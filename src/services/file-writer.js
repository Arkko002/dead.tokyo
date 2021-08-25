const fs = require("fs").promises;
const path = require("path");
const logger = require("../logger.js");
const config = require("../config.js");

// TODO Better error handling for file writing, recoverable errors
async function writeFile(file) {
  // TODO add number at end of file if already exists
  const savePath = config.get("path.fileSavingPath");
  const filePath = path.join(savePath, file.originalname);

  // TODO Possible path traversal attack here
  // TODO Move logging up, dont pass net info into file writer
  fs.writeFile(filePath, file, { flag: "wx" })
    .then(() => {
      logger.log({
        level: "info",
        message: `Upload successful: ${ipAddr} |
                 Password: ${ctx.password} |
                 File: ${ctx.file.originalname} |
                 Time: ${new Date()}`,
      });
    })
    .catch((err) => {
      logger.log({
        level: "error",
        message: `Upload failed: ${ipAddr} |
                 Password: ${ctx.password} |
                 File: ${ctx.file.originalname} |
                 Time: ${new Date()} | 
                 Error: ${err}`,
      });
    });
}

module.exports = {
  writeFile,
};
