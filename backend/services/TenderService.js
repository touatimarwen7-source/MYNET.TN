const crypto = require('crypto');
const { getPool } = require('../config/db');
const Tender = require('../models/Tender');
const NotificationService = require('./NotificationService');
const AuditLogService = require('./AuditLogService');
const QueueService = require('./QueueService');

class TenderService {
    generateTenderNumber() {
        const timestamp = new Date().toISOString().split('T')[0].replace(/-/g, '');
        const randomPart = crypto.randomBytes(4).toString('hex').toUpperCase();
        return `TND-${timestamp}-${randomPart}`;
    }

    // Map frontend field names to database column names
    mapFrontendToDatabaseFields(tenderData) {
        const mapped = {};
        
        // Database fields that directly exist
        const directFields = [
            'title', 'description', 'category', 'budget_min', 'budget_max',
            'currency', 'status', 'deadline', 'opening_date', 'requirements',
            'attachments', 'lots', 'participation_eligibility', 'mandatory_documents',
            'disqualification_criteria', 'submission_method', 'sealed_envelope_requirements',
            'contact_person', 'contact_email', 'contact_phone', 'technical_specifications',
            'queries_start_date', 'queries_end_date', 'offer_validity_days', 'alert_type',
            'is_public', 'evaluation_criteria'
        ];
        
        // Copy direct fields
        directFields.forEach(field => {
            if (tenderData[field] !== undefined) {
                mapped[field] = tenderData[field];
            }
        });
        
        // Map frontend-specific names to database columns
        if (tenderData.publish_date !== undefined) {
            mapped.publish_date = tenderData.publish_date;
        } else if (tenderData.publication_date !== undefined) {
            // Map publication_date to publish_date
            mapped.publish_date = tenderData.publication_date;
        }
        
        // Merge specification_documents into attachments
        if (tenderData.specification_documents && Array.isArray(tenderData.specification_documents)) {
            mapped.attachments = mapped.attachments || [];
            mapped.attachments = [
                ...mapped.attachments,
                ...tenderData.specification_documents
            ];
        }
        
        // Fields to ignore (not in database schema):
        // - consultation_number
        // - quantity_required
        // - unit
        // - awardLevel (not stored in tender table)
        
        return mapped;
    }

    async createTender(tenderData, userId) {
        const pool = getPool();
        
        // Map frontend data to database schema
        const mappedData = this.mapFrontendToDatabaseFields(tenderData);

        try {
            const tenderNumber = this.generateTenderNumber();

            // Prepare values directly without creating Tender model (to avoid inheritance issues)
            const values = [
                tenderNumber,
                mappedData.title || '',
                mappedData.description || '',
                mappedData.category || 'technology',
                mappedData.budget_min || 0,
                mappedData.budget_max || 0,
                mappedData.currency || 'TND',
                mappedData.status || 'draft',
                mappedData.publish_date || null,
                mappedData.deadline || null,
                mappedData.opening_date || null,
                JSON.stringify(mappedData.requirements || []),
                JSON.stringify(mappedData.attachments || []),
                JSON.stringify(mappedData.lots || []),
                mappedData.participation_eligibility || '',
                JSON.stringify(mappedData.mandatory_documents || []),
                mappedData.disqualification_criteria || '',
                mappedData.submission_method || 'electronic',
                mappedData.sealed_envelope_requirements || '',
                mappedData.contact_person || '',
                mappedData.contact_email || '',
                mappedData.contact_phone || '',
                mappedData.technical_specifications || '',
                mappedData.queries_start_date || null,
                mappedData.queries_end_date || null,
                mappedData.offer_validity_days || 90,
                mappedData.alert_type || 'before_48h',
                userId,
                mappedData.is_public !== undefined ? mappedData.is_public : true,
                JSON.stringify(mappedData.evaluation_criteria || {}),
                userId
            ];

            const result = await pool.query(
                `INSERT INTO tenders (tender_number, title, description, category, budget_min, budget_max,
                 currency, status, publish_date, deadline, opening_date, requirements, attachments, lots,
                 participation_eligibility, mandatory_documents, disqualification_criteria,
                 submission_method, sealed_envelope_requirements, contact_person, contact_email, contact_phone,
                 technical_specifications, queries_start_date, queries_end_date, offer_validity_days, alert_type,
                 buyer_id, is_public, evaluation_criteria, created_by)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31)
                 RETURNING *`,
                values
            );

            // Log the audit trail for tender creation
            await AuditLogService.log(userId, 'tender', result.rows[0].id, 'create', 'Tender created successfully');

            // Log to audit
            await QueueService.logTenderHistory({
                tender_id: result.rows[0].id,
                user_id: userId,
                action: 'created',
                previous_state: null,
                new_state: 'draft',
                metadata: { title: tenderData.title }
            });

            return result.rows[0];
        } catch (error) {
            // Log the audit trail for failed tender creation
            await AuditLogService.log(userId, 'tender', null, 'create', `Failed to create tender: ${error.message}`);
            throw new Error(`Failed to create tender: ${error.message}`);
        }
    }

    async getTenderById(tenderId) {
        const pool = getPool();

        try {
            const result = await pool.query(
                'SELECT * FROM tenders WHERE id = $1 AND is_deleted = FALSE',
                [tenderId]
            );

            // Log the audit trail for fetching tender by ID
            await AuditLogService.log(null, 'tender', tenderId, 'read', 'Tender fetched by ID');


            return result.rows[0] || null;
        } catch (error) {
            // Log the audit trail for failed tender fetching
            await AuditLogService.log(null, 'tender', tenderId, 'read', `Failed to get tender by ID: ${error.message}`);
            throw new Error(`Failed to get tender: ${error.message}`);
        }
    }

