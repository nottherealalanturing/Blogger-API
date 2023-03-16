const express = require("express");
const postsRouter = require("express").Router();
const Post = require("../models/Post");
const { authenticateUser } = require("../utils/middleware");

// GET /posts
postsRouter.get("/", async (req, res) => {
  const posts = await Post.find();
  res.json(posts);
});

// POST /posts
postsRouter.post("/", authenticateUser, async (req, res) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    author: req.user._id,
  });

  const newPost = await post.save();
  res.status(201).json(newPost);
});

// GET /posts/:id
postsRouter.get("/:id", async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }
  res.json(post);
});

// PUT /posts/:id
postsRouter.put("/:id", authenticateUser, async (req, res) => {
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
});

// DELETE /posts/:id
postsRouter.delete("/:id", authenticateUser, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  if (post.author.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Forbidden" });
  }

  await post.remove();
  res.json({ message: "Post deleted" });
});

module.exports = postsRouter;
