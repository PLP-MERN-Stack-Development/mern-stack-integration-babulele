// Home.jsx - Home page with post list

import { useState, useEffect } from 'react';
import { postService, categoryService } from '../services/api';
import PostCard from '../components/PostCard';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch posts and categories on mount
  useEffect(() => {
    fetchData();
    fetchCategories();
  }, [page, selectedCategory]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let queryParams = { page, limit: 9 };
      if (selectedCategory) {
        queryParams.category = selectedCategory;
      }
      if (searchQuery) {
        queryParams.search = searchQuery;
      }

      const response = await postService.getAllPosts(
        queryParams.page,
        queryParams.limit,
        queryParams.category,
        queryParams.search
      );

      setPosts(response.data || []);
      setTotalPages(response.pages || 1);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

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
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchData();
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setPage(1);
  };

  if (loading && page === 1) {
    return <Loading />;
  }

  return (
    <div className="home-page">
      <div className="home-header">
        <h1>Welcome to MERN Blog</h1>
        <p>Discover amazing articles and stories</p>
      </div>

      {/* Search and Filter Section */}
      <div className="filters-section">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-button">
            Search
          </button>
        </form>

        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="category-filter"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat.slug}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {error && <ErrorMessage message={error} />}

      {/* Posts Grid */}
      {posts.length > 0 ? (
        <>
          <div className="posts-grid">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="pagination-button"
              >
                Previous
              </button>
              <span className="pagination-info">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
                className="pagination-button"
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        !loading && (
          <div className="no-posts">
            <p>No posts found. Be the first to create one!</p>
          </div>
        )
      )}
    </div>
  );
};

export default Home;

