
const express = require('express');
const router = express.Router();
const { getPool, getPoolMetrics } = require('../config/db');
const { getCacheManager } = require('../utils/redisCache');

/**
 * 🏥 نقطة نهاية فحص الصحة الشامل
 * GET /api/health
 */
router.get('/', async (req, res) => {
  const healthStatus = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    components: {}
  };

  try {
    // فحص قاعدة البيانات
    const pool = getPool();
    const dbResult = await pool.query('SELECT NOW() as current_time');
    const poolMetrics = getPoolMetrics();
    
    healthStatus.components.database = {
      status: 'healthy',
      responseTime: dbResult.duration || 'N/A',
      poolMetrics: {
        total: poolMetrics.totalConnections,
        active: poolMetrics.activeConnections,
        errors: poolMetrics.errors
      }
    };
  } catch (dbError) {
    healthStatus.status = 'degraded';
    healthStatus.components.database = {
      status: 'unhealthy',
      error: dbError.message
    };
  }

  try {
    // فحص الكاش
    const cacheManager = getCacheManager();
    const cacheStats = cacheManager.getStats();
    
    healthStatus.components.cache = {
      status: 'healthy',
      stats: cacheStats
    };
  } catch (cacheError) {
    healthStatus.components.cache = {
      status: 'degraded',
      error: cacheError.message
    };
  }

  // تحديد رمز الحالة HTTP
  const statusCode = healthStatus.status === 'healthy' ? 200 : 503;
  
  res.status(statusCode).json(healthStatus);
});

/**
 * 🔍 فحص الجاهزية - للاستخدام مع Kubernetes/Docker
 * GET /api/health/ready
 */
router.get('/ready', async (req, res) => {
  try {
    const pool = getPool();
    await pool.query('SELECT 1');
    res.status(200).json({ ready: true });
  } catch (error) {
    res.status(503).json({ ready: false, error: error.message });
  }
});

/**
 * 💓 فحص النشاط - للاستخدام مع Load Balancers
 * GET /api/health/live
 */
router.get('/live', (req, res) => {
  res.status(200).json({ alive: true, uptime: process.uptime() });
});

module.exports = router;
