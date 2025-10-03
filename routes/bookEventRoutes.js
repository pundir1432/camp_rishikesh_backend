const express = require('express');
const router = express.Router();
const { createEventBooking, getAllEventBookings, getEventBookingsByUser, updateEventBookingStatus } = require('../controllers/bookEventController');

// @route   POST /api/bookevent
router.post('/', createEventBooking);

// @route   GET /api/bookevent
router.get('/', getAllEventBookings);

// @route   GET /api/bookevent/user/:userId
router.get('/user/:userId', getEventBookingsByUser);

// @route   PUT /api/bookevent/:id/status
router.put('/:id/status', updateEventBookingStatus);

module.exports = router;