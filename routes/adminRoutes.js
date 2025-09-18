const express = require('express');
const router = express.Router();
const { adminSignin, forgotPassword, resetPassword } = require('../controllers/adminController');

// @route   POST /api/admin/signin
router.post('/signin', adminSignin);

// @route   POST /api/admin/forgot-password
router.post('/forgot-password', forgotPassword);

// @route   PUT /api/admin/reset-password/:resettoken
router.put('/reset-password/:resettoken', resetPassword);

module.exports = router;