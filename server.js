const http = require("http");
const ecstatic = require("ecstatic");
const rootDir = __dirname;
const port = 8080;

http.createServer(
  ecstatic({root: rootDir})
).listen(port);

console.log(`Listening on port ${port}`);
