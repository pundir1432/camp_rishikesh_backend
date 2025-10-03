const Event = require('../models/Event');
const Ground = require('../models/Ground');
const Location = require('../models/Location');
const Gallery = require('../models/Gallery');
const Booking = require('../models/Booking');
const BookGround = require('../models/BookGround');
const BookEvent = require('../models/BookEvent');

// Get dashboard stats
exports.getDashboardStats = async (req, res) => {
    try {
        const { userId } = req.query;
        
        if (!userId) {
            return res.status(400).json({ message: 'userId is required' });
        }

        // Get counts from actual booking models
        const groundBookings = await BookGround.countDocuments({ userId });
        const eventBookings = await BookEvent.countDocuments({ userId });
        const totalBookings = groundBookings + eventBookings;
        
        const activeEvents = await Event.countDocuments();
        const availableGrounds = await Ground.countDocuments();
        const totalGalleryImages = await Gallery.countDocuments();
        const totalLocations = await Location.countDocuments();

        // Get recent bookings from both models
        const recentGroundBookings = await BookGround.find({ userId })
            .sort({ createdAt: -1 })
            .limit(3)
            .populate('userId', 'name email');
            
        const recentEventBookings = await BookEvent.find({ userId })
            .sort({ createdAt: -1 })
            .limit(3)
            .populate('userId', 'name email');
            
        // Format recent bookings for frontend
        const formattedGroundBookings = recentGroundBookings.map(booking => ({
            eventName: booking.groundName || 'Ground Booking',
            customerName: `${booking.firstName} ${booking.lastName}`,
            amount: booking.totalAmount || 0,
            status: booking.status === 'confirmed' ? 'Confirmed' : booking.status === 'pending' ? 'Pending' : 'Cancelled',
            bookingType: 'ground',
            createdAt: booking.createdAt
        }));
        
        const formattedEventBookings = recentEventBookings.map(booking => ({
            eventName: booking.eventName || 'Event Booking',
            customerName: `${booking.firstName} ${booking.lastName}`,
            amount: booking.eventPrice || 0,
            status: booking.status === 'confirmed' ? 'Confirmed' : booking.status === 'pending' ? 'Pending' : 'Cancelled',
            bookingType: 'event',
            createdAt: booking.createdAt
        }));
        
        const allRecentBookings = [...formattedGroundBookings, ...formattedEventBookings]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5);

        // Simple chart data (mock for now)
        const chartData = [
            { month: 'Jan 2024', bookings: 5 },
            { month: 'Feb 2024', bookings: 8 },
            { month: 'Mar 2024', bookings: 12 },
            { month: 'Apr 2024', bookings: 7 },
            { month: 'May 2024', bookings: 15 },
            { month: 'Jun 2024', bookings: 10 }
        ];

        res.status(200).json({
            status: 200,
            data: {
                totalBookings,
                activeEvents,
                availableGrounds,
                totalGalleryImages,
                totalLocations,
                recentBookings: allRecentBookings,
                groundBookings,
                eventBookings,
                chartData
            }
        });
    } catch (err) {
        console.error('Dashboard error:', err);
        res.status(500).json({ message: err.message });
    }
};