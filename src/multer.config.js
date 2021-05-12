const multer = require("multer");
const fs = require("fs");

const passwords = JSON.parse(fs.readFileSync("passwords.json", "utf8"));

module.exports = multerConfig = {
    passwords: passwords,

    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, "downloads/");
        },

        filename: (req, file, cb) => {
            cb(null, file.originalname);
        },

    }),

    fileFilter: (req, file, cb) => {
        if(!file) {
            return cb(new Error("No file was uploaded"));
        }
        const foundPassword = passwords.passwords.find(password => password === req.body.password);
        if(foundPassword === undefined) {
            console.log("asd")
            return cb(new Error("Incorrect password"))
        }

        // TODO Better file type detection
        const zipped = file.mimetype.startsWith("application/")
        if(zipped) {
            cb(null, true);
        } else {
            return cb();
        }
    }
}