-- ============================================
-- STEP 1: CHECK YOUR EXISTING LEASES
-- ============================================
-- Run this first to see what lease IDs you actually have:

SELECT 
  l.id AS lease_id,
  p.name AS property_name,
  u.unit_number,
  CONCAT(t.first_name, ' ', t.last_name) AS tenant_name,
  l.rent_amount,
  l.status AS lease_status
FROM leases l
LEFT JOIN properties p ON l.property_id = p.id
LEFT JOIN units u ON l.unit_id = u.id
LEFT JOIN tenants t ON l.tenant_id = t.id
WHERE l.organization_id = '00000000-0000-0000-0000-000000000001'
ORDER BY p.name, u.unit_number;

-- ============================================
-- STEP 2: ADD SAMPLE TRANSACTIONS
-- ============================================
-- After you see the lease IDs above, replace the UUIDs below with actual lease IDs
-- Then uncomment and run this INSERT statement:

/*
INSERT INTO transactions (organization_id, property_id, unit_id, tenant_id, lease_id, type, category, amount, date, description, payment_method, status)
VALUES 
  -- Example: Replace 'LEASE-ID-HERE' with actual lease ID from query above
  ('00000000-0000-0000-0000-000000000001', 
   (SELECT property_id FROM leases WHERE id = 'LEASE-ID-HERE'), 
   (SELECT unit_id FROM leases WHERE id = 'LEASE-ID-HERE'), 
   (SELECT tenant_id FROM leases WHERE id = 'LEASE-ID-HERE'), 
   'LEASE-ID-HERE', 
   'income', 
   'rent', 
   1200.00, 
   '2024-10-01', 
   'October 2024 Rent Payment', 
   'bank_transfer', 
   'completed');
*/

-- ============================================
-- STEP 3: VERIFY TRANSACTIONS WERE ADDED
-- ============================================
-- After adding transactions, run this to verify:

SELECT 
  t.date,
  t.type,
  t.category,
  t.amount,
  t.description,
  p.name AS property_name,
  u.unit_number,
  CONCAT(ten.first_name, ' ', ten.last_name) AS tenant_name
FROM transactions t
LEFT JOIN properties p ON t.property_id = p.id
LEFT JOIN units u ON t.unit_id = u.id
LEFT JOIN tenants ten ON t.tenant_id = ten.id
WHERE t.organization_id = '00000000-0000-0000-0000-000000000001'
ORDER BY t.date DESC;
