const Booking = require('../models/Booking');

exports.createBooking = async (req, res) => {
  try {
    const booking = await Booking.create({ ...req.body, user: req.user._id });
    return res.status(201).json({ booking });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.getBookingsByUser = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).populate('user');
    return res.status(200).json({ bookings });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};