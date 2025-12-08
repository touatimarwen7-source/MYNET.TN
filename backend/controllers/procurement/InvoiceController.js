
const InvoiceService = require('../../services/InvoiceService');
const { errorResponse } = require('../../middleware/errorResponseFormatter');
const logger = require('../../utils/logger');

/**
 * Invoice Controller
 * Manages invoices created by suppliers for purchase orders
 * Handles creation, retrieval, status updates, and document uploads
 * @class InvoiceController
 */
class InvoiceController {
  /**
   * Create an invoice for a purchase order
   * @async
   * @param {Object} req - Express request object
   * @param {Object} req.body - Invoice data
   * @param {string} req.body.purchase_order_id - Purchase order ID (required)
   * @param {number} req.body.amount - Invoice amount (required)
   * @param {string} req.body.due_date - Payment due date
   * @param {string} req.body.notes - Additional notes
   * @param {Object} req.user - Authenticated supplier user
   * @param {Object} res - Express response object
   * @returns {void} Returns created invoice with 201 status
   * @throws {400} If validation fails or invoice creation fails
   * @route POST /procurement/invoices
   * @example
   * POST /procurement/invoices
   * {
   *   "purchase_order_id": "PO-123",
   *   "amount": 50000,
   *   "due_date": "2025-02-01",
   *   "notes": "First installment"
   * }
   */
  async createInvoice(req, res) {
    try {
      const supplierId = req.user.id;
      const invoiceData = {
        ...req.body,
        supplier_id: supplierId,
      };

      const invoice = await InvoiceService.createInvoice(invoiceData);

      res.status(201).json({
        success: true,
        message: 'Invoice created successfully',
        data: invoice,
      });
    } catch (error) {
      logger.error('Error creating invoice:', error);
      errorResponse(res, error.message, 400);
    }
  }

  /**
   * Get invoice details by ID
   * @async
   * @param {Object} req - Express request object
   * @param {Object} req.params - Request parameters
   * @param {string} req.params.id - Invoice ID
   * @param {Object} req.user - Authenticated user
   * @param {Object} res - Express response object
   * @returns {void} Returns invoice details
   * @throws {404} If invoice not found
   * @throws {500} If database error occurs
   * @route GET /procurement/invoices/:id
   * @example
   * GET /procurement/invoices/123
   * Response: {
   *   success: true,
   *   data: {
   *     id: 123,
   *     invoice_number: "INV-2025-001",
   *     amount: 50000,
   *     status: "pending"
   *   }
   * }
   */
  async getInvoice(req, res) {
    try {
      const { id } = req.params;
      const invoice = await InvoiceService.getInvoiceById(id, req.user.id);

      if (!invoice) {
        return errorResponse(res, 'Invoice not found', 404);
      }

      res.json({
        success: true,
        data: invoice,
      });
    } catch (error) {
      logger.error('Error fetching invoice:', error);
      errorResponse(res, error.message, 500);
    }
  }

  /**
   * Get all invoices created by current supplier
   * @async
   * @param {Object} req - Express request object
   * @param {Object} req.user - Authenticated supplier user
   * @param {Object} res - Express response object
   * @returns {void} Returns supplier's invoices with count
   * @throws {500} If database error occurs
   * @route GET /procurement/my-invoices
   * @example
   * GET /procurement/my-invoices
   * Response: {
   *   success: true,
   *   count: 5,
   *   data: [...]
   * }
   */
  async getMyInvoices(req, res) {
    try {
      const supplierId = req.user.id;
      const invoices = await InvoiceService.getInvoicesBySupplier(supplierId);

      res.json({
        success: true,
        count: invoices.length,
        data: invoices,
      });
    } catch (error) {
      logger.error('Error fetching supplier invoices:', error);
      errorResponse(res, error.message, 500);
    }
  }

  /**
   * Get all invoices received by buyer
   * @route GET /procurement/received-invoices
   */
  async getReceivedInvoices(req, res) {
    try {
      const buyerId = req.user.id;
      const invoices = await InvoiceService.getInvoicesByBuyer(buyerId);

      res.json({
        success: true,
        count: invoices.length,
        data: invoices,
      });
    } catch (error) {
      logger.error('Error fetching buyer invoices:', error);
      errorResponse(res, error.message, 500);
    }
  }

  /**
   * Update invoice status (buyer approval/payment)
   * @async
   * @param {Object} req - Express request object
   * @param {Object} req.params - Request parameters
   * @param {string} req.params.id - Invoice ID
   * @param {Object} req.body - Status update data
   * @param {string} req.body.status - New status (pending, approved, paid, rejected)
   * @param {string} req.body.payment_date - Payment completion date (if status=paid)
   * @param {Object} req.user - Authenticated buyer user
   * @param {Object} res - Express response object
   * @returns {void} Returns updated invoice
   * @throws {400} If status update fails
   * @route PUT /procurement/invoices/:id/status
   * @example
   * PUT /procurement/invoices/123/status
   * {
   *   "status": "approved",
   *   "payment_date": "2025-01-15"
   * }
   */
  async updateInvoiceStatus(req, res) {
    try {
      const { id } = req.params;
      const { status, payment_date } = req.body;

      const updatedInvoice = await InvoiceService.updateInvoiceStatus(
        id,
        status,
        req.user.id,
        payment_date
      );

      res.json({
        success: true,
        message: 'Invoice status updated',
        data: updatedInvoice,
      });
    } catch (error) {
      logger.error('Error updating invoice status:', error);
      errorResponse(res, error.message, 400);
    }
  }

  /**
   * Upload original invoice document (PDF, image, etc.)
   * @async
   * @param {Object} req - Express request object
   * @param {Object} req.params - Request parameters
   * @param {string} req.params.id - Invoice ID
   * @param {Object} req.file - Uploaded file from multer middleware
   * @param {Object} req.user - Authenticated supplier user
   * @param {Object} res - Express response object
   * @returns {void} Returns updated invoice with document URL
   * @throws {400} If no file uploaded or attachment fails
   * @route POST /procurement/invoices/:id/upload
   * @example
   * POST /procurement/invoices/123/upload
   * Content-Type: multipart/form-data
   * Response: {
   *   success: true,
   *   message: 'Invoice document uploaded',
   *   data: { document_url: '/uploads/invoice-123.pdf' }
   * }
   */
  async uploadInvoiceDocument(req, res) {
    try {
      const { id } = req.params;

      if (!req.file) {
        return errorResponse(res, 'No file uploaded', 400);
      }

      const updatedInvoice = await InvoiceService.attachDocument(id, req.file, req.user.id);

      res.json({
        success: true,
        message: 'Invoice document uploaded',
        data: updatedInvoice,
      });
    } catch (error) {
      logger.error('Error uploading invoice document:', error);
      errorResponse(res, error.message, 400);
    }
  }
}

module.exports = new InvoiceController();
