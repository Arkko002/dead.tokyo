const path = require("path");
const logger = require(path.resolve(__dirname, "logger"));
const { isWithinLimits, resetLimitForIP } = require(path.resolve(__dirname, "rate-limiter"));

async function uploadRoute (req, res) {
    // logger.log({level: "info",
    //     message: `Upload attempt: ${req.headers["x-forwarded-for"]} |
    //      Password: ${req.body.password} |
    //      File: ${req.file.originalname} |
    //      Time: ${new Date()}`})

    const ipAddr = req.headers["x-forwarded-for"];

    const withinLimits = await isWithinLimits(ipAddr)
    if (!withinLimits) {
        logger.log({level: "error",
            message: `Password rate limit exceeded: ${ipAddr} |
             Password: ${req.body.password} |
             File: ${req.file.originalname} |
             Time: ${new Date()}`})

        res.status(429).send("Too Many Requests");
    }

    // Reset consumed points on successful upload from IP, otherwise wrong attempts would stack and lead to lockout
    await resetLimitForIP(ipAddr)

    logger.log({level: "info",
        message: `Upload attempt: ${ipAddr} |
             Password: ${req.body.password} |
             File: ${req.file.originalname} |
             Time: ${new Date()}`})

    res.end("Uploaded")
}

module.exports = {
    uploadRoute: uploadRoute,
}