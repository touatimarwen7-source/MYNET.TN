const { getPool } = require('../../config/db');
const UserService = require('../../services/UserService');
const SearchService = require('../../services/SearchService');
const AdvancedAdminService = require('../../services/AdvancedAdminService');
const HealthMonitoringService = require('../../services/HealthMonitoringService');
const PlatformConfigService = require('../../services/PlatformConfigService');
const logger = console;

/**
 * Admin Controller - Unified and cleaned
 */
class AdminController {
  /**
   * Get health dashboard data
   */
  async getHealthDashboard(req, res) {
    try {
      const pool = getPool();

      const healthQuery = `
        SELECT 
          COUNT(*) FILTER (WHERE is_deleted = FALSE) as total_users,
          COUNT(*) FILTER (WHERE role = 'buyer' AND is_deleted = FALSE) as total_buyers,
          COUNT(*) FILTER (WHERE role = 'supplier' AND is_deleted = FALSE) as total_suppliers,
          COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '7 days') as new_users_week
        FROM users
      `;

      const result = await pool.query(healthQuery);
      const stats = result.rows[0];

      res.json({
        success: true,
        data: {
          totalUsers: parseInt(stats.total_users) || 0,
          totalBuyers: parseInt(stats.total_buyers) || 0,
          totalSuppliers: parseInt(stats.total_suppliers) || 0,
          newUsersWeek: parseInt(stats.new_users_week) || 0
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Health dashboard error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch health dashboard',
        message: error.message,
      });
    }
  }

  /**
   * Get admin dashboard statistics
   */
  async getDashboard(req, res) {
    try {
      const pool = getPool();

      const statsQuery = `
        SELECT 
          (SELECT COUNT(*) FROM users WHERE is_deleted = FALSE) as total_users,
          (SELECT COUNT(*) FROM tenders WHERE is_deleted = FALSE) as total_tenders,
          (SELECT COUNT(*) FROM offers WHERE is_deleted = FALSE) as total_offers,
          (SELECT COUNT(*) FROM purchase_orders WHERE is_deleted = FALSE) as total_orders
      `;

      const result = await pool.query(statsQuery);
      const stats = result.rows[0];

      res.status(200).json({
        success: true,
        data: {
          totalUsers: parseInt(stats.total_users) || 0,
          totalTenders: parseInt(stats.total_tenders) || 0,
          totalOffers: parseInt(stats.total_offers) || 0,
          totalOrders: parseInt(stats.total_orders) || 0
        }
      });
    } catch (error) {
      console.error('Dashboard error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch dashboard data',
      });
    }
  }

