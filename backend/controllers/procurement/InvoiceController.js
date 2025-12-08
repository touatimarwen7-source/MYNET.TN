
const InvoiceService = require('../../services/InvoiceService');
const { errorResponse } = require('../../middleware/errorResponseFormatter');
const logger = require('../../utils/logger');

/**
 * Invoice Controller
 * Manages invoices created by suppliers for purchase orders
 */
class InvoiceController {
  /**
   * Create an invoice for a purchase order
   * @route POST /procurement/invoices
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
   * Get invoice by ID
   * @route GET /procurement/invoices/:id
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
   * Get all invoices created by supplier
   * @route GET /procurement/my-invoices
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
   * @route PUT /procurement/invoices/:id/status
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
   * Upload original invoice document
   * @route POST /procurement/invoices/:id/upload
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
