Vue.component('user-presence', {
  props: ['presence'],
  template: `
<li v-bind:class="{ online: presence.available, offline: !presence.available}" >
  <span 
   v-bind:title="statusTitle"
   v-bind:class="{ indicator: true, available: presence.status === 'available', away: presence.status === 'away', dnd: presence.status === 'dnd'}"/>
  <span class="display-name">{{ presence.displayName }}</span>
</li>
`,
  computed: {
    statusTitle: function () {
      if (this.presence.available) {
        switch (this.presence.status) {
          case "available":
            return "Available";
          case "away":
            return "Away";
          case "dnd":
            return "Do Not Disturb";
        }
      } else {
        return "Offline";
      }
    }
  }
});

// TODO buddies is hard coded. Make dynamic
const app = new Vue({
  el: '#presence-app',
  data: {
    connected: false,
    status: "available",
    username: USERS[0],
    users: USERS,
    buddies: null
  }
});


function connect() {
  console.log("connect as", app.username);
  // TODO implement connection and leverage presence api to subscribe to users and populate buddies.

  app.connected = true;
  app.buddies = [
    {username: "michael", available: true, status: "available", displayName: 'Michael'},
    {username: "alec", available: true, status: "away", displayName: 'Alec'},
    {username: "cameron", available: true, status: "dnd", displayName: 'Cameron'},
    {username: "john", available: false, status: "", displayName: 'John'}
  ];
}

function disconnect() {
  app.connected = false;
  // TODO implement disconnection

  app.buddies = null;
}

function changeStatus(target) {
  console.log("update status", target.value);
  // TODO leverage presence API to set state.
}
