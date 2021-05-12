const multer = require("multer");

const multerConfig = {
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, "/downloads");
        },

        filename: (req, file, cb) => {
            cb(null, file.fieldname);
        },

        fileFilter: (req, file, cb) => {
            if(!file) {
                cb();
            }

            // TODO Better file type detection
            const zipped = file.mimetype.startsWith("application/")
            if(zipped) {
                cb(null, true);
            } else {
                return cb();
            }
        }
    })
}

export default multerConfig;
