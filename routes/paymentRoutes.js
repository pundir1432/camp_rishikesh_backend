const express = require('express');
const router = express.Router();
const { createOrder, verifyPayment } = require('../controllers/paymentController');

// @route   POST /api/payment/create-order
router.post('/create-order', createOrder);

// @route   POST /api/payment/verify
router.post('/verify', verifyPayment);

module.exports = router;