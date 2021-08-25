const crypto = require("crypto");
const fs = require("fs").promises;
const { getPasswords } = require("../auth");
const config = require("../config");

function hashPassword(password) {
  const shaHash = crypto.createHash("sha256");

  return shaHash.update(password).digest("hex");
}

function addHashToFile(password) {
  if (typeof password === typeof undefined) {
    password = process.argv[1];
  }

  let hashedPassword = hashPassword(password);
  let passwords = getPasswords();

  passwords.push(hashedPassword);

  let passwordPath = config.get("path.passwords");
  fs.writeFile(passwordPath, JSON.stringify(passwords)).catch((err) => {
    throw err;
  });
}

function removeHashFromFile(password) {
  if (typeof password === typeof undefined) {
    password = process.argv[1];
  }

  let hashedPassword = hashPassword(password);
  // TODO Better password reading from file
  let passwords = getPasswords();

  passwords = passwords.filter((p) => p !== hashedPassword);

  let passwordPath = config.get("path.passwords");
  fs.writeFile(passwordPath, JSON.stringify(passwords)).catch((err) => {
    throw err;
  });
}

module.exports = {
  hashPassword: hashPassword,
  addHashToFile: addHashToFile,
  removeHashFromFile: removeHashFromFile,
};
