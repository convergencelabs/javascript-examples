//
// This file configures the domain url that is used to connect to the Convergence service.
//
// By default, it is configured to use the default options in the Convergence Development Edition
// (https://hub.docker.com/r/convergencelabs/convergence-de)
// 
// These are the relevant parts of the URL: http://<host>:<host-port>/api/realtime/<namespace>/<domainId>
var CONVERGENCE_URL = "http://localhost:8000/api/realtime/convergence/default";