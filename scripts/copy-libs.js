const fs = require("fs-extra");

const libs = [
  "@convergence",
  "@convergencelabs",
  "@fortawesome",
  "ace-builds",
  "backbone",
  "bootstrap",
  "chart.js",
  "codemirror",
  "director",
  "easymde",
  "froala-editor",
  "handlebars",
  "highlight.js",
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
  "tui-editor",
  "underscore",
  "vue"
];

const siteLibs = "_site/libs/";

if (!fs.existsSync(siteLibs)) {
  fs.mkdir(siteLibs);
}

libs.forEach(lib => fs.copySync("node_modules/" + lib, siteLibs + lib));
