const express = require("express");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const cors = require("cors");
const database = require("./utils/database");
const middleware = require("./utils/middleware");

const app = express();
require("express-async-errors");

app.use(express.json());
app.use(cors());
app.use(middleware.requestLogger);

app.use(
  session({
    secret: "myscrettoken",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

app.use(passport.initialize());
app.use(passport.session());

database();

app.use("/auth");
app.use("/posts");

//add routes

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
