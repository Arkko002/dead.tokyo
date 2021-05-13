const path = require("path");
const logger = require(path.resolve(__dirname, "logger"));
const fs = require("fs");
const { hashPassword } = require(path.resolve(__dirname), "hasher");
const { isWithinLimits, resetLimitForIP, incFailedAttempts } = require(path.resolve(__dirname, "rate-limiter"));

const passwords = JSON.parse(fs.readFileSync("passwords.json", "utf8"));

async function uploadRoute (req, res) {
    const ipAddr = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

    let foundPassword = false;
    passwords.passwords.forEach((password) => {
        if (hashPassword(req.body.password) === password) {
            foundPassword = true;
        }
    });

    if(foundPassword === false) {
        incFailedAttempts(ipAddr);

        const withinLimits = await isWithinLimits(ipAddr)
        if (!withinLimits) {
            logger.log({level: "error",
                message: `Password rate limit exceeded: ${ipAddr} |
                Password: ${req.body.password} |
                File: ${req.file.originalname} |
                Time: ${new Date()}`})

            res.status(429).send("Too Many Requests");
            return;
        }

        res.status(403).send("Incorrect password");
        return;
    }

    // Reset consumed points on successful password verification from IP, otherwise wrong attempts would stack and lead to lockout
    await resetLimitForIP(ipAddr)

    fs.writeFile(`${__dirname}/../downloads/${req.file.originalname}`, req.file.buffer, (err) => {
        if (err) {
            logger.log({level: "info",
                 message: `Upload failed: ${ipAddr} |
                 Password: ${req.body.password} |
                 File: ${req.file.originalname} |
                 Time: ${new Date()}`})

            res.code(500).send("Could not write the file to disk")
        } else {
            logger.log({level: "info",
                 message: `Upload successful: ${ipAddr} |
                 Password: ${req.body.password} |
                 File: ${req.file.originalname} |
                 Time: ${new Date()}`})

            res.send("Uploaded");
        }
    });
}

module.exports = {
    uploadRoute: uploadRoute,
}