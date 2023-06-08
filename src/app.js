require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const passportSetup = require("./config/passport");
const passport = require("passport");
const cookieSession = require("cookie-session");
const bodyParser = require("body-parser");
const fileUpload = require('express-fileupload')
const morgan = require("morgan");
const routes = require("./routes/index.js");
require("./db.js");

const server = express();

server.name = "API";

server.use(
  cookieSession({
    name: "session",
    keys: [process.env.JWT_SECRET],
    maxAge: 24 * 60 * 60 * 100,
  })
);

server.use(passport.initialize());
server.use(passport.session());
server.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
server.use(bodyParser.json({ limit: "50mb" }));
server.use(cookieParser());
server.use(morgan("dev"));
server.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://awericana.vercel.app"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

server.use(fileUpload({
  useTempFiles : true,
  tempFileDir : './uploads'
}));
server.use("/", routes);

// Error catching endware.
server.use((err, req, res, next) => {
  // eslint-disable-line no-unused-vars
  const status = err.status || 500;
  const message = err.message || err;
  console.error(err);
  res.status(status).send(message);
});




module.exports = server;
