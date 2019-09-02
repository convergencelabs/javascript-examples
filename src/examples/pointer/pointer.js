// References to the buttons that will be enabled / disabled
const joinButton = document.getElementById("joinButton");
const leaveButton = document.getElementById("leaveButton");

// The element that shows the local mouse location
const localMouseSpan = document.getElementById("localMouse");

const localUserSpan = document.getElementById("localUser");

// The list where all the cursors by session are listed.
const mouseLocations = document.getElementById("mouseLocations");

// The div where the mouse events are sourced / rendered
const cursorBox = document.getElementById('cursorBox');

// The Convergence activity
let activity;

// A map of remote cursors by sessionId
const sessions = new Map();

// The domain that this example connects too.
let domain;

let zOrder = 1;

const username = "User-" + (Math.floor(Math.random() * 900000) + 100000);

Convergence.connectAnonymously(CONVERGENCE_URL, username).then(function (d) {
  domain = d;
  joinButton.disabled = false;
  localUserSpan.innerHTML = domain.session().user().displayName;
}).catch(function (error) {
  console.log("Could not connect: " + error);
});

// Handles clicking the open button
function joinActivity() {
  domain.activities().join(convergenceExampleId).then(function (act) {
    activity = act;
    const participants = activity.participants();
    joinButton.disabled = true;
    leaveButton.disabled = false;

    participants.forEach(function (participant) {
      const local = participant.sessionId === activity.session().sessionId();
      handleSessionJoined(participant);
      const state = participant.state.get("pointer");
      if (state) {
        updateMouseLocation(participant.sessionId, state.x, state.y, local);
      }
    });

    activity.events().subscribe(function (event) {
      switch (event.name) {
        case "session_joined":
          handleSessionJoined(event.participant);
          break;
        case "session_left":
          handleSessionLeft(event.sessionId);
          break;
        case "state_set":
          switch (event.key) {
            case 'pointer':
              updateMouseLocation(event.sessionId, event.value.x, event.value.y, event.local);
              break;
            case 'click':
              if (!event.local) {
                remoteClicked(event.sessionId, event.value.x, event.value.y);
              }
              break;
          }
          break;
        case "state_removed":
          if (event.key === "pointer") {
            hidePointer(event.sessionId, event.local);
          }
          break;
      }
    });
  });
}

// Handles clicking the leave button
function leaveActivity() {
  activity.leave();
  joinButton.disabled = false;
  leaveButton.disabled = true;

  sessions.forEach((remoteSession, sessionId) => {
    handleSessionLeft(sessionId);
  });

  sessions.clear();
}

// Handles a session joining (both remote and local)
function handleSessionJoined(participant) {
  const sessionId = participant.sessionId;
  const username = participant.user.displayName;
  const sessionTr = document.createElement("tr");
  const usernameCell = document.createElement("td");
  usernameCell.innerHTML = participant.sessionId === activity.session().sessionId() ? 'local' : username;
  sessionTr.appendChild(usernameCell);

  const locationCell = document.createElement("td");
  sessionTr.appendChild(locationCell);

  const fpsCell = document.createElement("td");
  sessionTr.appendChild(fpsCell);

  mouseLocations.appendChild(sessionTr);
  let cursorDiv;

  if (!participant.local) {
    cursorDiv = document.createElement("img");
    cursorDiv.src = "assets/cursor.png";
    cursorDiv.className = "remoteCursor";
    cursorDiv.style.zIndex = zOrder++;
    cursorBox.appendChild(cursorDiv);
  }

  const sessionRec = {
    sessionTr: sessionTr,
    locationCell: locationCell,
    fpsCell: fpsCell,
    cursorDiv: cursorDiv,
    updates: []
  };
  sessions.set(sessionId, sessionRec);

  if (participant.state.has("pointer")) {
    const pointer = participant.state.get("pointer");
    updateMouseLocation(sessionId, pointer.x, pointer.y, participant.local);
  } else {
    hidePointer(sessionId, participant.local);
  }

  if (!participant.local) {
    calculateFrameRate(sessionRec);
  }
}

// Handles a session leaving (both remote and local)
function handleSessionLeft(sessionId) {
  const sessionRec = sessions.get(sessionId);
  sessionRec.sessionTr.parentNode.removeChild(sessionRec.sessionTr);
  if (sessionRec.cursorDiv) {
    cursorBox.removeChild(sessionRec.cursorDiv);
  }
  if(sessionRec.interval) {
    clearInterval(sessionRec.interval);
  }
  sessions.delete(sessionId);
}

function hidePointer(sessionId, local) {
  const sessionRec = sessions.get(sessionId);
  sessionRec.locationCell.innerHTML = "(none)";
  sessionRec.fpsCell.innerHTML = local ? "-" : "0";
  if (!local) {
    sessionRec.cursorDiv.style.visibility = "hidden";
  }
}

function updateMouseLocation(sessionId, x, y, local) {
  const sessionRec = sessions.get(sessionId);
  sessionRec.locationCell.innerHTML = "(" + Math.round(x) + "," + Math.round(y) + ")";
  if (!local) {
    sessionRec.cursorDiv.style.top = y + "px";
    sessionRec.cursorDiv.style.left = x + "px";
    sessionRec.cursorDiv.style.visibility = "visible";
  }

  sessionRec.updates.push(performance.now());
}

function calculateFrameRate(sessionRec) {
  sessionRec.interval = setInterval(function() {
    const times = sessionRec.updates;
    const now = performance.now();
    while (times.length > 0 && times[0] <= now - 1000) {
      times.shift();
    }
    sessionRec.fpsCell.innerHTML = times.length;
  }, 250);
}

function remoteClicked(sessionId, x, y) {
  const elem = createClickSpot(x, y);
  setTimeout(function () {
    elem.parentElement.removeChild(elem);
  }, 300);
}

function getMouseEventCoordinates(evt) {
  const cursorBoxOffset = $(cursorBox).offset();
  return {
    x: evt.pageX - cursorBoxOffset.left,
    y: evt.pageY - cursorBoxOffset.top
  };
}

// handles the local mouse movement and set events.
function mouseMoved(evt) {
  const coordinates = getMouseEventCoordinates(evt);
  localMouseSpan.innerHTML = " (" + Math.round(coordinates.x) + "," + Math.round(coordinates.y) + ")";

  if (activity && activity.isJoined()) {
    activity.setState("pointer", coordinates);
  }
}

function mouseOut(evt) {
  localMouseSpan.innerHTML = " (none)";
  if (activity && activity.isJoined()) {
    activity.removeState("pointer");
  }
}

function mouseClicked(event) {
  if (activity && activity.isJoined()) {
    const coordinates = getMouseEventCoordinates(event);
    activity.setState("click", coordinates);
  }
}

function createClickSpot(posX, posY) {
  const spot = document.createElement("div");
  spot.className = "clickSpot";
  spot.style.left = posX + "px";
  spot.style.top = posY + "px";
  cursorBox.appendChild(spot);
  return spot;
}
