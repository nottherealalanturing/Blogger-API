const usersRouter = require("express").Router();
const User = require("../models/user");
const passport = require("passport");
const { authenticateUser } = require("../utils/middleware");

usersRouter.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  const user = new User({ name, email });
  await user.setPassword(password);
  await user.save();
  res.json({ message: "User registered successfully" });
});

usersRouter.post("/login", passport.authenticate("local"), (req, res) => {
  res.json({ message: "Logged in successfully" });
});

usersRouter.get("/logout", authenticateUser, (req, res) => {
  req.logout();
  res.json({ message: "Logged out successfully" });
});

usersRouter.get("/me", authenticateUser, (req, res) => {
  res.json({ user: req.user });
});

module.exports = usersRouter;
