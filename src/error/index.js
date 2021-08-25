const { AppError } = require("./app-error");
const errorHandler = require("./error-handler");

module.exports = {
  AppError: AppError,
  ErrorHandler: errorHandler.handler,
};
