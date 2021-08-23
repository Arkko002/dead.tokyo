const path = require('path');
const fs = require('fs');
const config = require('../config.js');

// TODO Better way of managin passwords
function getPasswordObject() {
  const passwordPath = config.get('path.passwords');

  let passwords;
  let fd = fs.openSync(passwordPath, 'a+');
  try {
    passwords = JSON.parse(fs.readFileSync(fd, 'utf8'));
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
  getConfig: getConfig,
  getPasswordObject: getPasswordObject,
};
