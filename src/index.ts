#!/usr/bin/env node

import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import http from "http";
import logger from "./utils/logger";

// Normalize a port into a number, string, or false.
const normalizePort = (val: string) => {
  const port = parseInt(val, 10);

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

//Get port from environment and store in Express.
const port = normalizePort(process.env.PORT || "8000");
app.set("port", port);

// Create HTTP server.
const server = http.createServer(app);

//Event listener for HTTP server "error" event.
const onError = (error: any) => {
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      return process.exit(1);
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      return process.exit(1);
    default:
      throw error;
  }
};

//Event listener for HTTP server "listening" event.
const onListening = () => {
  const addr = server.address();
  let url = "";

  if (!addr || typeof addr === "string") {
    url = `http://localhost:${port}`;
  } else if (typeof addr === "object") {
    const host = addr.address !== "::" ? addr.address : "localhost";
    url = `http://${host}:${addr.port}`;
  }

  logger.info(`⚡️[server]: Server is running at ${url}`);
};

//Listen on provided port, on all network interfaces.
server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  logger.error(`unhandled rejection at ${promise}, reason: ${reason}`);
  process.exit(1);
});
// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  logger.error(`uncaught exception, error: ${error}`);
  process.exit(1);
});
