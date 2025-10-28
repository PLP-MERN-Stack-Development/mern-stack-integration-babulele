// PostContext.jsx - Context for managing posts state globally

import { createContext, useContext, useState, useCallback } from 'react';
import { postService } from '../services/api';

const PostContext = createContext(null);

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  });

  // Fetch posts with filters
  const fetchPosts = useCallback(async (page = 1, category = null, search = null) => {
    try {
      setLoading(true);
      setError(null);
      const response = await postService.getAllPosts(page, 9, category, search);
      setPosts(response.data || []);
      setPagination({
        page: response.page || 1,
        totalPages: response.pages || 1,
        total: response.total || 0,
      });
      return response;
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to load posts';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Optimistic update: Add post to list immediately (before server confirms)
  const addPostOptimistic = useCallback((newPost) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]);
  }, []);

  // Optimistic update: Update post in list immediately
  const updatePostOptimistic = useCallback((updatedPost) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post._id === updatedPost._id ? updatedPost : post
      )
    );
  }, []);

  // Optimistic update: Remove post from list immediately
  const deletePostOptimistic = useCallback((postId) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
  }, []);

  // Rollback optimistic update if API call fails
  const rollbackOptimisticUpdate = useCallback((previousPosts) => {
    setPosts(previousPosts);
  }, []);

  const value = {
    posts,
    loading,
    error,
    pagination,
    fetchPosts,
    addPostOptimistic,
    updatePostOptimistic,
    deletePostOptimistic,
    rollbackOptimisticUpdate,
    setPosts,
    setError,
  };

  return <PostContext.Provider value={value}>{children}</PostContext.Provider>;
};

export const usePosts = () => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error('usePosts must be used within PostProvider');
  }
  return context;
};

