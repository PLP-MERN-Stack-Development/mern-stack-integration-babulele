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
      setCategories(response.data || []);
    } catch (err) {
      console.error('Failed to load categories:', err);
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

    try {
      // Prepare data
      const postData = {
        ...formData,
        tags: formData.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0),
      };

      // Author ID is now set by backend from authenticated user

      let response;
      let previousPosts = null;

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

      const errorMessage = err.response?.data?.error || 'Failed to save post';
      const details = err.response?.data?.details;
      
      if (details) {
        setError(details.map((d) => d.message).join(', '));
        if (showNotification) {
          showNotification(errorMessage, 'error');
        }
      } else {
        setError(errorMessage);
        if (showNotification) {
          showNotification(errorMessage, 'error');
        }
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
            {validationErrors.category && (
              <span className="field-error">{validationErrors.category}</span>
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
            disabled={loading}
            className="btn btn-submit"
          >
            {loading ? 'Saving...' : isEditing ? 'Update Post' : 'Create Post'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostForm;

