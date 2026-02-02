const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected...');

        const adminEmail = 'admin@shisyamatrimony.com';
        const adminPassword = 'admin'; // Simple password for initial access

        let admin = await User.findOne({ email: adminEmail });

        if (admin) {
            console.log('Admin user already exists');
            // Ensure role is admin
            if (admin.role !== 'admin') {
                admin.role = 'admin';
                await admin.save();
                console.log('Updated existing user to Admin role');
            }
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
