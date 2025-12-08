const express = require('express');
const router = express.Router();
const { adminAuth, isSuperAdmin } = require('../middleware/adminMiddleware');
const { asyncHandler } = require('../middleware/errorHandlingMiddleware');
const { validateObjectId } = require('../middleware/validateIdMiddleware');

// Resolve AdminController from DI Container
const { container } = require('../core/Container');

// ============================================================================
// ADMIN ROUTES - Enhanced with Advanced Features
// ============================================================================

// Dashboard & Analytics
router.get('/dashboard', adminAuth, asyncHandler(async (req, res) => {
  const AdminController = require('../controllers/admin/AdminController');
  const adminController = new AdminController();
  return adminController.getDashboard(req, res);
}));

router.get('/dashboard/stats', adminAuth, asyncHandler(async (req, res) => {
  const AdminController = require('../controllers/admin/AdminController');
  const adminController = new AdminController();
  return adminController.getHealthDashboard(req, res);
}));

router.get('/analytics', adminAuth, asyncHandler(async (req, res) => {
  const AdminController = require('../controllers/admin/AdminController');
  const adminController = new AdminController();
  return adminController.getAnalytics(req, res);
}));

router.get('/metrics', adminAuth, asyncHandler(async (req, res) => {
  const AdminController = require('../controllers/admin/AdminController');
  const adminController = new AdminController();
  return adminController.getAdminPerformance(req, res);
}));

router.get('/monitoring', adminAuth, asyncHandler(async (req, res) => {
  const AdminController = require('../controllers/admin/AdminController');
  const adminController = new AdminController();
  return adminController.getHealthDashboard(req, res);
}));

// ===== Gestion des utilisateurs =====
router.get('/users', adminAuth, asyncHandler(async (req, res) => {
  const AdminController = require('../controllers/admin/AdminController');
  const adminController = new AdminController();
  return adminController.getAllUsers(req, res);
}));

router.put('/users/:id/status', adminAuth, validateObjectId('id'), asyncHandler(async (req, res) => {
  const AdminController = require('../controllers/admin/AdminController');
  const adminController = new AdminController();
  return adminController.toggleUserStatus(req, res);
}));

// Content management routes removed - not implemented in AdminController

// ===== Configuration du système =====
router.get('/config', adminAuth, asyncHandler(async (req, res) => {
  const AdminController = require('../controllers/admin/AdminController');
  const adminController = new AdminController();
  return adminController.getPlatformConfig(req, res);
}));

router.put('/config', adminAuth, asyncHandler(async (req, res) => {
  const AdminController = require('../controllers/admin/AdminController');
  const adminController = new AdminController();
  return adminController.updatePlatformConfig(req, res);
}));

// ===== Analyses et surveillance =====
router.get('/analytics/activities', adminAuth, asyncHandler(async (req, res) => {
  const AdminController = require('../controllers/admin/AdminController');
  const adminController = new AdminController();
  return adminController.getRecentActivities(req, res);
}));

router.get('/analytics/users', adminAuth, asyncHandler(async (req, res) => {
  const AdminController = require('../controllers/admin/AdminController');
  const adminController = new AdminController();
  return adminController.getUserStatistics(req, res);
}));

router.get('/analytics/performance', adminAuth, asyncHandler(async (req, res) => {
  const AdminController = require('../controllers/admin/AdminController');
  const adminController = new AdminController();
  return adminController.getAdminPerformance(req, res);
}));

router.get('/analytics/assistants', adminAuth, asyncHandler(async (req, res) => {
  const AdminController = require('../controllers/admin/AdminController');
  const adminController = new AdminController();
  return adminController.getAdminAssistantsStats(req, res);
}));

// ===== Gestion des abonnements =====
// Assuming SubscriptionAdminController and AdvertisementController are injected or managed appropriately
// For now, keeping direct instantiation/requiring, but ideally injected via DI.
const SubscriptionAdminController = require('../controllers/admin/SubscriptionAdminController');
const AdvertisementController = require('../controllers/admin/AdvertisementController');

router.get('/subscriptions/plans', adminAuth, asyncHandler(SubscriptionAdminController.getAllPlans));
router.post('/subscriptions/plans', adminAuth, asyncHandler(SubscriptionAdminController.createPlan));
router.put('/subscriptions/plans/:id', adminAuth, validateObjectId('id'), asyncHandler(SubscriptionAdminController.updatePlan));
router.delete('/subscriptions/plans/:id', adminAuth, validateObjectId('id'), asyncHandler(SubscriptionAdminController.deletePlan));
router.get('/subscriptions/analytics', adminAuth, asyncHandler(SubscriptionAdminController.getSubscriptionAnalytics));

// ===== Gestion des publicités =====
router.get('/advertisements', adminAuth, asyncHandler(AdvertisementController.getAllAds));
router.post('/advertisements', adminAuth, asyncHandler(AdvertisementController.createAd));
router.put('/advertisements/:id', adminAuth, validateObjectId('id'), asyncHandler(AdvertisementController.updateAd));
router.delete('/advertisements/:id', adminAuth, validateObjectId('id'), asyncHandler(AdvertisementController.deleteAd));
router.get('/advertisements/:id/analytics', adminAuth, validateObjectId('id'), asyncHandler(AdvertisementController.getAdAnalytics));

// ===== Audit logs export =====
router.get('/audit/export', adminAuth, asyncHandler(async (req, res) => {
  const AdminController = require('../controllers/admin/AdminController');
  const adminController = new AdminController();
  return adminController.exportAuditLogs(req, res);
}));

// ===== User Management Actions =====
router.get('/users/:userId', adminAuth, validateObjectId('userId'), asyncHandler(async (req, res) => {
  const AdminController = require('../controllers/admin/AdminController');
  const adminController = new AdminController();
  return adminController.getUserDetails(req, res);
}));

router.put('/users/:userId/role', adminAuth, validateObjectId('userId'), asyncHandler(async (req, res) => {
  const AdminController = require('../controllers/admin/AdminController');
  const adminController = new AdminController();
  return adminController.updateUserRole(req, res);
}));

router.post('/users/:userId/block', adminAuth, validateObjectId('userId'), asyncHandler(async (req, res) => {
  const AdminController = require('../controllers/admin/AdminController');
  const adminController = new AdminController();
  return adminController.blockUser(req, res);
}));

router.post('/users/:userId/unblock', adminAuth, validateObjectId('userId'), asyncHandler(async (req, res) => {
  const AdminController = require('../controllers/admin/AdminController');
  const adminController = new AdminController();
  return adminController.unblockUser(req, res);
}));

router.delete('/users/:userId', adminAuth, validateObjectId('userId'), asyncHandler(async (req, res) => {
  const AdminController = require('../controllers/admin/AdminController');
  const adminController = new AdminController();
  return adminController.deleteUser(req, res);
}));

router.post('/users/:userId/reset-password', adminAuth, validateObjectId('userId'), asyncHandler(async (req, res) => {
  const AdminController = require('../controllers/admin/AdminController');
  const adminController = new AdminController();
  return adminController.resetUserPassword(req, res);
}));

module.exports = router;