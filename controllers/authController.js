const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Configure nodemailer with more reliable settings
const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: 'pankajpundir228@gmail.com',
        pass: 'ugnv ludi qjmp lfkp'
    },
    tls: {
        rejectUnauthorized: false 
    }
});

// Verify connection configuration
transporter.verify(function(error, success) {
    if (error) {
        console.error('SMTP connection error:', error);
    } else {
        console.log('SMTP server is ready to take our messages');
    }
});

// Generate OTP
exports.generateOTP = async (req, res) => {
    try {
        const { email } = req.body;
        
        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000);
        
        // Find or create user
        let user = await User.findOne({ email });
        if (!user) {
            user = new User({
                email,
                otp: otp,
                otpExpiration: Date.now() + 15 * 60 * 1000 
            });
            await user.save();
        } else {
            user.otp = otp;
            user.otpExpiration = Date.now() + 15 * 60 * 1000;
            await user.save();
        }

        // Send OTP via email
        const mailOptions = {
            from: 'shubhamrwt789@gmail.com',
            to: email,
            subject: 'Flipkart Clone - Login OTP',
            html: `
                <h2>Your OTP for Flipkart Clone Login</h2>
                <p>Your One Time Password (OTP) is: <strong>${otp}</strong></p>
                <p>This OTP is valid for 15 minutes.</p>
            `
        };

        await transporter.sendMail(mailOptions);
        res.json({ message: 'OTP sent successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Error sending OTP' });
    }
};

// Verify OTP
exports.verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        
        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Check if OTP is valid
        if (user.otp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        // Check if OTP is expired
        if (user.otpExpiration < Date.now()) {
            return res.status(400).json({ message: 'OTP expired' });
        }

        // Clear OTP after successful verification
        user.otp = '';
        user.otpExpiration = null;
        user.isVerified = true;
        await user.save();

        // Create JWT token
        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '5h' },
            (err, token) => {
                if (err) throw err;
                res.status(200).json({status:200,message:'Verify email successfully', token,user });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Error verifying OTP' });
    }
};

// Register user
exports.register = async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;
        
        let user = await User.findOne({ $or: [{ email }, { phone }] });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        user = new User({
            name,
            email,
            phone,
            password
        });

        await user.save();

        const otp = Math.floor(100000 + Math.random() * 900000);
        user.otp = otp;
        user.otpExpiration = Date.now() + 15 * 60 * 1000;
        await user.save();

        const mailOptions = {
            from: 'pankajpundir228@gmail.com',
            to: email,
            subject: 'Camping_Rishikesh - Registration OTP',
            html: `
                <h2>Welcome to Camping Rishikesh</h2>
                <p>Your One Time Password (OTP) is: <strong>${otp}</strong></p>
                <p>This OTP is valid for 15 minutes.</p>
            `
        };
        console.log(mailOptions);

        await transporter.sendMail(mailOptions);
        res.status(200).json({status:200, message: 'Registration successful. OTP sent to your email.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Error during registration' });
    }
};

// Get user profile
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('wishlist', 'name price images').populate('orders', 'status totalAmount createdAt');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user.getPublicData());
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Error fetching profile' });
    }
};

// Update user profile
exports.updateProfile = async (req, res) => {
    try {
        const { name, phone, address } = req.body;
        
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update user fields
        if (name) user.name = name;
        if (phone) user.phone = phone;
        if (address) user.address = address;

        await user.save();
        res.json({ message: 'Profile updated successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Error updating profile' });
    }
};

// Login user
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Create JWT token
        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '5h' },
            (err, token) => {
                if (err) throw err;
                res.status(200).json({ 
                    token, 
                    user: user.getPublicData ? user.getPublicData() : user,
                    status: 200,
                    message: 'Login successful' 
                });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get current user's profile
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.status(200).json({
            success: true,
            data: user
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ 
            success: false,
            message: 'Server Error' 
        });
    }
};

// Update user details
exports.updateDetails = async (req, res) => {
    try {
        const fieldsToUpdate = {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone
        };

        const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
            new: true,
            runValidators: true
        }).select('-password');

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ 
            success: false,
            message: 'Error updating user details' 
        });
    }
};

// Update password
exports.updatePassword = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('+password');

        // Check current password
        const isMatch = await user.comparePassword(req.body.currentPassword);
        if (!isMatch) {
            return res.status(401).json({ 
                success: false,
                message: 'Password is incorrect' 
            });
        }

        user.password = req.body.newPassword;
        await user.save();

        // Create token
        const payload = {
            user: { id: user.id }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '5h' },
            (err, token) => {
                if (err) throw err;
                res.status(200).json({ 
                    token,
                    user: user.getPublicData ? user.getPublicData() : user,
                    status: 200,
                    message: 'Password updated successfully' 
                });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ 
            success: false,
            message: 'Error updating password' 
        });
    }
};

// Logout user
exports.logout = async (req, res) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });

    res.status(200).json({
        success: true,
        data: {}
    });
};

// Social login
exports.socialLogin = async (req, res) => {
    try {
        const { email, name, provider, providerId, image } = req.body;
        
        // Check if user exists
        let user = await User.findOne({ email });

        if (user) {
            // Update provider info if logging in with a new provider
            if (!user.providers?.includes(provider)) {
                user.providers = [...(user.providers || []), provider];
                user[`${provider}Id`] = providerId;
                await user.save();
            }
        } else {
            // Create new user
            user = new User({
                name,
                email,
                providers: [provider],
                [provider + 'Id']: providerId,
                image,
                isVerified: true
            });
            await user.save();
        }

        // Create token
        const payload = {
            user: { id: user.id }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '5h' },
            (err, token) => {
                if (err) throw err;
                res.status(200).json({ 
                    token,
                    user: user.getPublicData ? user.getPublicData() : user,
                    status: 200,
                    message: 'Social login successful' 
                });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ 
            success: false,
            message: 'Error with social login' 
        });
    }
};