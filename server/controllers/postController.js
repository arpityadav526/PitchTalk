const Post = require("../models/Post");
const Comment = require("../models/Comment");
const uploadToCloudinary = require("../utils/uploadToCloudinary");

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
const createPost = async (req, res, next) => {
  try {
    const { content, clubTag } = req.body;

    if (!content || !content.trim()) {
      res.status(400);
      throw new Error("Post content is required");
    }

    let imageUrl = "";

    if (req.file) {
      const uploadedImage = await uploadToCloudinary(req.file.buffer, "pitchtalk/posts");
      imageUrl = uploadedImage.secure_url;
    }

    const post = await Post.create({
      author: req.user._id,
      content: content.trim(),
      clubTag: clubTag ? clubTag.trim() : "",
      image: imageUrl,
    });

    const populatedPost = await Post.findById(post._id).populate(
      "author",
      "name username email avatar role"
    );

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      post: populatedPost,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all posts with optional search and club filter
// @route   GET /api/posts
// @access  Public
const getAllPosts = async (req, res, next) => {
  try {
    const { search, club } = req.query;

    const filter = {};

    if (search && search.trim()) {
      filter.content = { $regex: search.trim(), $options: "i" };
    }

    if (club && club.trim()) {
      filter.clubTag = { $regex: `^${club.trim()}$`, $options: "i" };
    }

    const posts = await Post.find(filter)
      .populate("author", "name username email avatar role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: posts.length,
      filters: {
        search: search || "",
        club: club || "",
      },
      posts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single post by ID
// @route   GET /api/posts/:id
// @access  Public
const getPostById = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      "author",
      "name username email avatar role"
    );

    if (!post) {
      res.status(404);
      throw new Error("Post not found");
    }

    res.status(200).json({
      success: true,
      post,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a post
// @route   PUT /api/posts/:id
// @access  Private
const updatePost = async (req, res, next) => {
  try {
    const { content, clubTag } = req.body;

    const post = await Post.findById(req.params.id);

    if (!post) {
      res.status(404);
      throw new Error("Post not found");
    }

    const isOwner = post.author.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      res.status(403);
      throw new Error("Not authorized to update this post");
    }

    if (content !== undefined) {
      if (!content.trim()) {
        res.status(400);
        throw new Error("Post content cannot be empty");
      }
      post.content = content.trim();
    }

    if (clubTag !== undefined) {
      post.clubTag = clubTag.trim();
    }

    if (req.file) {
      const uploadedImage = await uploadToCloudinary(req.file.buffer, "pitchtalk/posts");
      post.image = uploadedImage.secure_url;
    }

    const updatedPost = await post.save();

    const populatedPost = await Post.findById(updatedPost._id).populate(
      "author",
      "name username email avatar role"
    );

    res.status(200).json({
      success: true,
      message: "Post updated successfully",
      post: populatedPost,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private
const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      res.status(404);
      throw new Error("Post not found");
    }

    const isOwner = post.author.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      res.status(403);
      throw new Error("Not authorized to delete this post");
    }

    await Comment.deleteMany({ post: post._id });
    await post.deleteOne();

    res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Like or unlike a post
// @route   PUT /api/posts/:id/like
// @access  Private
const toggleLikePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      "author",
      "name username email avatar role"
    );

    if (!post) {
      res.status(404);
      throw new Error("Post not found");
    }

    const userId = req.user._id.toString();
    const alreadyLiked = post.likes.some((like) => like.toString() === userId);

    if (alreadyLiked) {
      post.likes = post.likes.filter((like) => like.toString() !== userId);
    } else {
      post.likes.push(req.user._id);
    }

    await post.save();

    res.status(200).json({
      success: true,
      message: alreadyLiked ? "Post unliked successfully" : "Post liked successfully",
      liked: !alreadyLiked,
      likesCount: post.likes.length,
      post,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a comment to a post
// @route   POST /api/posts/:id/comments
// @access  Private
const addCommentToPost = async (req, res, next) => {
  try {
    const { content } = req.body;

    if (!content || !content.trim()) {
      res.status(400);
      throw new Error("Comment content is required");
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      res.status(404);
      throw new Error("Post not found");
    }

    const comment = await Comment.create({
      post: post._id,
      author: req.user._id,
      content: content.trim(),
    });

    post.commentsCount += 1;
    await post.save();

    const populatedComment = await Comment.findById(comment._id).populate(
      "author",
      "name username email avatar role"
    );

    res.status(201).json({
      success: true,
      message: "Comment added successfully",
      comment: populatedComment,
      commentsCount: post.commentsCount,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all comments of a post
// @route   GET /api/posts/:id/comments
// @access  Public
const getCommentsByPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      res.status(404);
      throw new Error("Post not found");
    }

    const comments = await Comment.find({ post: req.params.id })
      .populate("author", "name username email avatar role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: comments.length,
      comments,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a comment
// @route   DELETE /api/posts/:postId/comments/:commentId
// @access  Private
const deleteComment = async (req, res, next) => {
  try {
    const { postId, commentId } = req.params;

    const post = await Post.findById(postId);
    if (!post) {
      res.status(404);
      throw new Error("Post not found");
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      res.status(404);
      throw new Error("Comment not found");
    }

    const isCommentOwner = comment.author.toString() === req.user._id.toString();
    const isPostOwner = post.author.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isCommentOwner && !isPostOwner && !isAdmin) {
      res.status(403);
      throw new Error("Not authorized to delete this comment");
    }

    await comment.deleteOne();

    if (post.commentsCount > 0) {
      post.commentsCount -= 1;
      await post.save();
    }

    res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
      commentsCount: post.commentsCount,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  toggleLikePost,
  addCommentToPost,
  getCommentsByPost,
  deleteComment,
};