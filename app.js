const express = require('express');
const cors = require('cors');
const connectDB = require('./server');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const galleryRoutes = require('./routes/galleryRoutes');
const locationRoutes = require('./routes/locationRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors({
  origin: '*', 
  credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/location', locationRoutes);
app.use('/api/booking', bookingRoutes);

app.get('/', (req, res) => {
  res.send('API Running...');
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
