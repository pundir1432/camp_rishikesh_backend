const mongoose = require('mongoose');
const Admin = require('../models/Admin');
require('dotenv').config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/camping_rishikesh');
        
        const admin = new Admin({
            name: 'Admin',
            email: 'admin@campingrishikesh.com',
            password: 'admin123'
        });

        await admin.save();
        console.log('Admin created successfully');
        process.exit();
    } catch (error) {
        console.error('Error creating admin:', error);
        process.exit(1);
    }
};

createAdmin();