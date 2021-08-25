class AppError extends Error {
  constructor(args, code, level, isOperational) {
    super(args);
    this.code = code;
    this.level = level;
    this.isOperational = isOperational;
  }
}

AppError.prototype = Object.create(Error.prototype);
AppError.prototype.constructor = AppError;

module.exports.AppError = AppError;
