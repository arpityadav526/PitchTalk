const User = require("../models/User");
const Post = require("../models/Post");
const uploadToCloudinary = require("../utils/uploadToCloudinary");

// @desc    Get current logged-in user
// @route   GET /api/users/me
// @access  Private
const getCurrentUser = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get my full profile
// @route   GET /api/users/profile/me
// @access  Private
const getMyProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update my profile
// @route   PUT /api/users/profile
// @access  Private
const updateMyProfile = async (req, res, next) => {
  try {
    const { name, username, bio, favoriteClubs, favoritePlayers } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    if (username && username.toLowerCase() !== user.username) {
      const existingUsername = await User.findOne({
        username: username.toLowerCase(),
        _id: { $ne: user._id },
      });

      if (existingUsername) {
        res.status(400);
        throw new Error("Username already taken");
      }
    }

    user.name = name !== undefined ? name.trim() : user.name;
    user.username =
      username !== undefined ? username.trim().toLowerCase() : user.username;
    user.bio = bio !== undefined ? bio.trim() : user.bio;
    user.favoriteClubs = Array.isArray(favoriteClubs)
      ? favoriteClubs
      : user.favoriteClubs;
    user.favoritePlayers = Array.isArray(favoritePlayers)
      ? favoritePlayers
      : user.favoritePlayers;

    if (req.file) {
      const uploadedAvatar = await uploadToCloudinary(req.file.buffer, "pitchtalk/avatars");
      user.avatar = uploadedAvatar.secure_url;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        username: updatedUser.username,
        email: updatedUser.email,
        bio: updatedUser.bio,
        avatar: updatedUser.avatar,
        favoriteClubs: updatedUser.favoriteClubs,
        favoritePlayers: updatedUser.favoritePlayers,
        role: updatedUser.role,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle favorite club
// @route   PUT /api/users/favorites/clubs
// @access  Private
const toggleFavoriteClub = async (req, res, next) => {
  try {
    const { club } = req.body;

    if (!club || !club.trim()) {
      res.status(400);
      throw new Error("Club is required");
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    const normalizedClub = club.trim();
    const alreadyExists = user.favoriteClubs.some(
      (item) => item.toLowerCase() === normalizedClub.toLowerCase()
    );

    if (alreadyExists) {
      user.favoriteClubs = user.favoriteClubs.filter(
        (item) => item.toLowerCase() !== normalizedClub.toLowerCase()
      );
    } else {
      user.favoriteClubs.push(normalizedClub);
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: alreadyExists
        ? "Club removed from favorites"
        : "Club added to favorites",
      favoriteClubs: user.favoriteClubs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle favorite player
// @route   PUT /api/users/favorites/players
// @access  Private
const toggleFavoritePlayer = async (req, res, next) => {
  try {
    const { player } = req.body;

    if (!player || !player.trim()) {
      res.status(400);
      throw new Error("Player is required");
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    const normalizedPlayer = player.trim();
    const alreadyExists = user.favoritePlayers.some(
      (item) => item.toLowerCase() === normalizedPlayer.toLowerCase()
    );

    if (alreadyExists) {
      user.favoritePlayers = user.favoritePlayers.filter(
        (item) => item.toLowerCase() !== normalizedPlayer.toLowerCase()
      );
    } else {
      user.favoritePlayers.push(normalizedPlayer);
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: alreadyExists
        ? "Player removed from favorites"
        : "Player added to favorites",
      favoritePlayers: user.favoritePlayers,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get public user profile by ID
// @route   GET /api/users/:id
// @access  Public
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get posts by a user
// @route   GET /api/users/:id/posts
// @access  Public
const getPostsByUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    const posts = await Post.find({ author: req.params.id })
      .populate("author", "name username email avatar role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: posts.length,
      posts,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCurrentUser,
  getMyProfile,
  updateMyProfile,
  toggleFavoriteClub,
  toggleFavoritePlayer,
  getUserById,
  getPostsByUser,
};