const Vehicle = require('../models/Vehicle');

// Create Vehicle
exports.createVehicle = async (req, res) => {
  try {
    const { name, price, description, type } = req.body;
    const images = req.files ? req.files.map((f) => f.filename) : [];

    if (!name || !type || !price || !description) {
      return res.status(400).json({ message: 'Required fields are missing' });
    }

    const vehicle = new Vehicle({
      name,
      image: images, // Store array of image filenames
      description,
      price: parseFloat(price),
      type,
    });

    await vehicle.save();
    res.status(200).json({
      status: 200,
      message: 'Vehicle created successfully',
      data: {
        ...vehicle.toObject(),
        imageUrls: images.map((filename) => `${req.protocol}://${req.get('host')}/uploads/vehicle/${filename}`),
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all Vehicles
exports.getVehicle = async (req, res) => {
  try {
    const vehicles = await Vehicle.find().sort({ createdAt: -1 });

    // Add full image URLs
    const vehiclesWithUrls = vehicles.map((item) => ({
      ...item.toObject(),
      imageUrls: item.image.length
        ? item.image.map((filename) => `${req.protocol}://${req.get('host')}/uploads/vehicle/${filename}`)
        : [],
    }));

    res.status(200).json({
      status: 200,
      data: vehiclesWithUrls,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Vehicle
exports.updateVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, price, description } = req.body;
    const images = req.files ? req.files.map((f) => f.filename) : [];

    const updateData = {
      name,
      description,
      price: parseFloat(price),
      type,
    };

    if (images.length) {
      updateData.image = images; // Update image array only if new images are provided
    }

    const vehicle = await Vehicle.findByIdAndUpdate(id, updateData, { new: true });

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    res.status(200).json({
      status: 200,
      message: 'Vehicle updated successfully',
      data: {
        ...vehicle.toObject(),
        imageUrls: vehicle.image.length
          ? vehicle.image.map((filename) => `${req.protocol}://${req.get('host')}/uploads/vehicle/${filename}`)
          : [],
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete Vehicle
exports.deleteVehicle = async (req, res) => {
  try {
    const { id } = req.params;

    const vehicle = await Vehicle.findByIdAndDelete(id);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    res.status(200).json({
      status: 200,
      message: 'Vehicle deleted successfully',
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};