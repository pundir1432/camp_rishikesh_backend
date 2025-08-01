const express = require('express');
const router = express.Router();
const { createBooking, getBookingsByUser } = require('../controllers/bookingController');
const {verifyToken} = require('../middlewares/authMiddleware');

// @route   POST /api/booking
router.post('/create', verifyToken, createBooking);

// @route   GET /api/booking/my
router.get('/get', verifyToken, getBookingsByUser);

// @route   DELETE /api/booking/:id

module.exports = router;
