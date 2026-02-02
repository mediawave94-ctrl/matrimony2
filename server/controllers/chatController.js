const Message = require('../models/Message');
const User = require('../models/User');

exports.sendMessage = async (req, res) => {
    try {
        const { recipientId, text } = req.body;

        const message = new Message({
            sender: req.user.id,
            recipient: recipientId,
            text
        });

        await message.save();
        res.json(message);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.getMessages = async (req, res) => {
    try {
        const currentUserId = req.user.id;
        const otherUserId = req.params.userId;

        const messages = await Message.find({
            $or: [
                { sender: currentUserId, recipient: otherUserId },
                { sender: otherUserId, recipient: currentUserId }
            ]
        }).sort({ timestamp: 1 });

        res.json(messages);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.getConversations = async (req, res) => {
    try {
        const currentUserId = req.user.id;

        // Find all unique users communicated with
        const messages = await Message.find({
            $or: [{ sender: currentUserId }, { recipient: currentUserId }]
        }).sort({ timestamp: -1 });

        // Extract unique user IDs
        const userIds = new Set();
        messages.forEach(msg => {
            if (msg.sender.toString() !== currentUserId) userIds.add(msg.sender.toString());
            if (msg.recipient.toString() !== currentUserId) userIds.add(msg.recipient.toString());
        });

        // Also include connected users even if no messages yet (from connectionController ideally, but let's query connections too)
        const Connection = require('../models/Connection');
        const connections = await Connection.find({
            $or: [{ requester: currentUserId }, { recipient: currentUserId }],
            status: 'accepted'
        });

        connections.forEach(conn => {
            const otherId = conn.requester.toString() === currentUserId ? conn.recipient.toString() : conn.requester.toString();
            userIds.add(otherId);
        });

        const users = await User.find({ _id: { $in: Array.from(userIds) } }).select('name basicDetails.photoUrl role');

        // Map users to last message and unread count
        const conversations = await Promise.all(users.map(async (user) => {
            const lastMsg = await Message.findOne({
                $or: [
                    { sender: currentUserId, recipient: user._id },
                    { sender: user._id, recipient: currentUserId }
                ]
            }).sort({ timestamp: -1 });

            const unreadCount = await Message.countDocuments({
                sender: user._id,
                recipient: currentUserId,
                isRead: false
            });

            return {
                ...user.toObject(),
                lastMessage: lastMsg,
                unreadCount
            };
        }));

        // Sort by last message timestamp (most recent first)
        conversations.sort((a, b) => {
            const timeA = a.lastMessage ? new Date(a.lastMessage.timestamp).getTime() : 0;
            const timeB = b.lastMessage ? new Date(b.lastMessage.timestamp).getTime() : 0;
            return timeB - timeA;
        });

        res.json(conversations);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.markAsRead = async (req, res) => {
    try {
        const currentUserId = req.user.id;
        const otherUserId = req.params.userId;

        await Message.updateMany(
            { sender: otherUserId, recipient: currentUserId, isRead: false },
            { $set: { isRead: true } }
        );

        res.json({ msg: 'Messages marked as read' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.getTotalUnread = async (req, res) => {
    try {
        const currentUserId = req.user.id;
        const count = await Message.countDocuments({
            recipient: currentUserId,
            isRead: false
        });
        res.json({ count });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
