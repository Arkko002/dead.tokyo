const multer = require("multer");
const fileType = require("file-type");

module.exports = multerConfig = {
    storage: multer.memoryStorage(),

    fileFilter: (req, file, cb) => {
        if(!file) {
            return cb(new Error("No file was uploaded"));
        }

        const zipped = isArchive(file);
        if(zipped) {
            cb(null, true);
        } else {
            return cb("Provided file was wrong format (must be a compressed archive)");
        }
		
    },

	isArchive: (file) => {
		let ext = fileType.fromBuffer(file).ext;

		// TODO possibly more supported extensions
		let archiveExts = ["zip", "tar", "rar", "gz", "7z", "bz2"];

		// indexOf will be -1 if ext is not found in array
		return archiveExts.indexOf(ext) != -1;
	}
}
