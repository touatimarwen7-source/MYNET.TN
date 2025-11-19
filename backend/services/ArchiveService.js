
const { getPool } = require('../config/db');
const AuditLogService = require('./AuditLogService');

class ArchiveService {
    /**
     * Get archive policy for entity type
     */
    async getArchivePolicy(entityType) {
        const pool = getPool();
        
        try {
            const result = await pool.query(
                'SELECT * FROM archive_policies WHERE entity_type = $1 AND is_active = TRUE',
                [entityType]
            );
            
            return result.rows[0] || { retention_days: 2555 }; // Default 7 years
        } catch (error) {
            throw new Error(`Failed to get archive policy: ${error.message}`);
        }
    }

    /**
     * Archive old documents based on retention policy
     */
    async archiveOldDocuments(entityType) {
        const pool = getPool();
        const client = await pool.connect();
        
        try {
            await client.query('BEGIN');
            
            const policy = await this.getArchivePolicy(entityType);
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - policy.retention_days);
            
            let table;
            switch (entityType) {
                case 'tender':
                    table = 'tenders';
                    break;
                case 'offer':
                    table = 'offers';
                    break;
                case 'invoice':
                    table = 'invoices';
                    break;
                case 'purchase_order':
                    table = 'purchase_orders';
                    break;
                default:
                    throw new Error('Invalid entity type');
            }
            
            // Mark documents for archiving
            const result = await client.query(
                `UPDATE ${table} 
                 SET is_archived = TRUE, archived_at = CURRENT_TIMESTAMP 
                 WHERE created_at < $1 AND is_archived = FALSE AND is_deleted = FALSE
                 RETURNING id`,
                [cutoffDate]
            );
            
            await AuditLogService.log(null, 'system', null, 'archive', 
                `Archived ${result.rows.length} ${entityType} documents older than ${policy.retention_days} days`);
            
            await client.query('COMMIT');
            return result.rows.length;
        } catch (error) {
            await client.query('ROLLBACK');
            throw new Error(`Failed to archive documents: ${error.message}`);
        } finally {
            client.release();
        }
    }

    /**
     * Schedule archive job (called by cron)
     */
    async runArchiveJob() {
        const entityTypes = ['tender', 'offer', 'invoice', 'purchase_order'];
        const results = {};
        
        for (const type of entityTypes) {
            try {
                results[type] = await this.archiveOldDocuments(type);
            } catch (error) {
                results[type] = { error: error.message };
            }
        }
        
        return results;
    }
}

module.exports = new ArchiveService();
