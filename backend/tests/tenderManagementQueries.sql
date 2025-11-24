-- Tender Management Testing Database Queries

-- 1. Check award status
SELECT 
  o.offer_number,
  u.company_name,
  o.final_score,
  o.award_status,
  o.awarded_at,
  o.ranking
FROM offers o
LEFT JOIN users u ON o.supplier_id = u.id
WHERE o.tender_id = [tender_id]
ORDER BY o.ranking ASC;

-- 2. Verify document archives
SELECT 
  archive_id,
  document_type,
  retention_years,
  expiration_date,
  archived_at,
  status
FROM document_archives
WHERE document_ref_id = [tender_id]
ORDER BY archived_at DESC;

-- 3. Check tender cancellation
SELECT 
  id,
  tender_number,
  status,
  cancellation_reason,
  cancelled_at
FROM tenders
WHERE id = [tender_id];

-- 4. Verify all offers are cancelled
SELECT 
  offer_number,
  status,
  is_deleted
FROM offers
WHERE tender_id = [tender_id] AND status = 'cancelled';

-- 5. Archive retention compliance
SELECT 
  COUNT(*) as total_archives,
  SUM(CASE WHEN expiration_date > NOW() THEN 1 ELSE 0 END) as active_archives,
  SUM(CASE WHEN status = 'expired' THEN 1 ELSE 0 END) as expired_archives,
  MIN(retention_years) as min_retention_years,
  MAX(retention_years) as max_retention_years
FROM document_archives;

-- 6. Award notification history
SELECT 
  offer_number,
  award_status,
  awarded_at,
  LAG(awarded_at) OVER (ORDER BY awarded_at) as previous_award_time
FROM offers
WHERE award_status = 'awarded'
ORDER BY awarded_at DESC
LIMIT 10;

-- 7. Cancellation audit trail
SELECT 
  id,
  tender_number,
  cancelled_at,
  cancellation_reason,
  COUNT(DISTINCT o.id) as cancelled_offers
FROM tenders t
LEFT JOIN offers o ON t.id = o.tender_id
WHERE t.status = 'cancelled'
GROUP BY t.id
ORDER BY t.cancelled_at DESC;

-- 8. Legal compliance check (7-year retention)
SELECT 
  archived_at,
  expiration_date,
  document_type,
  EXTRACT(YEAR FROM expiration_date - archived_at) as retention_years_actual,
  CASE 
    WHEN EXTRACT(YEAR FROM expiration_date - archived_at) = 7 THEN 'COMPLIANT'
    ELSE 'NON_COMPLIANT'
  END as compliance_status
FROM document_archives
WHERE status != 'expired';

-- 9. Performance metrics
SELECT 
  AVG(EXTRACT(EPOCH FROM awarded_at)) as avg_award_time,
  COUNT(DISTINCT CASE WHEN award_status = 'awarded' THEN 1 END) as total_awarded,
  COUNT(DISTINCT CASE WHEN status = 'cancelled' THEN tender_id END) as total_cancelled_tenders
FROM offers o
LEFT JOIN tenders t ON o.tender_id = t.id;

-- 10. Data integrity check
SELECT 
  COUNT(DISTINCT archive_id) as unique_archives,
  COUNT(*) as total_archive_records,
  SUM(CASE WHEN encrypted_data IS NOT NULL THEN 1 ELSE 0 END) as encrypted_records
FROM document_archives;

