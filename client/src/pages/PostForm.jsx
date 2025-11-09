// PostForm.jsx - Create/Edit post form page

import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { postService, categoryService } from '../services/api';
import { validatePostForm } from '../utils/validation';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import { usePosts } from '../context/PostContext';

const PostForm = ({ showNotification }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  const { addPostOptimistic, updatePostOptimistic, rollbackOptimisticUpdate } = usePosts();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [categories, setCategories] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', description: '', color: '#667eea' });
  const [creatingCategory, setCreatingCategory] = useState(false);
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: '',
    tags: '',
    isPublished: false,
    featuredImage: '',
  });

  useEffect(() => {
    fetchCategories();
    if (isEditing) {
      fetchPost();
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getAllCategories();
      // Response structure: { success: true, count: X, data: [...] }
      const categoriesList = response.data || [];
      setCategories(categoriesList);
      
      if (categoriesList.length === 0) {
        console.warn('No categories found. You may need to create categories first.');
      }
    } catch (err) {
      console.error('Failed to load categories:', err);
      setCategories([]);
      setError('Failed to load categories. Please refresh the page.');
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    setCreatingCategory(true);
    setError(null);

    try {
      if (!newCategory.name || newCategory.name.trim().length < 2) {
        setError('Category name must be at least 2 characters');
        setCreatingCategory(false);
        return;
      }

      // Prepare category data - ensure all fields are properly formatted
      const categoryData = {
        name: newCategory.name.trim(),
      };
      
      // Include description only if it has content
      const trimmedDescription = newCategory.description.trim();
      if (trimmedDescription) {
        categoryData.description = trimmedDescription;
      }
      
      // Always include color (default is set in state, but ensure it's valid)
      // HTML color picker returns format like #RRGGBB (7 chars) or #RGB (4 chars)
      if (newCategory.color) {
        // Normalize color to 6-digit format if it's 3-digit
        let color = newCategory.color;
        if (/^#[0-9A-Fa-f]{3}$/.test(color)) {
          // Convert #RGB to #RRGGBB
          color = '#' + color[1] + color[1] + color[2] + color[2] + color[3] + color[3];
        }
        categoryData.color = color;
      } else {
        categoryData.color = '#667eea'; // Default color
      }
      
      const response = await categoryService.createCategory(categoryData);

      // Add new category to list
      setCategories([...categories, response.data]);
      
      // Select the newly created category
      setFormData((prev) => ({
        ...prev,
        category: response.data._id,
      }));

      // Reset form and hide it
      setNewCategory({ name: '', description: '', color: '#667eea' });
      setShowCategoryForm(false);
      
      if (showNotification) {
        showNotification('Category created successfully!', 'success');
      }
    } catch (err) {
      // Handle validation errors with details
      let errorMessage = 'Failed to create category';
      
      if (err.response?.data) {
        const errorData = err.response.data;
        
        // Check for validation error details
        if (errorData.details && Array.isArray(errorData.details)) {
          const validationErrors = errorData.details.map(d => d.message).join(', ');
          errorMessage = `Validation failed: ${validationErrors}`;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
      }
      
      console.error('Category creation error:', err.response?.data || err);
      setError(errorMessage);
      if (showNotification) {
        showNotification(errorMessage, 'error');
      }
    } finally {
      setCreatingCategory(false);
    }
  };

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await postService.getPost(id);
      const post = response.data;
      
      setFormData({
        title: post.title || '',
        content: post.content || '',
        excerpt: post.excerpt || '',
        category: post.category?._id || '',
        tags: post.tags?.join(', ') || '',
        isPublished: post.isPublished || false,
        featuredImage: post.featuredImage || '',
      });
      
      if (post.featuredImage) {
        setImagePreview(`/uploads/${post.featuredImage}`);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load post');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    try {
      setUploadingImage(true);
      setError(null);

      // Upload image
      const response = await postService.uploadImage(file);
      setFormData((prev) => ({
        ...prev,
        featuredImage: response.data.filename,
      }));

      // Show preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setValidationErrors({});

    // Frontend validation
    const validation = validatePostForm(formData);
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      setLoading(false);
      if (showNotification) {
        showNotification('Please fix the form errors', 'error');
      }
      return;
    }

    // Validate category is selected before preparing data
    if (!formData.category || formData.category.trim() === '') {
      setError('Please select a category before submitting');
      setValidationErrors({ category: 'Please select a category' });
      setLoading(false);
      if (showNotification) {
        showNotification('Please select a category', 'error');
      }
      return;
    }

    // Prepare data outside try block so it's accessible in catch block
    const postData = {
      title: formData.title.trim(),
      content: formData.content.trim(),
      excerpt: formData.excerpt?.trim() || '',
      category: formData.category.trim(), // Already validated to be non-empty
      tags: (formData.tags || '')
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0),
      isPublished: formData.isPublished || false,
      featuredImage: formData.featuredImage || '',
    };

    // Log the data being sent for debugging
    console.log('📤 Submitting post data:', {
      title: postData.title,
      content: postData.content?.substring(0, 50) + '...',
      category: postData.category,
      categoryLength: postData.category?.length,
      tags: postData.tags,
      isPublished: postData.isPublished,
      excerpt: postData.excerpt,
      featuredImage: postData.featuredImage,
    });

    try {
      // Author ID is now set by backend from authenticated user

      let response;

      // Optimistic update for editing
      if (isEditing) {
        // For edit, we can show immediate feedback
        const optimisticPost = {
          _id: id,
          ...postData,
          updatedAt: new Date(),
        };
        updatePostOptimistic(optimisticPost);
        response = await postService.updatePost(id, postData);
        if (showNotification) {
          showNotification('Post updated successfully!', 'success');
        }
      } else {
        // For create, add optimistic post (but we need to save reference to rollback)
        const optimisticPost = {
          _id: 'temp-' + Date.now(),
          ...postData,
          createdAt: new Date(),
          author: { name: 'You' },
          category: categories.find((c) => c._id === postData.category),
        };
        addPostOptimistic(optimisticPost);
        response = await postService.createPost(postData);
        if (showNotification) {
          showNotification('Post created successfully!', 'success');
        }
      }

      // Small delay to show success message, then navigate
      setTimeout(() => {
        navigate(`/posts/${response.data._id}`);
      }, 500);
    } catch (err) {
      // Rollback optimistic update on error
      if (isEditing) {
        // For edit, we'd need to fetch the original post
        // For simplicity, just show error
      }

      // Handle error response
      const errorResponse = err.response?.data || {};
      let errorMessage = 'Failed to save post';
      let errorDetails = [];

      // Check if we have an error response
      if (err.response && err.response.data) {
        // Get main error message
        errorMessage = errorResponse.error || errorResponse.message || errorMessage;
        
        // Get validation details if available
        if (errorResponse.details && Array.isArray(errorResponse.details)) {
          errorDetails = errorResponse.details.map((d) => {
            const fieldName = d.field || d.path?.join('.') || 'unknown';
            const message = d.message || 'Invalid value';
            const value = d.value !== undefined ? ` (received: "${d.value}")` : '';
            return `${fieldName}: ${message}${value}`;
          });
        } else if (errorResponse.message) {
          // If there's a message but no details, use it
          errorDetails = [errorResponse.message];
        }
      } else if (err.message) {
        // Network error or other error
        errorMessage = err.message;
        errorDetails = [err.message];
      }

      // Log error for debugging - expanded format for better visibility
      console.group('❌ Post Creation/Update Error');
      console.error('Status:', err.response?.status);
      console.error('Error Response:', errorResponse);
      if (errorResponse?.details && Array.isArray(errorResponse.details)) {
        console.error('Validation Errors:', errorResponse.details);
        errorResponse.details.forEach((detail, index) => {
          console.error(`  Error ${index + 1}:`, {
            field: detail.field,
            message: detail.message,
            value: detail.value,
            type: detail.type,
          });
        });
      }
      console.error('Request Data:', isEditing ? { id, ...postData } : postData);
      console.error('Form Data:', formData);
      console.error('Full Error Response:', err.response?.data);
      console.error('Full Error Object:', err);
      console.groupEnd();

      // Set error message - prioritize showing validation errors
      if (errorDetails.length > 0) {
        // Create a user-friendly error message
        const errorText = errorDetails.map(d => `• ${d}`).join('\n');
        setError(errorText);
        
        // Also set validation errors for specific fields to highlight them in the form
        const fieldErrors = {};
        errorResponse.details?.forEach((d) => {
          if (d.field) {
            fieldErrors[d.field] = d.message;
            // Also log each field error for debugging
            console.error(`  Field "${d.field}": ${d.message} (value: ${d.value || 'undefined'})`);
          }
        });
        setValidationErrors(fieldErrors);
        
        // Scroll to first error field if possible
        setTimeout(() => {
          if (Object.keys(fieldErrors).length > 0) {
            const firstErrorField = Object.keys(fieldErrors)[0];
            const errorElement = document.querySelector(`[name="${firstErrorField}"]`);
            if (errorElement) {
              errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
              errorElement.focus();
            }
          }
        }, 100);
      } else {
        // If no detailed errors, show the general error message
        const displayError = errorMessage || 'An unexpected error occurred. Please check the console for details.';
        setError(displayError);
        console.error('No detailed error information available. General error:', errorMessage);
      }

      // Show notification
      if (showNotification) {
        const notificationMessage = errorDetails.length > 0 
          ? errorDetails.join(', ') 
          : errorMessage;
        showNotification(notificationMessage, 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditing && !formData.title) {
    return <Loading />;
  }

  return (
    <div className="post-form-page">
      <h1>{isEditing ? 'Edit Post' : 'Create New Post'}</h1>

      {error && <ErrorMessage message={error} />}

      <form onSubmit={handleSubmit} className="post-form">
        <div className="form-group">
          <label htmlFor="title">Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={validationErrors.title ? 'error' : ''}
            required
            minLength={3}
            maxLength={100}
            placeholder="Enter post title..."
          />
          {validationErrors.title && (
            <span className="field-error">{validationErrors.title}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="featuredImage">Featured Image</label>
          <input
            type="file"
            id="featuredImage"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            style={{ display: 'none' }}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="btn btn-upload"
            disabled={uploadingImage}
          >
            {uploadingImage ? 'Uploading...' : 'Choose Image'}
          </button>
          {formData.featuredImage && (
            <div className="image-preview">
              <img
                src={imagePreview || `/uploads/${formData.featuredImage}`}
                alt="Preview"
              />
              <button
                type="button"
                onClick={() => {
                  setFormData((prev) => ({ ...prev, featuredImage: '' }));
                  setImagePreview(null);
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                className="btn-remove-image"
              >
                Remove
              </button>
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="excerpt">Excerpt</label>
          <textarea
            id="excerpt"
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            maxLength={200}
            rows="3"
            placeholder="Short summary of your post..."
          />
        </div>

        <div className="form-group">
          <label htmlFor="content">Content *</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            className={validationErrors.content ? 'error' : ''}
            required
            minLength={10}
            rows="15"
            placeholder="Write your post content here..."
          />
          {validationErrors.content && (
            <span className="field-error">{validationErrors.content}</span>
          )}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="category">Category *</label>
            {categories.length === 0 ? (
              <div className="category-empty-state">
                <p className="category-empty-message">
                  ⚠️ No categories available. Please create a category first.
                </p>
                {!showCategoryForm ? (
                  <button
                    type="button"
                    onClick={() => setShowCategoryForm(true)}
                    className="btn btn-create-category"
                  >
                    + Create Category
                  </button>
                ) : (
                  <div className="category-form-inline">
                    <input
                      type="text"
                      placeholder="Category name (required)"
                      value={newCategory.name}
                      onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                      className="category-name-input"
                      required
                      minLength={2}
                      maxLength={50}
                    />
                    <input
                      type="text"
                      placeholder="Description (optional)"
                      value={newCategory.description}
                      onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                      className="category-desc-input"
                      maxLength={200}
                    />
                    <input
                      type="color"
                      value={newCategory.color}
                      onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                      className="category-color-input"
                      title="Category color"
                    />
                    <div className="category-form-actions">
                      <button
                        type="button"
                        onClick={handleCreateCategory}
                        disabled={creatingCategory || !newCategory.name.trim()}
                        className="btn btn-save-category"
                      >
                        {creatingCategory ? 'Creating...' : 'Create'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowCategoryForm(false);
                          setNewCategory({ name: '', description: '', color: '#667eea' });
                        }}
                        className="btn btn-cancel-category"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={validationErrors.category ? 'error' : ''}
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {!showCategoryForm ? (
                  <button
                    type="button"
                    onClick={() => setShowCategoryForm(true)}
                    className="btn-link btn-add-category"
                    style={{ marginTop: '5px', fontSize: '0.9em' }}
                  >
                    + Add New Category
                  </button>
                ) : (
                  <div className="category-form-inline" style={{ marginTop: '10px' }}>
                    <input
                      type="text"
                      placeholder="Category name"
                      value={newCategory.name}
                      onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                      className="category-name-input"
                      required
                      minLength={2}
                      maxLength={50}
                    />
                    <input
                      type="text"
                      placeholder="Description (optional)"
                      value={newCategory.description}
                      onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                      className="category-desc-input"
                      maxLength={200}
                    />
                    <input
                      type="color"
                      value={newCategory.color}
                      onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                      className="category-color-input"
                      title="Category color"
                    />
                    <div className="category-form-actions">
                      <button
                        type="button"
                        onClick={handleCreateCategory}
                        disabled={creatingCategory || !newCategory.name.trim()}
                        className="btn btn-save-category"
                      >
                        {creatingCategory ? 'Creating...' : 'Create'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowCategoryForm(false);
                          setNewCategory({ name: '', description: '', color: '#667eea' });
                        }}
                        className="btn btn-cancel-category"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
                {validationErrors.category && (
                  <span className="field-error">{validationErrors.category}</span>
                )}
              </>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="tags">Tags</label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="tag1, tag2, tag3"
            />
            <small>Separate tags with commas</small>
          </div>
        </div>

        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              name="isPublished"
              checked={formData.isPublished}
              onChange={handleChange}
            />
            Publish immediately
          </label>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn btn-cancel"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || categories.length === 0}
            className="btn btn-submit"
            title={categories.length === 0 ? 'Please create a category first' : ''}
          >
            {loading ? 'Saving...' : isEditing ? 'Update Post' : 'Create Post'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostForm;

