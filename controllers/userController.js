const User = require('../models/User');

// Get all users (for admin)
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find()
            .select('-password -otp -otpExpiration')
            .sort({ createdAt: -1 });

        res.status(200).json({
            status: 200,
            data: users,
            total: users.length
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get single user by ID
exports.getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const user = await User.findById(id)
            .select('-password -otp -otpExpiration');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            status: 200,
            data: user
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Delete user (for admin)
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            status: 200,
            message: 'User deleted successfully'
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};