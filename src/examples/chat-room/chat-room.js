let chatRoom = null;
let domain = null;

let localDisplayName;

function connectAndJoin() {
  localDisplayName = $("#username").val();
  const roomId = $("#room").val();

  // Connect to the domain.  See ../config.js for the connection settings.
  Convergence.connectAnonymously(CONVERGENCE_URL, localDisplayName)
    .then(d => {
      domain = d;
      // Blindly try to create the chat room, ignoring the error if it already exists.
      return domain.chat().create({id: roomId, type: "room", membership: "public", ignoreExistsError: true})
    })
    .then(channelId => domain.chat().join(channelId))
    .then(handleJoin)
    .catch(error => {
      console.log("Could not join chat room: " + error);
    });
}

function handleJoin(room) {
  chatRoom = room;

  $("#join").hide();
  $("#leave").show();

  $("#username").prop("disabled", true);
  $("#room").prop("disabled", true);
  $("#message").prop("disabled", false);

  chatRoom.on("message", (event) => appendMessage({
    username: event.user.displayName,
    message: event.message,
    timestamp: event.timestamp
  }));

  room.getHistory({
    offset: chatRoom.info().lastEventNumber,
    limit: 25,
    eventFilter: ["message"]
  }).then(events => {
    events.filter(event => event.type === "message").forEach(event => {
      appendMessage({
        username: event.user.displayName,
        message: event.message,
        timestamp: event.timestamp
      });
    });
  });
}

function handleLeave() {
  $("#join").show();
  $("#leave").hide();

  $("#username").prop("disabled", false);
  $("#room").prop("disabled", false);
  $("#message").prop("disabled", true);

  $("#chat-messages").empty();

  chatRoom.leave().then(() => domain.dispose());
  chatRoom = null;
}

function appendMessage(message) {
  const messageItem = $('<li/>', {class: "collection-item avatar"});
  const icon = $('<i class="material-icons circle green">person</i>');

  const username = $('<span class="title"></span>');
  username.html(message.username);

  const messageText = $('<p/>');
  messageText.text(message.message);

  const time = $('<span class="secondary-content"></span>');
  const dateString = moment(message.timestamp).format('h:mm a');
  time.html(dateString);

  messageItem.append(icon);
  messageItem.append(username);
  messageItem.append(messageText);
  messageItem.append(time);

  $("#chat-messages").append(messageItem);

  const scroller = $("#scroller");
  scroller.scrollTop(scroller[0].scrollHeight);
}

function handleKeyDown(event) {
  if (event.keyCode === 13) {
    const message = event.target.value;
    chatRoom.send(message);
    event.target.value = "";

    appendMessage({
      username: domain.session().user().displayName,
      message: message,
      timestamp: new Date().getTime()
    });
  }
}
