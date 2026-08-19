const express = require('express');
const router = express.Router();

const {
  getConversations, openConversation, getMessages, sendMessage,
} = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/conversations', getConversations);
router.post('/conversations', openConversation);
router.get('/conversations/:id/messages', getMessages);
router.post('/conversations/:id/messages', sendMessage);

module.exports = router;
