const path = require('path');
const logger = require(path.resolve(__dirname, 'logger'));
const { hashPassword } = require('./hasher.js');
const {
  isWithinLimits,
  resetLimitForIP,
  incFailedAttempts,
} = require('./rate-limiter.js');
const configLoader = require('../util/config-loader.js');
const config = require('../config.js');
const { uploadError } = require('./upload-error.js');
const { writeFile } = require('./file-writer.js');

// TODO Module for fs handling
async function uploadFile(ctx) {
  const passwords = configLoader.getPasswordObject();

  const ipAddr = ctx.forwardedFor;

  let foundPassword = false;

  for (const password of passwords.passwords) {
    if (hashPassword(ctx.password) === password) {
      foundPassword = true;
      break;
    }
  }

  if (!foundPassword) {
    await incFailedAttempts(ipAddr);

    const withinLimits = await isWithinLimits(ipAddr);
    if (!withinLimits) {
      logger.log({
        level: 'error',
        message: `Password rate limit exceeded: ${ipAddr} |
                Password: ${ctx.password} |
                File: ${ctx.file.originalname} |
                Time: ${new Date()}`,
      });

      throw new uploadError('Too Many Requests', 429);
    }

    throw new uploadError('Incorrect Password', 403);
  }

  // Reset consumed points on successful password verification from IP, otherwise wrong attempts would stack and lead to lockout
  await resetLimitForIP(ipAddr);

  try {
    await writeFile(ctx.file);
  } catch (err) {
    throw new uploadError(`Could not write the file to disk: ${err}`, 500);
  }

  return true;
}

module.exports = {
  uploadFile: uploadFile,
};
