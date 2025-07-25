const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  date: String,
  campPackage: String,
  people: Number,
  message: String,
});

module.exports = mongoose.model('Booking', bookingSchema);
