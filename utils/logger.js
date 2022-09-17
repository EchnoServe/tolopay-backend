const winston = require("winston");

const logger = winston.createLogger({
  transports: [
    new winston.transports.File({
      filename: "errors.log",
      level: "error",
    }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

process.on("unhandledRejection", (ex) => {
  logger.error("Unhandled Rejection at Promise : ", ex);
  process.exit(1);
});
process.on("uncaughtException", (ex) => {
  logger.error("Uncaught Exception thrown : ", ex);
  process.exit(1);
});

module.exports = logger;
