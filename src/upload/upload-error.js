class UploadError extends Error {
  constructor(args, code) {
    super(args);
    this.code = code;
  }
}

module.exports = { uploadError: UploadError };
