const { getPool } = require('../config/db');
const NotificationService = require('./NotificationService');
const AuditLogService = require('./AuditLogService');

class ClarificationService {
  /**
   * Creates a clarification request from a buyer for a specific offer.
   * @param {string} offerId - The ID of the offer.
   * @param {string} question - The question from the buyer.
   * @param {object} buyer - The authenticated buyer user object.
   * @returns {Promise<object>} The created clarification record.
   */
  async createClarification(offerId, question, buyer) {
    const pool = getPool();
    // Start a transaction
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // 1. Fetch offer and tender details to verify ownership and get supplier ID
      const offerRes = await client.query(
        'SELECT supplier_id, tender_id FROM offers WHERE id = $1',
        [offerId]
      );
      if (offerRes.rows.length === 0) throw new Error('Offer not found.');
      const { supplier_id, tender_id } = offerRes.rows[0];

      const tenderRes = await client.query('SELECT title, buyer_id FROM tenders WHERE id = $1', [
        tender_id,
      ]);
      if (tenderRes.rows.length === 0) throw new Error('Tender not found.');
      const { title: tender_title, buyer_id } = tenderRes.rows[0];

      // 2. Authorization: Ensure the user requesting is the buyer who owns the tender
      if (buyer_id !== buyer.id) {
        throw new Error('Authorization Failed: You do not own this tender.');
      }

      // 3. Create the clarification record
      const clarificationRes = await client.query(
        'INSERT INTO clarifications (offer_id, buyer_id, supplier_id, question, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [offerId, buyer.id, supplier_id, question, 'pending_response']
      );
      const newClarification = clarificationRes.rows[0];

      // 4. Trigger notifications for the supplier
      const notificationPayload = {
        userId: supplier_id,
        type: 'CLARIFICATION_REQUEST',
        title: 'طلب توضيح جديد',
        message: `لديك طلب توضيح جديد بخصوص عرضك للمناقصة: ${tender_title}`,
        relatedEntityId: newClarification.id,
        relatedEntityType: 'clarification',
      };
      await NotificationService.createAndDispatch(notificationPayload, client);

      // 5. Log the audit trail
      await AuditLogService.log(
        buyer.id,
        'clarification',
        newClarification.id,
        'create',
        `Requested clarification for offer ${offerId}`,
        client
      );

      await client.query('COMMIT');
      return newClarification;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Fetches all clarification requests for a given supplier.
   * @param {string} supplierId - The ID of the supplier.
   * @returns {Promise<Array>} A list of clarification requests.
   */
  async getReceivedClarifications(supplierId) {
    const pool = getPool();
    const query = `
      SELECT c.*, t.title as tender_title
      FROM clarifications c
      JOIN offers o ON c.offer_id = o.id
      JOIN tenders t ON o.tender_id = t.id
      WHERE c.supplier_id = $1
      ORDER BY c.created_at DESC
    `;
    const result = await pool.query(query, [supplierId]);
    return result.rows;
  }

  /**
   * Fetches a single clarification request by its ID.
   * @param {string} clarificationId - The ID of the clarification.
   * @param {object} user - The authenticated user.
   * @returns {Promise<object>} The clarification object.
   */
  async getClarificationById(clarificationId, user) {
    const pool = getPool();
    const result = await pool.query('SELECT * FROM clarifications WHERE id = $1', [
      clarificationId,
    ]);
    if (result.rows.length === 0) throw new Error('Clarification not found.');

    const clarification = result.rows[0];
    // Authorization: Ensure user is either the buyer or the supplier involved.
    if (user.id !== clarification.buyer_id && user.id !== clarification.supplier_id) {
      throw new Error('You are not authorized to view this clarification.');
    }
    return clarification;
  }

  /**
   * Submits a response from a supplier to a clarification request.
   * @param {string} clarificationId - The ID of the clarification.
   * @param {string} responseText - The supplier's response text.
   * @param {object} supplier - The authenticated supplier user object.
   * @returns {Promise<object>} The updated clarification record.
   */
  async respondToClarification(clarificationId, responseText, supplier) {
    const pool = getPool();
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      const updateRes = await client.query(
        'UPDATE clarifications SET response = $1, status = $2, responded_at = CURRENT_TIMESTAMP WHERE id = $3 AND supplier_id = $4 RETURNING *',
        [responseText, 'answered', clarificationId, supplier.id]
      );

      if (updateRes.rows.length === 0)
        throw new Error('Clarification not found or you are not authorized to respond.');
      const updatedClarification = updateRes.rows[0];

      // TODO: Notify the buyer that a response has been submitted.

      await client.query('COMMIT');
      return updatedClarification;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}

module.exports = new ClarificationService();
