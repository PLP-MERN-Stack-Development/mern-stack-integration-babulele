// AuthContext.jsx - Context for authentication state using Clerk

import { createContext, useContext } from 'react';
import { useUser, useAuth as useClerkAuth } from '@clerk/clerk-react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const { user, isLoaded: userLoaded } = useUser();
  const { isSignedIn, signOut } = useClerkAuth();

  const value = {
    user: user ? {
      id: user.id,
      name: user.fullName || user.firstName || user.username || user.emailAddresses[0]?.emailAddress || 'User',
      email: user.emailAddresses[0]?.emailAddress || '',
      imageUrl: user.imageUrl,
      clerkId: user.id,
    } : null,
    loading: !userLoaded,
    logout: signOut,
    isAuthenticated: isSignedIn,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

