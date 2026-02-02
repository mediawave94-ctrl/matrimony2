const User = require('../models/User');
const calculateMatchScore = require('../utils/matchScorer');

exports.getMatches = async (req, res) => {
    try {
        // Assume req.user.id is populated by auth middleware (need to create/use it)
        const currentUser = await User.findById(req.user.id);
        if (!currentUser) return res.status(404).json({ msg: 'User not found' });

        // Check if current user has completed ALL personality quiz sections
        if (!currentUser.personality ||
            !currentUser.personality.conflictHandling ||
            !currentUser.personality.lifestyle ||
            !currentUser.personality.careerVsFamily ||
            !currentUser.personality.financialMindset
        ) {
            return res.status(400).json({
                msg: 'Personality quiz not completed',
                code: 'QUIZ_REQUIRED'
            });
        }

        // Find potential matches
        // Filter: Opposite gender (or targetGender), Not self, Has COMPLETED Personality
        const query = {
            _id: { $ne: currentUser.id }, // Exclude self
            gender: currentUser.targetGender, // Strict opposite match for now
            role: { $ne: 'admin' }, // Exclude admin
            'personality.conflictHandling': { $exists: true, $ne: null },
            'personality.lifestyle': { $exists: true, $ne: null },
            'personality.careerVsFamily': { $exists: true, $ne: null },
            'personality.financialMindset': { $exists: true, $ne: null }
        };

        // Check if target is 'both' or missing, maybe relax? Keeping strict 400 for now if gender missing.
        if (!currentUser.gender) {
            return res.status(400).json({ msg: 'Please complete your profile gender settings' });
        }

        const candidates = await User.find(query).limit(10); // Limit to 10 for "Slow Match"

        // Fetch all connections for this user to map status
        const Connection = require('../models/Connection');
        const connections = await Connection.find({
            $or: [{ requester: currentUser.id }, { recipient: currentUser.id }]
        });

        const connectionMap = {};
        connections.forEach(conn => {
            const otherId = conn.requester.toString() === currentUser.id
                ? conn.recipient.toString()
                : conn.requester.toString();
            connectionMap[otherId] = conn.status;
        });

        const Message = require('../models/Message');

        // Calculate Scores
        const matches = await Promise.all(candidates.map(async (candidate) => {
            const score = calculateMatchScore(currentUser, candidate);
            const unreadCount = await Message.countDocuments({
                sender: candidate._id,
                recipient: currentUser.id,
                isRead: false
            });

            return {
                _id: candidate._id,
                name: candidate.name, // In real app, name might be hidden?
                age: candidate.age,
                gender: candidate.gender,
                compatibility: score,
                personality: candidate.personality, // Expose traits for UI
                basicDetails: candidate.basicDetails,
                subscriptionStatus: candidate.subscriptionStatus,
                connectionStatus: connectionMap[candidate._id.toString()] || 'none',
                unreadCount
            };
        }));

        // Sort by highest compatibility
        matches.sort((a, b) => b.compatibility.total - a.compatibility.total);

        res.json(matches);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.getAllMatches = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user.id);
        if (!currentUser) return res.status(404).json({ msg: 'User not found' });

        // No strict personality check for "All Profiles"
        // We just want to see "opposite gender" (or target gender)

        // Parse Filters
        const { minAge, maxAge, religion, caste, city, occupation } = req.query;

        const query = {
            _id: { $ne: currentUser.id },
            gender: currentUser.targetGender,
            role: { $ne: 'admin' }, // Exclude admin
        };

        if (minAge || maxAge) {
            query.age = {};
            if (minAge) query.age.$gte = parseInt(minAge);
            if (maxAge) query.age.$lte = parseInt(maxAge);
        }

        if (religion) query['religious.religion'] = religion;
        if (caste) query['religious.caste'] = caste;
        if (city) query['location.city'] = new RegExp(city, 'i'); // Case insensitive partial? Or exact? RegExp safer for user input
        if (occupation) query['professional.occupation'] = occupation;

        // Fetch ALL candidates (no limit)
        const candidates = await User.find(query);

        // Fetch all connections
        const Connection = require('../models/Connection');
        const connections = await Connection.find({
            $or: [{ requester: currentUser.id }, { recipient: currentUser.id }]
        });
        const connectionMap = {};
        connections.forEach(conn => {
            const otherId = conn.requester.toString() === currentUser.id
                ? conn.recipient.toString()
                : conn.requester.toString();
            connectionMap[otherId] = conn.status;
        });

        const Message = require('../models/Message');

        // Calculate Scores
        const matches = await Promise.all(candidates.map(async (candidate) => {
            const score = calculateMatchScore(currentUser, candidate);
            const unreadCount = await Message.countDocuments({
                sender: candidate._id,
                recipient: currentUser.id,
                isRead: false
            });

            return {
                _id: candidate._id,
                name: candidate.name,
                age: candidate.age,
                gender: candidate.gender,
                compatibility: score,
                personality: candidate.personality,
                basicDetails: candidate.basicDetails,
                subscriptionStatus: candidate.subscriptionStatus,
                connectionStatus: connectionMap[candidate._id.toString()] || 'none',
                unreadCount
            };
        }));

        matches.sort((a, b) => b.compatibility.total - a.compatibility.total);

        res.json(matches);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
