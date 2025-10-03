const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  image: {
    type: [String], // Array of strings for multiple images
    required: false,
  },
  price: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model('Vehicle', vehicleSchema);