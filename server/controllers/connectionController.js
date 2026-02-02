const Connection = require('../models/Connection');
const User = require('../models/User');

// @desc    Send a connection request
// @route   POST api/connections/request
// @access  Private
exports.sendRequest = async (req, res) => {
    try {
        const { recipientId, introMessage } = req.body;
        const requesterId = req.user.id;

        // Check if user is Premium
        const requester = await User.findById(requesterId);
        if (requester.subscriptionStatus !== 'premium') {
            return res.status(403).json({
                msg: 'Upgrade to Premium to send connection requests',
                code: 'PREMIUM_REQUIRED'
            });
        }

        if (requesterId === recipientId) {
            return res.status(400).json({ msg: 'Cannot send request to yourself' });
        }

        // Check if connection already exists
        let connection = await Connection.findOne({
            $or: [
                { requester: requesterId, recipient: recipientId },
                { requester: recipientId, recipient: requesterId }
            ]
        });

        if (connection) {
            if (connection.status === 'pending') {
                return res.status(400).json({ msg: 'Connection request already pending' });
            }
            if (connection.status === 'accepted') {
                return res.status(400).json({ msg: 'Already connected' });
            }
            // If rejected, maybe allow retry? For now, block.
            if (connection.status === 'rejected') {
                return res.status(400).json({ msg: 'Connection request was rejected' });
            }
        }

        connection = new Connection({
            requester: requesterId,
            recipient: recipientId,
            introMessage,
            status: 'pending'
        });

        await connection.save();
        res.json(connection);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Accept a connection request
// @route   PUT api/connections/accept/:id
// @access  Private
exports.acceptRequest = async (req, res) => {
    try {
        const connectionId = req.params.id;

        // Find connection where current user is the recipient
        let connection = await Connection.findOne({
            _id: connectionId,
            recipient: req.user.id
        });

        if (!connection) {
            return res.status(404).json({ msg: 'Connection request not found' });
        }

        if (connection.status !== 'pending') {
            return res.status(400).json({ msg: 'Request already handled' });
        }

        connection.status = 'accepted';
        connection.updatedAt = Date.now();
        await connection.save();

        res.json(connection);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Reject a connection request
// @route   PUT api/connections/reject/:id
// @access  Private
exports.rejectRequest = async (req, res) => {
    try {
        const connectionId = req.params.id;

        let connection = await Connection.findOne({
            _id: connectionId,
            recipient: req.user.id
        });

        if (!connection) {
            return res.status(404).json({ msg: 'Connection request not found' });
        }

        if (connection.status !== 'pending') {
            return res.status(400).json({ msg: 'Request already handled' });
        }

        connection.status = 'rejected';
        connection.updatedAt = Date.now();
        await connection.save();

        res.json({ msg: 'Connection request rejected' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get pending requests for current user (Received)
// @route   GET api/connections/requests
// @access  Private
exports.getPendingRequests = async (req, res) => {
    try {
        const requests = await Connection.find({
            recipient: req.user.id,
            status: 'pending'
        })
            .populate('requester', 'name basicDetails.photoUrl age gender profession') // Adjust fields as needed
            .sort({ createdAt: -1 });

        res.json(requests);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get request history (Accepted/Rejected) for current user (Received)
// @route   GET api/connections/history
// @access  Private
exports.getRequestsHistory = async (req, res) => {
    try {
        const history = await Connection.find({
            recipient: req.user.id,
            status: { $in: ['accepted', 'rejected'] }
        })
            .populate('requester', 'name basicDetails.photoUrl age gender profession')
            .sort({ updatedAt: -1 });

        res.json(history);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get connection status with a specific user
// @route   GET api/connections/status/:userId
// @access  Private
exports.getConnectionStatus = async (req, res) => {
    try {
        const targetUserId = req.params.userId;
        const currentUserId = req.user.id;

        const connection = await Connection.findOne({
            $or: [
                { requester: currentUserId, recipient: targetUserId },
                { requester: targetUserId, recipient: currentUserId }
            ]
        });

        if (!connection) {
            return res.json({ status: 'none' });
        }

        // Return status relative to current user (e.g., did I send it or receive it?)
        // simplified response for now
        res.json({
            status: connection.status,
            requestId: connection._id,
            isSender: connection.requester.toString() === currentUserId
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
