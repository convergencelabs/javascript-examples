let chatRoom = null;
let domain = null;

function connectAndJoin() {
  const username = $("#username").val();
  const roomId = $("#room").val();

  // Connect to the domain.  See ../../config.js for the connection settings.
  Convergence.connectAnonymously(DOMAIN_URL, username)
    .then(function (d) {
      domain = d;
      // Now open the model, creating it using the initial data if it does not exist.
      return domain.chat().joinRoom(roomId)
    })
    .then(handleJoin)
    .catch(function (error) {
      console.log("Could not join chat room: " + error);
    });
}

function handleJoin(room) {
  $("#join").hide();
  $("#leave").show();

  $("#username").prop("disabled", true);
  $("#room").prop("disabled", true);
  $("#message").prop("disabled", false);

  chatRoom = room;
  room.on("message", appendMessage);
}

function handleLeave() {
  $("#join").show();
  $("#leave").hide();

  $("#username").prop("disabled", false);
  $("#room").prop("disabled", false);
  $("#message").prop("disabled", true);

  $("#chat-messages").empty();

  chatRoom.leave();
  domain.dispose();
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
