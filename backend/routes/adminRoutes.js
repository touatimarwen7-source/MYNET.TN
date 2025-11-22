const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');

// جميع مسارات الإدارة محمية - admin فقط
router.use(authMiddleware.verifyToken);
router.use(authMiddleware.checkRole(['admin']));

// ===== لوحة التحكم =====
router.get('/health', adminController.getHealthDashboard);
router.get('/dashboard', adminController.getDashboard);
router.get('/audit-logs/export', adminController.exportAuditLogs);

// ===== إدارة المستخدمين =====
router.get('/users', adminController.getAllUsers);
router.get('/users/:id', adminController.getUserDetails);
router.put('/users/:id/role', adminController.updateUserRole);
router.post('/users/:id/block', adminController.blockUser);
router.post('/users/:id/unblock', adminController.unblockUser);
router.post('/users/:id/reset-password', adminController.resetUserPassword);

// ===== إدارة المحتوى الثابت =====
router.get('/content/pages', adminController.getAllPages);
router.get('/content/pages/:id', adminController.getPageById);
router.put('/content/pages/:id', adminController.updatePage);
router.post('/content/pages', adminController.createPage);
router.delete('/content/pages/:id', adminController.deletePage);

router.get('/content/files', adminController.getAllFiles);
router.post('/content/files', adminController.uploadFile);
router.delete('/content/files/:id', adminController.deleteFile);

// ===== إعدادات النظام =====
router.get('/config', adminController.getSystemConfig);
router.get('/system/config', adminController.getSystemConfig);
router.put('/config', adminController.updateSystemConfig);
router.put('/system/config', adminController.updateSystemConfig);
router.put('/config/maintenance', adminController.toggleMaintenance);
router.post('/system/maintenance', adminController.toggleMaintenance);
router.post('/config/cache/clear', adminController.clearCache);
router.post('/config/system/restart', adminController.restartSystem);

// ===== التحليلات والمراقبة =====
router.get('/analytics/stats', adminController.getAnalyticsStats);
router.get('/analytics/health', adminController.getHealthDashboard);
router.get('/analytics/activities', adminController.getRecentActivities);
router.get('/analytics/users', adminController.getUserStatistics);

// ===== نسخة احتياطية من المسارات القديمة =====
router.put('/users/:id/block', adminController.blockUser);

module.exports = router;
