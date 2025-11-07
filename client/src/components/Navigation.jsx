// Navigation.jsx - Navigation bar component

import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { useAuth as useCustomAuth } from '../context/AuthContext';

const Navigation = () => {
  const { isSignedIn, signOut } = useAuth();
  const { user } = useCustomAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
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
          
          {isSignedIn ? (
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
              <Link to="/sign-in" className="nav-link">
                Sign In
              </Link>
              <Link to="/sign-up" className="nav-link nav-button">
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

