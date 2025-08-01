const Booking = require('../models/Booking');

exports.createBooking = async (req, res) => {
  try {
    const {userId} = req.query
    console.log(userId,'userId')
    if(!userId || userId === undefined){
    return res.status(400).json({ error: 'Not user id' });
    }else{
      const booking = await Booking.create({ ...req.body });
    return res.status(200).json({ data:booking,status:200,message:'Booking successfully' });
    }
    
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.getBookingsByUser = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).populate('user');
    return res.status(200).json({ bookings });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};