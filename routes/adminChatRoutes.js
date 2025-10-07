const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const { verifyAdmin } = require('../middlewares/authMiddleware');  // Import from middleware/auth.js

// GET /api/admin/chat/conversations - List all chats (bookings with messages)
router.get('/conversations', verifyAdmin, async (req, res) => {
  try {
    // If Booking model not exists, aggregate from Messages only
    const conversations = await Message.aggregate([
      {
        $group: {
          _id: '$bookingId',  // Group by bookingId
          userId: { $first: '$userId' },
          lastMessage: { $last: '$text' },
          timestamp: { $last: '$timestamp' },
          unreadCount: {
            $sum: {
              $cond: [
                { $and: [{ $eq: ['$sender', 'user'] }, { $eq: ['$read', false] }] },
                1,
                0
              ]
            }
          }
        }
      },
      {
        $lookup: {
          from: 'users',  // Assume User model collection name 'users'
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
          pipeline: [{ $project: { name: 1, email: 1 } }]
        }
      },
      {
        $unwind: { path: '$user', preserveNullAndEmptyArrays: true }
      },
      {
        $project: {
          id: '$_id',  // bookingId
          userName: { $ifNull: ['$user.name', 'Unknown User'] },
          lastMessage: 1,
          unreadCount: 1,
          userId: 1,
          timestamp: 1
        }
      },
      { $sort: { timestamp: -1 } }  // Latest first
    ]);

    res.json(conversations);
  } catch (err) {
    console.error('Error fetching conversations:', err);
    res.status(500).json({ message: err.message });
  }
});

// GET /api/admin/chat/messages/:bookingId - Fetch messages for booking
router.get('/messages/:bookingId', verifyAdmin, async (req, res) => {
  try {
    const messages = await Message.find({ bookingId: req.params.bookingId })
      .populate('userId', 'name email')  // Populate user details
      .sort({ timestamp: 1 });

    // Mark user messages as read when admin views
    await Message.updateMany(
      { bookingId: req.params.bookingId, sender: 'user', read: false },
      { read: true }
    );

    res.json(messages);
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({ message: err.message });
  }
});

// POST /api/admin/chat/send/:bookingId - Admin sends message
router.post('/send/:bookingId', verifyAdmin, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Message text required' });
    }

    const message = new Message({
      bookingId: req.params.bookingId,
      text: text.trim(),
      sender: 'admin',
      userId: req.user.id,  // Admin's ID
      read: true  // Admin messages auto-read
    });

    await message.save();
    await message.populate('userId', 'name');  // Optional populate for response

    res.status(201).json(message);
  } catch (err) {
    console.error('Error sending message:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;