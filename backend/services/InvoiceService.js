
const { getPool } = require('../config/db');
const AuditLogService = require('./AuditLogService');
const NotificationService = require('./NotificationService');
const { v4: uuidv4 } = require('uuid');

/**
 * Invoice Service
 * Handles supplier invoice creation and management
 */
class InvoiceService {
  /**
   * Create an invoice for a purchase order
   */
  async createInvoice(invoiceData) {
    const pool = getPool();
    const {
      purchase_order_id,
      supplier_id,
      invoice_number,
      invoice_date,
      due_date,
      items,
      subtotal,
      tax_amount,
      total_amount,
      currency,
      payment_terms,
      notes,
      bank_details,
    } = invoiceData;

    try {
      // Verify purchase order exists and belongs to supplier
      const poResult = await pool.query(
        `SELECT * FROM purchase_orders WHERE id = $1 AND supplier_id = $2`,
        [purchase_order_id, supplier_id]
      );

      if (poResult.rows.length === 0) {
        throw new Error('Purchase order not found or unauthorized');
      }

      const purchaseOrder = poResult.rows[0];

      // Create invoice
      const invoiceId = uuidv4();
      const result = await pool.query(
        `INSERT INTO invoices 
        (id, purchase_order_id, supplier_id, buyer_id, invoice_number, invoice_date, due_date, 
         items, subtotal, tax_amount, total_amount, currency, payment_terms, notes, 
         bank_details, status, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, CURRENT_TIMESTAMP)
        RETURNING *`,
        [
          invoiceId,
          purchase_order_id,
          supplier_id,
          purchaseOrder.buyer_id,
          invoice_number,
          invoice_date,
          due_date,
          JSON.stringify(items),
          subtotal,
          tax_amount,
          total_amount,
          currency || 'TND',
          payment_terms,
          notes,
          JSON.stringify(bank_details),
          'submitted',
        ]
      );

      const invoice = result.rows[0];

      // Audit log
      await AuditLogService.logAction(
        supplier_id,
        'create_invoice',
        'invoice',
        invoiceId,
        { invoice_number, purchase_order_id, total_amount }
      );

      // Notify buyer
      await NotificationService.notifyInvoiceReceived(
        purchaseOrder.buyer_id,
        invoice_number,
        supplier_id
      );

      return invoice;
    } catch (error) {
      throw new Error(`Failed to create invoice: ${error.message}`);
    }
  }

  /**
   * Get invoice by ID
   */
  async getInvoiceById(invoiceId, userId) {
    const pool = getPool();

    const result = await pool.query(
      `SELECT i.*, 
              u_supplier.full_name as supplier_name, u_supplier.company_name as supplier_company,
              u_buyer.full_name as buyer_name, u_buyer.company_name as buyer_company,
              po.po_number
       FROM invoices i
       LEFT JOIN users u_supplier ON i.supplier_id = u_supplier.id
       LEFT JOIN users u_buyer ON i.buyer_id = u_buyer.id
       LEFT JOIN purchase_orders po ON i.purchase_order_id = po.id
       WHERE i.id = $1 AND (i.supplier_id = $2 OR i.buyer_id = $2)`,
      [invoiceId, userId]
    );

    return result.rows[0] || null;
  }

  /**
   * Get invoices by supplier
   */
  async getInvoicesBySupplier(supplierId) {
    const pool = getPool();

    const result = await pool.query(
      `SELECT i.*, 
              u.full_name as buyer_name, u.company_name as buyer_company,
              po.po_number
       FROM invoices i
       LEFT JOIN users u ON i.buyer_id = u.id
       LEFT JOIN purchase_orders po ON i.purchase_order_id = po.id
       WHERE i.supplier_id = $1
       ORDER BY i.created_at DESC`,
      [supplierId]
    );

    return result.rows;
  }

  /**
   * Get invoices by buyer
   */
  async getInvoicesByBuyer(buyerId) {
    const pool = getPool();

    const result = await pool.query(
      `SELECT i.*, 
              u.full_name as supplier_name, u.company_name as supplier_company,
              po.po_number
       FROM invoices i
       LEFT JOIN users u ON i.supplier_id = u.id
       LEFT JOIN purchase_orders po ON i.purchase_order_id = po.id
       WHERE i.buyer_id = $1
       ORDER BY i.created_at DESC`,
      [buyerId]
    );

    return result.rows;
  }

  /**
   * Update invoice status (buyer approval/payment)
   */
  async updateInvoiceStatus(invoiceId, status, userId, paymentDate = null) {
    const pool = getPool();

    const result = await pool.query(
      `UPDATE invoices 
       SET status = $1, payment_date = $2, updated_at = CURRENT_TIMESTAMP
       WHERE id = $3 AND buyer_id = $4
       RETURNING *`,
      [status, paymentDate, invoiceId, userId]
    );

    if (result.rows.length === 0) {
      throw new Error('Invoice not found or unauthorized');
    }

    const invoice = result.rows[0];

    await AuditLogService.logAction(userId, 'update_invoice_status', 'invoice', invoiceId, {
      status,
      payment_date: paymentDate,
    });

    return invoice;
  }

  /**
   * Attach invoice document (PDF)
   */
  async attachDocument(invoiceId, file, userId) {
    const pool = getPool();

    const documentPath = `/uploads/invoices/${file.filename}`;

    const result = await pool.query(
      `UPDATE invoices 
       SET document_path = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2 AND supplier_id = $3
       RETURNING *`,
      [documentPath, invoiceId, userId]
    );

    if (result.rows.length === 0) {
      throw new Error('Invoice not found or unauthorized');
    }

    return result.rows[0];
  }
}

module.exports = new InvoiceService();
