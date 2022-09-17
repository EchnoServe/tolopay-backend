const logger = require("./../utils/logger");

exports.error = (err, req, res, next) => {
  logger.error(err.message, err);
  //! status code

  res.status(500).send({
    message: err.message,
  });
};
