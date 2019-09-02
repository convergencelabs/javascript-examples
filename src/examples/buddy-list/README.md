# Overview

This example demonstrates how to build a simple buddy list showing the online / offline status of users in the system using the Presence API. Users will show as either online or offline, and can set their availability using the shared presence state. Availability can be "Available", "Away", or "Do Not Disturb", which are common statuses in a chat type application.

The example leverages [Vue.js](https://vuejs.org/) for the dynamic rendering of stat.

# User Configuration
Note that this example assumes a specific set of users exist in the Convergence domain. The set of user the example uses can be configured in the [users.js](users.js) file. These users can be selected to log in as, and will also be the users that show up in the buddy list.
