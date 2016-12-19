// References to the buttons that will be enabled / disabled
var joinButton = document.getElementById("joinButton");
var leaveButton = document.getElementById("leaveButton");

// The element that shows the local moust location
var localMouseSpan = document.getElementById("localMouse");

var sessionIdSpan = document.getElementById("sessionId");

// The list where all the cursors by session are listed.
var mouseLocations = document.getElementById("mouseLocations");

// The div where the mouse events are sourced / rendered
var cursorBox = document.getElementById('cursorBox');

// The Convergence activity
var activity;

// A map of remote cursors by sessionId
var remoteSessions = {};

// The domain that this example connects too.
var domain;


ConvergenceDomain.connect(DOMAIN_URL, DOMAIN_USERNAME, DOMAIN_PASSWORD).then(function (d) {
  domain = d;
  joinButton.disabled = false;
  sessionIdSpan.innerHTML = domain.session().sessionId();
}.bind(this)).catch(function (error) {
  console.log("Could not connect: " + error);
});

var zOrder = 1;

// Handles clicking the open button
function joinActivity() {
  domain.activities().join("testActivity").then(function (act) {
    activity = act;
    var participants = activity.participants();
    joinButton.disabled = true;
    leaveButton.disabled = false;

    participants.forEach(function (participant) {
      var local = participant.sessionId() === activity.session().sessionId();
      handleSessionJoined(participant.sessionId(), local);
      var state = participant.state()["pointer"];
      if (state) {
        updateMouseLocation(participant.sessionId(), state.x, state.y, local);
      }
    });

    activity.events().subscribe(function (event) {
      switch (event.name) {
        case "session_joined":
          handleSessionJoined(event.sessionId, event.local);
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
      }
    });
  });
}

// Handles clicking the leave button
function leaveActivity() {
  activity.leave();
  joinButton.disabled = false;
  leaveButton.disabled = true;
}


// Handles a session joining (both remote and local)
function handleSessionJoined(sessionId, local) {
  var sessionTr = document.createElement("tr");
  var sessionIdCell = document.createElement("td");
  sessionIdCell.innerHTML = sessionId;
  sessionTr.appendChild(sessionIdCell);

  var locationCell = document.createElement("td");
  sessionTr.appendChild(locationCell);

  mouseLocations.appendChild(sessionTr);
  var cursorDiv;

  if (!local) {
    cursorDiv = document.createElement("img");
    cursorDiv.src = "assets/cursor.png";
    cursorDiv.className = "remoteCursor";
    cursorDiv.style.zIndex = zOrder++;
    cursorBox.appendChild(cursorDiv);
  }

  remoteSessions[sessionId] = {
    sessionTr: sessionTr,
    locationCell: locationCell,
    cursorDiv: cursorDiv
  }
}

// Handles a session leaving (both remote and local)
function handleSessionLeft(sessionId) {
  var sessionRec = remoteSessions[sessionId];
  sessionRec.sessionTr.parentNode.removeChild(sessionRec.sessionTr);
  if (sessionRec.cursorDiv) {
    cursorBox.removeChild(sessionRec.cursorDiv);
  }
  delete remoteSessions[sessionId];
}

function updateMouseLocation(sessionId, x, y, local) {
  var sessionRec = remoteSessions[sessionId];
  sessionRec.locationCell.innerHTML = "(" + x + "," + y + ")";
  if (!local) {
    sessionRec.cursorDiv.style.top = y + "px";
    sessionRec.cursorDiv.style.left = x + "px";
  }
}

function remoteClicked(sessionId, x, y) {
  console.log(x, y);
  var elem = createClickSpot(x, y);
  setTimeout(function () {
    elem.parentElement.removeChild(elem);
  }, 300);
}

function getMouseEventCoordinates(evt) {
  var cursorBoxOffset = $(cursorBox).offset();
  return {
    x: evt.pageX - cursorBoxOffset.left,
    y: evt.pageY - cursorBoxOffset.top
  };
}

// handles the local mouse movement and set events.
function mouseMoved(evt) {
  var coordinates = getMouseEventCoordinates(evt);
  localMouseSpan.innerHTML = " (" + coordinates.x + "," + coordinates.y + ")";

  if (activity && activity.isJoined()) {
    activity.setState("pointer", coordinates);
  }
}

function mouseClicked(event) {
  if (activity && activity.isJoined()) {
    var coordinates = getMouseEventCoordinates(event);
    activity.setState("click", coordinates);
  }
}

function createClickSpot(posX, posY) {
  var spot = document.createElement("div");
  spot.className = "clickSpot";
  spot.style.left = posX + "px";
  spot.style.top = posY + "px";
  cursorBox.appendChild(spot);
  return spot;
}
