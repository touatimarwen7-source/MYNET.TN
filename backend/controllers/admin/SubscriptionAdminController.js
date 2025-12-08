
const { getPool } = require('../../config/db');
const logger = require('../../utils/logger');

class SubscriptionAdminController {
  /**
   * Get all subscription plans
   */
  async getAllPlans(req, res) {
    const pool = getPool();
    try {
      const result = await pool.query(`
        SELECT 
          sp.*,
          COUNT(DISTINCT us.id) as active_subscribers,
          COALESCE(SUM(sp.price), 0) as total_revenue
        FROM subscription_plans sp
        LEFT JOIN user_subscriptions us ON sp.id = us.plan_id 
          AND us.status = 'active'
        GROUP BY sp.id
        ORDER BY sp.price ASC
      `);

      res.json({
        success: true,
        data: result.rows
      });
    } catch (error) {
      logger.error('Error fetching plans:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * Create new subscription plan
   */
  async createPlan(req, res) {
    const pool = getPool();
    const {
      name,
      description,
      price,
      currency = 'TND',
      duration_days,
      features,
      max_tenders,
      max_offers,
      max_products = 50,
      storage_limit = 5
    } = req.body;

    try {
      const result = await pool.query(`
        INSERT INTO subscription_plans 
        (name, description, price, currency, duration_days, features, 
         max_tenders, max_offers, max_products, storage_limit, is_active)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, TRUE)
        RETURNING *
      `, [
        name,
        description,
        price,
        currency,
        duration_days,
        JSON.stringify(features || {}),
        max_tenders,
        max_offers,
        max_products,
        storage_limit
      ]);

      res.status(201).json({
        success: true,
        data: result.rows[0],
        message: 'Plan créé avec succès'
      });
    } catch (error) {
      logger.error('Error creating plan:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * Update subscription plan
   */
  async updatePlan(req, res) {
    const pool = getPool();
    const { id } = req.params;
    const {
      name,
      description,
      price,
      currency,
      duration_days,
      features,
      max_tenders,
      max_offers,
      max_products,
      storage_limit,
      is_active
    } = req.body;

    try {
      const result = await pool.query(`
        UPDATE subscription_plans
        SET 
          name = COALESCE($1, name),
          description = COALESCE($2, description),
          price = COALESCE($3, price),
          currency = COALESCE($4, currency),
          duration_days = COALESCE($5, duration_days),
          features = COALESCE($6, features),
          max_tenders = COALESCE($7, max_tenders),
          max_offers = COALESCE($8, max_offers),
          max_products = COALESCE($9, max_products),
          storage_limit = COALESCE($10, storage_limit),
          is_active = COALESCE($11, is_active),
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $12
        RETURNING *
      `, [
        name,
        description,
        price,
        currency,
        duration_days,
        features ? JSON.stringify(features) : null,
        max_tenders,
        max_offers,
        max_products,
        storage_limit,
        is_active,
        id
      ]);

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Plan non trouvé'
        });
      }

      res.json({
        success: true,
        data: result.rows[0],
        message: 'Plan mis à jour avec succès'
      });
    } catch (error) {
      logger.error('Error updating plan:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * Delete subscription plan
   */
  async deletePlan(req, res) {
    const pool = getPool();
    const { id } = req.params;

    try {
      // Check if plan has active subscribers
      const subscribersCheck = await pool.query(
        'SELECT COUNT(*) FROM user_subscriptions WHERE plan_id = $1 AND status = $2',
        [id, 'active']
      );

      if (parseInt(subscribersCheck.rows[0].count) > 0) {
        return res.status(400).json({
          success: false,
          error: 'Impossible de supprimer un plan avec des abonnés actifs'
        });
      }

      await pool.query('DELETE FROM subscription_plans WHERE id = $1', [id]);

      res.json({
        success: true,
        message: 'Plan supprimé avec succès'
      });
    } catch (error) {
      logger.error('Error deleting plan:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * Get subscription analytics
   */
  async getSubscriptionAnalytics(req, res) {
    const pool = getPool();
    try {
      const [overview, byPlan, revenue] = await Promise.all([
        // Overview stats
        pool.query(`
          SELECT 
            COUNT(DISTINCT us.id) as total_subscriptions,
            COUNT(DISTINCT CASE WHEN us.status = 'active' THEN us.id END) as active_subscriptions,
            COUNT(DISTINCT us.user_id) as total_subscribers
          FROM user_subscriptions us
        `),
        
        // By plan
        pool.query(`
          SELECT 
            sp.name,
            sp.price,
            COUNT(us.id) as subscriber_count,
            SUM(sp.price) as revenue
          FROM subscription_plans sp
          LEFT JOIN user_subscriptions us ON sp.id = us.plan_id 
            AND us.status = 'active'
          GROUP BY sp.id, sp.name, sp.price
          ORDER BY subscriber_count DESC
        `),

        // Revenue trend
        pool.query(`
          SELECT 
            DATE_TRUNC('month', us.created_at) as month,
            COUNT(*) as new_subscriptions,
            SUM(sp.price) as monthly_revenue
          FROM user_subscriptions us
          JOIN subscription_plans sp ON us.plan_id = sp.id
          WHERE us.created_at >= CURRENT_DATE - INTERVAL '12 months'
          GROUP BY month
          ORDER BY month DESC
        `)
      ]);

      res.json({
        success: true,
        data: {
          overview: overview.rows[0],
          byPlan: byPlan.rows,
          revenueTrend: revenue.rows
        }
      });
    } catch (error) {
      logger.error('Error fetching subscription analytics:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = new SubscriptionAdminController();
