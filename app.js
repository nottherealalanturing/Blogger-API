const express = require("express");
const database = require("./utils/database");
const middleware = require("./utils/middleware");
const cors = require("cors");

const app = express();
require("express-async-errors");

database();
app.use(express.json());
app.use(middleware.requestLogger);

app.use(cors());

//add routes

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
