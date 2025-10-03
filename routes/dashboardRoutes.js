const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/dashboardController');

// Test route
router.get('/test', (req, res) => {
    res.json({ message: 'Dashboard route working' });
});

// @route   GET /api/dashboard/stats
router.get('/stats', getDashboardStats);

module.exports = router;