const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  bookingId: {
    type: String, // बुकिंग ID (ग्राउंड या इवेंट)
    required: true
  },
  text: {
    type: String,
    required: true
  },
  sender: {
    type: String, // 'user' या 'admin'
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // आपके User मॉडल से लिंक
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);