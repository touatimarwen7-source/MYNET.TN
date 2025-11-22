// Business Logic Enhancements

/**
 * Check for duplicate review by same reviewer for same reviewed user
 */
const checkDuplicateReview = async (db, reviewerId, reviewedUserId, tenderId) => {
  const result = await db.query(`
    SELECT id FROM reviews 
    WHERE reviewer_id = $1 AND reviewed_user_id = $2 AND is_deleted = false
    LIMIT 1
  `, [reviewerId, reviewedUserId]);
  return result.rows.length > 0;
};

/**
 * Check if tender has expired and auto-close if needed
 */
const checkAndCloseTender = async (db, tenderId) => {
  const tender = await db.query(`
    SELECT deadline, status FROM tenders WHERE id = $1
  `, [tenderId]);
  
  if (tender.rows.length === 0) return false;
  
  const { deadline, status } = tender.rows[0];
  if (!deadline || status === 'closed') return false;
  
  if (new Date(deadline) < new Date()) {
    await db.query(`
      UPDATE tenders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2
    `, ['closed', tenderId]);
    return true;
  }
  return false;
};

/**
 * Track invoice payment status updates
 */
const updateInvoicePaymentStatus = async (db, invoiceId, paymentStatus, paymentDate = null) => {
  return await db.query(`
    UPDATE invoices 
    SET status = $1, payment_date = $2, updated_at = CURRENT_TIMESTAMP
    WHERE id = $3
    RETURNING *
  `, [paymentStatus, paymentDate, invoiceId]);
};

/**
 * Check user budget balance
 */
const checkUserBudgetBalance = async (db, userId, requiredAmount) => {
  const result = await db.query(`
    SELECT minimum_budget FROM users WHERE id = $1
  `, [userId]);
  
  if (result.rows.length === 0) return false;
  const { minimum_budget } = result.rows[0];
  return minimum_budget >= requiredAmount;
};

/**
 * Get tender expiration date
 */
const getTenderExpirationStatus = async (db, tenderId) => {
  const result = await db.query(`
    SELECT deadline, status, 
           EXTRACT(EPOCH FROM (deadline - CURRENT_TIMESTAMP)) as seconds_remaining
    FROM tenders WHERE id = $1
  `, [tenderId]);
  
  if (result.rows.length === 0) return null;
  return result.rows[0];
};

module.exports = {
  checkDuplicateReview,
  checkAndCloseTender,
  updateInvoicePaymentStatus,
  checkUserBudgetBalance,
  getTenderExpirationStatus
};
