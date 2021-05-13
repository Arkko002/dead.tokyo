const crypto = require("crypto");
const fs = require("fs");

function hashPassword(password) {
    const shaHash = crypto.createHash("sha256");

    return  shaHash.update(password).digest("hex");
}

function hashPasswordToFile(password) {
    if (password === undefined) {
        password = process.argv[1];
    }

    let hashedPassword = hashPassword(password);

    const passwords = JSON.parse(fs.readFileSync("passwords.json", "utf8"));
    if(passwords.passwords === undefined) {
        throw "Password file is improperly formatted"
    }

    passwords.passwords.push(hashedPassword);

    fs.writeFile("passwords.json", JSON.stringify(passwords), (err) => {
        if (err) {
            throw err;
        }
    });
}

module.exports = {
    hashPassword: hashPassword,
    hashPasswordToFile: hashPasswordToFile
}