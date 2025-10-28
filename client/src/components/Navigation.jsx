// Navigation.jsx - Navigation bar component

import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navigation = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          📝 MERN Blog
        </Link>
        
        <div className="nav-links">
          <Link to="/" className="nav-link">
            Home
          </Link>
          
          {isAuthenticated ? (
            <>
              <Link to="/posts/new" className="nav-link">
                New Post
              </Link>
              <span className="nav-user">Hi, {user?.name || 'User'}</span>
              <button onClick={handleLogout} className="nav-button">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                Login
              </Link>
              <Link to="/register" className="nav-link nav-button">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;

