const express = require('express');
const router = express.Router();
const { createBooking, getBookingsByUser } = require('../controllers/bookingController');
const authMiddleware = require('../middlewares/authMiddleware');

// @route   POST /api/booking
router.post('/', authMiddleware, createBooking);

// @route   GET /api/booking/my
router.get('/my', authMiddleware, getBookingsByUser);

// @route   DELETE /api/booking/:id

module.exports = router;
