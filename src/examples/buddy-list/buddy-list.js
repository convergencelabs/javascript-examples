Vue.component('user-presence', {
  props: ['presenceSubscription'],
  template: `
<li v-bind:class="{ online: online, offline: !online}" >
  <span 
   v-bind:title="statusTitle"
   v-bind:class="{ indicator: true, available: status === 'available', away: status === 'away', dnd: status === 'dnd'}"/>
  <span class="display-name">{{ displayName }}</span>
</li>
`,
  computed: {
    statusTitle: function () {
      if (this.presenceSubscription.available) {
        switch (this.presenceSubscription.state.get("status")) {
          case "available":
            return "Available";
          case "away":
            return "Away";
          case "dnd":
            return "Do Not Disturb";
          default:
            return "Unknown";
        }
      } else {
        return "Offline";
      }
    },
    displayName: function() {
      return this.presenceSubscription.user.displayName;
    }
  },
  created: function () {
    this.online = this.presenceSubscription.available;
    this.status = this.presenceSubscription.state.get("status");

    this.presenceSubscription.on("availability_changed", (evt) => {
      this.online = evt.available;
    });

    this.presenceSubscription.on("state_set", (evt) => {
      this.status = this.presenceSubscription.state.get("status");
    });
  },
  destroyed: function() {
    this.presenceSubscription.unsubscribe();
  }
});

// TODO buddies is hard coded. Make dynamic
const app = new Vue({
  el: '#presence-app',
  data: {
    connected: false,
    status: null,
    username: USERS[0].username,
    users: USERS,
    buddies: null
  }
});

let domain = null;
function connect() {
  const user = USERS.find(user => user.username === app.username);
  Convergence.connectWithPassword(CONVERGENCE_URL, {username: user.username, password: user.password})
    .then(d => {
      domain = d;
      app.connected = true;

      if (!domain.presence().state().has("status")) {
        domain.presence().setState("status", "available");
      }

      app.status = domain.presence().state().get("status");
    })
    .then(() => {
      const usernames = USERS.map(user => user.username);
      return domain.presence().subscribe(usernames);
    })
    .then(subscriptions => {
      app.buddies = subscriptions;
      domain.presence().on(Convergence.PresenceService.Events.STATE_SET, (evt) => {
        if (evt.state.has("status")) {
          app.status = evt.state.get("status");
        }
      })
    })
    .then(localSubscription => {})
    .catch(error => {
      console.log("Error connecting", error);
    });
}

function disconnect() {
  app.connected = false;
  domain.dispose();
  domain = null;
  app.buddies = null;
}

function changeStatus(target) {
  domain.presence().setState("status", target.value);
  app.status = target.value;
}
