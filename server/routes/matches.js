const express = require('express');
const router = express.Router();
const matchController = require('../controllers/matchController');
const auth = require('../middleware/auth');

// @route   GET api/matches
// @desc    Get matches for current user
// @access  Private
router.get('/', auth, matchController.getMatches);

// @route   GET api/matches/all
// @desc    Get ALL matches for current user (opposite gender)
// @access  Private
router.get('/all', auth, matchController.getAllMatches);

module.exports = router;
