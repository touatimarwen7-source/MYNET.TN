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

-- ============ COMPOSITE INDEXES (Most Important) ============
CREATE INDEX IF NOT EXISTS idx_offers_tender_status ON offers(tender_id, status);
CREATE INDEX IF NOT EXISTS idx_tenders_buyer_status ON tenders(buyer_id, status);
CREATE INDEX IF NOT EXISTS idx_offers_supplier_status ON offers(supplier_id, status);

-- Check index creation
SELECT 
  schemaname, tablename, indexname
FROM pg_indexes 
WHERE schemaname = 'public'
ORDER BY tablename, indexname;
