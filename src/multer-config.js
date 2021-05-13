const multer = require("multer");

module.exports = multerConfig = {
    storage: multer.memoryStorage(),

    fileFilter: (req, file, cb) => {
        if(!file) {
            return cb(new Error("No file was uploaded"));
        }

        // TODO Better file type detection
        const zipped = file.mimetype.startsWith("application/")
        if(zipped) {
            cb(null, true);
        } else {
            return cb("Provided file was wrong format (must be a compressed archive)");
        }
    }
}