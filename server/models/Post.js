// Post.js - Mongoose model for blog posts

const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    content: {
      type: String,
      required: [true, 'Please provide content'],
    },
    featuredImage: {
      type: String,
      default: 'default-post.jpg',
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    excerpt: {
      type: String,
      maxlength: [200, 'Excerpt cannot be more than 200 characters'],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    tags: [String],
    isPublished: {
      type: Boolean,
      default: false,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        content: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

// Create slug from title before validation
// Using pre('validate') ensures slug is set before validation runs (since slug is required)
PostSchema.pre('validate', function (next) {
  // Only generate slug if it's not already explicitly set
  // This allows the controller to set a custom slug (e.g., for handling duplicates)
  if (!this.slug) {
    if (!this.title) {
      return next(new Error('Title is required to generate slug'));
    }
    
    // Generate slug from title
    let slug = this.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]+/g, '') // Remove special characters except spaces and hyphens
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
    
    // If slug is empty after processing, use a fallback
    if (!slug || slug.length === 0) {
      slug = 'post-' + Date.now();
    }
    
    this.slug = slug;
  } else if (this.isModified('title') && !this.isNew) {
    // Only regenerate slug if title is modified on an existing document
    // and slug wasn't explicitly set
    // For new documents with explicit slug, don't regenerate
    if (this.title) {
      let slug = this.title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]+/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');
      
      if (!slug || slug.length === 0) {
        slug = 'post-' + Date.now();
      }
      
      this.slug = slug;
    }
  }
  
  next();
});

// Virtual for post URL
PostSchema.virtual('url').get(function () {
  return `/posts/${this.slug}`;
});

// Method to add a comment
PostSchema.methods.addComment = function (userId, content) {
  this.comments.push({ user: userId, content });
  return this.save();
};

// Method to increment view count
PostSchema.methods.incrementViewCount = function () {
  this.viewCount += 1;
  return this.save();
};

module.exports = mongoose.model('Post', PostSchema); 