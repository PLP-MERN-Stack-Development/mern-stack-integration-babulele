// useApi.js - Custom hook for API calls with loading and error states

import { useState, useEffect } from 'react';

/**
 * Custom hook for making API calls
 * Handles loading state, error state, and data
 * 
 * @param {Function} apiFunction - The API function to call
 * @returns {Object} - { data, loading, error, execute }
 */
export const useApi = (apiFunction) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = async (...args) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFunction(...args);
      setData(result);
      return result;
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, execute };
};

/**
 * Custom hook for fetching data on component mount
 * @param {Function} apiFunction - The API function to call
 * @param {Array} dependencies - Dependencies for useEffect
 */
export const useApiData = (apiFunction, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFunction();
      setData(result);
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'An error occurred';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Use useEffect to fetch data when dependencies change
  useEffect(() => {
    fetchData();
  }, dependencies);

  const refetch = () => {
    fetchData();
  };

  return { data, loading, error, refetch };
};

