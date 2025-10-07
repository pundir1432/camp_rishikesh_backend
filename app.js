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
const messageRoutes = require('./routes/messageRoutes');
const adminChatRoutes = require('./routes/adminChatRoutes'); // Admin chat routes
const Message = require('./models/Message'); // Message model
const jwt = require('jsonwebtoken'); // For socket auth

const app = express();
const server = http.createServer(app); // Create HTTP server
const io = new Server(server, {
  cors: {
    origin: [process.env.FRONTEND_URL || 'http://localhost:3000', 'http://localhost:3001'], // Allow both user (3000) & admin (3001)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Include OPTIONS
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow auth headers
  },
});

const PORT = process.env.PORT || 5000;

connectDB();

// Flexible CORS middleware for multiple origins
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:3000',  // User app
      'http://localhost:3001',  // Admin app
      process.env.FRONTEND_URL || 'http://localhost:3000',
      // Add more: 'https://yourdomain.com'
    ];
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true); // Allow
    } else {
      console.log(`CORS Blocked Origin: ${origin}`); // Debug log
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  preflightContinue: false,
  optionsSuccessStatus: 204, // For legacy browsers
};

// Apply CORS
app.use(cors(corsOptions));

// Log CORS requests for debugging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - Origin: ${req.headers.origin || 'Direct'}`);
  next();
});

app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
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
app.use('/api/messages', messageRoutes);
app.use('/api/admin/chat', adminChatRoutes); // Admin chat routes

// Socket.IO with Auth Middleware
io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) {
    console.log('Socket: No token provided');
    return next(new Error('Authentication error: No token'));
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded;
    socket.isAdmin = decoded.role === 'admin';  // Assume role in JWT payload
    next();
  } catch (err) {
    console.log('Socket Auth Error:', err.message);
    next(new Error('Authentication error: Invalid token'));
  }
});

io.on('connection', (socket) => {
  console.log('Connected:', socket.id, socket.user?.id, socket.isAdmin ? '(Admin)' : '(User)');

  if (socket.isAdmin) {
    // Admin joins all active booking rooms (fetch from DB)
    socket.on('joinAllBookings', async () => {
      if (!socket.isAdmin) return socket.emit('error', { message: 'Admin only' });
      
      try {
        // Fetch all unique bookingIds with messages
        const bookingIds = await Message.distinct('bookingId');
        socket.emit('allBookings', bookingIds);  // Send list to admin client
        console.log('Admin requested all bookings:', bookingIds.length);
        
        // Auto-join admin to all rooms
        bookingIds.forEach(id => socket.join(id));
      } catch (err) {
        console.error('Error fetching bookings for admin:', err);
        socket.emit('error', { message: 'Failed to join rooms' });
      }
    });
  }

  socket.on('joinBooking', (bookingId) => {
    socket.join(bookingId);
    console.log(`${socket.isAdmin ? 'Admin' : 'User'} ${socket.id} joined room: ${bookingId}`);
  });

  socket.on('sendMessage', async (data) => {
    const { bookingId, text, sender, userId } = data;
    
    // Admin bypass: Allow admin to send without userId match
    if (!socket.isAdmin && socket.user.id !== userId) {
      return socket.emit('error', { message: 'Unauthorized sender' });
    }

    try {
      const message = new Message({
        bookingId,
        text,
        sender: socket.isAdmin ? 'admin' : 'user',  // Override sender based on role
        userId: socket.user.id,  // Always use sender's ID
        read: socket.isAdmin ? true : false,  // Admin messages auto-read for user? Adjust logic
      });
      await message.save();

      // Broadcast to room (both user & admin receive)
      const broadcastMsg = {
        id: message._id,
        bookingId,
        text,
        sender: message.sender,
        userId: message.userId,
        timestamp: message.timestamp,
        read: message.read,
      };
      io.to(bookingId).emit('receiveMessage', broadcastMsg);

      // Notify admin globally if user message (for unread)
      if (message.sender === 'user') {
        io.emit('userMessageNotification', { 
          bookingId, 
          text: message.text,
          userId: message.userId 
        });  // Admin listens for this to update UI
      }
    } catch (err) {
      console.error('Error saving message:', err);
      socket.emit('error', { message: err.message });
    }
  });

  socket.on('disconnect', () => {
    console.log('Disconnected:', socket.id);
  });
});

app.get('/', (req, res) => {
  res.send('API Running...');
});

server.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`CORS Allowed Origins: localhost:3000, localhost:3001`); // Debug log
});