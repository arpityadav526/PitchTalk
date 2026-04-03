const express = require("express");
const router = express.Router();
const {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  toggleLikePost,
  addCommentToPost,
  getCommentsByPost,
  deleteComment,
} = require("../controllers/postController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.get("/test", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Post route working",
  });
});

router
  .route("/")
  .get(getAllPosts)
  .post(protect, upload.single("image"), createPost);

router.put("/:id/like", protect, toggleLikePost);

router
  .route("/:id")
  .get(getPostById)
  .put(protect, upload.single("image"), updatePost)
  .delete(protect, deletePost);

router.route("/:id/comments").get(getCommentsByPost).post(protect, addCommentToPost);

router.delete("/:postId/comments/:commentId", protect, deleteComment);

module.exports = router;