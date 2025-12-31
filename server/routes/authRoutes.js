const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// @route   POST api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', authController.register);

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', authController.login);

// @route   GET api/auth/user
// @desc    Get user data
// @access  Private
const auth = require('../middleware/auth');
router.get('/user', auth, authController.getUser);
router.put('/profile', auth, authController.updateProfile);

module.exports = router;
