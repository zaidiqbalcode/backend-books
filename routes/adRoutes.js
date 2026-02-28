const express = require('express');
const router = express.Router();
const { trackEvent, getAnalytics } = require('../controllers/adController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public route for tracking (can be called without auth)
router.post('/track', trackEvent);

// Protected admin route for analytics
router.get('/analytics', protect, admin, getAnalytics);

module.exports = router;
