const express = require('express');
const router = express.Router();
const connectionController = require('../controllers/connectionController');
const auth = require('../middleware/auth');

// @route   POST api/connections/request
// @desc    Send a connection request
// @access  Private
router.post('/request', auth, connectionController.sendRequest);

// @route   PUT api/connections/accept/:id
// @desc    Accept a connection request
// @access  Private
router.put('/accept/:id', auth, connectionController.acceptRequest);

// @route   PUT api/connections/reject/:id
// @desc    Reject a connection request
// @access  Private
router.put('/reject/:id', auth, connectionController.rejectRequest);

// @route   GET api/connections/requests
// @desc    Get pending requests for current user (Received)
// @access  Private
router.get('/requests', auth, connectionController.getPendingRequests);

// @route   GET api/connections/history
// @desc    Get request history
// @access  Private
router.get('/history', auth, connectionController.getRequestsHistory);

// @route   GET api/connections/status/:userId
// @desc    Get connection status with a specific user
// @access  Private
router.get('/status/:userId', auth, connectionController.getConnectionStatus);

module.exports = router;
