const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Connection = require('../models/Connection');

// @desc    Get Admin Stats
// @route   GET api/admin/stats
// @access  Private (Admin)
exports.getStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ role: 'user' });
        const premiumUsers = await User.countDocuments({ role: 'user', subscriptionStatus: 'premium' });
        const totalConnections = await Connection.countDocuments({ status: 'accepted' });

        // Calculate revenue
        const transactions = await Transaction.find({ status: 'completed' });
        const totalRevenue = transactions.reduce((acc, curr) => acc + curr.amount, 0);

        // Recent users
        const recentUsers = await User.find({ role: 'user' })
            .sort({ createdAt: -1 })
            .limit(5)
            .select('name email createdAt basicDetails.photoUrl');

        res.json({
            totalUsers,
            premiumUsers,
            totalConnections,
            totalRevenue,
            recentUsers
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get All Users
// @route   GET api/admin/users
// @access  Private (Admin)
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ role: 'user' }).select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Delete User
// @route   DELETE api/admin/users/:id
// @access  Private (Admin)
exports.deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        // Also clean up connections?
        await Connection.deleteMany({
            $or: [{ requester: req.params.id }, { recipient: req.params.id }]
        });

        res.json({ msg: 'User deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Simulate Payment (For testing/manual entry by admin if needed, or user action)
// @route   POST api/admin/pay
// @access  Private
exports.logPayment = async (req, res) => {
    try {
        const { userId, amount } = req.body;

        const transaction = new Transaction({
            user: userId,
            amount,
            status: 'completed',
            paymentMethod: 'Manual/System'
        });

        await transaction.save();

        // Upgrade user
        await User.findByIdAndUpdate(userId, {
            subscriptionStatus: 'premium',
            subscriptionExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
        });

        res.json(transaction);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
