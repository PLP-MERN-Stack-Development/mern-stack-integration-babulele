// ProtectedRoute.jsx - Component to protect routes that require authentication

import { Navigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import Loading from './Loading';

const ProtectedRoute = ({ children }) => {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return <Loading />;
  }

  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace />;
  }

  return children;
};

export default ProtectedRoute;

