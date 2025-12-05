const ClarificationService = require('../services/ClarificationService');

class ClarificationController {
  async handleCreateClarification(req, res, next) {
    try {
      const { offerId } = req.params;
      const { question } = req.body;
      const buyer = req.user; // Assuming user is attached by auth middleware

      if (!question) {
        return res.status(400).json({ message: 'Question text is required.' });
      }

      const clarification = await ClarificationService.createClarification(
        offerId,
        question,
        buyer
      );
      res.status(201).json(clarification);
    } catch (error) {
      next(error);
    }
  }

  async handleGetReceivedClarifications(req, res, next) {
    try {
      const supplier = req.user;
      const clarifications = await ClarificationService.getReceivedClarifications(supplier.id);
      res.status(200).json(clarifications);
    } catch (error) {
      next(error);
    }
  }

  async handleGetClarificationById(req, res, next) {
    try {
      const { clarificationId } = req.params;
      const user = req.user;
      const clarification = await ClarificationService.getClarificationById(clarificationId, user);
      res.status(200).json(clarification);
    } catch (error) {
      next(error);
    }
  }

  async handleRespondToClarification(req, res, next) {
    try {
      const { clarificationId } = req.params;
      const { response } = req.body;
      const supplier = req.user;

      if (!response) {
        return res.status(400).json({ message: 'Response text is required.' });
      }

      const updatedClarification = await ClarificationService.respondToClarification(
        clarificationId,
        response,
        supplier
      );
      res.status(200).json(updatedClarification);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ClarificationController();
