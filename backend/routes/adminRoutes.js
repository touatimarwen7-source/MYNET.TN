const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin/AdminController');
const { adminAuth, isSuperAdmin } = require('../middleware/adminMiddleware');
const { asyncHandler } = require('../middleware/errorHandlingMiddleware');
const { validateObjectId } = require('../middleware/validateIdMiddleware');
const { adminPermissions } = require('../middleware/adminPermissionsMiddleware');

// ============================================================================
// ADMIN ROUTES - Enhanced with Advanced Features
// ============================================================================

// Dashboard & Analytics
router.get('/dashboard', adminAuth, asyncHandler(adminController.getDashboard));
router.get(
  '/dashboard/stats',
  adminAuth,
  asyncHandler(adminController.getDashboardStats)
);
router.get(
  '/analytics/real-time',
  adminAuth,
  asyncHandler(adminController.getRealTimeAnalytics)
);
router.get(
  '/analytics/predictive',
  adminAuth,
  asyncHandler(adminController.getPredictiveInsights)
);
router.get('/metrics', adminAuth, asyncHandler(adminController.getMetrics));
router.get('/monitoring', adminAuth, asyncHandler(adminController.getSystemMonitoring));

// ===== Gestion des utilisateurs =====
router.get(
  '/users',
  adminAuth,
  adminPermissions(adminPermissions.PERMISSIONS.VIEW_USERS),
  validateObjectId('userId'), // Assuming validation for user ID if needed for specific user operations
  asyncHandler(adminController.getAllUsers)
);

router.get(
  '/users/:userId',
  adminAuth,
  adminPermissions(adminPermissions.PERMISSIONS.VIEW_USERS),
  validateObjectId('userId'),
  asyncHandler(adminController.getUserDetails)
);

router.put(
  '/users/:userId/role',
  adminAuth,
  adminPermissions(adminPermissions.PERMISSIONS.MANAGE_USERS),
  validateObjectId('userId'),
  asyncHandler(adminController.updateUserRole)
);

router.post(
  '/users/:userId/block',
  adminAuth,
  adminPermissions(adminPermissions.PERMISSIONS.BLOCK_USERS),
  validateObjectId('userId'),
  asyncHandler(adminController.blockUser)
);

router.post(
  '/users/:userId/unblock',
  adminAuth,
  adminPermissions(adminPermissions.PERMISSIONS.BLOCK_USERS),
  validateObjectId('userId'),
  asyncHandler(adminController.unblockUser)
);

router.post(
  '/users/:userId/reset-password',
  adminAuth,
  adminPermissions(adminPermissions.PERMISSIONS.MANAGE_USERS),
  validateObjectId('userId'),
  asyncHandler(adminController.resetUserPassword)
);

// ===== Gestion du contenu statique, pages et fichiers =====
// Pages statiques (édition complète)
router.get('/content/pages', adminAuth, asyncHandler(adminController.getAllPages));
router.get('/content/pages/:id', adminAuth, validateObjectId('id'), asyncHandler(adminController.getPageById));
router.post('/content/pages', adminAuth, asyncHandler(adminController.createPage));
router.put('/content/pages/:id', adminAuth, validateObjectId('id'), asyncHandler(adminController.updatePage));
router.patch('/content/pages/:id', adminAuth, validateObjectId('id'), asyncHandler(adminController.patchPage));
router.delete('/content/pages/:id', adminAuth, validateObjectId('id'), asyncHandler(adminController.deletePage));

// Fichiers, images et documents
router.get('/content/files', adminAuth, asyncHandler(adminController.getAllFiles));
router.get('/content/media', adminAuth, asyncHandler(adminController.getAllMedia));
router.post('/content/files', adminAuth, asyncHandler(adminController.uploadFile));
router.post('/content/files/bulk', adminAuth, asyncHandler(adminController.uploadBulkFiles));
router.put('/content/files/:id', adminAuth, validateObjectId('id'), asyncHandler(adminController.updateFile));
router.delete('/content/files/:id', adminAuth, validateObjectId('id'), asyncHandler(adminController.deleteFile));
router.delete('/content/files/bulk', adminAuth, asyncHandler(adminController.deleteBulkFiles));

// Images (optimisées)
router.get('/content/images', adminAuth, asyncHandler(adminController.getAllImages));
router.post('/content/images', adminAuth, asyncHandler(adminController.uploadImage));
router.put('/content/images/:id', adminAuth, validateObjectId('id'), asyncHandler(adminController.updateImage));
router.delete('/content/images/:id', adminAuth, validateObjectId('id'), asyncHandler(adminController.deleteImage));

// Documents
router.get('/content/documents', adminAuth, asyncHandler(adminController.getAllDocuments));
router.post('/content/documents', adminAuth, asyncHandler(adminController.uploadDocument));
router.put('/content/documents/:id', adminAuth, validateObjectId('id'), asyncHandler(adminController.updateDocument));
router.delete('/content/documents/:id', adminAuth, validateObjectId('id'), asyncHandler(adminController.deleteDocument));

// Gestion avancée du contenu
router.post('/content/sync', adminAuth, asyncHandler(adminController.syncContent));
router.get('/content/stats', adminAuth, asyncHandler(adminController.getContentStats));
router.post('/content/backup', adminAuth, asyncHandler(adminController.createBackup));
router.post('/content/restore', adminAuth, asyncHandler(adminController.restoreContent));

// ===== Configuration du système =====
router.get('/config', adminAuth, asyncHandler(adminController.getConfig));
router.get('/system/config', adminAuth, asyncHandler(adminController.getSystemConfig));
router.put('/config', adminAuth, asyncHandler(adminController.updateConfig));
router.put('/system/config', adminAuth, asyncHandler(adminController.updateSystemConfig));
router.put('/config/maintenance', adminAuth, asyncHandler(adminController.toggleMaintenanceMode));
router.post('/system/maintenance', adminAuth, asyncHandler(adminController.toggleSystemMaintenance));
router.post('/config/cache/clear', adminAuth, asyncHandler(adminController.clearCache));
router.post('/config/system/restart', adminAuth, asyncHandler(adminController.scheduleSystemRestart));

// ===== Analyses et surveillance =====
router.get('/analytics/stats', adminAuth, asyncHandler(adminController.getAnalyticsStats)); // Assuming this is a distinct route from dashboard stats
router.get('/analytics/health', adminAuth, asyncHandler(adminController.getHealthMetrics)); // Renamed for clarity
router.get('/analytics/activities', adminAuth, asyncHandler(adminController.getRecentActivities)); // Kept as is, assuming it's different from general activities
router.get('/analytics/users', adminAuth, asyncHandler(adminController.getUserStatistics)); // Kept as is
router.get('/analytics/performance', adminAuth, asyncHandler(adminController.getAdminPerformance));
router.get('/analytics/assistants', adminAuth, asyncHandler(adminController.getAdminAssistantsStats));

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

// ===== Routes de compatibilité (anciennes versions) =====
// Replaced with direct calls to AdminController methods for consistency and to leverage potential DI
router.put('/users/:id/block', adminAuth, validateObjectId('id'), asyncHandler(adminController.blockUser)); // Assuming this is the intended functionality for backward compatibility

module.exports = router;