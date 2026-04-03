const bcrypt = require("bcryptjs");
const User = require("../models/User");
const generateToken = require("../utils/generateTokens");

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { name, username, email, password } = req.body;

    if (!name || !username || !email || !password) {
      res.status(400);
      throw new Error("All fields are required");
    }

    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail) {
      res.status(400);
      throw new Error("Email already registered");
    }

    const existingUserByUsername = await User.findOne({ username });
    if (existingUserByUsername) {
      res.status(400);
      throw new Error("Username already taken");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        bio: user.bio,
        avatar: user.avatar,
        favoriteClubs: user.favoriteClubs,
        favoritePlayers: user.favoritePlayers,
        role: user.role,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { emailOrUsername, password } = req.body;

    if (!emailOrUsername || !password) {
      res.status(400);
      throw new Error("Email/username and password are required");
    }

    const user = await User.findOne({
      $or: [
        { email: emailOrUsername.toLowerCase() },
        { username: emailOrUsername.toLowerCase() },
      ],
    });

    if (!user) {
      res.status(401);
      throw new Error("Invalid credentials");
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      res.status(401);
      throw new Error("Invalid credentials");
    }

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        bio: user.bio,
        avatar: user.avatar,
        favoriteClubs: user.favoriteClubs,
        favoritePlayers: user.favoritePlayers,
        role: user.role,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
};