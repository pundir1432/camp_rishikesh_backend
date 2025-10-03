const express = require('express');
const router = express.Router();
const { createBooking, getAllBookings, getBookingsByUser, updateBookingStatus } = require('../controllers/bookGroundController');

// @route   POST /api/bookground
router.post('/', createBooking);

// @route   GET /api/bookground
router.get('/', getAllBookings);

// @route   GET /api/bookground/user/:userId
router.get('/user/:userId', getBookingsByUser);

// @route   PUT /api/bookground/:id/status
router.put('/:id/status', updateBookingStatus);

module.exports = router;