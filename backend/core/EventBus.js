
/**
 * 🚌 EVENT BUS
 * Event-driven architecture داخلياً
 */

const EventEmitter = require('events');
const { logger } = require('../utils/logger');

class EventBus extends EventEmitter {
  constructor() {
    super();
    this.setMaxListeners(50); // Increase limit for large apps
  }

  /**
   * Publish an event
   */
  publish(eventName, data) {
    logger.info(`Event published: ${eventName}`, { data });
    this.emit(eventName, data);
  }

  /**
   * Subscribe to an event
   */
  subscribe(eventName, handler) {
    logger.info(`Subscriber registered for: ${eventName}`);
    this.on(eventName, handler);
  }

  /**
   * Subscribe once to an event
   */
  subscribeOnce(eventName, handler) {
    this.once(eventName, handler);
  }

  /**
   * Unsubscribe from an event
   */
  unsubscribe(eventName, handler) {
    this.off(eventName, handler);
  }

  /**
   * Unsubscribe all handlers for an event
   */
  unsubscribeAll(eventName) {
    this.removeAllListeners(eventName);
  }
}

// Global event bus instance
const eventBus = new EventBus();

// Domain Events
const DomainEvents = {
  // User Events
  USER_REGISTERED: 'user.registered',
  USER_LOGGED_IN: 'user.logged_in',
  USER_UPDATED: 'user.updated',
  
  // Tender Events
  TENDER_CREATED: 'tender.created',
  TENDER_PUBLISHED: 'tender.published',
  TENDER_UPDATED: 'tender.updated',
  TENDER_CLOSED: 'tender.closed',
  TENDER_AWARDED: 'tender.awarded',
  TENDER_CANCELLED: 'tender.cancelled',
  
  // Offer Events
  OFFER_SUBMITTED: 'offer.submitted',
  OFFER_UPDATED: 'offer.updated',
  OFFER_ACCEPTED: 'offer.accepted',
  OFFER_REJECTED: 'offer.rejected',
  
  // Payment Events
  PAYMENT_INITIATED: 'payment.initiated',
  PAYMENT_COMPLETED: 'payment.completed',
  PAYMENT_FAILED: 'payment.failed',
  
  // Notification Events
  NOTIFICATION_SEND: 'notification.send',
  EMAIL_SEND: 'email.send',
  
  // Audit Events
  AUDIT_LOG: 'audit.log',
};

module.exports = { EventBus, eventBus, DomainEvents };
