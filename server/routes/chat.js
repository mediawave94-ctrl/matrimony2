const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const auth = require('../middleware/auth');

router.get('/conversations/all', auth, chatController.getConversations);
router.get('/unread-total', auth, chatController.getTotalUnread);
router.get('/:userId', auth, chatController.getMessages);
router.post('/send', auth, chatController.sendMessage);
router.put('/mark-read/:userId', auth, chatController.markAsRead);

module.exports = router;
