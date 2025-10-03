const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { createEvent, getEvents, updateEvent, deleteEvent } = require('../controllers/eventController');

// @route   POST /api/event
router.post('/', upload.single('image'), createEvent);

// @route   GET /api/event
router.get('/', getEvents);

// @route   PUT /api/event/:id
router.put('/:id', upload.single('image'), updateEvent);

// @route   DELETE /api/event/:id
router.delete('/:id', deleteEvent);

module.exports = router;