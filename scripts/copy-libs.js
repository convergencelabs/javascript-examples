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

const srcLibs = "src/libs/";

if (!fs.existsSync(srcLibs)) {
  fs.mkdir(srcLibs);
}

const paths = libs
  .forEach(lib => fs.copySync("node_modules/" + lib, srcLibs + lib));

