const Location = require('../models/Location');

// Create location
exports.createLocation = async (req, res) => {
    try {
        const { type, title, name, address, city, state, driveTime, distance, link, description } = req.body;
        const image = req.file ? req.file.filename : null;

        if (!type || !title || !name || !address || !city || !state || !driveTime || !description) {
            return res.status(400).json({ message: 'Required fields are missing' });
        }

        const location = new Location({
            type,
            title,
            name,
            address,
            city,
            state,
            driveTime,
            distance,
            link,
            image,
            description
        });

        await location.save();
        res.status(201).json({
            status: 201,
            message: 'Location created successfully',
            data: location
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get all locations
exports.getLocations = async (req, res) => {
    try {
        const { type } = req.query;
        
        let filter = {};
        if (type && type !== 'all') {
            filter.type = type;
        }
        
        const locations = await Location.find(filter).sort({ createdAt: -1 });
        res.status(200).json({
            status: 200,
            data: locations
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update location
exports.updateLocation = async (req, res) => {
    try {
        const { id } = req.params;
        const { type, title, name, address, city, state, driveTime, distance, link, description } = req.body;
        const image = req.file ? req.file.filename : undefined;

        const updateData = {
            type, title, name, address, city, state, driveTime, distance, link, description
        };
        
        if (image) {
            updateData.image = image;
        }

        const location = await Location.findByIdAndUpdate(id, updateData, { new: true });

        if (!location) {
            return res.status(404).json({ message: 'Location not found' });
        }

        res.status(200).json({
            status: 200,
            message: 'Location updated successfully',
            data: location
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Delete location
exports.deleteLocation = async (req, res) => {
    try {
        const { id } = req.params;

        const location = await Location.findByIdAndDelete(id);
        if (!location) {
            return res.status(404).json({ message: 'Location not found' });
        }

        res.status(200).json({
            status: 200,
            message: 'Location deleted successfully'
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Calculate distance (placeholder function)
exports.calculateDistance = async (req, res) => {
    try {
        const { address, city, state } = req.body;
        
        // Placeholder calculation - you can integrate with Google Maps API
        const mockDistance = Math.floor(Math.random() * 50) + 10; // Random distance between 10-60 km
        
        res.status(200).json({
            status: 200,
            distance: `${mockDistance} km`,
            message: 'Distance calculated successfully'
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};