const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken } = require('../security/AuthorizationGuard');
const { checkRole } = require('../security/AuthorizationGuard');

// جميع مسارات الإدارة محمية - admin فقط
router.use(verifyToken);
router.use(checkRole(['admin']));

// لوحة معلومات الصحة
router.get('/health', adminController.getHealthDashboard);

// تصدير سجلات التدقيق
router.get('/audit-logs/export', adminController.exportAuditLogs);

// لوحة التحكم الرئيسية
router.get('/dashboard', adminController.getDashboard);

module.exports = router;
