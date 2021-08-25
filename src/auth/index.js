const hasher = require("./hasher");
const { getPasswords } = require("./password-loader");

module.exports = { PasswordHasher: hasher, getPasswords: getPasswords };
