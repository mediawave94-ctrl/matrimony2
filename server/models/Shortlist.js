const mongoose = require('mongoose');

const ShortlistSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    target: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Avoid duplicate shortlists
ShortlistSchema.index({ user: 1, target: 1 }, { unique: true });

module.exports = mongoose.model('Shortlist', ShortlistSchema);
