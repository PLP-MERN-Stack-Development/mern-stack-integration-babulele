// validation.js - Frontend form validation utilities

/**
 * Validate post form data
 * @param {Object} formData - Form data to validate
 * @returns {Object} - { isValid, errors }
 */
export const validatePostForm = (formData) => {
  const errors = {};

  // Title validation
  if (!formData.title || formData.title.trim() === '') {
    errors.title = 'Title is required';
  } else if (formData.title.length < 3) {
    errors.title = 'Title must be at least 3 characters';
  } else if (formData.title.length > 100) {
    errors.title = 'Title cannot exceed 100 characters';
  }

  // Content validation
  if (!formData.content || formData.content.trim() === '') {
    errors.content = 'Content is required';
  } else if (formData.content.length < 10) {
    errors.content = 'Content must be at least 10 characters';
  }

  // Category validation
  if (!formData.category || formData.category.trim() === '') {
    errors.category = 'Please select a category';
  }

  // Excerpt validation (optional, but if provided must be valid)
  if (formData.excerpt && formData.excerpt.length > 200) {
    errors.excerpt = 'Excerpt cannot exceed 200 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate category form
 * @param {Object} formData - Category form data
 * @returns {Object} - { isValid, errors }
 */
export const validateCategoryForm = (formData) => {
  const errors = {};

  if (!formData.name || formData.name.trim() === '') {
    errors.name = 'Category name is required';
  } else if (formData.name.length < 2) {
    errors.name = 'Category name must be at least 2 characters';
  } else if (formData.name.length > 50) {
    errors.name = 'Category name cannot exceed 50 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

