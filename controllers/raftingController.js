const Rafting = require('../models/Rafting');

// Create Rafting
exports.createRafting = async (req, res) => {
  try {
    const { name, price, description, place,distance,duration,rapid,level,participants,available,location } = req.body;
    const images = req.files ? req.files.map((f) => f.filename) : [];

    if (!name || !price || !description || !place || !distance || !duration || !rapid || !level || !participants || !available || !location) {
      return res.status(400).json({ message: 'Required fields are missing' });
    }

    const rafting = new Rafting({
      name,
      image: images, // Store array of image filenames
      description,
      price: parseFloat(price),
      place,distance,duration,rapid,level,participants,available,location

    });

    await rafting.save();
    res.status(200).json({
      status: 200,
      message: 'Rafting created successfully',
      data: {
        ...rafting.toObject(),
        imageUrls: images.map((filename) => `${req.protocol}://${req.get('host')}/uploads/rafting/${filename}`),
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all Raftings
exports.getRafting = async (req, res) => {
  try {
    const raftings = await Rafting.find().sort({ createdAt: -1 });

    // Add full image URLs
    const raftingsWithUrls = raftings.map((item) => ({
      ...item.toObject(),
      imageUrls: item.image.length
        ? item.image.map((filename) => `${req.protocol}://${req.get('host')}/uploads/rafting/${filename}`)
        : [],
    }));

    res.status(200).json({
      status: 200,
      data: raftingsWithUrls,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Rafting
exports.updateRafting = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, description,place,distance,duration,rapid,level,participants,available,location } = req.body;
    const images = req.files ? req.files.map((f) => f.filename) : [];

    const updateData = {
      name,
      description,
      price: parseFloat(price),
     place,distance,duration,rapid,level,participants,available,location
    };

    if (images.length) {
      updateData.image = images;
    }

    const rafting = await Rafting.findByIdAndUpdate(id, updateData, { new: true });

    if (!rafting) {
      return res.status(404).json({ message: 'Rafting not found' });
    }

    res.status(200).json({
      status: 200,
      message: 'Rafting updated successfully',
      data: {
        ...rafting.toObject(),
        imageUrls: rafting.image.length
          ? rafting.image.map((filename) => `${req.protocol}://${req.get('host')}/uploads/rafting/${filename}`)
          : [],
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete Rafting
exports.deleteRafting = async (req, res) => {
  try {
    const { id } = req.params;

    const rafting = await Rafting.findByIdAndDelete(id);
    if (!rafting) {
      return res.status(404).json({ message: 'Rafting not found' });
    }

    res.status(200).json({
      status: 200,
      message: 'Rafting deleted successfully',
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};