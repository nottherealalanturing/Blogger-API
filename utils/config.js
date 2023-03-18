require("dotenv").config();

const PORT = process.env.PORT;

const MONGODB_URI = () => {
  return process.env.MONGODB_URI;
};

const PUBL_KEY = process.env.PUB_KEY;
const PRI_KEY = process.env.PRI_KEY;

module.exports = {
  MONGODB_URI,
  PORT,
  PUB_KEY,
  PRI_KEY,
};
