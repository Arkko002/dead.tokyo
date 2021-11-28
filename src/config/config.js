const convict = require("convict");
const fs = require("fs");
const promisify = require("util").promisify;

let config = convict({
  allowedExtensions: {
    doc: "File extensions allowed to be uploaded.",
    format: Array,
    default: [".zip", ".tar", ".rar", ".gz", ".7z", ".bz2"],
  },
  path: {
    passwords: {
      doc: "Path to file containing hashed passwords.",
      format: String,
      default: "/home/ubuntu/www/dead.tokyo/passwords.json",
    },
    fileSavingPath: {
      doc: "Location that will be used to store uploaded files.",
      format: String,
      default: "/home/ubuntu/www/dead.tokyo/files/uploads",
    },
  },
});

if (fs.existsSync("../../config.json")) {
  config.loadFile("../../config.json");
}

config.validate({ allowed: "strict" });

module.exports = config;
