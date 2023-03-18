require("dotenv").config();

const PORT = process.env.PORT;

const MONGODB_URI = () => {
  return process.env.MONGODB_URI;
};

module.exports = {
  MONGODB_URI,
  PORT,
};
