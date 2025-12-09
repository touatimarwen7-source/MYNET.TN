
-- ============================================================================
-- BUYER DASHBOARD OPTIMIZED INDEXES
-- ============================================================================

-- Composite index for buyer dashboard stats
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_tenders_buyer_status_deleted 
ON tenders(buyer_id, status, is_deleted) 
WHERE is_deleted = false;

-- Index for offer counts by tender
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_offers_tender_deleted 
ON offers(tender_id, is_deleted) 
WHERE is_deleted = false;

-- Composite index for analytics queries
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_tenders_buyer_created_status 
ON tenders(buyer_id, created_at DESC, status) 
WHERE is_deleted = false AND created_at >= CURRENT_DATE - INTERVAL '6 months';

-- Index for joining offers with tenders
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_offers_tender_buyer 
ON offers(tender_id) 
INCLUDE (is_deleted, created_at);

-- Analyze tables
ANALYZE tenders;
ANALYZE offers;
