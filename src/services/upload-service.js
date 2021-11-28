const logger = require("../logger.js");
const {
  isWithinLimits,
  resetLimitForIP,
  incFailedAttempts,
} = require("./rate-limiter");
const { getPasswords } = require("../auth");
const { AppError, ErrorHandler } = require("../error");
const { writeFile } = require("./file-writer");

// TODO Module for fs handling
async function uploadFile(ctx) {
  const passwords = getPasswords();

  if (!(ctx.password in passwords)) {
    await incFailedAttempts(ctx.forwardedFor);

    const withinLimits = await isWithinLimits(ctx.forwardedFor);
    if (!withinLimits) {
      logger.log({
        level: "error",
        message: `Password rate limit exceeded: ${ctx.forwardedFor} |
                Password: ${ctx.password} |
                File: ${ctx.file.originalname} |
                Time: ${new Date()}`,
      });

      throw new AppError("Too Many Requests", 429, "error", true);
    }

    throw new AppError("Incorrect Password", 403, "info", true);
  }

  // Reset consumed points on successful password verification from IP, otherwise wrong attempts would stack and lead to lockout
  await resetLimitForIP(ctx.forwardedFor);

  try {
    await writeFile(ctx.file);
    logger.log({
      level: "info",
      message: `Upload successful: ${ctx.forwardedFor} |
                 Password: ${ctx.password} |
                 File: ${ctx.file.originalname} |
                 Time: ${new Date()}`,
    });
  } catch (err) {
    logger.log({
      level: "error",
      message: `Upload failed: ${ctx.forwardedFor} |
                 Password: ${ctx.password} |
                 File: ${ctx.file.originalname} |
                 Time: ${new Date()} | 
                 Error: ${err}`,
    });

    throw new AppError(
      `Could not write the file to disk: ${err}`,
      500,
      "error",
      true
    );
  }

  return true;
}

module.exports = {
  uploadFile: uploadFile,
};
