
const express = require('express');
const router = express.Router();
const AuthorizationGuard = require('../security/AuthorizationGuard');
const { isAdmin } = require('../middleware/adminMiddleware');

// Placeholder controller functions
const getAdminDashboard = async (req, res) => {
  res.json({ success: true, message: 'Admin dashboard data' });
};

const getSystemHealth = async (req, res) => {
  res.json({ success: true, health: 'OK' });
};

const getAnalytics = async (req, res) => {
  res.json({ success: true, analytics: {} });
};

// Apply middleware to all routes
router.use(AuthorizationGuard.authenticateToken.bind(AuthorizationGuard));
router.use(isAdmin);

// Admin routes
router.get('/dashboard', getAdminDashboard);
router.get('/health', getSystemHealth);
router.get('/analytics', getAnalytics);

module.exports = router;
