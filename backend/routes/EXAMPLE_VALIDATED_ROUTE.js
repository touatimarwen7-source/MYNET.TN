
/**
 * 🎓 EXAMPLE: Fully Validated Route
 * نموذج مثالي لملف Routes يتبع جميع معايير الأمان والتحقق
 */

const express = require('express');
const router = express.Router();

// ✅ STEP 1: Import middleware correctly (Named Imports)
const { verifyToken, checkRole } = require('../middleware/authMiddleware');
const { validationMiddleware } = require('../middleware/validationMiddleware');
const { validateIdMiddleware } = require('../middleware/validateIdMiddleware');
const { procurementValidators } = require('../middleware/endpointValidators');

// ✅ STEP 2: Apply global input sanitization
router.use(validationMiddleware);

// ============================================================================
// PUBLIC ROUTES (No Authentication)
// ============================================================================

/**
 * GET /api/example/public
 * مسار عام بدون مصادقة
 */
router.get('/public', async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Public data',
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================================================
// PROTECTED ROUTES (Authentication Required)
// ============================================================================

/**
 * GET /api/example/data
 * مسار محمي - يتطلب مصادقة فقط
 */
router.get('/data', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    res.json({
      success: true,
      userId,
      data: 'Protected data',
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/example/:id
 * مسار محمي بمعرّف - يتحقق من صحة ID
 */
router.get(
  '/:id',
  validateIdMiddleware('id'), // ✅ Validate ID format
  verifyToken, // ✅ Authenticate user
  async (req, res) => {
    try {
      const { id } = req.params;
      const db = req.app.get('db');

      const result = await db.query('SELECT * FROM example_table WHERE id = $1', [id]);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Resource not found' });
      }

      res.json({
        success: true,
        data: result.rows[0],
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// ============================================================================
// DATA SUBMISSION ROUTES (POST/PUT with Validation)
// ============================================================================

/**
 * POST /api/example
 * إنشاء موارد جديدة مع التحقق الكامل
 */
router.post('/create', verifyToken, async (req, res) => {
  try {
    // ✅ STEP 3: Server-side validation (even if frontend validates)
    const errors = procurementValidators.createTender(req.body);
    if (errors) {
      return res.status(400).json({
        success: false,
        errors,
      });
    }

    const { title, description, budget } = req.body;
    const db = req.app.get('db');

    // ✅ STEP 4: Use parameterized queries (SQL injection prevention)
    const result = await db.query(
      'INSERT INTO example_table (title, description, budget, created_by) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, description, budget, req.user.id]
    );

    res.status(201).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * PUT /api/example/:id
 * تحديث موارد موجودة مع التحقق الكامل
 */
router.put(
  '/:id',
  validateIdMiddleware('id'), // ✅ Validate ID
  verifyToken, // ✅ Authenticate
  async (req, res) => {
    try {
      const { id } = req.params;

      // ✅ Validate input data
      if (!req.body.title || req.body.title.trim().length < 5) {
        return res.status(400).json({
          success: false,
          error: 'Le titre doit contenir au moins 5 caractères',
        });
      }

      const db = req.app.get('db');

      // ✅ Check ownership before update
      const ownerCheck = await db.query(
        'SELECT created_by FROM example_table WHERE id = $1',
        [id]
      );

      if (ownerCheck.rows.length === 0) {
        return res.status(404).json({ error: 'Resource not found' });
      }

      if (ownerCheck.rows[0].created_by !== req.user.id) {
        return res.status(403).json({ error: 'Not authorized to update this resource' });
      }

      // ✅ Perform update
      const result = await db.query(
        'UPDATE example_table SET title = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
        [req.body.title, id]
      );

      res.json({
        success: true,
        data: result.rows[0],
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// ============================================================================
// ADMIN-ONLY ROUTES (Role-based Access Control)
// ============================================================================

/**
 * DELETE /api/example/:id
 * حذف موارد - للمشرفين فقط
 */
router.delete(
  '/:id',
  validateIdMiddleware('id'),
  verifyToken,
  checkRole(['admin', 'super_admin']), // ✅ Role-based access
  async (req, res) => {
    try {
      const { id } = req.params;
      const db = req.app.get('db');

      const result = await db.query('DELETE FROM example_table WHERE id = $1 RETURNING *', [id]);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Resource not found' });
      }

      res.json({
        success: true,
        message: 'Resource deleted successfully',
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

module.exports = router;
