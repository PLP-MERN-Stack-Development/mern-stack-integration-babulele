// posts.js - Routes for post-related endpoints

const express = require('express');
const router = express.Router();
const multer = require('multer');

// Import controllers
const {
  getAllPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  uploadPostImage,
  addComment,
} = require('../controllers/postController');

// Import upload middleware
const upload = require('../middleware/upload');

// Import validation middleware
const { validate, createPostSchema, updatePostSchema } = require('../utils/validation');

// Import auth middleware
const { protect } = require('../middleware/auth');

/**
 * @route   GET /api/posts
 * @desc    Get all posts
 * @access  Public
 * @query   page, limit, category, search, isPublished
 */
router.get('/', getAllPosts);

/**
 * @route   GET /api/posts/:id
 * @desc    Get single post by ID or slug
 * @access  Public
 */
router.get('/:id', getPost);

/**
 * @route   POST /api/posts
 * @desc    Create new post
 * @access  Private
 */
router.post('/', protect, validate(createPostSchema), createPost);

/**
 * @route   PUT /api/posts/:id
 * @desc    Update post
 * @access  Private
 */
router.put('/:id', protect, validate(updatePostSchema), updatePost);

/**
 * @route   DELETE /api/posts/:id
 * @desc    Delete post
 * @access  Private
 */
router.delete('/:id', protect, deletePost);

/**
 * @route   POST /api/posts/upload
 * @desc    Upload post image
 * @access  Private
 */
router.post('/upload', protect, (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      // Handle Multer errors
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            success: false,
            error: 'File too large. Maximum size is 5MB.',
          });
        }
        return res.status(400).json({
          success: false,
          error: err.message,
        });
      }
      // Handle other errors
      return res.status(400).json({
        success: false,
        error: err.message || 'File upload failed',
      });
    }
    next();
  });
}, uploadPostImage);

/**
 * @route   POST /api/posts/:id/comments
 * @desc    Add comment to post
 * @access  Private
 */
router.post('/:id/comments', protect, addComment);

module.exports = router;

