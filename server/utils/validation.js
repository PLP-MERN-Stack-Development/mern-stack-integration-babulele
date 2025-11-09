// validation.js - Joi validation schemas for request validation

const Joi = require('joi');

// Validation for creating a post
const createPostSchema = Joi.object({
  title: Joi.string()
    .required()
    .min(3)
    .max(100)
    .messages({
      'string.empty': 'Title is required',
      'string.min': 'Title must be at least 3 characters',
      'string.max': 'Title cannot exceed 100 characters',
    }),
  
  content: Joi.string()
    .required()
    .min(10)
    .messages({
      'string.empty': 'Content is required',
      'string.min': 'Content must be at least 10 characters',
    }),
  
  excerpt: Joi.string()
    .max(200)
    .allow('')
    .optional(),
  
  category: Joi.string()
    .required()
    .trim()
    .custom((value, helpers) => {
      // Value is already trimmed by Joi
      // Check if empty (should not happen due to .required(), but just in case)
      if (!value || value === '') {
        return helpers.error('string.empty');
      }
      
      // Check if it's a valid MongoDB ObjectId (24 hex characters)
      if (!/^[0-9a-fA-F]{24}$/.test(value)) {
        return helpers.error('string.pattern.base');
      }
      
      return value;
    })
    .messages({
      'string.empty': 'Category is required. Please select a category.',
      'string.pattern.base': 'Category must be a valid category ID (24 hex characters). Received: "{{#value}}"',
      'any.required': 'Category is required. Please select a category.',
      'any.custom': 'Category must be a valid category ID',
    }),
  
  tags: Joi.array()
    .items(Joi.string())
    .optional(),
  
  isPublished: Joi.boolean()
    .optional()
    .default(false),
  
  featuredImage: Joi.string()
    .optional()
    .allow(''),
});

// Validation for updating a post
const updatePostSchema = Joi.object({
  title: Joi.string()
    .min(3)
    .max(100)
    .optional(),
  
  content: Joi.string()
    .min(10)
    .optional(),
  
  excerpt: Joi.string()
    .max(200)
    .allow('')
    .optional(),
  
  category: Joi.string()
    .optional(),
  
  tags: Joi.array()
    .items(Joi.string())
    .optional(),
  
  isPublished: Joi.boolean()
    .optional(),
  
  featuredImage: Joi.string()
    .optional()
    .allow(''),
});

// Validation for creating a category
const createCategorySchema = Joi.object({
  name: Joi.string()
    .required()
    .min(2)
    .max(50)
    .messages({
      'string.empty': 'Category name is required',
      'string.min': 'Category name must be at least 2 characters',
      'string.max': 'Category name cannot exceed 50 characters',
    }),
  
  description: Joi.string()
    .max(200)
    .allow('')
    .optional(),
  
  color: Joi.string()
    .pattern(/^#([0-9A-F]{3}|[0-9A-F]{6})$/i)
    .optional()
    .allow('')
    .messages({
      'string.pattern.base': 'Color must be a valid hex color (e.g., #667eea or #f0f)',
    }),
});

// Middleware function to validate requests
const validate = (schema) => {
  return (req, res, next) => {
    // Log incoming request data for debugging (in development)
    if (process.env.NODE_ENV === 'development') {
      console.log('Validation - Request body:', JSON.stringify(req.body, null, 2));
    }

    const { error, value } = schema.validate(req.body, {
      abortEarly: false, // Show all errors, not just the first one
      stripUnknown: true, // Remove unknown fields
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
        value: detail.context?.value !== undefined ? String(detail.context.value) : undefined,
        type: detail.type,
      }));

      // Log validation errors for debugging (in development)
      if (process.env.NODE_ENV === 'development') {
        console.error('Validation failed:', {
          errors: errors,
          requestBody: req.body,
          errorCount: errors.length,
        });
      }

      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors,
      });
    }

    // Replace req.body with validated and sanitized value
    req.body = value;
    next();
  };
};

module.exports = {
  validate,
  createPostSchema,
  updatePostSchema,
  createCategorySchema,
};

