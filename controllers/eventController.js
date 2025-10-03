const Event = require('../models/Event');

// Create event
exports.createEvent = async (req, res) => {
    try {
        const { type, price, name, date, startTime, endTime, address, person, description } = req.body;
        const image = req.file ? req.file.filename : null;

        if (!type || !price || !name || !date || !startTime || !endTime || !address || !person || !description) {
            return res.status(400).json({ message: 'All required fields must be provided' });
        }

        const event = new Event({
            type,
            price: parseFloat(price),
            name,
            image,
            date: new Date(date),
            startTime,
            endTime,
            address,
            person: parseInt(person),
            description
        });

        await event.save();
        res.status(201).json({
            status: 201,
            message: 'Event created successfully',
            data: event
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get all events
exports.getEvents = async (req, res) => {
    try {
        const { type } = req.query;
        
        let filter = {};
        if (type && type !== 'all' && type !== '') {
            filter.type = type;
        }
        
        const events = await Event.find(filter).sort({ createdAt: -1 });
        
        // Add full image URL
        const eventsWithUrls = events.map(item => ({
            ...item.toObject(),
            imageUrl: item.image ? `${req.protocol}://${req.get('host')}/uploads/event/${item.image}` : null
        }));
        
        res.status(200).json({
            status: 200,
            data: eventsWithUrls
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update event
exports.updateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const { type, price, name, date, startTime, endTime, address, person, description } = req.body;
        const image = req.file ? req.file.filename : undefined;

        const updateData = {
            type,
            price: parseFloat(price),
            name,
            date: new Date(date),
            startTime,
            endTime,
            address,
            person: parseInt(person),
            description
        };
        
        if (image) {
            updateData.image = image;
        }

        const event = await Event.findByIdAndUpdate(id, updateData, { new: true });

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.status(200).json({
            status: 200,
            message: 'Event updated successfully',
            data: event
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Delete event
exports.deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;

        const event = await Event.findByIdAndDelete(id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.status(200).json({
            status: 200,
            message: 'Event deleted successfully'
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};