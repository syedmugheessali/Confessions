const express = require('express');
const {
  getStats,
  getUsers,
  updateUserRole,
  getAdminConfessions,
  deleteConfessionAdmin,
} = require('../controllers/adminController');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Moderation & metrics routes (Admins and Moderators)
router.get('/stats', auth, authorize('admin', 'moderator'), getStats);
router.get('/confessions', auth, authorize('admin', 'moderator'), getAdminConfessions);
router.delete('/confessions/:id', auth, authorize('admin', 'moderator'), deleteConfessionAdmin);

// User management routes (Admin only)
router.get('/users', auth, authorize('admin'), getUsers);
router.patch('/users/:id/role', auth, authorize('admin'), updateUserRole);

module.exports = router;
