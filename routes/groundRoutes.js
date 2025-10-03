const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { createGround, getGrounds, updateGround, deleteGround } = require('../controllers/groundController');

// @route   POST /api/ground
router.post('/', upload.single('image'), createGround);

// @route   GET /api/ground
router.get('/', getGrounds);

// @route   PUT /api/ground/:id
router.put('/:id', upload.single('image'), updateGround);

// @route   DELETE /api/ground/:id
router.delete('/:id', deleteGround);

module.exports = router;