
Vue.component('chat-example', {
  data: function() {
    return {
      domain: null,
      room: null,
      messages: []
    };
  },
  template: '' +
    '<div>' +
    '  <membership-actions :joined="room != null" @connectAndJoin="handleConnect" @leave="handleLeave" />' +
    '  <div class="chat-container">' +
    '    <chat-messages :messages="messages" />' +
    '    <chat-input :input-allowed="room != null" @submit="handleMessageSubmission" />' +
    '  </div>' +
    '</div>',
  methods: {
    handleConnect: function(username) {
      // Connect to the domain.  See ../../config.js for the connection settings.
      Convergence.connectAnonymously(CONVERGENCE_URL, username)
        .then(d => {
          this.domain = d;
          // Blindly try to create the chat room, ignoring the error if it already exists.
          return this.domain.chat().create({
            id: convergenceExampleId, 
            type: "room", 
            membership: "public", 
            ignoreExistsError: true
          });
        })
        .then(channelId => this.domain.chat().join(channelId))
        .then(this.handleJoin)
        .catch(error => {
          console.log("Could not join chat room: " + error);
        });
    },
    handleJoin: function(room) {
      this.room = room;

      // listen for a new message added to this room
      room.on("message", this.appendMessage);

      // fetch the 25 most recent messages
      room.getHistory({
        limit: 25,
        // only return events of type "message"
        eventFilter: ["message"]
      }).then(events => {
        events.forEach(event => {
          this.appendMessage(event);
        });
      });
    },
    appendMessage: function(event) {
      let messages = this.messages.slice(0);
      messages.push({
        username: event.user.displayName,
        message: event.message,
        timestamp: event.timestamp
      });
      // don't mutate the array, replace it
      this.messages = messages;
    },
    handleMessageSubmission: function(messageText) {
      try {
        this.room.send(messageText);

        let messages = this.messages.slice(0);
        messages.push({
          username: this.domain.session().user().displayName,
          message: messageText,
          timestamp: new Date().getTime()
        });
        this.messages = messages;
      } catch (e) {
        // handle errors.  say, the user isn't currently connected
        this.displayError(e);
      }
    },
    handleLeave() {
      this.room.leave().then(() => {
        this.room = null;
        this.messages = [];
        return this.domain.dispose();
      });
    },
    displayError(msg, detail) {
      // use the materialize toast 
      if (detail) {
        M.toast({html: '<h3>' + msg + '</h3><p>' + detail + '</p>'});
      } else {
        M.toast({html: msg});
      }
    }
  }
});

new Vue({
  el: '#example'
});

exampleLoaded();