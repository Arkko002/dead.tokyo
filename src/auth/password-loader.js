const fs = require("fs");
const config = require("../config");

// TODO Better way of managin passwords
function getPasswords() {
  const passwordPath = config.get("path.passwords");

  // Disable eslint false positives, those paths are read from config only
  let passwords;
  let fd = fs.openSync(passwordPath, "a+"); // eslint-disable-line security/detect-non-literal-fs-filename
  try {
    passwords = JSON.parse(fs.readFileSync(fd, "utf8")); // eslint-disable-line security/detect-non-literal-fs-filename
  } catch (err) {
    if (err instanceof SyntaxError) {
      passwords = [];
    } else {
      throw `Error parsing JSON: ${err}`;
    }
  }

  return passwords;
}

module.exports = {
  getPasswords: getPasswords,
};
