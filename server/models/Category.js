// Category.js - Mongoose model for blog post categories

const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a category name'],
      trim: true,
      unique: true,
      maxlength: [50, 'Category name cannot be more than 50 characters'],
    },
    description: {
      type: String,
      maxlength: [200, 'Description cannot be more than 200 characters'],
    },
    slug: {
      type: String,
      required: false, // Not required in schema - will be auto-generated in pre('validate') hook
      unique: true,
      lowercase: true,
    },
    color: {
      type: String,
      default: '#667eea', // Default purple color
    },
  },
  { timestamps: true }
);

// Create slug from name before validation
// Using pre('validate') ensures slug is set before validation runs
CategorySchema.pre('validate', function (next) {
  // Always generate slug if it's not already set or if name is modified
  if (!this.slug || this.isModified('name')) {
    if (!this.name) {
      return next(new Error('Category name is required to generate slug'));
    }
    
    // Generate slug from name
    let slug = this.name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]+/g, '') // Remove special characters except spaces and hyphens
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
    
    // If slug is empty after processing, use a fallback
    if (!slug || slug.length === 0) {
      slug = 'category-' + Date.now();
    }
    
    this.slug = slug;
  }
    
  next();
});

// Index already created via unique: true in schema definition
// CategorySchema.index({ slug: 1 }); // Removed to avoid duplicate index warning

module.exports = mongoose.model('Category', CategorySchema);

