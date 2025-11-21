const express = require('express');
const FeatureFlagController = require('../controllers/admin/FeatureFlagController');
const authMiddleware = require('../middleware/authMiddleware');
const { checkPermission } = require('../security/AuthorizationGuard');

const router = express.Router();

// Only ADMIN can manage feature flags
router.put('/enable', authMiddleware, checkPermission('manage_features'), (req, res) =>
    FeatureFlagController.enableFeature(req, res)
);

router.put('/disable', authMiddleware, checkPermission('manage_features'), (req, res) =>
    FeatureFlagController.disableFeature(req, res)
);

router.get('/all', authMiddleware, checkPermission('view_features'), (req, res) =>
    FeatureFlagController.getAllFeatures(req, res)
);

router.get('/category/:category', authMiddleware, checkPermission('view_features'), (req, res) =>
    FeatureFlagController.getFeaturesByCategory(req, res)
);

router.get('/:feature_key', authMiddleware, checkPermission('view_features'), (req, res) =>
    FeatureFlagController.getFeatureStatus(req, res)
);

module.exports = router;
