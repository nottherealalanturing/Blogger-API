const express = require("express");
const passport = require("passport");
const postsRouter = require("express").Router();
const Post = require("../models/post");
const { authenticateUser } = require("../utils/middleware");

postsRouter.get("/", async (req, res) => {
  const posts = await Post.find();
  res.json(posts);
});

postsRouter.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      author: req.user._id,
    });

    const newPost = await post.save();
    res.status(201).json(newPost);
  }
);

postsRouter.get("/:id", async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }
  res.json(post);
});

postsRouter.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Forbidden" });
    }

    post.title = req.body.title;
    post.content = req.body.content;

    const updatedPost = await post.save();
    res.json(updatedPost);
  }
);

/* (
  "/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await post.remove();
    res.json({ message: "Post deleted" });
  }
);
 */
postsRouter.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Forbidden" });
    }

    try {
      await post.deleteOne();
      res.json({ message: "Post deleted" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

module.exports = postsRouter;
