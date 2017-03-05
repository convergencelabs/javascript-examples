//
// This file configures the domain url that is used by all of the exampled to
// connect to the Convergence service.
//

//
// 1. Obtain a Convergence account and note your username.
//
// 2. Create a domain, not the domain id, and ensure that anonymous authentication is enabled.
//
// 3. Rename this file to config.js and modify the below.
//
// 4. Modify the url to match your convergence username and the domainId of the
//    domain you wish to use.
//

const DOMAIN_URL = "https://api.convergence.io/realtime/domain/<convergence-username>/<domain-id>";