  /**
   * Get analytics data
   */
  async getAnalytics(req, res) {
    try {
      const pool = getPool();

      const analyticsQuery = `
        SELECT 
          DATE_TRUNC('day', created_at) as date,
          COUNT(*) as count
        FROM users
        WHERE created_at >= NOW() - INTERVAL '30 days'
        GROUP BY DATE_TRUNC('day', created_at)
        ORDER BY date DESC
      `;

      const result = await pool.query(analyticsQuery);

      res.status(200).json({
        success: true,
        data: result.rows
      });
    } catch (error) {
      console.error('Analytics error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch analytics',
      });
    }
  }

  /**
   * Get user statistics
   */
  async getUserStatistics(req, res) {
    try {
      const pool = getPool();

      const statsQuery = `
        SELECT 
          role,
          COUNT(*) as count
        FROM users
        WHERE is_deleted = FALSE
        GROUP BY role
      `;

      const result = await pool.query(statsQuery);

      res.status(200).json({
        success: true,
        data: result.rows
      });
    } catch (error) {
      console.error('User statistics error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch user statistics',
      });
    }
  }

  /**
   * Get recent activities
   */
  async getRecentActivities(req, res) {
    try {
      // التحقق من الصلاحيات
      if (!req.user || !['super_admin', 'admin'].includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          error: 'Unauthorized access'
        });
      }

      // Validation des paramètres
      const limit = Math.min(parseInt(req.query.limit) || 50, 100);
      const offset = Math.max(parseInt(req.query.offset) || 0, 0);

      const pool = getPool();

      const activitiesQuery = `
        SELECT 
          id,
          user_id,
          action,
          created_at
        FROM audit_logs
        ORDER BY created_at DESC
        LIMIT $1 OFFSET $2
      `;

      const result = await pool.query(activitiesQuery, [limit, offset]);

      res.status(200).json({
        success: true,
        data: result.rows,
        meta: {
          limit,
          offset,
          total: result.rowCount
        }
      });
    } catch (error) {
      logger.error('Error fetching activities:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch activities'
      });
    }
  }

  /**
   * Export audit logs
   */
  async exportAuditLogs(req, res) {
    try {
      const { format = 'json' } = req.query;
      const pool = getPool();

      const logsQuery = `
        SELECT * FROM audit_logs
        ORDER BY created_at DESC
      `;

      const result = await pool.query(logsQuery);

      if (format === 'csv') {
        const csv = this._convertToCSV(result.rows);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="audit-logs-${Date.now()}.csv"`);
        res.send(csv);
      } else {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename="audit-logs-${Date.now()}.json"`);
        res.json({
          success: true,
          data: result.rows
        });
      }
    } catch (error) {
      console.error('Export audit logs error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to export audit logs'
      });
    }
  }

  _convertToCSV(data) {
    if (!data || data.length === 0) return '';

    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => 
      Object.values(row).map(val => 
        typeof val === 'string' && val.includes(',') ? `"${val}"` : val
      ).join(',')
    );

    return [headers, ...rows].join('\n');
  }

  /**
   * Get all users
   */
  async getAllUsers(req, res) {
    try {
      const filters = {
        role: req.query.role,
        is_verified: req.query.is_verified,
      };

      const users = await UserService.getAllUsers(filters);

      res.status(200).json({
        success: true,
        count: users.length,
        data: users,
      });
    } catch (error) {
      console.error('Get all users error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch users',
      });
    }
  }

  /**
   * Get admin performance metrics
   */
  async getAdminPerformance(req, res) {
    try {
      res.json({
        success: true,
        data: {
          avgResponseTime: 150,
          uptime: 99.9
        }
      });
    } catch (error) {
      console.error('Admin performance error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch admin performance'
      });
    }
  }

  /**
   * Get admin assistants statistics
   */
  async getAdminAssistantsStats(req, res) {
    try {
      res.json({
        success: true,
        data: {
          totalAssistants: 0,
          activeAssistants: 0
        }
      });
    } catch (error) {
      console.error('Admin assistants stats error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch admin assistants stats'
      });
    }
  }

  /**
   * Toggle user status (block/unblock)
   */
  async toggleUserStatus(req, res) {
    try {
      const { id } = req.params;
      const { is_active } = req.body;
      const pool = getPool();

      await pool.query(
        'UPDATE users SET is_active = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
        [is_active, id]
      );

      res.status(200).json({
        success: true,
        message: `User ${is_active ? 'activated' : 'deactivated'} successfully`,
      });
    } catch (error) {
      console.error('Toggle user status error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to toggle user status',
      });
    }
  }

  /**
   * Get platform configuration
   */
  async getPlatformConfig(req, res) {
    try {
      const config = await PlatformConfigService.getAllConfigs();

      res.json({
        success: true,
        data: config
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * Update platform configuration
   */
  async updatePlatformConfig(req, res) {
    try {
      const { configs } = req.body;

      if (req.user.role !== 'super_admin') {
        return res.status(403).json({
          success: false,
          error: 'Only super admin can modify platform configuration'
        });
      }

      for (const [key, value] of Object.entries(configs)) {
        await PlatformConfigService.setConfig(key, value);
      }

      res.json({
        success: true,
        message: 'Platform configuration updated successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = new AdminController();