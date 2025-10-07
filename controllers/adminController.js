const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Configure nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'pankajpundir228@gmail.com',
        pass: 'ugnv ludi qjmp lfkp'
    }
});

// Admin signin
exports.adminSignin = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Login attempt:', { email, password });

        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(400).json({ message: 'Admin not found' });
        }

        const isMatch = await admin.comparePassword(password);
        console.log('Password match:', isMatch);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        const payload = { admin: { id: admin.id } };
        
        jwt.sign(
            payload,
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '5h' },
            (err, token) => {
                if (err) throw err;
                res.status(200).json({
                    status: 200,
                    message: 'Admin login successful',
                    token,
                    admin: {
                        id: admin._id,
                        name: admin.name,
                        email: admin.email,
                        role: admin.role
                    }
                });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// Forgot password
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(20).toString('hex');
        admin.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        admin.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

        await admin.save();

        const resetUrl = `${req.protocol}://${req.get('host')}/api/admin/reset-password/${resetToken}`;

        const mailOptions = {
            from: 'pankajpundir228@gmail.com',
            to: email,
            subject: 'Admin Password Reset',
            html: `
                <h2>Password Reset Request</h2>
                <p>You requested a password reset. Click the link below to reset your password:</p>
                <a href="${resetUrl}">${resetUrl}</a>
                <p>This link expires in 10 minutes.</p>
            `
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ 
            status: 200,
            message: 'Password reset email sent' 
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Error sending email' });
    }
};

// Reset password
exports.resetPassword = async (req, res) => {
    try {
        const resetPasswordToken = crypto.createHash('sha256').update(req.params.resettoken).digest('hex');

        const admin = await Admin.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!admin) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        admin.password = req.body.password;
        admin.resetPasswordToken = undefined;
        admin.resetPasswordExpire = undefined;

        await admin.save();

        res.status(200).json({
            status: 200,
            message: 'Password reset successful'
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Error resetting password' });
    }
};