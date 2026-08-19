const express = require('express');
const router = express.Router();

const {
  getMyNotifications, markAsRead, markAllAsRead, deleteNotification, registerPushToken, clearPushToken,
} = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getMyNotifications);
router.post('/push-token', registerPushToken);
router.delete('/push-token', clearPushToken);
router.patch('/read-all', markAllAsRead);
router.patch('/:id/read', markAsRead);
router.delete('/:id', deleteNotification);

module.exports = router;
