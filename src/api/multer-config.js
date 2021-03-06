const multer = require("multer");
const path = require("path");
const config = require("../config/config");

let multerConfig = {
  storage: multer.memoryStorage(),

  fileFilter: (req, file, cb) => {
    if (!file) {
      return cb(new Error("No file was uploaded"));
    }

    let ext = path.extname(file.originalname);
    let archiveExts = config.get("allowedExtensions");

    // indexOf will be -1 if ext is not found in array
    const zipped = archiveExts.indexOf(ext) !== -1;

    if (zipped) {
      cb(null, true);
    } else {
      return cb(
        "Provided file was wrong format (must be a compressed archive)"
      );
    }
  },
};
module.exports = multerConfig;
