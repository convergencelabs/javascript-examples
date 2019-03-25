const fs = require("fs-extra");

const libs = [
  "@convergence",
  "@convergencelabs",
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
  "monaco-editor",
  "mxgraph",
  "nouislider",
  "popper.js",
  "rxjs",
  "toastr",
  "underscore"
];

const srcLibs = "src/libs/";

fs.mkdir(srcLibs);

const paths = libs
  .forEach(lib => fs.copySync("node_modules/" + lib, srcLibs + lib));
