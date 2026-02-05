const User = require('../models/User');
const calculateMatchScore = require('../utils/matchScorer');
const { calculateTamilMatch } = require('../utils/astrologyMatcher');

exports.getMatches = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user.id);
        if (!currentUser) return res.status(404).json({ msg: 'User not found' });

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

        const query = {
            _id: { $ne: currentUser.id },
            gender: currentUser.targetGender,
            role: { $ne: 'admin' },
            'personality.conflictHandling': { $exists: true, $ne: null },
            'personality.lifestyle': { $exists: true, $ne: null },
            'personality.careerVsFamily': { $exists: true, $ne: null },
            'personality.financialMindset': { $exists: true, $ne: null }
        };

        if (!currentUser.gender) {
            return res.status(400).json({ msg: 'Please complete your profile gender settings' });
        }

        const candidates = await User.find(query).limit(10);

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

        const matches = await Promise.all(candidates.map(async (candidate) => {
            const score = calculateMatchScore(currentUser, candidate);
            const unreadCount = await Message.countDocuments({
                sender: candidate._id,
                recipient: currentUser.id,
                isRead: false
            });

            // Astrology Match Score
            let astroScore = 0;
            const fs = require('fs');
            if (currentUser.astrological?.natchathiram && candidate.astrological?.natchathiram) {
                const boy = currentUser.gender === 'male' ? currentUser.astrological : candidate.astrological;
                const girl = currentUser.gender === 'female' ? currentUser.astrological : candidate.astrological;
                const result = calculateTamilMatch(boy, girl);
                astroScore = result.total || 0;
                fs.appendFileSync('match_debug.log', `Matching ${currentUser.name} as ${currentUser.gender} with ${candidate.name}: Boy(${boy.natchathiram}) Girl(${girl.natchathiram}) -> Score: ${astroScore}\n`);
            } else {
                fs.appendFileSync('match_debug.log', `Skipped matching ${currentUser.name} with ${candidate.name}: selfStar=${!!currentUser.astrological?.natchathiram} targetStar=${!!candidate.astrological?.natchathiram}\n`);
            }

            return {
                _id: candidate._id,
                name: candidate.name,
                age: candidate.age,
                gender: candidate.gender,
                compatibility: score,
                astroScore,
                personality: candidate.personality,
                basicDetails: candidate.basicDetails,
                astrological: candidate.astrological,
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

exports.getAllMatches = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user.id);
        if (!currentUser) return res.status(404).json({ msg: 'User not found' });

        const { minAge, maxAge, religion, caste, city, occupation, rassi, natchathiram, dosham } = req.query;

        const query = {
            _id: { $ne: currentUser.id },
            gender: currentUser.targetGender,
            role: { $ne: 'admin' },
        };

        if (minAge || maxAge) {
            query.age = {};
            if (minAge) query.age.$gte = parseInt(minAge);
            if (maxAge) query.age.$lte = parseInt(maxAge);
        }

        if (religion) query['religious.religion'] = religion;
        if (caste) query['religious.caste'] = caste;
        if (city) query['location.city'] = new RegExp(city, 'i');
        if (occupation) query['professional.occupation'] = occupation;

        // Astrology Filters
        if (rassi) query['astrological.rassi'] = rassi;
        if (natchathiram) query['astrological.natchathiram'] = natchathiram;
        if (dosham) query['astrological.dosham'] = dosham;

        const candidates = await User.find(query);

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

        const matches = await Promise.all(candidates.map(async (candidate) => {
            const score = calculateMatchScore(currentUser, candidate);
            const unreadCount = await Message.countDocuments({
                sender: candidate._id,
                recipient: currentUser.id,
                isRead: false
            });

            // Astrology Match Score
            let astroScore = 0;
            if (currentUser.astrological?.natchathiram && candidate.astrological?.natchathiram) {
                const boy = currentUser.gender === 'male' ? currentUser.astrological : candidate.astrological;
                const girl = currentUser.gender === 'female' ? currentUser.astrological : candidate.astrological;
                astroScore = calculateTamilMatch(boy, girl).total || 0;
            }

            return {
                _id: candidate._id,
                name: candidate.name,
                age: candidate.age,
                gender: candidate.gender,
                compatibility: score,
                astroScore,
                personality: candidate.personality,
                basicDetails: candidate.basicDetails,
                astrological: candidate.astrological,
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
