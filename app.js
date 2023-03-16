const express = require("express");
const database = require("./utils/database");
const middleware = require("./utils/middleware");
const cors = require("cors");
const passport = require("passport");
const ls = require("./controllers/passportStrategy");

const app = express();
require("express-async-errors");

database();
app.use(express.json());
app.use(middleware.requestLogger);

app.use(cors());

app.use(passport.initialize());
app.use(ls);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

app.use("/route", passport.authenticate("local"), "router");

//add routes

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
