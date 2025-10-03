const express = require('express');
const router = express.Router();
const { getAllBookings, getUserBookings } = require('../controllers/allBookingsController');

// @route   GET /api/allbookings
router.get('/', getAllBookings);

// @route   GET /api/allbookings/user/:userId
router.get('/user/:userId', getUserBookings);

module.exports = router;