const express = require('express');
const { getUserAnalytics } = require('../controllers/analyticsController');
const router = express.Router();

// Route to get user analytics
router.get('/user/:userId/analytics', getUserAnalytics);

module.exports = router;
