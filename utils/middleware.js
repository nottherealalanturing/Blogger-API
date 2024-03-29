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
  else if (error.code === 11000) {
    res.status(400).send({ message: "Email already exists" });
  } else {
    res.status(500).send({ message: "Internal server error" });
  }

  next(error);
};

const authenticateUser = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (error, user) => {
    if (error || !user) {
      res.status(401).json({ message: "Unauthorized" });
    } else {
      req.user = user;
      next();
    }
  })(req, res, next);
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  authenticateUser,
};
