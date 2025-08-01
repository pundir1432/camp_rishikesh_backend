const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  checkIn: String,
  checkOut: String,
  people: String,
  Accommodation: String,
});

module.exports = mongoose.model('Booking', bookingSchema);
