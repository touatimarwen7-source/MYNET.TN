const PDFDocument = require('pdfkit');
const { getPool } = require('../config/db');
const path = require('path');
const fs = require('fs');

class PDFService {
    async generateTenderDocument(tenderId) {
        const pool = getPool();

        try {
            const result = await pool.query(
                `SELECT t.*, u.company_name, u.full_name
                 FROM tenders t
                 LEFT JOIN users u ON t.buyer_id = u.id
                 WHERE t.id = $1`,
                [tenderId]
            );

            if (result.rows.length === 0) {
                throw new Error('Tender not found');
            }

            const tender = result.rows[0];
            const pdf = new PDFDocument({
                size: 'A4',
                margin: 50,
                bufferPages: true
            });

            // Header
            pdf.fontSize(20).font('Helvetica-Bold').text('وثيقة المناقصة', { align: 'right' });
            pdf.moveDown(0.5);
            pdf.fontSize(12).text(`رقم المناقصة: ${tender.tender_number}`, { align: 'right' });
            pdf.fontSize(10).text(`تاريخ الإنشاء: ${new Date(tender.created_at).toLocaleDateString('ar-TN')}`, { align: 'right' });
            pdf.moveTo(50, pdf.y + 10).lineTo(550, pdf.y + 10).stroke();
            pdf.moveDown(1);

            // Tender Details
            pdf.fontSize(14).font('Helvetica-Bold').text('تفاصيل المناقصة', { align: 'right' });
            pdf.moveDown(0.5);
            pdf.fontSize(11).font('Helvetica');

            const details = [
                { label: 'العنوان:', value: tender.title },
                { label: 'الوصف:', value: tender.description },
                { label: 'الفئة:', value: tender.category },
                { label: 'الحالة:', value: tender.status },
                { label: 'الميزانية الدنيا:', value: `${tender.budget_min} ${tender.currency}` },
                { label: 'الميزانية العليا:', value: `${tender.budget_max} ${tender.currency}` },
                { label: 'تاريخ النشر:', value: new Date(tender.publish_date).toLocaleDateString('ar-TN') },
                { label: 'تاريخ الإغلاق:', value: new Date(tender.deadline).toLocaleDateString('ar-TN') },
                { label: 'تاريخ الفتح:', value: new Date(tender.opening_date).toLocaleDateString('ar-TN') }
            ];

            details.forEach(detail => {
                pdf.text(`${detail.label} ${detail.value}`, { align: 'right' });
                pdf.moveDown(0.4);
            });

            pdf.moveDown(1);

            // Buyer Information
            pdf.fontSize(14).font('Helvetica-Bold').text('معلومات المشتري', { align: 'right' });
            pdf.moveDown(0.5);
            pdf.fontSize(11).font('Helvetica');
            pdf.text(`الشركة: ${tender.company_name}`, { align: 'right' });
            pdf.text(`المسؤول: ${tender.full_name}`, { align: 'right' });
            pdf.moveDown(1);

            // Footer
            pdf.fontSize(9).text('---', { align: 'center' });
            pdf.text(`تم إنشاء هذا المستند بشكل آلي بواسطة نظام MyNet.tn في ${new Date().toLocaleString('ar-TN')}`, { align: 'center' });
            pdf.text('هذا المستند سري وقابل للتدقيق (Audit-Ready)', { align: 'center' });

            return pdf;
        } catch (error) {
            throw new Error(`Failed to generate tender PDF: ${error.message}`);
        }
    }

    async generateOfferEvaluationReport(offerId) {
        const pool = getPool();

        try {
            const result = await pool.query(
                `SELECT o.*, t.title as tender_title, s.company_name as supplier_name
                 FROM offers o
                 LEFT JOIN tenders t ON o.tender_id = t.id
                 LEFT JOIN users s ON o.supplier_id = s.id
                 WHERE o.id = $1`,
                [offerId]
            );

            if (result.rows.length === 0) {
                throw new Error('Offer not found');
            }

            const offer = result.rows[0];
            const pdf = new PDFDocument({
                size: 'A4',
                margin: 50,
                bufferPages: true
            });

            // Header
            pdf.fontSize(18).font('Helvetica-Bold').text('تقرير تقييم العرض', { align: 'right' });
            pdf.moveDown(0.5);
            pdf.fontSize(11).text(`رقم العرض: ${offer.offer_number}`, { align: 'right' });
            pdf.fontSize(11).text(`المناقصة: ${offer.tender_title}`, { align: 'right' });
            pdf.moveTo(50, pdf.y + 10).lineTo(550, pdf.y + 10).stroke();
            pdf.moveDown(1);

            // Offer Details
            pdf.fontSize(13).font('Helvetica-Bold').text('بيانات العرض', { align: 'right' });
            pdf.moveDown(0.5);
            pdf.fontSize(11).font('Helvetica');

            const offerDetails = [
                { label: 'المورد:', value: offer.supplier_name },
                { label: 'المبلغ الإجمالي:', value: `${offer.total_amount} TND` },
                { label: 'وقت التسليم:', value: offer.delivery_time },
                { label: 'شروط الدفع:', value: offer.payment_terms },
                { label: 'الحالة:', value: offer.status },
                { label: 'درجة التقييم:', value: offer.evaluation_score || 'قيد التقييم' },
                { label: 'ملاحظات التقييم:', value: offer.evaluation_notes || 'لا توجد ملاحظات' }
            ];

            offerDetails.forEach(detail => {
                pdf.text(`${detail.label} ${detail.value}`, { align: 'right' });
                pdf.moveDown(0.4);
            });

            pdf.moveDown(1);

            // Status
            if (offer.is_winner) {
                pdf.fontSize(13).font('Helvetica-Bold').fillColor('green').text('✓ هذا العرض فائز', { align: 'center' });
            } else {
                pdf.fontSize(13).font('Helvetica-Bold').fillColor('red').text('✗ هذا العرض لم يفز', { align: 'center' });
            }

            pdf.fillColor('black').moveDown(1);

            // Footer
            pdf.fontSize(9).text('---', { align: 'center' });
            pdf.text(`تم إنشاء هذا التقرير في ${new Date().toLocaleString('ar-TN')}`, { align: 'center' });
            pdf.text('وثيقة رسمية - محمية بحماية التوقيع الرقمي', { align: 'center' });

            return pdf;
        } catch (error) {
            throw new Error(`Failed to generate evaluation report: ${error.message}`);
        }
    }

