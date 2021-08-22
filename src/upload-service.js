const path = require("path");
const fs = require("fs");
const logger = require(path.resolve(__dirname, "logger"));
const { hashPassword } = require("./hasher.js");
const { isWithinLimits, resetLimitForIP, incFailedAttempts } = require("./rate-limiter.js");
const configLoader = require("./config-loader.js");

// TODO Module for fs handling
async function uploadRoute(req, res) {
	const config = configLoader.getConfig();
	const passwords = configLoader.getPasswordObject();

	const ipAddr = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

	let foundPassword = false;

	for (const password of passwords.passwords) {
		if (hashPassword(req.body.password) === password) {
			foundPassword = true;
			break;
		}
	}

	if (!foundPassword) {
		await incFailedAttempts(ipAddr);

		const withinLimits = await isWithinLimits(ipAddr)
		if (!withinLimits) {
			logger.log({
				level: "error",
				message: `Password rate limit exceeded: ${ipAddr} |
                Password: ${req.body.password} |
                File: ${req.file.originalname} |
                Time: ${new Date()}`
			})

			res.status(429).send("Too Many Requests");
			return;
		}

		res.status(403).send("Incorrect password");
		return;
	}

	// Reset consumed points on successful password verification from IP, otherwise wrong attempts would stack and lead to lockout
	await resetLimitForIP(ipAddr);

	const filePath = path.join(config.fileSavingPath, req.file.originalname);

	fs.writeFile(filePath, req.file.buffer,{flag: "wx"}, (err) => {
		if (err) {
			logger.log({
				level: "error",
				message: `Upload failed: ${ipAddr} |
                 Password: ${req.body.password} |
                 File: ${req.file.originalname} |
                 Time: ${new Date()} | 
                 Error: ${err}`
			})

			res.status(500).send(`Could not write the file to disk: ${err}`)
		} else {
			logger.log({
				level: "info",
				message: `Upload successful: ${ipAddr} |
                 Password: ${req.body.password} |
                 File: ${req.file.originalname} |
                 Time: ${new Date()}`
			})

			res.send("Uploaded");
		}
	});
}
module.exports = {
	uploadRoute: uploadRoute,
}
