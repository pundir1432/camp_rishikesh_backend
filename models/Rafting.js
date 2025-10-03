const mongoose = require('mongoose');

const raftingschema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: [String],
        required: false,
    },
    price: {
        type: Number,
        required: true,
    },
    duration: {
        type: Number,
        required: true,
    },
    distance: {
        type: String,
        required: true,
    }, location: {
        type: String,
        required: true,
    },
    place: {
        type: String,
        required: true,
    }, rapid: {
        type: String,
        required: true,
    },
    level: {
        type: String,
        required: true,
    }, participants: {
        type: String,
        required: true,
    },
    available: {
        type: Boolean,
        required: true,
    },



});

module.exports = mongoose.model('Rafting', raftingschema);