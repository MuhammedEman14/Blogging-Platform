const express = require("express");
const app = express();
const router = express.Router();
const {
  createBlogPost,
  getBlogPostById,
  updateBlogPost,
  deleteBlogPost,
  addRating,
  addComment,
  getAllBlogPosts,
  getSortedAndFilteredPosts,
  getUserFeed,
  listAllBlogPosts,
  viewBlogPost,
  disableBlog,
} = require("../controllers/blogController");

const { authenticateUser } = require("../middleware/authenticationMiddleware");
const  {isAdmin}  = require('../middleware/adminMiddleware');


router.post("/posts",authenticateUser, createBlogPost);
router.post('/posts/:postId/ratings', authenticateUser, addRating);

// Add comment to a blog post
router.post('/posts/:postId/comments', authenticateUser, addComment);
// Retrieve a specific blog post
router.get("/posts/:postId",authenticateUser, getBlogPostById);

// Update a specific blog post
router.put("/posts/:postId",authenticateUser, updateBlogPost);

// Delete a specific blog post
router.delete("/posts/:postId", authenticateUser,deleteBlogPost);
router.get('/blog-posts', getAllBlogPosts);
router.get('/sorted-and-filtered-posts', getSortedAndFilteredPosts);
router.get('/feed',authenticateUser, getUserFeed);
router.get('/blog-posts',authenticateUser, isAdmin, listAllBlogPosts);
router.get('/blog-post/:postId', authenticateUser,isAdmin, viewBlogPost);
router.put('/disable-blog/:postId',authenticateUser, isAdmin, disableBlog);

module.exports = router;
