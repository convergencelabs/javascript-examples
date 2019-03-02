const fs = require("fs-extra");

const libs = [
  "@convergence",
  "@fortawesome",
  "ace-builds",
  "backbone",
  "bootstrap",
  "chart.js",
  "director",
  "froala-editor",
  "handlebars",
  "jointjs",
  "jquery",
  "lodash",
  "materialize-css",
  "moment",
  "nouislider",
  "popper.js",
  "todomvc-common",
  "todomvc-app-css",
  "underscore"
];

const srcLibs = "src/libs/";

fs.mkdir(srcLibs);


const paths = libs
  .forEach(lib => fs.copySync("node_modules/" + lib, srcLibs + lib));
