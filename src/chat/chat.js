let chatRoom = null;
let domain = null;

function connectAndJoin() {
  const username = $("#username").val();
  const roomId = $("#room").val();

  // Connect to the domain.  See ../config.js for the connection settings.
  Convergence.connectAnonymously(DOMAIN_URL, username)
    .then(d => {
      domain = d;
      // Blindly try to create the chat room. We'll get a known error if it exists.
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

  chatRoom.on("message", appendMessage);

  room.getHistory({
    offset: room.info().eventCount,
    limit: 25,
    filter: "message"
  }).then(events => {
    // TODO display messages
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
  domain.identity().user(message.username).then(function(user) {
    const messageItem = $('<li/>', {class: "collection-item avatar"});
    const icon = $('<i class="material-icons circle green">person</i>');

    const username = $('<span class="title"></span>');
    username.html(user.displayName);

    const messageText = $('<p/>');
    messageText.html(message.message);

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
  });
}

function handleKeyDown(event) {
  if (event.keyCode === 13) {
    const message = event.target.value;
    chatRoom.send(message);
    event.target.value = "";

    appendMessage({
      username: domain.session().username(),
      message: message,
      timestamp: new Date().getTime()
    });
  }
}
