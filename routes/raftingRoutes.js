const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { createRafting, getRafting, updateRafting, deleteRafting } = require('../controllers/raftingController');

// @route   POST /api/vehicle
router.post('/', upload.array('image[]', 10), createRafting); // Changed 'images' to 'image[]'

// @route   GET /api/vehicle
router.get('/', getRafting);

// @route   PUT /api/vehicle/:id
router.put('/:id', upload.array('image[]', 10), updateRafting); // Changed 'images' to 'image[]'

// @route   DELETE /api/vehicle/:id
router.delete('/:id', deleteRafting);

module.exports = router;