    async generateAwardCertificate(tenderId, supplierId) {
        const pool = getPool();

        try {
            const result = await pool.query(
                `SELECT t.title, t.tender_number, u.company_name, u.full_name
                 FROM tenders t
                 LEFT JOIN users u ON u.id = $1
                 WHERE t.id = $2`,
                [supplierId, tenderId]
            );

            if (result.rows.length === 0) {
                throw new Error('Data not found');
            }

            const data = result.rows[0];
            const pdf = new PDFDocument({
                size: 'A4',
                margin: 60,
                bufferPages: true
            });

            // Decorative Header
            pdf.fontSize(10).text('═══════════════════════════════════════', { align: 'center' });
            pdf.fontSize(16).font('Helvetica-Bold').text('شهادة الترسية', { align: 'center' });
            pdf.fontSize(10).text('═══════════════════════════════════════', { align: 'center' });
            pdf.moveDown(1);

            // Body
            pdf.fontSize(12).font('Helvetica');
            pdf.text('تشهد هذه الشهادة بأن:', { align: 'center' });
            pdf.moveDown(1);

            pdf.fontSize(14).font('Helvetica-Bold').text(data.company_name, { align: 'center' });
            pdf.moveDown(0.5);

            pdf.fontSize(12).font('Helvetica');
            pdf.text('فاز بالمناقصة رقم:', { align: 'center' });
            pdf.fontSize(13).font('Helvetica-Bold').text(data.tender_number, { align: 'center' });
            pdf.moveDown(0.5);

            pdf.fontSize(12).font('Helvetica');
            pdf.text('الموضوع:', { align: 'center' });
            pdf.fontSize(13).font('Helvetica-Bold').text(data.title, { align: 'center' });
            pdf.moveDown(2);

            // Date
            pdf.fontSize(11);
            pdf.text(`تاريخ الترسية: ${new Date().toLocaleDateString('ar-TN')}`, { align: 'center' });
            pdf.moveDown(1);

            // Footer
            pdf.fontSize(9).text('═══════════════════════════════════════', { align: 'center' });
            pdf.text('وثيقة رسمية صادرة عن نظام MyNet.tn', { align: 'center' });

            return pdf;
        } catch (error) {
            throw new Error(`Failed to generate award certificate: ${error.message}`);
        }
    }

    async generateTransactionReport(supplierId, startDate, endDate) {
        const pool = getPool();

        try {
            const offersResult = await pool.query(
                `SELECT o.*, t.title as tender_title
                 FROM offers o
                 LEFT JOIN tenders t ON o.tender_id = t.id
                 WHERE o.supplier_id = $1 
                 AND o.created_at BETWEEN $2 AND $3
                 ORDER BY o.created_at DESC`,
                [supplierId, startDate, endDate]
            );

            const pdf = new PDFDocument({
                size: 'A4',
                margin: 50,
                bufferPages: true
            });

            // Header
            pdf.fontSize(16).font('Helvetica-Bold').text('تقرير سجل المعاملات', { align: 'right' });
            pdf.fontSize(10).text(`من: ${startDate} إلى: ${endDate}`, { align: 'right' });
            pdf.moveTo(50, pdf.y + 10).lineTo(550, pdf.y + 10).stroke();
            pdf.moveDown(1);

            // Table Header
            pdf.fontSize(10).font('Helvetica-Bold');
            pdf.text('رقم العرض', 55, pdf.y, { width: 100 });
            pdf.text('المناقصة', 155, pdf.y);
            pdf.text('المبلغ', 350, pdf.y);
            pdf.text('الحالة', 450, pdf.y);
            pdf.moveDown(0.7);
            pdf.moveTo(50, pdf.y).lineTo(550, pdf.y).stroke();
            pdf.moveDown(0.5);

            // Table Body
            pdf.fontSize(9).font('Helvetica');
            offersResult.rows.forEach(offer => {
                pdf.text(offer.offer_number, 55, pdf.y, { width: 100 });
                pdf.text(offer.tender_title, 155, pdf.y, { width: 190 });
                pdf.text(`${offer.total_amount} TND`, 350, pdf.y);
                pdf.text(offer.status, 450, pdf.y);
                pdf.moveDown(0.6);
            });

            pdf.moveDown(1);
            pdf.fontSize(9).text('---', { align: 'center' });
            pdf.text(`إجمالي العروض: ${offersResult.rows.length}`, { align: 'center' });
            pdf.text(`تم إنشاء التقرير في: ${new Date().toLocaleString('ar-TN')}`, { align: 'center' });

            return pdf;
        } catch (error) {
            throw new Error(`Failed to generate transaction report: ${error.message}`);
        }
    }
}

module.exports = new PDFService();
