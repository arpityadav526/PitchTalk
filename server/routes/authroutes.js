const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/authController");

router.get("/test", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Auth route working",
  });
});

router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;

