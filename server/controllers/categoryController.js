// categoryController.js - Controller for handling category-related requests

const Category = require('../models/Category');
const { ApiError } = require('../middleware/errorHandler');

/**
 * @desc    Get all categories
 * @route   GET /api/categories
 * @access  Public
 */
const getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single category by ID or slug
 * @route   GET /api/categories/:id
 * @access  Public
 */
const getCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if it's a valid MongoDB ObjectId or a slug
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);

    let category;
    if (isObjectId) {
      category = await Category.findById(id);
    } else {
      category = await Category.findOne({ slug: id });
    }

    if (!category) {
      return next(new ApiError(`Category not found with id/slug of ${id}`, 404));
    }

    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create new category
 * @route   POST /api/categories
 * @access  Private (will add auth/admin check later)
 */
const createCategory = async (req, res, next) => {
  try {
    const category = await Category.create(req.body);

    res.status(201).json({
      success: true,
      data: category,
    });
  } catch (error) {
    // Handle duplicate error (both name and slug can be duplicates)
    if (error.code === 11000) {
      // Check which field caused the duplicate
      const duplicateField = error.keyPattern?.name ? 'name' : 'slug';
      return next(new ApiError(`Category with this ${duplicateField} already exists`, 400));
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((el) => el.message);
      return next(new ApiError(`Validation failed: ${errors.join(', ')}`, 400));
    }
    
    // Log unexpected errors for debugging
    console.error('Category creation error:', error);
    next(error);
  }
};

module.exports = {
  getAllCategories,
  getCategory,
  createCategory,
};

