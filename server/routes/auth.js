// auth.js - Routes for authentication (using Clerk)
// Note: Registration and login are handled by Clerk on the frontend

const express = require('express');
const router = express.Router();
const { getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

/**
 * @route   GET /api/auth/me
 * @desc    Get current logged in user
 * @access  Private
 */
router.get('/me', protect, getMe);

module.exports = router;

