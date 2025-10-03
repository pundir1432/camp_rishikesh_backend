const Gallery = require('../models/Gallery');

// Create gallery item
exports.createGallery = async (req, res) => {
    try {
        const { title, description, type } = req.body;
        const image = req.file ? req.file.filename : null;

        if (!image || !title || !description || !type) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const gallery = new Gallery({
            image,
            title,
            description,
            type
        });

        await gallery.save();
        res.status(201).json({
            status: 201,
            message: 'Gallery item created successfully',
            data: gallery
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


// Get all gallery items
exports.getGallery = async (req, res) => {
    try {
        const { type } = req.query;
        
        let filter = {};
        if (type && type !== 'all') {
            filter.type = type;
        }
        
        const gallery = await Gallery.find(filter).sort({ createdAt: -1 });
        
        // Add full image URL
        const galleryWithUrls = gallery.map(item => ({
            ...item.toObject(),
            imageUrl: item.image ? `${req.protocol}://${req.get('host')}/uploads/gallery/${item.image}` : null
        }));
        
        res.status(200).json({
            status: 200,
            data: galleryWithUrls
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update gallery item
exports.updateGallery = async (req, res) => {
    try {
        const { id } = req.params;
        const { image, title, description, type } = req.body;

        const gallery = await Gallery.findByIdAndUpdate(
            id,
            { image, title, description, type },
            { new: true }
        );

        if (!gallery) {
            return res.status(404).json({ message: 'Gallery item not found' });
        }

        res.status(200).json({
            status: 200,
            message: 'Gallery item updated successfully',
            data: gallery
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Delete gallery item
exports.deleteGallery = async (req, res) => {
    try {
        const { id } = req.params;

        const gallery = await Gallery.findByIdAndDelete(id);
        if (!gallery) {
            return res.status(404).json({ message: 'Gallery item not found' });
        }

        res.status(200).json({
            status: 200,
            message: 'Gallery item deleted successfully'
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};