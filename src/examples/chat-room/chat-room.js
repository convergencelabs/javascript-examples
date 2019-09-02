
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

      room.on("message", this.appendMessage);

      room.getHistory({
        offset: room.info().lastEventNumber,
        limit: 25,
        eventFilter: ["message"]
      }).then(events => {
        events.filter(event => event.type === "message").forEach(event => {
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
      this.room.send(messageText);

      let messages = this.messages.slice(0);
      messages.push({
        username: this.domain.session().user().displayName,
        message: messageText,
        timestamp: new Date().getTime()
      });
      this.messages = messages;
    },
    handleLeave() {
      this.room.leave().then(() => {
        this.room = null;
        this.messages = [];
        return this.domain.dispose();
      });
    }
  }
});

new Vue({
  el: '#example'
});