const Ground = require('../models/Ground');

// Create ground
exports.createGround = async (req, res) => {
    try {
        const { name, person, price, size, facilities } = req.body;
        const image = req.file ? req.file.filename : null;

        if (!name || !person || !price || !size) {
            return res.status(400).json({ message: 'Required fields are missing' });
        }

        // Parse facilities - handle comma-separated string
        let facilitiesArray = [];
        if (facilities) {
            if (typeof facilities === 'string') {
                facilitiesArray = facilities.split(',').map(f => f.trim());
            } else {
                facilitiesArray = facilities;
            }
        }

        const ground = new Ground({
            name,
            image,
            person: parseInt(person),
            price: parseFloat(price),
            size,
            facilities: facilitiesArray
        });

        await ground.save();
        res.status(201).json({
            status: 201,
            message: 'Ground created successfully',
            data: ground
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get all grounds
exports.getGrounds = async (req, res) => {
    try {
        const grounds = await Ground.find().sort({ createdAt: -1 });
        
        // Add full image URL
        const groundsWithUrls = grounds.map(item => ({
            ...item.toObject(),
            imageUrl: item.image ? `${req.protocol}://${req.get('host')}/uploads/ground/${item.image}` : null
        }));
        
        res.status(200).json({
            status: 200,
            data: groundsWithUrls
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update ground
exports.updateGround = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, person, price, size, facilities } = req.body;
        const image = req.file ? req.file.filename : undefined;

        let facilitiesArray = [];
        if (facilities) {
            if (typeof facilities === 'string') {
                facilitiesArray = facilities.split(',').map(f => f.trim());
            } else {
                facilitiesArray = facilities;
            }
        }

        const updateData = {
            name,
            person: parseInt(person),
            price: parseFloat(price),
            size,
            facilities: facilitiesArray
        };
        
        if (image) {
            updateData.image = image;
        }

        const ground = await Ground.findByIdAndUpdate(id, updateData, { new: true });

        if (!ground) {
            return res.status(404).json({ message: 'Ground not found' });
        }

        res.status(200).json({
            status: 200,
            message: 'Ground updated successfully',
            data: ground
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Delete ground
exports.deleteGround = async (req, res) => {
    try {
        const { id } = req.params;

        const ground = await Ground.findByIdAndDelete(id);
        if (!ground) {
            return res.status(404).json({ message: 'Ground not found' });
        }

        res.status(200).json({
            status: 200,
            message: 'Ground deleted successfully'
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};