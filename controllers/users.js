const usersRouter = require("express").Router();
const User = require("../models/user");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const { authenticateUser } = require("../utils/middleware");
const {
  generatePasswordHash,
  issueJWT,
  validatePassword,
} = require("../utils/password_utils");

usersRouter.post("/register", async (req, res) => {
  const saltHash = generatePasswordHash(req.body.password);

  const { salt, hash } = saltHash;

  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    username: req.body.username,
    hash: hash,
    salt: salt,
  });

  try {
    const user = await newUser.save();
    const jwttoken = issueJWT(user);
    res.json({
      success: true,
      user: user,
      token: jwttoken.token,
      expiresIn: jwttoken.expires,
    });
  } catch (error) {
    if (error.name === "CastError") res.json({ error: "malformatted id" });
    else if (error.name === "ValidationError")
      res.json({ error: error.message });
    else if (error.name === "JsonWebTokenError")
      return res.json({ error: error.message });
    else if (error.name === "TokenExpiredError")
      return response.status(401).res.json({
        error: "token expired",
      });
    else if (error.code === 11000) {
      res.status(400).send({ message: "Email already exists" });
    } else {
      res.status(500).send({ message: "Internal server error" });
    }
  }
});

usersRouter.post("/login", (req, res, next) => {
  User.findOne({ username: req.body.username })
    .then((user) => {
      if (!user) {
        return res
          .status(401)
          .json({ success: false, msg: "could not find user" });
      }

      const isValid = validatePassword(req.body.password, user.hash, user.salt);

      if (isValid) {
        const tokenObject = issueJWT(user);

        res.status(200).json({
          success: true,
          token: tokenObject.token,
          expiresIn: tokenObject.expires,
        });
      } else {
        res.status(401).json({ success: false, msg: "Incorrect credentials" });
      }
    })
    .catch((err) => {
      next(err);
    });
});

usersRouter.get(
  "/me",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({ user: req.user });
  }
);

module.exports = usersRouter;
