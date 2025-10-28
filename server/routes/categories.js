// categories.js - Routes for category-related endpoints

const express = require('express');
const router = express.Router();

// Import controllers
const {
  getAllCategories,
  getCategory,
  createCategory,
} = require('../controllers/categoryController');

// Import validation middleware
const { validate, createCategorySchema } = require('../utils/validation');

/**
 * @route   GET /api/categories
 * @desc    Get all categories
 * @access  Public
 */
router.get('/', getAllCategories);

/**
 * @route   GET /api/categories/:id
 * @desc    Get single category by ID or slug
 * @access  Public
 */
router.get('/:id', getCategory);

/**
 * @route   POST /api/categories
 * @desc    Create new category
 * @access  Private (auth/admin will be added in Task 5)
 */
router.post('/', validate(createCategorySchema), createCategory);

module.exports = router;

