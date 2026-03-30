const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const calculateDNA = require('../utils/dnaCalculator');

exports.register = async (req, res) => {
    try {
        const { name, email, password, gender, personality } = req.body;

        // Check if user exists
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: 'User already exists' });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Calculate DNA (Default validation handles empty personality)
        const dnaScores = calculateDNA(personality || {});

        // Determine target gender (Simple opposite logic for MVP default)
        let targetGender = 'both';
        if (gender === 'male') targetGender = 'female';
        if (gender === 'female') targetGender = 'male';

        // Create user
        user = new User({
            name,
            email,
            password: hashedPassword,
            gender,
            targetGender,
            personality: personality || {},
            compatibilityDNA: dnaScores
        });

        await user.save();

        // Create Token
        const payload = { user: { id: user.id } };
        jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: 36000 }, (err, token) => {
            if (err) throw err;
            res.json({ token, user: { id: user.id, name: user.name, personality: user.personality, compatibilityDNA: user.compatibilityDNA } });
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        let user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'Invalid Credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' });

        const payload = { user: { id: user.id } };
        jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: 36000 }, (err, token) => {
            if (err) throw err;
            res.json({
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    role: user.role,
                    subscriptionStatus: user.subscriptionStatus
                }
            });
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Forgot Password - Send reset code
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ msg: 'Please provide your email address' });

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ msg: 'No account found with this email' });

        // Generate 6-digit code
        const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Hash the code before saving
        const salt = await bcrypt.genSalt(10);
        user.resetPasswordToken = await bcrypt.hash(resetCode, salt);
        user.resetPasswordExpires = Date.now() + 600000; // 10 minutes
        await user.save();

        // In production, send via email/SMS. For MVP, return the code.
        res.json({ 
            msg: 'Reset code generated successfully.',
            resetCode 
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Reset Password - Verify code and set new password
exports.resetPassword = async (req, res) => {
    try {
        const { email, code, newPassword } = req.body;
        
        if (!email || !code || !newPassword) {
            return res.status(400).json({ msg: 'All fields are required' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ msg: 'Password must be at least 6 characters' });
        }

        const user = await User.findOne({ 
            email,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ msg: 'Invalid or expired reset code' });
        }

        // Verify code
        const isValidCode = await bcrypt.compare(code, user.resetPasswordToken);
        if (!isValidCode) {
            return res.status(400).json({ msg: 'Invalid reset code' });
        }

        // Set new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.json({ msg: 'Password reset successfully! You can now login.' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
