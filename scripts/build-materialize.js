const fs = require("fs-extra");
const sass = require("sass");

// This is to remove the toast styles which conflict with toastr.  You'll have 
// to comment out the @import "components/toast" in the source file first.
var result = sass.renderSync({
  file: `src/libs/materialize-css/sass/materialize.scss`,
  outputStyle: 'compressed'
});

fs.writeFile(`src/assets/css/materialize.min.css`, result.css);