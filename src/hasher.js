const crypto = require("crypto");
const fs = require("fs");
const configLoader = require("./config-loader.js")

function hashPassword(password) {
	const shaHash = crypto.createHash("sha256");

	return shaHash.update(password).digest("hex");
}

function addHashToFile(password) {
	if (password === undefined) {
		password = process.argv[1];
	}

	let hashedPassword = hashPassword(password);
	let passwords = configLoader.getPasswordObject();

	passwords.push(hashedPassword);

	let config = configLoader.getConfig();
	fs.writeFile(config.passwordPath, JSON.stringify(passwords), (err) => {
		if (err) {
			throw err;
		}
	});
}

function removeHashFromFile(password) {
	if (password === undefined) {
		password = process.argv[1];
	}

	let hashedPassword = hashPassword(password);
	let passwords = configLoader.getPasswordObject();

	passwords = passwords.filter((p) => p !== hashedPassword);

	let config = configLoader.getConfig();
	fs.writeFile(config.passwordPath, JSON.stringify(passwords), (err) => {
		if (err) {
			throw err;
		}
	});
}

module.exports = {
	hashPassword: hashPassword,
	addHashToFile: addHashToFile,
	removeHashFromFile: removeHashFromFile
}

