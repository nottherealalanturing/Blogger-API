const express = require("express");
const passport = require("passport");
const postsRouter = require("express").Router();
const Post = require("../models/post");
const { authenticateUser } = require("../utils/middleware");

/**
 * @swagger
 * /api/posts:
 *   get:
 *     summary: Get all posts
 *     tag: [Posts]
 *     responses:
 *       200:
 *         description: A list of all posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: The ID of the post
 *                     example: 616579e9b8cf59b9f4c0863a
 *                   title:
 *                     type: string
 *                     description: The title of the post
 *                     example: My First Post
 *                   content:
 *                     type: string
 *                     description: The content of the post
 *                     example: This is my first post!
 *                   author:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: The ID of the author
 *                         example: 616579e9b8cf59b9f4c0863b
 *                       username:
 *                         type: string
 *                         description: The username of the author
 *                         example: johndoe
 *                     description: The author of the post
 *                     example: {_id: "616579e9b8cf59b9f4c0863b", username: "johndoe"}
 */

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
