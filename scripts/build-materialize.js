const fs = require("fs-extra");
const sass = require("sass");

// This builds a customized version of materialize that doesn't override the parent
// site's styling.  To use, comment out
//
// @import "components/toast" 
// @import "components/navbar";
//
// in the source file (src/libs/...) and run this script.
var result = sass.renderSync({
  file: `src/libs/materialize-css/sass/materialize.scss`,
  outputStyle: 'compressed'
});

fs.writeFile(`src/assets/css/materialize.min.css`, result.css);