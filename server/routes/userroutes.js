const express = require("express");
const router = express.Router();
const {
  getCurrentUser,
  getMyProfile,
  updateMyProfile,
  toggleFavoriteClub,
  toggleFavoritePlayer,
  getUserById,
  getPostsByUser,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.get("/test", (req, res) => {
  res.status(200).json({
    success: true,
    message: "User route working",
  });
});

router.get("/me", protect, getCurrentUser);
router.get("/profile/me", protect, getMyProfile);
router.put("/profile", protect, upload.single("avatar"), updateMyProfile);

router.put("/favorites/clubs", protect, toggleFavoriteClub);
router.put("/favorites/players", protect, toggleFavoritePlayer);

router.get("/:id/posts", getPostsByUser);
router.get("/:id", getUserById);

module.exports = router;