    async getAllTenders(filters = {}, userId) {
        const pool = getPool();
        let query = 'SELECT * FROM tenders WHERE is_deleted = FALSE';
        const params = [];
        let paramCount = 1;

        if (filters.status) {
            query += ` AND status = $${paramCount}`;
            params.push(filters.status);
            paramCount++;
        }

        if (filters.category) {
            query += ` AND category = $${paramCount}`;
            params.push(filters.category);
            paramCount++;
        }

        if (filters.is_public !== undefined) {
            query += ` AND is_public = $${paramCount}`;
            params.push(filters.is_public);
            paramCount++;
        }

        query += ' ORDER BY created_at DESC';

        if (filters.limit) {
            query += ` LIMIT $${paramCount}`;
            params.push(filters.limit);
            paramCount++;
        }

        try {
            const result = await pool.query(query, params);

            // Log the audit trail for fetching all tenders
            await AuditLogService.log(userId, 'tender', null, 'read', 'All tenders fetched with filters');


            return result.rows;
        } catch (error) {
            // Log the audit trail for failed fetching all tenders
            await AuditLogService.log(userId, 'tender', null, 'read', `Failed to get tenders: ${error.message}`);
            throw new Error(`Failed to get tenders: ${error.message}`);
        }
    }

    async getMyTenders(userId, filters = {}) {
        const pool = getPool();
        let query = 'SELECT * FROM tenders WHERE is_deleted = FALSE AND created_by = $1';
        const params = [userId];
        let paramCount = 2;

        if (filters.status) {
            query += ` AND status = $${paramCount}`;
            params.push(filters.status);
            paramCount++;
        }

        if (filters.category) {
            query += ` AND category = $${paramCount}`;
            params.push(filters.category);
            paramCount++;
        }

        query += ' ORDER BY created_at DESC';

        if (filters.limit) {
            query += ` LIMIT $${paramCount}`;
            params.push(filters.limit);
            paramCount++;
        }

        try {
            const result = await pool.query(query, params);
            await AuditLogService.log(userId, 'tender', null, 'read', 'My tenders fetched');
            return result.rows;
        } catch (error) {
            await AuditLogService.log(userId, 'tender', null, 'read', `Failed to get my tenders: ${error.message}`);
            throw new Error(`Failed to get my tenders: ${error.message}`);
        }
    }

    async updateTender(tenderId, updateData, userId) {
        const pool = getPool();

        try {
            const fields = [];
            const values = [];
            let paramCount = 1;

            Object.keys(updateData).forEach(key => {
                if (key !== 'id' && updateData[key] !== undefined) {
                    fields.push(`${key} = $${paramCount}`);
                    values.push(updateData[key]);
                    paramCount++;
                }
            });

            fields.push(`updated_at = CURRENT_TIMESTAMP`);
            fields.push(`updated_by = $${paramCount}`);
            values.push(userId);
            paramCount++;

            values.push(tenderId);

            const query = `UPDATE tenders SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`;
            const result = await pool.query(query, values);

            // Log the audit trail for tender update
            await AuditLogService.log(userId, 'tender', tenderId, 'update', 'Tender updated successfully');


            return result.rows[0];
        } catch (error) {
            // Log the audit trail for failed tender update
            await AuditLogService.log(userId, 'tender', tenderId, 'update', `Failed to update tender: ${error.message}`);
            throw new Error(`Failed to update tender: ${error.message}`);
        }
    }

    async deleteTender(tenderId, userId) {
        const pool = getPool();

        try {
            await pool.query(
                'UPDATE tenders SET is_deleted = TRUE, updated_by = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
                [userId, tenderId]
            );

            // Log the audit trail for tender deletion
            await AuditLogService.log(userId, 'tender', tenderId, 'delete', 'Tender deleted successfully');


            return { success: true, message: 'Tender deleted successfully' };
        } catch (error) {
            // Log the audit trail for failed tender deletion
            await AuditLogService.log(userId, 'tender', tenderId, 'delete', `Failed to delete tender: ${error.message}`);
            throw new Error(`Failed to delete tender: ${error.message}`);
        }
    }

    async publishTender(tenderId, userId) {
        const pool = getPool();

        try {
            const result = await pool.query(
                `UPDATE tenders SET status = 'published', publish_date = CURRENT_TIMESTAMP,
                 updated_by = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`,
                [userId, tenderId]
            );

            // Log the audit trail for tender publication
            await AuditLogService.log(userId, 'tender', tenderId, 'publish', 'Tender published successfully');


            return result.rows[0];
        } catch (error) {
            // Log the audit trail for failed tender publication
            await AuditLogService.log(userId, 'tender', tenderId, 'publish', `Failed to publish tender: ${error.message}`);
            throw new Error(`Failed to publish tender: ${error.message}`);
        }
    }

    async closeTender(tenderId, userId) {
        const pool = getPool();

        try {
            const result = await pool.query(
                `UPDATE tenders SET status = 'closed', updated_by = $1, updated_at = CURRENT_TIMESTAMP
                 WHERE id = $2 RETURNING *`,
                [userId, tenderId]
            );

            // Log the audit trail for tender closure
            await AuditLogService.log(userId, 'tender', tenderId, 'close', 'Tender closed successfully');


            return result.rows[0];
        } catch (error) {
            // Log the audit trail for failed tender closure
            await AuditLogService.log(userId, 'tender', tenderId, 'close', `Failed to close tender: ${error.message}`);
            throw new Error(`Failed to close tender: ${error.message}`);
        }
    }
}

module.exports = new TenderService();