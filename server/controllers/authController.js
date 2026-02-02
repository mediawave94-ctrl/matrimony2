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
            personality: personality || {}, // Default to empty object if not provided
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
