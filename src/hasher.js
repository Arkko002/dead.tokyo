const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

function hashPassword(password) {
    const shaHash = crypto.createHash("sha256");

    return  shaHash.update(password).digest("hex");
}

function hashPasswordToFile(password) {
    if (password === undefined) {
        password = process.argv[1];
    }

    let hashedPassword = hashPassword(password);

    const passwordPath = path.join(__dirname, "/../passwords.json")
    fs.open(passwordPath, "w+", (err, fd) => {
        if (err) throw `Error opening password file: ${err}`


        let passwords;
        try {
            passwords = JSON.parse(fs.readFileSync(fd, "utf8"));
        } catch (err) {
            if (err instanceof SyntaxError) {
                passwords = {}
            } else {
                throw `Error parsing JSON: ${err}`
            }
        }

        if(passwords.passwords === undefined) {
            passwords.passwords = []
        }

        passwords.passwords.push(hashedPassword);

        fs.writeFile(fd, JSON.stringify(passwords), (err) => {
            if (err) {
                throw err;
            }
        });
    })
}

module.exports = {
    hashPassword: hashPassword,
    hashPasswordToFile: hashPasswordToFile
}
