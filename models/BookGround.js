const mongoose = require('mongoose');

const bookGroundSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Personal Information
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    zipCode: {
        type: String,
        required: true
    },
    // Booking Details
    checkIn: {
        type: String,
        required: true
    },
    checkOut: {
        type: String,
        required: true
    },
    startTime: {
        type: String,
        required: true
    },
    endTime: {
        type: String,
        required: true
    },
    guests: {
        type: String,
        required: true
    },
    specialRequests: {
        type: String,
        required: false
    },
    // Emergency Contact
    emergencyName: {
        type: String,
        required: true
    },
    emergencyPhone: {
        type: String,
        required: true
    },
    emergencyRelation: {
        type: String,
        required: true
    },
    // Ground Details
    groundId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ground',
        required: false
    },
    groundName: {
        type: String,
        required: false
    },
    totalAmount: {
        type: Number,
        required: false
    },
    status: {
        type: String,
        default: 'pending',
        enum: ['pending', 'confirmed', 'cancelled']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('BookGround', bookGroundSchema);