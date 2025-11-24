-- Database Verification Queries for Inquiry & Addenda System

-- 1. Check if all inquiry-related tables exist and have data
SELECT COUNT(*) as inquiry_count FROM tender_inquiries;
SELECT COUNT(*) as response_count FROM inquiry_responses;
SELECT COUNT(*) as addenda_count FROM addenda;
SELECT COUNT(*) as notification_count FROM addendum_notifications;

-- 2. View recent inquiries with supplier info
SELECT 
  ti.id,
  ti.tender_id,
  ti.subject,
  ti.status,
  u.username as supplier_name,
  u.email as supplier_email,
  ti.submitted_at
FROM tender_inquiries ti
LEFT JOIN users u ON ti.supplier_id = u.id
ORDER BY ti.submitted_at DESC
LIMIT 10;

-- 3. View inquiry responses with responder info
SELECT 
  ir.id,
  ir.inquiry_id,
  ir.response_text,
  u.username as answered_by,
  ir.is_public,
  ir.answered_at
FROM inquiry_responses ir
LEFT JOIN users u ON ir.answered_by = u.id
ORDER BY ir.answered_at DESC
LIMIT 10;

-- 4. View published addenda
SELECT 
  id,
  addendum_number,
  title,
  version,
  published_at,
  published_by
FROM addenda
ORDER BY published_at DESC
LIMIT 10;

-- 5. View addendum notifications with details
SELECT 
  an.id,
  a.addendum_number,
  u.email as recipient_email,
  an.sent_at,
  an.read_at,
  an.notification_method
FROM addendum_notifications an
LEFT JOIN addenda a ON an.addendum_id = a.id
LEFT JOIN users u ON an.user_id = u.id
ORDER BY an.sent_at DESC
LIMIT 20;

-- 6. Check indexes were created
SELECT indexname FROM pg_indexes 
WHERE tablename IN ('tender_inquiries', 'inquiry_responses', 'addenda', 'addendum_notifications')
ORDER BY tablename, indexname;

-- 7. Verify data integrity - inquiries with responses
SELECT 
  ti.id as inquiry_id,
  ti.subject,
  COUNT(ir.id) as response_count
FROM tender_inquiries ti
LEFT JOIN inquiry_responses ir ON ti.id = ir.inquiry_id
GROUP BY ti.id, ti.subject
ORDER BY inquiry_id DESC;

-- 8. Check soft deletes (should be FALSE for active records)
SELECT 
  'tender_inquiries' as table_name,
  COUNT(*) as total,
  SUM(CASE WHEN is_deleted = FALSE THEN 1 ELSE 0 END) as active_count
FROM tender_inquiries
UNION ALL
SELECT 
  'inquiry_responses' as table_name,
  COUNT(*) as total,
  SUM(CASE WHEN is_deleted = FALSE THEN 1 ELSE 0 END) as active_count
FROM inquiry_responses
UNION ALL
SELECT 
  'addenda' as table_name,
  COUNT(*) as total,
  SUM(CASE WHEN is_deleted = FALSE THEN 1 ELSE 0 END) as active_count
FROM addenda;

