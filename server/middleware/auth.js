// auth.js - Authentication middleware using Clerk

const { createClerkClient } = require('@clerk/clerk-sdk-node');
const User = require('../models/User');
const { ApiError } = require('./errorHandler');

// Initialize Clerk client
const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

/**
 * Protect routes - Verify Clerk session token
 */
const protect = async (req, res, next) => {
  try {
    // Get the session token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('Auth middleware: No authorization header found');
      return next(new ApiError('Not authorized to access this route', 401));
    }

    const token = authHeader.split(' ')[1];
    
    if (!token) {
      console.log('Auth middleware: Token is empty');
      return next(new ApiError('Not authorized to access this route', 401));
    }

    // Verify the JWT token with Clerk
    // getToken() from frontend returns a JWT that should be verified with verifyToken()
    let sessionClaims;
    try {
      // Verify the token - verifyToken() verifies JWT tokens from getToken()
      sessionClaims = await clerkClient.verifyToken(token);
    } catch (verifyError) {
      console.error('Token verification failed:', {
        error: verifyError.message || verifyError.toString(),
        errorName: verifyError.name,
        tokenLength: token ? token.length : 0,
        tokenPrefix: token ? token.substring(0, 30) + '...' : 'no token',
        hasSecretKey: !!process.env.CLERK_SECRET_KEY,
        secretKeyPrefix: process.env.CLERK_SECRET_KEY ? process.env.CLERK_SECRET_KEY.substring(0, 10) + '...' : 'not set'
      });
      return next(new ApiError('Invalid or expired token', 401));
    }
    
    if (!sessionClaims || !sessionClaims.sub) {
      console.error('Token verified but no user ID in claims:', sessionClaims);
      return next(new ApiError('Invalid token - no user ID found', 401));
    }

    // Get user ID from the token claims
    const userId = sessionClaims.sub;

    // Find or create user in our database
    let user = await User.findOne({ clerkId: userId });
    
    if (!user) {
      // If user doesn't exist in our DB, fetch from Clerk and create
      const clerkUser = await clerkClient.users.getUser(userId);
      
      user = await User.create({
        clerkId: userId,
        name: (clerkUser.firstName && clerkUser.lastName) 
          ? `${clerkUser.firstName} ${clerkUser.lastName}` 
          : clerkUser.username || (clerkUser.emailAddresses && clerkUser.emailAddresses[0]?.emailAddress) || 'User',
        email: (clerkUser.emailAddresses && clerkUser.emailAddresses[0]?.emailAddress) || '',
        role: 'user',
      });
    }

    // Attach user to request
    req.user = user;
    req.clerkUserId = userId;

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return next(new ApiError('Not authorized to access this route', 401));
  }
};

/**
 * Grant access to specific roles
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError(
          `User role '${req.user.role}' is not authorized to access this route`,
          403
        )
      );
    }
    next();
  };
};

module.exports = { protect, authorize };

