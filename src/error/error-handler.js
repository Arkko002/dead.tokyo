const logger = require("../logger");

class errorHandler {
  constructor() {
    this.handleError = async (error, responseStream) => {
      // logger.log(error);

      console.log(error);
      if (typeof responseStream !== typeof undefined) {
        responseStream.send(`An error occured: ${error}`);
        console.log(error);
      }
    };
  }
}

module.exports.handler = new errorHandler();
