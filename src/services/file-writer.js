const fs = require("fs");
const promisify = require("util").promisify;
const path = require("path");
const config = require("../config/config.js");

const writeFilePromise = promisify(fs.writeFile);

// TODO Better error handling for file writing, recoverable errors
async function writeFile(file) {
  // TODO add number at end of file if already exists

  const savePath = config.get("path.fileSavingPath");
  const filePath = path.join(savePath, file.originalname);

  // TODO Possible path traversal attack here
  await writeFilePromise(filePath, file.buffer, { flag: "wx" });
}

module.exports = {
  writeFile,
};
