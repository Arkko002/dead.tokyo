const { ErrorHandler } = require("./error");
const express = require("express");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const multer = require("multer");

const app = express();

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(helmet());

app.use(async (err, req, res, next) => {
  await ErrorHandler.handleError(err, res);
  next();
});

process.on("uncaughtException", (error) => {
  ErrorHandler.handleError(error);
});

process.on("unhandledRejection", (error) => {
  ErrorHandler.handleError(error);
});
