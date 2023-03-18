const usersRouter = require("express").Router();
const User = require("../models/user");
const passport = require("passport");
const path = require("path");
const jwt = require("jsonwebtoken");
const { authenticateUser } = require("../utils/middleware");
const {
  generatePasswordHash,
  issueJWT,
  validatePassword,
} = require("../utils/password_utils");

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 default: Assad Isah
 *               email:
 *                 type: string
 *                 default: assad@isah.com
 *               username:
 *                 type: string
 *                 default: assadisah
 *               password:
 *                 type: string
 *                 default: password
 *     responses:
 *       '200':
 *         description: A successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     username:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                     updatedAt:
 *                       type: string
 *                 token:
 *                   type: string
 *                 expiresIn:
 *                   type: string
 *       '400':
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */

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

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Log in an existing user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Successfully logged in user and issued JWT token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MTY3ZjAxMmIzMDY0YzI3MjVjNzhlMTEiLCJlbWFpbCI6ImVtYWlsQGV4YW1wbGUuY29tIiwiaWF0IjoxNjMwNTQ1MDkzLCJleHAiOjE2MzA1NDg2OTN9.WGVx_7_gDaFKrlzXXYgsJfnZBKhFZnbgyPWdYGkmJg8"
 *                 expiresIn:
 *                   type: string
 *                   format: date-time
 *                   example: "2022-01-01T00:00:00.000Z"
 *       '401':
 *         description: Invalid username or password
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
 *                   example: "Incorrect credentials"
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */

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

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Get authenticated user's information
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User's information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: User ID
 *                     name:
 *                       type: string
 *                       description: User's name
 *                     email:
 *                       type: string
 *                       description: User's email
 *                     username:
 *                       type: string
 *                       description: User's username
 *                   example:
 *                     _id: "614f8d6e28c6c22b9f0b69d8"
 *                     name: "Assad Isah"
 *                     email: "assadisah@example.com"
 *                     username: "assadisah"
 *       401:
 *         description: Unauthorized access
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *               example:
 *                 message: "Unauthorized"
 */

usersRouter.get(
  "/me",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({ user: req.user });
  }
);

module.exports = usersRouter;
