// api.js - API service for making requests to the backend

import axios from 'axios';

// Determine the base URL for API requests
// In production, use VITE_API_URL if set, otherwise use relative URL with /api prefix
// In development, use the proxy or VITE_API_URL
const getBaseURL = () => {
  // If VITE_API_URL is explicitly set, use it
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // In production (when not localhost), use relative URL
  // This works when backend and frontend are on the same domain
  if (import.meta.env.PROD) {
    return '/api';
  }
  
  // In development, use localhost with proxy
  return 'http://localhost:5000/api';
};

// Create axios instance with base URL
const api = axios.create({
  baseURL: getBaseURL(),
  // Don't set default Content-Type - let it be set per request
  // For JSON requests, we'll set it in the interceptor
  // For FormData, browser will set it automatically
});

// Add request interceptor for authentication with Clerk
// Token will be set by components using useAuth hook from Clerk
let getToken = null;

export const setTokenGetter = (tokenGetter) => {
  getToken = tokenGetter;
};

api.interceptors.request.use(
  async (config) => {
    // Get token from Clerk if available
    if (getToken) {
      try {
        const token = await getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        } else {
          console.warn('No token available from Clerk - user may not be signed in');
        }
      } catch (error) {
        console.error('Error getting token from Clerk:', error);
        // If token retrieval fails, the request will likely fail with 401
        // which is expected behavior for unauthenticated requests
      }
    } else {
      console.warn('Token getter not set up. Make sure TokenSetup component is rendered inside ClerkProvider.');
    }
    
    // For FormData requests, don't set Content-Type - let browser set it with boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    } else if (!config.headers['Content-Type'] && config.data) {
      // For non-FormData requests, set Content-Type to application/json
      config.headers['Content-Type'] = 'application/json';
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle authentication errors
    if (error.response && error.response.status === 401) {
      // Redirect to sign-in handled by Clerk
      window.location.href = '/sign-in';
    }
    return Promise.reject(error);
  }
);

// Post API services
export const postService = {
  // Get all posts with optional pagination and filters
  getAllPosts: async (page = 1, limit = 10, category = null, search = null) => {
    let url = `/posts?page=${page}&limit=${limit}`;
    if (category) {
      url += `&category=${category}`;
    }
    if (search) {
      url += `&search=${encodeURIComponent(search)}`;
    }
    const response = await api.get(url);
    return response.data;
  },

  // Get a single post by ID or slug
  getPost: async (idOrSlug) => {
    const response = await api.get(`/posts/${idOrSlug}`);
    return response.data;
  },

  // Create a new post
  createPost: async (postData) => {
    const response = await api.post('/posts', postData);
    return response.data;
  },

  // Update an existing post
  updatePost: async (id, postData) => {
    const response = await api.put(`/posts/${id}`, postData);
    return response.data;
  },

  // Delete a post
  deletePost: async (id) => {
    const response = await api.delete(`/posts/${id}`);
    return response.data;
  },

  // Add a comment to a post
  addComment: async (postId, commentData) => {
    const response = await api.post(`/posts/${postId}/comments`, commentData);
    return response.data;
  },

  // Upload post image
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    const response = await api.post('/posts/upload', formData, {
      // Don't set Content-Type header - browser will set it automatically with boundary
      // The interceptor will handle removing Content-Type for FormData
    });
    return response.data;
  },

  // Search posts
  searchPosts: async (query) => {
    const response = await api.get(`/posts/search?q=${query}`);
    return response.data;
  },
};

// Category API services
export const categoryService = {
  // Get all categories
  getAllCategories: async () => {
    const response = await api.get('/categories');
    // Backend returns: { success: true, count: X, data: [...] }
    // Return the data property containing the categories array
    return {
      ...response.data,
      data: response.data.data || [],
    };
  },

  // Create a new category
  createCategory: async (categoryData) => {
    const response = await api.post('/categories', categoryData);
    return response.data;
  },
};

// Auth API services (using Clerk - registration/login handled by Clerk)
export const authService = {
  // Get current user from backend
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

export default api; 