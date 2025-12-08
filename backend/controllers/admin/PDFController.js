
const { getPool } = require('../../config/db');
const { sendOk, sendNotFound, sendInternalError } = require('../../utils/responseHelper');
const { logger } = require('../../utils/logger');
const PDFService = require('../../services/PDFService');

/**
 * 📄 PDF CONTROLLER
 * Handles PDF generation for tenders, offers, reports, and awards
 */
class PDFController {
  /**
   * Generate PDF for tender
   * @route POST /api/pdf/generate-tender
   */
  async generateTenderPDF(req, res) {
    try {
      const { tenderId } = req.body;

      if (!tenderId) {
        return sendInternalError(res, 'Tender ID is required');
      }

      const pool = getPool();
      const result = await pool.query(
        'SELECT * FROM tenders WHERE id = $1',
        [tenderId]
      );

      if (result.rows.length === 0) {
        return sendNotFound(res, 'Tender');
      }

      const tender = result.rows[0];
      const pdfBuffer = await PDFService.generateTenderPDF(tender);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=tender_${tenderId}.pdf`);
      return res.send(pdfBuffer);
    } catch (error) {
      logger.error('Error generating tender PDF:', { error: error.message, tenderId: req.body.tenderId });
      return sendInternalError(res, 'Failed to generate tender PDF');
    }
  }

  /**
   * Generate PDF for offer
   * @route POST /api/pdf/generate-offer
   */
  async generateOfferPDF(req, res) {
    try {
      const { offerId } = req.body;

      if (!offerId) {
        return sendInternalError(res, 'Offer ID is required');
      }

      const pool = getPool();
      const result = await pool.query(
        'SELECT * FROM offers WHERE id = $1',
        [offerId]
      );

      if (result.rows.length === 0) {
        return sendNotFound(res, 'Offer');
      }

      const offer = result.rows[0];
      const pdfBuffer = await PDFService.generateOfferPDF(offer);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=offer_${offerId}.pdf`);
      return res.send(pdfBuffer);
    } catch (error) {
      logger.error('Error generating offer PDF:', { error: error.message, offerId: req.body.offerId });
      return sendInternalError(res, 'Failed to generate offer PDF');
    }
  }

  /**
   * Generate PDF for opening report
   * @route POST /api/pdf/generate-opening-report
   */
  async generateOpeningReportPDF(req, res) {
    try {
      const { reportId } = req.body;

      if (!reportId) {
        return sendInternalError(res, 'Report ID is required');
      }

      const pool = getPool();
      const result = await pool.query(
        'SELECT * FROM opening_reports WHERE id = $1',
        [reportId]
      );

      if (result.rows.length === 0) {
        return sendNotFound(res, 'Opening Report');
      }

      const report = result.rows[0];
      const pdfBuffer = await PDFService.generateOpeningReportPDF(report);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=opening_report_${reportId}.pdf`);
      return res.send(pdfBuffer);
    } catch (error) {
      logger.error('Error generating opening report PDF:', { error: error.message, reportId: req.body.reportId });
      return sendInternalError(res, 'Failed to generate opening report PDF');
    }
  }

  /**
   * Generate PDF for tender award
   * @route POST /api/pdf/generate-award
   */
  async generateAwardPDF(req, res) {
    try {
      const { awardId } = req.body;

      if (!awardId) {
        return sendInternalError(res, 'Award ID is required');
      }

      const pool = getPool();
      const result = await pool.query(
        'SELECT * FROM tender_awards WHERE id = $1',
        [awardId]
      );

      if (result.rows.length === 0) {
        return sendNotFound(res, 'Award');
      }

      const award = result.rows[0];
      const pdfBuffer = await PDFService.generateAwardPDF(award);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=award_${awardId}.pdf`);
      return res.send(pdfBuffer);
    } catch (error) {
      logger.error('Error generating award PDF:', { error: error.message, awardId: req.body.awardId });
      return sendInternalError(res, 'Failed to generate award PDF');
    }
  }
}

module.exports = PDFController;
