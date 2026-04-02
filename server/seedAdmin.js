const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected...');

        // Change these to your desired new email and password
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@shisya.com';
        const adminPassword = process.env.ADMIN_PASSWORD || 'admin'; 

        let admin = await User.findOne({ email: adminEmail });

        if (admin) {
            console.log('Admin user already exists. Updating password...');
            // Ensure role is admin and update password
            admin.role = 'admin';
            const salt = await bcrypt.genSalt(10);
            admin.password = await bcrypt.hash(adminPassword, salt);
            await admin.save();
            console.log('Updated existing user with new password and Admin role');
        } else {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(adminPassword, salt);

            admin = new User({
                name: 'System Admin',
                email: adminEmail,
                password: hashedPassword,
                gender: 'male', // Required field
                role: 'admin',
                subscriptionStatus: 'premium'
            });

            await admin.save();
            console.log('Admin user created successfully');
            console.log(`Email: ${adminEmail}`);
            console.log(`Password: ${adminPassword}`);
        }

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedAdmin();
