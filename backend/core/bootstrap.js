
/**
 * 🚀 APPLICATION BOOTSTRAP
 * Initialize DI Container and Modules
 */

const { container } = require('./Container');
const { eventBus } = require('./EventBus');
const { logger } = require('../utils/logger');

// Modules
const AuthModule = require('../modules/auth/AuthModule');
const ProcurementModule = require('../modules/procurement/ProcurementModule');
const NotificationModule = require('../modules/notifications/NotificationModule');

/**
 * Bootstrap the application
 */
async function bootstrap() {
  try {
    logger.info('🚀 Bootstrapping application...');

    // Register core services
    container.singleton('eventBus', () => eventBus);
    
    container.singleton('db', () => require('../config/db'));
    
    container.singleton('jwtService', () => ({
      generateToken: (user) => 'jwt-token',
      verifyToken: (token) => ({ userId: 1 }),
    }));

    container.singleton('emailService', () => ({
      send: async (params) => {
        logger.info('Email sent', params);
        return true;
      },
    }));

    container.singleton('notificationService', () => ({
      send: async (params) => {
        logger.info('Notification sent', params);
        return true;
      },
    }));

    // Register modules
    container.singleton('authModule', (c) => new AuthModule({
      db: c.resolve('db'),
      jwtService: c.resolve('jwtService'),
      eventBus: c.resolve('eventBus'),
    }));

    container.singleton('procurementModule', (c) => new ProcurementModule({
      db: c.resolve('db'),
      eventBus: c.resolve('eventBus'),
      notificationService: c.resolve('notificationService'),
    }));

    container.singleton('notificationModule', (c) => new NotificationModule({
      emailService: c.resolve('emailService'),
      db: c.resolve('db'),
      eventBus: c.resolve('eventBus'),
    }));

    logger.info('✅ Application bootstrapped successfully');
    logger.info('📦 Registered modules: Auth, Procurement, Notification');
    
    return container;
  } catch (error) {
    logger.error('❌ Bootstrap failed', { error });
    throw error;
  }
}

module.exports = { bootstrap };
