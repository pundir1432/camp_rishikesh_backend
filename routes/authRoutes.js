const express = require('express');
const router = express.Router();
const { login,verifyOTP, register } = require('../controllers/authController');

// @route   POST /api/auth/signin
router.post('/signin', login);

// @route   POST /api/auth/signup
router.post('/signup', register);
router.post('/verifyOTP', verifyOTP);


module.exports = router;
