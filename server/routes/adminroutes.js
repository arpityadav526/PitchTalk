const express = require("express");
const router = express.Router();
const {
  getAllPostsForAdmin,
  deleteAnyPostAsAdmin,
  getAllUsersForAdmin,
} = require("../controllers/adminController");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

router.get("/test", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Admin route working",
  });
});

router.get("/posts", protect, authorizeRoles("admin"), getAllPostsForAdmin);
router.delete(
  "/posts/:id",
  protect,
  authorizeRoles("admin"),
  deleteAnyPostAsAdmin
);
router.get("/users", protect, authorizeRoles("admin"), getAllUsersForAdmin);

module.exports = router;