// postController.js - Controller for handling post-related requests

const Post = require('../models/Post');
const Category = require('../models/Category');
const { ApiError } = require('../middleware/errorHandler');

/**
 * @desc    Upload post image
 * @route   POST /api/posts/upload
 * @access  Private
 */
const uploadPostImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(new ApiError('Please upload an image file', 400));
    }

    res.status(200).json({
      success: true,
      data: {
        filename: req.file.filename,
        path: `/uploads/${req.file.filename}`,
        fullPath: req.file.path,
      },
    });
  } catch (error) {
    console.error('Upload error:', error);
    next(error);
  }
};

/**
 * @desc    Get all posts
 * @route   GET /api/posts
 * @access  Public
 */
const getAllPosts = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      search,
      isPublished = true,
    } = req.query;

    // Build query
    const query = {};
    
    // Filter by category
    if (category) {
      const categoryDoc = await Category.findOne({ slug: category });
      if (categoryDoc) {
        query.category = categoryDoc._id;
      }
    }
    
    // Filter by published status
    if (isPublished === 'true' || isPublished === true) {
      query.isPublished = true;
    }

    // Search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ];
    }

    // Calculate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Get posts with pagination
    const posts = await Post.find(query)
      .populate('author', 'name email')
      .populate('category', 'name slug color')
      .sort({ createdAt: -1 }) // Newest first
      .skip(skip)
      .limit(limitNum);

    // Get total count for pagination info
    const total = await Post.countDocuments(query);

    res.status(200).json({
      success: true,
      count: posts.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      data: posts,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single post by ID or slug
 * @route   GET /api/posts/:id
 * @access  Public
 */
const getPost = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if it's a valid MongoDB ObjectId or a slug
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);

    let post;
    if (isObjectId) {
      post = await Post.findById(id)
        .populate('author', 'name email')
        .populate('category', 'name slug color')
        .populate('comments.user', 'name email');
    } else {
      post = await Post.findOne({ slug: id })
        .populate('author', 'name email')
        .populate('category', 'name slug color')
        .populate('comments.user', 'name email');
    }

    if (!post) {
      return next(new ApiError(`Post not found with id/slug of ${id}`, 404));
    }

    // Increment view count
    post.incrementViewCount();

    res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create new post
 * @route   POST /api/posts
 * @access  Private (will add auth later)
 */
const createPost = async (req, res, next) => {
  try {
    // Get author from authenticated user
    req.body.author = req.user.id;

    // Check if category exists
    const category = await Category.findById(req.body.category);
    if (!category) {
      return next(new ApiError(`Category not found with id of ${req.body.category}`, 404));
    }

    // Create post
    const post = await Post.create(req.body);

    // Populate before sending response
    await post.populate('author', 'name email');
    await post.populate('category', 'name slug color');

    res.status(201).json({
      success: true,
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update post
 * @route   PUT /api/posts/:id
 * @access  Private (will add auth later)
 */
const updatePost = async (req, res, next) => {
  try {
    const { id } = req.params;

    let post = await Post.findById(id);

    if (!post) {
      return next(new ApiError(`Post not found with id of ${id}`, 404));
    }

    // Make sure user owns the post (or is admin)
    if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new ApiError('Not authorized to update this post', 403));
    }

    // If category is being updated, validate it exists
    if (req.body.category) {
      const category = await Category.findById(req.body.category);
      if (!category) {
        return next(new ApiError(`Category not found with id of ${req.body.category}`, 404));
      }
    }

    // Update post
    post = await Post.findByIdAndUpdate(id, req.body, {
      new: true, // Return updated document
      runValidators: true, // Run schema validators
    })
      .populate('author', 'name email')
      .populate('category', 'name slug color');

    res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete post
 * @route   DELETE /api/posts/:id
 * @access  Private (will add auth later)
 */
const deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);

    if (!post) {
      return next(new ApiError(`Post not found with id of ${id}`, 404));
    }

    // Make sure user owns the post (or is admin)
    if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new ApiError('Not authorized to delete this post', 403));
    }

    await post.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
      message: 'Post deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Add comment to post
 * @route   POST /api/posts/:id/comments
 * @access  Private
 */
const addComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (!content || content.trim() === '') {
      return next(new ApiError('Comment content is required', 400));
    }

    const post = await Post.findById(id);

    if (!post) {
      return next(new ApiError(`Post not found with id of ${id}`, 404));
    }

    // Add comment
    post.comments.push({
      user: req.user.id,
      content: content.trim(),
    });

    await post.save();

    // Populate user info in the new comment
    await post.populate('comments.user', 'name email');

    const newComment = post.comments[post.comments.length - 1];

    res.status(201).json({
      success: true,
      data: newComment,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  uploadPostImage,
  addComment,
};

