const express = require('express');
const ClarificationController = require('../controllers/ClarificationController');
// Note: ClarificationController is in the correct location
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// Buyer route to create a clarification request
router.post(
  '/offers/:offerId/clarification',
  authMiddleware,
  roleMiddleware(['buyer']),
  ClarificationController.handleCreateClarification
);

// Supplier route to get their received clarification requests
router.get(
  '/clarifications/received',
  authMiddleware,
  roleMiddleware(['supplier']),
  ClarificationController.handleGetReceivedClarifications
);

// Route for both buyer and supplier to get a specific clarification
router.get(
  '/clarifications/:clarificationId',
  authMiddleware,
  ClarificationController.handleGetClarificationById
);

// Supplier route to respond to a clarification
router.post(
  '/clarifications/:clarificationId/respond',
  authMiddleware,
  roleMiddleware(['supplier']),
  ClarificationController.handleRespondToClarification
);

module.exports = router;
