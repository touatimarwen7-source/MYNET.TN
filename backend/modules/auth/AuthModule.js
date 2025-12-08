
/**
 * 🔐 AUTH MODULE
 * Modular Monolith - Authentication Domain
 */

const { getPool } = require('../../config/db');
const { logger } = require('../../utils/logger');
const { DomainEvents } = require('../../core/EventBus');

class AuthModule {
  constructor(dependencies) {
    this.jwtService = dependencies.jwtService;
    this.eventBus = dependencies.eventBus;
    this.pool = getPool();
  }

  /**
   * Register user
   */
  async register(userData) {
    try {
      // Business logic here
      const result = await this.pool.query(
        'INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING *',
        [userData.email, userData.password, userData.role || 'buyer']
      );
      const user = result.rows[0];
      
      // Publish event
      this.eventBus.publish(DomainEvents.USER_REGISTERED, {
        userId: user.id,
        email: user.email,
        timestamp: new Date().toISOString(),
      });

      return user;
    } catch (error) {
      logger.error('Auth Module - Register failed', { error });
      throw error;
    }
  }

  /**
   * Login user
   */
  async login(email, password) {
    try {
      // Authenticate user
      const user = await this.authenticateUser(email, password);
      
      // Generate token
      const token = this.jwtService.generateToken(user);
      
      // Publish event
      this.eventBus.publish(DomainEvents.USER_LOGGED_IN, {
        userId: user.id,
        email: user.email,
        timestamp: new Date().toISOString(),
      });

      return { user, token };
    } catch (error) {
      logger.error('Auth Module - Login failed', { error });
      throw error;
    }
  }

  /**
   * Authenticate user (internal)
   */
  async authenticateUser(email, password) {
    // Implementation here
    return { id: 1, email };
  }
}

module.exports = AuthModule;
