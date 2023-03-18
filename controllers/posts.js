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
 *     tags:
 *       - Posts
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

/**
 * @swagger
 * /api/posts:
 *   post:
 *     summary: Create a new post
 *     tags:
 *       - Posts
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *             required:
 *               - title
 *               - content
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 content:
 *                   type: string
 *                 author:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     username:
 *                       type: string
 *                 createdAt:
 *                   type: string
 *         headers:
 *           Location:
 *             schema:
 *               type: string
 *               format: uri
 *             description: URL of the created post
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 msg:
 *                   type: string
 *                   example: Unauthorized
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */

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

/**
 * @swagger
 * /api/posts/{id}:
 *   get:
 *     summary: Get a post by ID
 *     tags:
 *       - Posts
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the post to retrieve
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The post ID
 *                 title:
 *                   type: string
 *                   description: The title of the post
 *                 content:
 *                   type: string
 *                   description: The content of the post
 *                 author:
 *                   type: object
 *                   description: The author of the post
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: The author ID
 *                     username:
 *                       type: string
 *                       description: The username of the author
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       description: The creation time of the author
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       description: The update time of the author
 *       404:
 *         description: Post not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: The error message
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: The error message
 */

postsRouter.get("/:id", async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }
  res.json(post);
});

/**
 * @swagger
 * /api/posts/{id}:
 *   put:
 *     summary: Update a post
 *     description: Update a post by ID
 *     tags: [Posts]
 *     security:
 *       - jwt: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the post to update
 *         required: true
 *         schema:
 *           type: string
 *         example: 6070ac0bfe39c04d90f0701c
 *       - name: title
 *         in: body
 *         description: New title for the post
 *         required: true
 *         schema:
 *           type: string
 *         example: New Title
 *       - name: content
 *         in: body
 *         description: New content for the post
 *         required: true
 *         schema:
 *           type: string
 *         example: New Content
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: Post ID
 *                   example: 6070ac0bfe39c04d90f0701c
 *                 title:
 *                   type: string
 *                   description: Post title
 *                   example: New Title
 *                 content:
 *                   type: string
 *                   description: Post content
 *                   example: New Content
 *                 author:
 *                   type: string
 *                   description: Author ID
 *                   example: 6070ac0bfe39c04d90f0701c
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: Unauthorized
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: Forbidden
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: Post not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: Internal server error
 */

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

/**
 * @swagger
 * /api/posts/{id}:
 *   delete:
 *     summary: Delete a post by ID
 *     description: Deletes a post specified by its ID. Only the author of the post can delete it.
 *     tags:
 *       - Posts
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the post to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The deleted post
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: The status message
 *                   example: Post deleted
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: The error message
 *                   example: Unauthorized
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: The error message
 *                   example: Forbidden
 *       404:
 *         description: Not Found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: The error message
 *                   example: Post not found
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: The error message
 *                   example: Internal server error
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
