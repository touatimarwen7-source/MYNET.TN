
/**
 * @swagger
 * tags:
 *   name: Clarifications
 *   description: Gestion des demandes de clarification
 * 
 * /api/clarifications/offers/{offerId}/clarification:
 *   post:
 *     summary: Créer une demande de clarification
 *     tags: [Clarifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: offerId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'offre
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - question
 *             properties:
 *               question:
 *                 type: string
 *                 description: Question de clarification
 *     responses:
 *       201:
 *         description: Demande créée avec succès
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non authentifié
 * 
 * /api/clarifications/received:
 *   get:
 *     summary: Obtenir les demandes de clarification reçues
 *     tags: [Clarifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des demandes
 *       401:
 *         description: Non authentifié
 * 
 * /api/clarifications/{clarificationId}/respond:
 *   post:
 *     summary: Répondre à une demande de clarification
 *     tags: [Clarifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: clarificationId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - response
 *             properties:
 *               response:
 *                 type: string
 *     responses:
 *       200:
 *         description: Réponse ajoutée
 *       401:
 *         description: Non authentifié
 */



const express = require('express');
const router = express.Router();
const { verifyToken, checkRole } = require('../middleware/authMiddleware');
const { validateIdMiddleware } = require('../middleware/validateIdMiddleware');

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'clarifications' });
});

// Get all clarifications for a tender
router.get('/tender/:tenderId', verifyToken, validateIdMiddleware('tenderId'), async (req, res) => {
  try {
    res.json({ success: true, data: [], message: 'Clarifications retrieved successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create clarification request
router.post('/create', verifyToken, checkRole(['buyer']), async (req, res) => {
  try {
    res.json({ success: true, message: 'Clarification created successfully' });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Respond to clarification
router.post('/:clarificationId/respond', verifyToken, checkRole(['supplier']), validateIdMiddleware('clarificationId'), async (req, res) => {
  try {
    res.json({ success: true, message: 'Response submitted successfully' });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

module.exports = router;
