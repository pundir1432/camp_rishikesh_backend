const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { createGallery, getGallery, updateGallery, deleteGallery } = require('../controllers/galleryController');

// @route   POST /api/gallery
router.post('/', upload.single('image'), createGallery);

// @route   GET /api/gallery
router.get('/', getGallery);

// @route   PUT /api/gallery/:id
router.put('/:id', upload.single('image'), updateGallery);

// @route   DELETE /api/gallery/:id
router.delete('/:id', deleteGallery);

module.exports = router;