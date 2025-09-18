const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { createLocation, getLocations, updateLocation, deleteLocation, calculateDistance } = require('../controllers/locationController');

// @route   POST /api/location
router.post('/', upload.single('image'), createLocation);

// @route   GET /api/location
router.get('/', getLocations);

// @route   PUT /api/location/:id
router.put('/:id', upload.single('image'), updateLocation);

// @route   DELETE /api/location/:id
router.delete('/:id', deleteLocation);

// @route   POST /api/location/calculate-distance
router.post('/calculate-distance', calculateDistance);

module.exports = router;