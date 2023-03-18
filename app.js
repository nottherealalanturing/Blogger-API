const express = require("express");
const passport = require("passport");
const cors = require("cors");
const database = require("./utils/database");
const middleware = require("./utils/middleware");
const postsRouter = require("./controllers/posts");
const usersRouter = require("./controllers/users");
const swaggerDocs = require("./utils/swagger");

const app = express();
require("express-async-errors");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(middleware.requestLogger);

require("./utils/passport_auth")(passport);

app.use(passport.initialize());

require("./utils/passport_auth");

database();

app.use("/api/users", usersRouter);
app.use("/api/posts", postsRouter);
swaggerDocs(app, 3210);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
