const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { createVehicle, getVehicle, updateVehicle, deleteVehicle } = require('../controllers/vehicleController');

// @route   POST /api/vehicle
router.post('/', upload.array('image[]', 10), createVehicle); // Changed 'images' to 'image[]'

// @route   GET /api/vehicle
router.get('/', getVehicle);

// @route   PUT /api/vehicle/:id
router.put('/:id', upload.array('image[]', 10), updateVehicle); // Changed 'images' to 'image[]'

// @route   DELETE /api/vehicle/:id
router.delete('/:id', deleteVehicle);

module.exports = router;