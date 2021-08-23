const fs = require('fs');
const logger = require(path.resolve(__dirname, 'logger'));
const config = require('../config.js');

// TODO Better error handling for file writing, recoverable errors
async function writeFile(file) {
  // TODO add number at end of file if already exists
  const savePath = config.get('path.fileSavingPath');
  const filePath = path.join(savePath, file.originalname);

  fs.writeFile(file, filePath, { flag: 'wx' }, (err) => {
    if (err) {
      logger.log({
        level: 'error',
        message: `Upload failed: ${ipAddr} |
                 Password: ${ctx.password} |
                 File: ${ctx.file.originalname} |
                 Time: ${new Date()} | 
                 Error: ${err}`,
      });

      throw err;
    } else {
      logger.log({
        level: 'info',
        message: `Upload successful: ${ipAddr} |
                 Password: ${ctx.password} |
                 File: ${ctx.file.originalname} |
                 Time: ${new Date()}`,
      });
    }
  });
}

module.exports = {
  writeFile,
};
