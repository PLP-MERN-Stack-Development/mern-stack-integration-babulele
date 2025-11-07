// authController.js - Controller for authentication (using Clerk)

const User = require('../models/User');
const { ApiError } = require('../middleware/errorHandler');

/**
 * @desc    Get current logged in user
 * @route   GET /api/auth/me
 * @access  Private
 * @note    User is already attached to req by the protect middleware
 */
const getMe = async (req, res, next) => {
  try {
    // User is already attached to req by the protect middleware
    const user = req.user;

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        clerkId: user.clerkId,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMe,
};

