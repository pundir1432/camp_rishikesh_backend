const express = require('express');
const cors = require('cors');
const http = require('http'); // Import http module
const { Server } = require('socket.io'); // Import Socket.IO
const connectDB = require('./server');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const galleryRoutes = require('./routes/galleryRoutes');
const locationRoutes = require('./routes/locationRoutes');
const groundRoutes = require('./routes/groundRoutes');
const eventRoutes = require('./routes/eventRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const bookGroundRoutes = require('./routes/bookGroundRoutes');
const bookEventRoutes = require('./routes/bookEventRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const allBookingsRoutes = require('./routes/allBookingsRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');
const raftingRoutes = require('./routes/raftingRoutes');
const Message = require('./models/Message'); // Import Message model

const app = express();
const server = http.createServer(app); // Create HTTP server
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000', // Match frontend URL
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
}));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/location', locationRoutes);
app.use('/api/ground', groundRoutes);
app.use('/api/event', eventRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/bookground', bookGroundRoutes);
app.use('/api/bookevent', bookEventRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/allbookings', allBookingsRoutes);
app.use('/api/booking', bookingRoutes);
app.use('/api/vehicle', vehicleRoutes);
app.use('/api/rafting', raftingRoutes);

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Join a room based on bookingId
  socket.on('joinBooking', (bookingId) => {
    socket.join(bookingId);
    console.log(`User ${socket.id} joined booking room: ${bookingId}`);
  });

  // Handle sending messages
  socket.on('sendMessage', async (data) => {
    const { bookingId, text, sender, userId } = data;
    try {
      // Save message to MongoDB
      const message = new Message({
        bookingId,
        text,
        sender,
        userId,
      });
      await message.save();

      // Broadcast message to the booking room
      io.to(bookingId).emit('receiveMessage', {
        id: message._id,
        bookingId,
        text,
        sender,
        userId,
        timestamp: message.timestamp,
      });
    } catch (err) {
      console.error('Error saving message:', err);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

app.get('/', (req, res) => {
  res.send('API Running...');
});

server.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});