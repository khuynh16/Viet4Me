const app = require("./app");
const debug = require("debug")("viet4me");
const http = require("http");

// makes sure when we set up a port, and we receive it
// from a environment variable, we actually make sure it's
// a valid number
const normalizePort = val => {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
};

// check which type of error occurred occurred, log
// something different, and exit gracefully
const onError = error => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const bind = typeof port === "string" ? "pipe " + port : "port " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

// outputting where we are listening for requests
const onListening = () => {
  const addr = server.address();
  const bind = typeof port === "string" ? "pipe " + port : "port " + port;
  debug("Listening on " + bind);
};

// setting port on express app
const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

// setting up node server
const server = http.createServer(app);

// register for two listeners, one for error handling
// and one for listening via onListening
server.on("error", onError);
server.on("listening", onListening);

// creates listener on specified port/path
server.listen(port);
