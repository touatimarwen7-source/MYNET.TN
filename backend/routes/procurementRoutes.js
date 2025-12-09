// ============================================================================
// PROCUREMENT ROUTES
// ============================================================================

const express = require('express');
const router = express.Router();
const { authMiddleware, roleMiddleware, requireOwnership } = require('../middleware/authMiddleware');
const TenderController = require('../controllers/procurement/TenderController');
const OfferController = require('../controllers/procurement/OfferController');
const { validateTenderCreation } = require('../middleware/criticalOperationsValidator');

// Tender routes
router.post('/tenders', verifyToken, validateTenderCreation, TenderController.createTender.bind(TenderController));
router.get('/tenders', (req, res, next) => {
  // Normaliser et valider les paramètres de pagination
  try {
    // Convertir en string pour parsing sécurisé
    if (req.query.page !== undefined) {
      req.query.page = String(req.query.page).trim();
    }
    if (req.query.limit !== undefined) {
      req.query.limit = String(req.query.limit).trim();
    }
    // Normaliser is_public
    if (req.query.is_public !== undefined) {
      const val = String(req.query.is_public).toLowerCase().trim();
      if (val === 'true' || val === '1') {
        req.query.is_public = 'true';
      } else if (val === 'false' || val === '0') {
        req.query.is_public = 'false';
      }
    }
    next();
  } catch (err) {
    return res.status(400).json({
      success: false,
      error: 'Paramètres de requête invalides',
      code: 'INVALID_QUERY_PARAMS'
    });
  }
}, TenderController.getAllTenders.bind(TenderController));
router.get('/tenders/:id', TenderController.getTender.bind(TenderController));
router.put('/tenders/:id', verifyToken, requireOwnership, TenderController.updateTender.bind(TenderController));
router.delete('/tenders/:id', verifyToken, requireOwnership, TenderController.deleteTender.bind(TenderController));
router.post('/tenders/:id/publish', verifyToken, TenderController.publishTender.bind(TenderController));
router.post('/tenders/:id/close', verifyToken, TenderController.closeTender.bind(TenderController));
router.post('/tenders/:id/award', verifyToken, TenderController.awardTender.bind(TenderController));
router.get('/tenders/:id/statistics', TenderController.getTenderStatistics.bind(TenderController));
router.get('/my-tenders', verifyToken, TenderController.getMyTenders.bind(TenderController));

// Offer routes
router.post('/offers', verifyToken, OfferController.createOffer.bind(OfferController));
router.get('/offers/:id', verifyToken, OfferController.getOffer.bind(OfferController));

// ============================================================================
// BUYER DASHBOARD ENDPOINTS
// ============================================================================

/**
 * @route   GET /api/procurement/buyer/dashboard-stats
 * @desc    Get buyer dashboard statistics
 * @access  Private (Buyer)
 */
router.get('/buyer/dashboard-stats', authMiddleware, asyncHandler(async (req, res) => {
  const userId = req.user.id;

  try {
    // Get statistics from database
    const statsQuery = `
      SELECT 
        (SELECT COUNT(*) FROM tenders WHERE buyer_id = $1 AND status = 'published') as active_tenders,
        (SELECT COUNT(*) FROM tenders WHERE buyer_id = $1 AND status = 'draft') as draft_tenders,
        (SELECT COUNT(*) FROM offers WHERE tender_id IN (SELECT id FROM tenders WHERE buyer_id = $1)) as total_offers,
        (SELECT COUNT(*) FROM tenders WHERE buyer_id = $1 AND status = 'awarded') as awarded_tenders
    `;

    const result = await pool.query(statsQuery, [userId]);

    res.json({
      success: true,
      data: result.rows[0] || {
        active_tenders: 0,
        draft_tenders: 0,
        total_offers: 0,
        awarded_tenders: 0
      }
    });
  } catch (error) {
    logger.error('Error fetching buyer dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في تحميل الإحصائيات'
    });
  }
}));

/**
 * @route   GET /api/procurement/buyer/analytics
 * @desc    Get buyer analytics data
 * @access  Private (Buyer)
 */
router.get('/buyer/analytics', authMiddleware, asyncHandler(async (req, res) => {
  const userId = req.user.id;

  try {
    // Get analytics from database
    const analyticsQuery = `
      SELECT 
        DATE_TRUNC('month', created_at) as month,
        COUNT(*) as tender_count,
        SUM(CASE WHEN status = 'awarded' THEN 1 ELSE 0 END) as awarded_count
      FROM tenders
      WHERE buyer_id = $1
      AND created_at >= NOW() - INTERVAL '6 months'
      GROUP BY DATE_TRUNC('month', created_at)
      ORDER BY month DESC
      LIMIT 6
    `;

    const result = await pool.query(analyticsQuery, [userId]);

    res.json({
      success: true,
      data: result.rows || []
    });
  } catch (error) {
    logger.error('Error fetching buyer analytics:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في تحميل التحليلات'
    });
  }
}));

// ============================================================================
// SUPPLIER DASHBOARD ENDPOINTS
// ============================================================================

/**
 * @route   GET /api/procurement/supplier/dashboard-stats
 * @desc    Get supplier dashboard statistics
 * @access  Private (Supplier)
 */
router.get('/supplier/dashboard-stats', authMiddleware, asyncHandler(async (req, res) => {
  const userId = req.user.id;

  try {
    const statsQuery = `
      SELECT 
        (SELECT COUNT(*) FROM offers WHERE supplier_id = $1 AND status = 'submitted') as active_offers,
        (SELECT COUNT(*) FROM offers WHERE supplier_id = $1 AND status = 'draft') as draft_offers,
        (SELECT COUNT(*) FROM offers WHERE supplier_id = $1 AND status = 'accepted') as won_offers,
        (SELECT COUNT(DISTINCT tender_id) FROM offers WHERE supplier_id = $1) as participated_tenders
    `;

    const result = await pool.query(statsQuery, [userId]);

    res.json({
      success: true,
      data: result.rows[0] || {
        active_offers: 0,
        draft_offers: 0,
        won_offers: 0,
        participated_tenders: 0
      }
    });
  } catch (error) {
    logger.error('Error fetching supplier dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في تحميل الإحصائيات'
    });
  }
}));

/**
 * @route   GET /api/procurement/supplier/analytics
 * @desc    Get supplier analytics data
 * @access  Private (Supplier)
 */
router.get('/supplier/analytics', authMiddleware, asyncHandler(async (req, res) => {
  const userId = req.user.id;

  try {
    const analyticsQuery = `
      SELECT 
        DATE_TRUNC('month', created_at) as month,
        COUNT(*) as offer_count,
        SUM(CASE WHEN status = 'accepted' THEN 1 ELSE 0 END) as won_count
      FROM offers
      WHERE supplier_id = $1
      AND created_at >= NOW() - INTERVAL '6 months'
      GROUP BY DATE_TRUNC('month', created_at)
      ORDER BY month DESC
      LIMIT 6
    `;

    const result = await pool.query(analyticsQuery, [userId]);

    res.json({
      success: true,
      data: result.rows || []
    });
  } catch (error) {
    logger.error('Error fetching supplier analytics:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في تحميل التحليلات'
    });
  }
}));

// ============================================================================
// OFFER ROUTES
// ============================================================================

module.exports = router;