const Location = require('../models/Location');

// Create location
exports.createLocation = async (req, res) => {
    try {
        const { type, title, name, address, city, state, driveTime, distance, link, description } = req.body;
        const image = req.file ? req.file.filename : null;

        if (!type || !title || !name || !address || !city || !state || !driveTime || !description) {
            return res.status(400).json({ message: 'Required fields are missing' });
        }

        const { latitude, longitude } = req.body;
        
        const locationData = {
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
        };
        
        if (latitude && longitude) {
            locationData.coordinates = {
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude)
            };
        }
        
        const location = new Location(locationData);

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
        
        // Add full image URL
        const locationsWithUrls = locations.map(item => ({
            ...item.toObject(),
            imageUrl: item.image ? `${req.protocol}://${req.get('host')}/uploads/location/${item.image}` : null
        }));
        
        res.status(200).json({
            status: 200,
            data: locationsWithUrls
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

        const { latitude, longitude } = req.body;
        
        const updateData = {
            type, title, name, address, city, state, driveTime, distance, link, description
        };
        
        if (latitude && longitude) {
            updateData.coordinates = {
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude)
            };
        }
        
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

// Calculate distance from user location
exports.calculateDistanceFromUser = async (req, res) => {
    try {
        const { userLat, userLng, locationId } = req.body;
        
        const location = await Location.findById(locationId);
        if (!location || !location.coordinates) {
            return res.status(404).json({ message: 'Location coordinates not found' });
        }
        
        // Haversine formula for distance calculation
        const R = 6371; // Earth's radius in km
        const dLat = (location.coordinates.latitude - userLat) * Math.PI / 180;
        const dLng = (location.coordinates.longitude - userLng) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(userLat * Math.PI / 180) * Math.cos(location.coordinates.latitude * Math.PI / 180) *
                  Math.sin(dLng/2) * Math.sin(dLng/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const distance = R * c;
        
        res.status(200).json({
            status: 200,
            distance: `${distance.toFixed(1)} km`,
            message: 'Distance calculated successfully'
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get coordinates from address
exports.getCoordinates = async (req, res) => {
    try {
        const { address, city, state } = req.body;
        
        if (!address || !city) {
            return res.status(400).json({ message: 'Address and city are required' });
        }
        
        const fullAddress = `${address}, ${city}, ${state || ''}`;
        
        // Using OpenStreetMap Nominatim API (free alternative to Google Maps)
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullAddress)}&limit=1`
        );
        
        const data = await response.json();
        
        if (data && data.length > 0) {
            const { lat, lon } = data[0];
            res.status(200).json({
                status: 200,
                coordinates: {
                    latitude: parseFloat(lat),
                    longitude: parseFloat(lon)
                },
                message: 'Coordinates found successfully'
            });
        } else {
            res.status(404).json({
                status: 404,
                message: 'Coordinates not found for this address'
            });
        }
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