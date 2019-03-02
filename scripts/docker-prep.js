const fs = require("fs-extra");

const dockerBuild = "docker-build";
const www = `${dockerBuild}/www`;

fs.removeSync(dockerBuild);

fs.mkdir(dockerBuild);
fs.copySync("docker", dockerBuild);

fs.copySync("_site", www);