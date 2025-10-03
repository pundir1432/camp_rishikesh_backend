const BookGround = require('../models/BookGround');
const BookEvent = require('../models/BookEvent');

// Get all bookings (Ground + Event) for admin
exports.getAllBookings = async (req, res) => {
    try {
        // Get ground bookings
        const groundBookings = await BookGround.find()
            .populate('userId', 'name email')
            .sort({ createdAt: -1 });

        // Get event bookings
        const eventBookings = await BookEvent.find()
            .populate('userId', 'name email')
            .populate('eventId', 'name type price')
            .sort({ createdAt: -1 });

        // Add booking type to differentiate
        const groundBookingsWithType = groundBookings.map(booking => ({
            ...booking.toObject(),
            bookingType: 'ground'
        }));

        const eventBookingsWithType = eventBookings.map(booking => ({
            ...booking.toObject(),
            bookingType: 'event'
        }));

        // Combine and sort by creation date
        const allBookings = [...groundBookingsWithType, ...eventBookingsWithType]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        res.status(200).json({
            status: 200,
            data: {
                totalBookings: allBookings.length,
                groundBookings: groundBookingsWithType.length,
                eventBookings: eventBookingsWithType.length,
                bookings: allBookings
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get user bookings (Ground + Event)
exports.getUserBookings = async (req, res) => {
    try {
        const { userId } = req.params;

        // Get user ground bookings
        const groundBookings = await BookGround.find({ userId })
            .populate('userId', 'name email')
            .sort({ createdAt: -1 });

        // Get user event bookings
        const eventBookings = await BookEvent.find({ userId })
            .populate('userId', 'name email')
            .populate('eventId', 'name type price')
            .sort({ createdAt: -1 });

        // Add booking type
        const groundBookingsWithType = groundBookings.map(booking => ({
            ...booking.toObject(),
            bookingType: 'ground'
        }));

        const eventBookingsWithType = eventBookings.map(booking => ({
            ...booking.toObject(),
            bookingType: 'event'
        }));

        // Combine and sort
        const allBookings = [...groundBookingsWithType, ...eventBookingsWithType]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        res.status(200).json({
            status: 200,
            data: {
                totalBookings: allBookings.length,
                groundBookings: groundBookingsWithType.length,
                eventBookings: eventBookingsWithType.length,
                bookings: allBookings
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};