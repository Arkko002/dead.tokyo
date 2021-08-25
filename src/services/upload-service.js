const logger = require("../logger.js");
const { PasswordHasher } = require("../auth");
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

  let foundPassword = false;
  if (PasswordHasher.hashPassword(ctx.password) in passwords) {
    foundPassword = true;
  }

  if (!foundPassword) {
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
  } catch (err) {
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
