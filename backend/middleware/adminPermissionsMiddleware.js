
const { getPool } = require('../config/db');
const logger = require('../utils/logger');

/**
 * Middleware de permissions granulaires pour administrateurs
 * Vérifie les permissions spécifiques pour chaque action admin
 */
class AdminPermissionsMiddleware {
  /**
   * Vérifie si l'utilisateur a une permission spécifique
   */
  static async checkPermission(requiredPermission) {
    return async (req, res, next) => {
      try {
        const userId = req.user?.id;
        const userRole = req.user?.role;

        // Super admin a toutes les permissions
        if (userRole === 'super_admin') {
          return next();
        }

        // Admin doit avoir la permission spécifique
        if (userRole === 'admin') {
          const pool = getPool();
          
          const result = await pool.query(
            `SELECT COUNT(*) as count 
             FROM admin_permissions 
             WHERE user_id = $1 AND permission_key = $2`,
            [userId, requiredPermission]
          );

          if (parseInt(result.rows[0].count) > 0) {
            return next();
          }
        }

        return res.status(403).json({
          success: false,
          error: 'Permission insuffisante',
          required: requiredPermission
        });
      } catch (error) {
        logger.error('Erreur vérification permissions:', error);
        return res.status(500).json({
          success: false,
          error: 'Erreur serveur lors de la vérification des permissions'
        });
      }
    };
  }

  /**
   * Liste des permissions disponibles
   */
  static PERMISSIONS = {
    // Utilisateurs
    VIEW_USERS: 'view_users',
    MANAGE_USERS: 'manage_users',
    BLOCK_USERS: 'block_users',
    
    // Tenders
    VIEW_TENDERS: 'view_tenders',
    MANAGE_TENDERS: 'manage_tenders',
    
    // Rapports
    VIEW_REPORTS: 'view_reports',
    EXPORT_DATA: 'export_data',
    
    // Configuration
    MANAGE_SETTINGS: 'manage_settings',
    MANAGE_FEATURES: 'manage_features',
    
    // Abonnements
    MANAGE_SUBSCRIPTIONS: 'manage_subscriptions',
    
    // Publicités
    MANAGE_ADS: 'manage_ads',
    
    // Audit
    VIEW_AUDIT_LOGS: 'view_audit_logs',
    
    // Système
    MANAGE_BACKUP: 'manage_backup',
    MANAGE_SECURITY: 'manage_security'
  };
}

module.exports = AdminPermissionsMiddleware;
