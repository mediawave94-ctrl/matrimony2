const User = require('../models/User');
const calculateDNA = require('../utils/dnaCalculator');

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { name, age, gender, personality, bio } = req.body;

        // Build profile object
        const profileFields = {};
        if (name) profileFields.name = name;
        if (age) profileFields.age = age;
        if (gender) {
            profileFields.gender = gender;
            // Update target gender logic if gender changes
            if (gender === 'male') profileFields.targetGender = 'female';
            if (gender === 'female') profileFields.targetGender = 'male';
        }
        if (bio) profileFields.bio = bio;
        if (req.body.location) profileFields.location = req.body.location; // Keep for backward compatibility or migration
        if (req.body.occupation) profileFields.occupation = req.body.occupation;

        // New Detailed Profile Fields
        if (req.body.basicDetails) profileFields.basicDetails = req.body.basicDetails;
        if (req.body.religious) profileFields.religious = req.body.religious;
        if (req.body.professional) profileFields.professional = req.body.professional;
        if (req.body.location) profileFields.location = req.body.location; // Overlap with old field, schema will handle
        if (req.body.family) profileFields.family = req.body.family;
        if (req.body.astrological) profileFields.astrological = req.body.astrological;

        // If personality is updated, recalculate DNA
        if (personality) {
            profileFields.personality = personality;
            profileFields.compatibilityDNA = calculateDNA(personality);
        }

        let user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        user = await User.findByIdAndUpdate(
            req.user.id,
            { $set: profileFields },
            { new: true }
        ).select('-password');

        res.json(user);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.getUserById = async (req, res) => {
    try {
        const currentUserId = req.user.id;
        const targetUserId = req.params.id;

        let user = await User.findById(targetUserId).select('-password');
        if (!user) return res.status(404).json({ msg: 'User not found' });

        // If viewing self, return full profile
        if (currentUserId === targetUserId) {
            return res.json(user);
        }

        // Check connection status
        const Connection = require('../models/Connection');
        const connection = await Connection.findOne({
            $or: [
                { requester: currentUserId, recipient: targetUserId },
                { requester: targetUserId, recipient: currentUserId }
            ],
            status: 'accepted'
        });

        const isConnected = !!connection;

        // Clone user object to modify it
        let userProfile = user.toObject();

        if (!isConnected) {
            // MASK SENSITIVE DATA
            // Allow: Name, Age, Gender, Bio, Basic Details, Professional (Generic), Religion.
            // Hide: Detailed Family, Astrological, Email.

            delete userProfile.family;
            delete userProfile.astrological;
            delete userProfile.email;

            userProfile.isConnected = false;
        } else {
            userProfile.isConnected = true;
        }

        res.json(userProfile);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const Transaction = require('../models/Transaction');

exports.subscribe = async (req, res) => {
    try {
        const { planId, amount } = req.body;

        // In a real app, verify signature/payment ID here.
        // For MVP, we assume trust (or self-serve simulation)

        const transaction = new Transaction({
            user: req.user.id,
            amount: amount,
            status: 'completed',
            paymentMethod: 'Online/Card', // Simulated
            currency: 'INR'
        });

        await transaction.save();

        // Update User
        await User.findByIdAndUpdate(req.user.id, {
            subscriptionStatus: 'premium',
            subscriptionExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
        });

        res.json({ msg: 'Subscription successful', transaction });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};