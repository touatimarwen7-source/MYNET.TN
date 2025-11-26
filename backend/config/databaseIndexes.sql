-- 📊 Database Optimization Indexes
-- Significantly improves query performance for large datasets

-- ============ OFFERS TABLE INDEXES ============
CREATE INDEX IF NOT EXISTS idx_offers_tender_id ON offers(tender_id);
CREATE INDEX IF NOT EXISTS idx_offers_supplier_id ON offers(supplier_id);
CREATE INDEX IF NOT EXISTS idx_offers_status ON offers(status);
CREATE INDEX IF NOT EXISTS idx_offers_award_status ON offers(award_status);
CREATE INDEX IF NOT EXISTS idx_offers_submitted_at ON offers(submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_offers_tender_supplier ON offers(tender_id, supplier_id);
CREATE INDEX IF NOT EXISTS idx_offers_ranking ON offers(ranking);

-- ============ TENDERS TABLE INDEXES ============
CREATE INDEX IF NOT EXISTS idx_tenders_buyer_id ON tenders(buyer_id);
CREATE INDEX IF NOT EXISTS idx_tenders_status ON tenders(status);
CREATE INDEX IF NOT EXISTS idx_tenders_deadline ON tenders(deadline DESC);
CREATE INDEX IF NOT EXISTS idx_tenders_created_at ON tenders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tenders_is_public ON tenders(is_public);
CREATE INDEX IF NOT EXISTS idx_tenders_category ON tenders(category);
CREATE INDEX IF NOT EXISTS idx_tenders_is_deleted ON tenders(is_deleted);

-- ============ USERS TABLE INDEXES ============
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);

-- ============ PURCHASE ORDERS INDEXES ============
CREATE INDEX IF NOT EXISTS idx_po_tender_id ON purchase_orders(tender_id);
CREATE INDEX IF NOT EXISTS idx_po_supplier_id ON purchase_orders(supplier_id);
CREATE INDEX IF NOT EXISTS idx_po_buyer_id ON purchase_orders(buyer_id);
CREATE INDEX IF NOT EXISTS idx_po_status ON purchase_orders(status);

-- ============ INVOICES INDEXES ============
CREATE INDEX IF NOT EXISTS idx_invoices_po_id ON invoices(po_id);
CREATE INDEX IF NOT EXISTS idx_invoices_supplier_id ON invoices(supplier_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);

-- ============ MESSAGES INDEXES ============
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_recipient_id ON messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_messages_entity ON messages(entity_type, entity_id);

-- ============ ADDENDA & INQUIRIES INDEXES ============
CREATE INDEX IF NOT EXISTS idx_addenda_tender_id ON addenda(tender_id);
CREATE INDEX IF NOT EXISTS idx_addenda_published_at ON addenda(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_inquiries_tender_id ON tender_inquiries(tender_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_supplier_id ON tender_inquiries(supplier_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON tender_inquiries(status);

-- ============ AUDIT & REVIEWS INDEXES ============
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_reviews_supplier_id ON reviews(supplier_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);

-- ============ COMPOSITE INDEXES (Most Important for N+1 prevention) ============
CREATE INDEX IF NOT EXISTS idx_offers_tender_status ON offers(tender_id, status);
CREATE INDEX IF NOT EXISTS idx_tenders_buyer_status ON tenders(buyer_id, status);
CREATE INDEX IF NOT EXISTS idx_offers_supplier_status ON offers(supplier_id, status);
CREATE INDEX IF NOT EXISTS idx_offers_tender_deleted ON offers(tender_id, is_deleted);
CREATE INDEX IF NOT EXISTS idx_tenders_buyer_deleted ON tenders(buyer_id, is_deleted);

-- ============ SOFT DELETE OPTIMIZATION ============
CREATE INDEX IF NOT EXISTS idx_tenders_deleted_filter ON tenders(is_deleted, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_offers_deleted_filter ON offers(is_deleted, submitted_at DESC);

-- Check index creation
SELECT 
  schemaname, tablename, indexname, idx_scan, idx_tup_read, idx_tup_fetch
FROM pg_stat_user_indexes 
WHERE schemaname = 'public'
ORDER BY idx_scan DESC, tablename, indexname;
