const BookEvent = require('../models/BookEvent');

// Create event booking
exports.createEventBooking = async (req, res) => {
    try {
        const {
            userId,
            eventId,
            firstName,
            lastName,
            email,
            phone,
            person,
            personType,
            address,
            city,
            state,
            zipCode,
            eventName,
            eventDate,
            eventPrice
        } = req.body;

        if (!userId || !eventId || !firstName || !lastName || !email || !phone || 
            !person || !personType || !address || !city || !state || !zipCode || 
            !eventName || !eventDate || !eventPrice) {
            return res.status(400).json({ message: 'All required fields must be provided' });
        }

        const booking = new BookEvent({
            userId,
            eventId,
            firstName,
            lastName,
            email,
            phone,
            person,
            personType,
            address,
            city,
            state,
            zipCode,
            eventName,
            eventDate,
            eventPrice
        });

        await booking.save();
        res.status(201).json({
            status: 201,
            message: 'Event booking created successfully',
            data: booking
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get all event bookings
exports.getAllEventBookings = async (req, res) => {
    try {
        const bookings = await BookEvent.find()
            .populate('userId', 'name email')
            .populate('eventId', 'name type price')
            .sort({ createdAt: -1 });

        res.status(200).json({
            status: 200,
            data: bookings
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get event bookings by userId
exports.getEventBookingsByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        
        const bookings = await BookEvent.find({ userId })
            .populate('userId', 'name email')
            .populate('eventId', 'name type price')
            .sort({ createdAt: -1 });

        res.status(200).json({
            status: 200,
            data: bookings
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update event booking status
exports.updateEventBookingStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const booking = await BookEvent.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!booking) {
            return res.status(404).json({ message: 'Event booking not found' });
        }

        res.status(200).json({
            status: 200,
            message: 'Event booking status updated successfully',
            data: booking
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};