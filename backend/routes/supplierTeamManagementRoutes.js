
const express = require('express');
const router = express.Router();
const SupplierTeamManagementService = require('../services/SupplierTeamManagementService');
const { authMiddleware } = require('../middleware/authMiddleware');
const { sendOk, sendError } = require('../utils/responseHelper');

// Get all team members
router.get('/', authMiddleware, async (req, res) => {
  try {
    const supplierId = req.user.id;
    const result = await SupplierTeamManagementService.getTeamMembers(supplierId);
    return sendOk(res, result.members, 'Team members retrieved successfully');
  } catch (error) {
    return sendError(res, error.message, 500);
  }
});

// Get team statistics
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const supplierId = req.user.id;
    const result = await SupplierTeamManagementService.getTeamStats(supplierId);
    return sendOk(res, result.stats, 'Team stats retrieved successfully');
  } catch (error) {
    return sendError(res, error.message, 500);
  }
});

// Add new team member
router.post('/', authMiddleware, async (req, res) => {
  try {
    const supplierId = req.user.id;
    const result = await SupplierTeamManagementService.addTeamMember(supplierId, req.body);
    
    if (!result.success) {
      return sendError(res, result.error, 400);
    }
    
    return sendOk(res, result.member, 'Team member added successfully', 201);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
});

// Update team member
router.put('/:memberId', authMiddleware, async (req, res) => {
  try {
    const { memberId } = req.params;
    const supplierId = req.user.id;
    const result = await SupplierTeamManagementService.updateTeamMember(memberId, supplierId, req.body);
    
    if (!result.success) {
      return sendError(res, result.error, 404);
    }
    
    return sendOk(res, result.member, 'Team member updated successfully');
  } catch (error) {
    return sendError(res, error.message, 500);
  }
});

// Remove team member
router.delete('/:memberId', authMiddleware, async (req, res) => {
  try {
    const { memberId } = req.params;
    const supplierId = req.user.id;
    const result = await SupplierTeamManagementService.removeTeamMember(memberId, supplierId);
    
    if (!result.success) {
      return sendError(res, result.error, 404);
    }
    
    return sendOk(res, null, 'Team member removed successfully');
  } catch (error) {
    return sendError(res, error.message, 500);
  }
});

module.exports = router;
