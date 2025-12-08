const express = require('express');
const ProfileController = require('../controllers/user/ProfileController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();
const { validateIdMiddleware } = require('../middleware/validateIdMiddleware');
const { validationMiddleware } = require('../middleware/validationMiddleware');
const { asyncHandler } = require('../middleware/errorHandlingMiddleware');

router.put('/supplier/preferences', authMiddleware, (req, res) =>
  ProfileController.updateSupplierPreferences(req, res)
);

router.get('/supplier/preferences', authMiddleware, (req, res) =>
  ProfileController.getSupplierPreferences(req, res)
);

// ✅ FIX: Ensure ProfileController.updateProfile is a function
router.put('/', authMiddleware, asyncHandler(async (req, res) => {
  if (typeof ProfileController.updateProfile === 'function') {
    return ProfileController.updateProfile(req, res);
  }
  throw new Error('ProfileController.updateProfile is not a function');
}));

module.exports = router;