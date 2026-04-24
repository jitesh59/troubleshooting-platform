const express = require("express");
const router = express.Router();
const {
  createPost,
  getPosts,
  getPost,
  deletePost,
  upvotePost,
  downvotePost,
  addComment,
} = require("../controllers/postController");
const auth = require("../middleware/auth");

// Public routes
router.get("/", getPosts);
router.get("/:id", getPost);

// Protected routes
router.post("/", auth, createPost);
router.delete("/:id", auth, deletePost);
router.put("/:id/upvote", auth, upvotePost);
router.put("/:id/downvote", auth, downvotePost);
router.post("/:id/comments", auth, addComment);

module.exports = router;
