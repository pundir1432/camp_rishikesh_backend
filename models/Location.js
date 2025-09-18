const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: ['Travel', 'Restaurant', 'Rafting', 'Other']
    },
    title: {
        type: String,
        required: true
    },
    name: {
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
    driveTime: {
        type: String,
        required: true
    },
    distance: {
        type: String,
        required: false
    },
    link: {
        type: String,
        required: false
    },
    image: {
        type: String,
        required: false
    },
    description: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Location', locationSchema);