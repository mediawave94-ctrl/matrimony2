const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const auth = require('../middleware/auth');

router.post('/send', auth, chatController.sendMessage);
router.get('/:userId', auth, chatController.getMessages);
router.get('/conversations/all', auth, chatController.getConversations);
router.get('/unread-total', auth, chatController.getTotalUnread);
router.put('/mark-read/:userId', auth, chatController.markAsRead);

module.exports = router;
