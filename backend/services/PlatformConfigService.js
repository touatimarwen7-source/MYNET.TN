
const { getPool } = require('../config/db');
const logger = require('../utils/logger');

/**
 * Platform Configuration Service
 * Allows admin to manage platform settings without code changes
 */
class PlatformConfigService {
  
  /**
   * Get all platform configurations
   */
  async getAllConfigs() {
    const pool = getPool();
    try {
      const result = await pool.query(`
        SELECT * FROM platform_config 
        ORDER BY category, key
      `);
      
      const configs = {};
      result.rows.forEach(row => {
        if (!configs[row.category]) {
          configs[row.category] = {};
        }
        configs[row.category][row.key] = {
          value: row.value,
          type: row.type,
          description: row.description,
          updatedAt: row.updated_at
        };
      });
      
      return configs;
    } catch (error) {
      logger.error('Error fetching platform configs:', error);
      
      // Return default configs if table doesn't exist
      return this._getDefaultConfigs();
    }
  }

  /**
   * Update platform configuration
   */
  async updateConfig(category, key, value) {
    const pool = getPool();
    try {
      await pool.query(`
        INSERT INTO platform_config (category, key, value, updated_at)
        VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
        ON CONFLICT (category, key) 
        DO UPDATE SET value = $3, updated_at = CURRENT_TIMESTAMP
      `, [category, key, JSON.stringify(value)]);
      
      return { success: true };
    } catch (error) {
      logger.error('Error updating platform config:', error);
      throw error;
    }
  }

  /**
   * Get branding settings
   */
  async getBrandingSettings() {
    const pool = getPool();
    try {
      const result = await pool.query(`
        SELECT * FROM platform_config 
        WHERE category = 'branding'
      `);
      
      const branding = {};
      result.rows.forEach(row => {
        branding[row.key] = row.value;
      });
      
      return branding;
    } catch (error) {
      return this._getDefaultBranding();
    }
  }

  /**
   * Update branding settings
   */
  async updateBranding(settings) {
    const promises = Object.entries(settings).map(([key, value]) => 
      this.updateConfig('branding', key, value)
    );
    
    await Promise.all(promises);
    return { success: true };
  }

  /**
   * Get email templates
   */
  async getEmailTemplates() {
    const pool = getPool();
    try {
      const result = await pool.query(`
        SELECT * FROM email_templates 
        ORDER BY name
      `);
      
      return result.rows;
    } catch (error) {
      return this._getDefaultEmailTemplates();
    }
  }

  /**
   * Update email template
   */
  async updateEmailTemplate(id, template) {
    const pool = getPool();
    try {
      await pool.query(`
        UPDATE email_templates 
        SET subject = $1, body = $2, updated_at = CURRENT_TIMESTAMP
        WHERE id = $3
      `, [template.subject, template.body, id]);
      
      return { success: true };
    } catch (error) {
      logger.error('Error updating email template:', error);
      throw error;
    }
  }

  /**
   * Get menu configurations
   */
  async getMenuConfigs() {
    const pool = getPool();
    try {
      const result = await pool.query(`
        SELECT * FROM menu_config 
        ORDER BY position
      `);
      
      return result.rows;
    } catch (error) {
      return this._getDefaultMenus();
    }
  }

  /**
   * Update menu configuration
   */
  async updateMenuConfig(menus) {
    const pool = getPool();
    try {
      await pool.query('DELETE FROM menu_config');
      
      const values = menus.map((menu, idx) => 
        `('${menu.title}', '${menu.path}', '${menu.icon}', ${idx}, ${menu.visible})`
      ).join(',');
      
      if (values) {
        await pool.query(`
          INSERT INTO menu_config (title, path, icon, position, visible)
          VALUES ${values}
        `);
      }
      
      return { success: true };
    } catch (error) {
      logger.error('Error updating menu config:', error);
      throw error;
    }
  }

  // Private helper methods
  
  _getDefaultConfigs() {
    return {
      branding: {
        platformName: { value: 'MyNet.tn', type: 'string' },
        primaryColor: { value: '#1976d2', type: 'color' },
        logoUrl: { value: '/logo.png', type: 'string' }
      },
      features: {
        enableChat: { value: true, type: 'boolean' },
        enableNotifications: { value: true, type: 'boolean' },
        enableAnalytics: { value: true, type: 'boolean' }
      },
      email: {
        fromEmail: { value: 'noreply@mynet.tn', type: 'string' },
        fromName: { value: 'MyNet.tn', type: 'string' }
      }
    };
  }

  _getDefaultBranding() {
    return {
      platformName: 'MyNet.tn',
      primaryColor: '#1976d2',
      secondaryColor: '#dc004e',
      logoUrl: '/logo.png'
    };
  }

  _getDefaultEmailTemplates() {
    return [
      {
        id: 1,
        name: 'welcome_email',
        subject: 'Bienvenue sur MyNet.tn',
        body: 'Bonjour {{name}}, bienvenue sur notre plateforme!'
      },
      {
        id: 2,
        name: 'tender_notification',
        subject: 'Nouvel appel d\'offres disponible',
        body: 'Un nouvel appel d\'offres correspond à votre profil.'
      }
    ];
  }

  _getDefaultMenus() {
    return [
      { id: 1, title: 'Accueil', path: '/', icon: 'Home', position: 0, visible: true },
      { id: 2, title: 'Appels d\'offres', path: '/tenders', icon: 'Gavel', position: 1, visible: true },
      { id: 3, title: 'Tableau de bord', path: '/dashboard', icon: 'Dashboard', position: 2, visible: true }
    ];
  }
}

module.exports = new PlatformConfigService();
