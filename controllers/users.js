const usersRouter = require("express").Router();
const User = require("../models/user");

usersRouter.get("/", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

usersRouter.get(":/id", async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.json(user);
});

usersRouter.post("/", async (req, res) => {
  const user = new User(req.body);
  await user.save();
  res.status(201).json(user);
});

usersRouter.put("/:id", async (req, res) => {
  const { id } = req.params;

  const user = await User.findByIdAndUpdate(id, req.body, { new: true });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.json(user);
});

usersRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  await user.remove();

  return res.status(204).send();
});
