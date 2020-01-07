const fs = require("fs-extra");

fs.removeSync("docker-build");
fs.removeSync("_site");
fs.removeSync("src/libs");
fs.removeSync(".sass-cahce");
