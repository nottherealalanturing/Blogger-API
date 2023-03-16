const express = require("express");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const cors = require("cors");
const mongoose = require("mongoose");
const database = require("./utils/database");
const middleware = require("./utils/middleware");
const postsRouter = require("./controllers/posts");
const usersRouter = require("./controllers/users");

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
    store: MongoStore.create({
      mongoUrl:
        "mongodb://assad:password@localhost:27017/bloggerDEV?directConnection=true&authSource=admin&replicaSet=replicaset&retryWrites=true",
    }),
    //new MongoStore({ mongooseConnection: mongoose.connection })
  })
);

app.use(passport.initialize());
app.use(passport.session());

database();

app.use("/auth", usersRouter);
app.use("/posts", postsRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
