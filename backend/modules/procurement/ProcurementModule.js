
/**
 * 🛒 PROCUREMENT MODULE
 * Modular Monolith - Procurement Domain
 */

const { getPool } = require('../../config/db');
const { logger } = require('../../utils/logger');
const { DomainEvents } = require('../../core/EventBus');

class ProcurementModule {
  constructor(dependencies) {
    this.eventBus = dependencies.eventBus;
    this.notificationService = dependencies.notificationService;
    this.pool = getPool();
  }

  /**
   * Create tender
   */
  async createTender(tenderData, buyerId) {
    try {
      const result = await this.pool.query(
        `INSERT INTO tenders (title, description, buyer_id, created_at) 
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [tenderData.title, tenderData.description, buyerId, new Date()]
      );
      const tender = result.rows[0];

      // Original code for reference
      // const tender = await this.db.createTender({
        ...tenderData,
        buyer_id: buyerId,
        created_at: new Date(),
      });

      // Publish event
      this.eventBus.publish(DomainEvents.TENDER_CREATED, {
        tenderId: tender.id,
        buyerId,
        title: tender.title,
        timestamp: new Date().toISOString(),
      });

      return tender;
    } catch (error) {
      logger.error('Procurement Module - Create tender failed', { error });
      throw error;
    }
  }

  /**
   * Publish tender
   */
  async publishTender(tenderId) {
    try {
      const tender = await this.db.updateTender(tenderId, {
        status: 'published',
        published_at: new Date(),
      });

      // Publish event
      this.eventBus.publish(DomainEvents.TENDER_PUBLISHED, {
        tenderId: tender.id,
        title: tender.title,
        timestamp: new Date().toISOString(),
      });

      return tender;
    } catch (error) {
      logger.error('Procurement Module - Publish tender failed', { error });
      throw error;
    }
  }

  /**
   * Submit offer
   */
  async submitOffer(offerData, supplierId) {
    try {
      const offer = await this.db.createOffer({
        ...offerData,
        supplier_id: supplierId,
        created_at: new Date(),
      });

      // Publish event
      this.eventBus.publish(DomainEvents.OFFER_SUBMITTED, {
        offerId: offer.id,
        tenderId: offer.tender_id,
        supplierId,
        timestamp: new Date().toISOString(),
      });

      return offer;
    } catch (error) {
      logger.error('Procurement Module - Submit offer failed', { error });
      throw error;
    }
  }
}

module.exports = ProcurementModule;
