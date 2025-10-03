const BookGround = require('../models/BookGround');

// Create booking
exports.createBooking = async (req, res) => {
    try {
        const {
            userId,
            firstName,
            lastName,
            email,
            phone,
            address,
            city,
            state,
            zipCode,
            checkIn,
            checkOut,
            startTime,
            endTime,
            guests,
            specialRequests,
            emergencyName,
            emergencyPhone,
            emergencyRelation,
            groundId,
            groundName,
            totalAmount
        } = req.body;

        if (!userId || !firstName || !lastName || !email || !phone || !address || 
            !city || !state || !zipCode || !checkIn || !checkOut || !startTime || 
            !endTime || !guests || !emergencyName || !emergencyPhone || !emergencyRelation) {
            return res.status(400).json({ message: 'All required fields must be provided' });
        }

        const booking = new BookGround({
            userId,
            firstName,
            lastName,
            email,
            phone,
            address,
            city,
            state,
            zipCode,
            checkIn,
            checkOut,
            startTime,
            endTime,
            guests,
            specialRequests,
            emergencyName,
            emergencyPhone,
            emergencyRelation,
            groundId,
            groundName,
            totalAmount
        });

        await booking.save();
        res.status(201).json({
            status: 201,
            message: 'Booking created successfully',
            data: booking
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get all bookings
exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await BookGround.find()
            .populate('userId', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({
            status: 200,
            data: bookings
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get bookings by userId
exports.getBookingsByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        
        const bookings = await BookGround.find({ userId })
            .populate('userId', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({
            status: 200,
            data: bookings
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update booking status
exports.updateBookingStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const booking = await BookGround.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        res.status(200).json({
            status: 200,
            message: 'Booking status updated successfully',
            data: booking
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};