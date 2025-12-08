
const PurchaseOrderService = require('../../services/PurchaseOrderService');
const { errorResponse } = require('../../middleware/errorResponseFormatter');
const logger = require('../../utils/logger');

/**
 * Purchase Order Controller
 * Manages purchase orders sent from buyers to winning suppliers
 */
class PurchaseOrderController {
  /**
   * Create a purchase order for winning supplier(s)
   * @route POST /procurement/purchase-orders
   */
  async createPurchaseOrder(req, res) {
    try {
      const buyerId = req.user.id;
      const purchaseOrderData = {
        ...req.body,
        buyer_id: buyerId,
      };

      const purchaseOrder = await PurchaseOrderService.createPurchaseOrder(purchaseOrderData);

      res.status(201).json({
        success: true,
        message: 'Purchase order created and sent successfully',
        data: purchaseOrder,
      });
    } catch (error) {
      logger.error('Error creating purchase order:', error);
      errorResponse(res, error.message, 400);
    }
  }

  /**
   * Get purchase order by ID
   * @route GET /procurement/purchase-orders/:id
   */
  async getPurchaseOrder(req, res) {
    try {
      const { id } = req.params;
      const purchaseOrder = await PurchaseOrderService.getPurchaseOrderById(id, req.user.id);

      if (!purchaseOrder) {
        return errorResponse(res, 'Purchase order not found', 404);
      }

      res.json({
        success: true,
        data: purchaseOrder,
      });
    } catch (error) {
      logger.error('Error fetching purchase order:', error);
      errorResponse(res, error.message, 500);
    }
  }

  /**
   * Get all purchase orders for current buyer
   * @route GET /procurement/my-purchase-orders
   */
  async getMyPurchaseOrders(req, res) {
    try {
      const buyerId = req.user.id;
      const purchaseOrders = await PurchaseOrderService.getPurchaseOrdersByBuyer(buyerId);

      res.json({
        success: true,
        count: purchaseOrders.length,
        data: purchaseOrders,
      });
    } catch (error) {
      logger.error('Error fetching buyer purchase orders:', error);
      errorResponse(res, error.message, 500);
    }
  }

  /**
   * Get all purchase orders received by supplier
   * @route GET /procurement/received-purchase-orders
   */
  async getReceivedPurchaseOrders(req, res) {
    try {
      const supplierId = req.user.id;
      const purchaseOrders = await PurchaseOrderService.getPurchaseOrdersBySupplier(supplierId);

      res.json({
        success: true,
        count: purchaseOrders.length,
        data: purchaseOrders,
      });
    } catch (error) {
      logger.error('Error fetching supplier purchase orders:', error);
      errorResponse(res, error.message, 500);
    }
  }

  /**
   * Update purchase order status
   * @route PUT /procurement/purchase-orders/:id/status
   */
  async updatePurchaseOrderStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const updatedPO = await PurchaseOrderService.updatePurchaseOrderStatus(
        id,
        status,
        req.user.id
      );

      res.json({
        success: true,
        message: 'Purchase order status updated',
        data: updatedPO,
      });
    } catch (error) {
      logger.error('Error updating purchase order status:', error);
      errorResponse(res, error.message, 400);
    }
  }
}

module.exports = new PurchaseOrderController();
