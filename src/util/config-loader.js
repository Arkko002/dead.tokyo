const path = require('path');
const fs = require('fs');

// TODO Reduce duplication
function getConfig() {
  let configPath = path.join(__dirname, '/../', 'config.json');

  let config;
  let fd = fs.openSync(configPath, 'a+');

  try {
    config = JSON.parse(fs.readFileSync(fd, 'utf-8'));
  } catch (err) {
    if (err instanceof SyntaxError) {
      config = {};
    } else {
      throw `Error parsing JSON: ${err}`;
    }
  }

  if (config.passwordPath === undefined) {
    config.passwordPath = '/home/ubuntu/www/dead.tokyo/passwords.json';
  }
  if (config.fileSavingPath === undefined) {
    config.fileSavingPath = '/home/ubuntu/www/dead.tokyo/files/uploads';
  }
  if (config.allowedExtensions === undefined) {
    config.allowedExtensions = ['.zip', '.tar', '.rar', '.gz', '.7z', '.bz2'];
  }

  fs.writeFileSync(configPath, JSON.stringify(config));

  return config;
}

function getPasswordObject() {
  const passwordPath = path.join(__dirname, '../passwords.json');

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
