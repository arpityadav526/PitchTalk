const User = require("../models/User");
const Post = require("../models/Post");
const Comment = require("../models/Comment");

// @desc    Get all posts for admin dashboard
// @route   GET /api/admin/posts
// @access  Private/Admin
const getAllPostsForAdmin = async (req, res, next) => {
  try {
    const posts = await Post.find()
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

// @desc    Delete any post as admin
// @route   DELETE /api/admin/posts/:id
// @access  Private/Admin
const deleteAnyPostAsAdmin = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      res.status(404);
      throw new Error("Post not found");
    }

    await Comment.deleteMany({ post: post._id });
    await post.deleteOne();

    res.status(200).json({
      success: true,
      message: "Post deleted by admin successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users for admin dashboard
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsersForAdmin = async (req, res, next) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllPostsForAdmin,
  deleteAnyPostAsAdmin,
  getAllUsersForAdmin,
};