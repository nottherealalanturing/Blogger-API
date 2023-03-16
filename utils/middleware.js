const passport = require("passport");
const logger = require("./logger.js");

const requestLogger = (request, response, next) => {
  logger.info("Method:", request.method);
  logger.info("path:", request.path);
  logger.info("body:", request.body);
  logger.info("- - -:");
  next();
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (error, request, response, next) => {
  logger.error(error.message);

  if (error.name === "CastError")
    response.status(404).json({ error: "malformatted id" });
  else if (error.name === "ValidationError")
    response.status(404).json({ error: error.message });
  else if (error.name === "JsonWebTokenError")
    return response.status(400).json({ error: error.message });
  else if (error.name === "TokenExpiredError")
    return response.status(401).json({
      error: "token expired",
    });

  next(error);
};

const authenticateUser = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.user = user;
    next();
  })(req, res, next);
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  authenticateUser,
};
