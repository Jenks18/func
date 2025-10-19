-- ============================================
-- SAMPLE DATA INSERTION
-- This migration adds sample data to test the application
-- ============================================

-- ⚠️ IMPORTANT: Replace 'YOUR_ACTUAL_CLERK_USER_ID' below with your real Clerk user ID
-- You can find it by:
-- 1. Sign in to your app
-- 2. Open browser console
-- 3. Type: Clerk.user.id
-- 4. Copy the ID (format: user_XXXXXXXXXX)
-- 5. Replace ALL occurrences of 'YOUR_ACTUAL_CLERK_USER_ID' in this file

-- Using development keys from your .env:
-- NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_d2lsbGluZy1tYWxsYXJkLTk0LmNsZXJrLmFjY291bnRzLmRldiQ
-- CLERK_SECRET_KEY=sk_test_UM5luHVKExnOpuAn0uFGEwJOpypwHevTtvI7N4JwAe

-- Insert a sample organization if none exists
INSERT INTO organizations (id, name, created_by, plan)
SELECT 
  '00000000-0000-0000-0000-000000000001'::uuid,
  'Sample Property Management Co',
  'user_33vib6sN3jWakVJvXaFHBDmGHPg',
  'pro'
WHERE NOT EXISTS (SELECT 1 FROM organizations LIMIT 1);

-- Insert a sample user if none exists
INSERT INTO users (id, clerk_id, email, first_name, last_name, role, organization_id)
SELECT 
  '00000000-0000-0000-0000-000000000002'::uuid,
  'user_33vib6sN3jWakVJvXaFHBDmGHPg',
  'admin@sample.com',
  'John',
  'Doe',
  'org_admin',
  '00000000-0000-0000-0000-000000000001'::uuid
WHERE NOT EXISTS (SELECT 1 FROM users WHERE clerk_id = 'user_33vib6sN3jWakVJvXaFHBDmGHPg');

-- Insert sample properties
INSERT INTO properties (id, organization_id, name, address, city, state, zip_code, property_type)
VALUES
  (
    '10000000-0000-0000-0000-000000000001'::uuid,
    '00000000-0000-0000-0000-000000000001'::uuid,
    'Main Street Lofts',
    '101 Main St',
    'Milford Oaks',
    'OH',
    '45140',
    'apartment'
  ),
  (
    '10000000-0000-0000-0000-000000000002'::uuid,
    '00000000-0000-0000-0000-000000000001'::uuid,
    'Jefferson Ave Apartments',
    '456 Jefferson Ave',
    'Cincinnati',
    'OH',
    '45202',
    'apartment'
  ),
  (
    '10000000-0000-0000-0000-000000000003'::uuid,
    '00000000-0000-0000-0000-000000000001'::uuid,
    'Jefferson House',
    '789 Jefferson Blvd',
    'Columbus',
    'OH',
    '43215',
    'multi_family'
  ),
  (
    '10000000-0000-0000-0000-000000000004'::uuid,
    '00000000-0000-0000-0000-000000000001'::uuid,
    'Shiloh House',
    '321 Shiloh Dr',
    'Cleveland',
    'OH',
    '44101',
    'single_family'
  )
ON CONFLICT (id) DO NOTHING;

-- Insert sample units for Main Street Lofts
-- Using actual schema: organization_id (TEXT), square_feet (not square_footage), no rent_amount/deposit_amount
INSERT INTO units (id, organization_id, property_id, unit_number, bedrooms, bathrooms, square_feet, status)
VALUES
  ('20000000-0000-0000-0000-000000000001'::uuid, '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001'::uuid, '101', 2, 1.0, 850, 'occupied'),
  ('20000000-0000-0000-0000-000000000002'::uuid, '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001'::uuid, '102', 2, 1.0, 850, 'occupied'),
  ('20000000-0000-0000-0000-000000000003'::uuid, '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001'::uuid, '103', 1, 1.0, 650, 'available'),
  ('20000000-0000-0000-0000-000000000004'::uuid, '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001'::uuid, '201', 2, 2.0, 1000, 'occupied'),
  ('20000000-0000-0000-0000-000000000005'::uuid, '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001'::uuid, '202', 2, 2.0, 1000, 'occupied'),
  ('20000000-0000-0000-0000-000000000006'::uuid, '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001'::uuid, '203', 1, 1.0, 650, 'available')
ON CONFLICT (id) DO NOTHING;

-- Insert sample units for Jefferson Ave Apartments
INSERT INTO units (id, organization_id, property_id, unit_number, bedrooms, bathrooms, square_feet, status)
VALUES
  ('20000000-0000-0000-0000-000000000007'::uuid, '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002'::uuid, 'A1', 3, 2.0, 1200, 'occupied'),
  ('20000000-0000-0000-0000-000000000008'::uuid, '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002'::uuid, 'A2', 3, 2.0, 1200, 'occupied'),
  ('20000000-0000-0000-0000-000000000009'::uuid, '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002'::uuid, 'B1', 2, 1.5, 900, 'occupied'),
  ('20000000-0000-0000-0000-000000000010'::uuid, '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002'::uuid, 'B2', 2, 1.5, 900, 'available')
ON CONFLICT (id) DO NOTHING;

-- Insert sample units for Jefferson House
INSERT INTO units (id, organization_id, property_id, unit_number, bedrooms, bathrooms, square_feet, status)
VALUES
  ('20000000-0000-0000-0000-000000000011'::uuid, '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000003'::uuid, '1', 4, 2.5, 1800, 'occupied'),
  ('20000000-0000-0000-0000-000000000012'::uuid, '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000003'::uuid, '2', 4, 2.5, 1800, 'occupied'),
  ('20000000-0000-0000-0000-000000000013'::uuid, '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000003'::uuid, '3', 3, 2.0, 1500, 'occupied')
ON CONFLICT (id) DO NOTHING;

-- Insert sample units for Shiloh House
INSERT INTO units (id, organization_id, property_id, unit_number, bedrooms, bathrooms, square_feet, status)
VALUES
  ('20000000-0000-0000-0000-000000000014'::uuid, '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000004'::uuid, '1', 3, 2.0, 1400, 'occupied'),
  ('20000000-0000-0000-0000-000000000015'::uuid, '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000004'::uuid, '2', 3, 2.0, 1400, 'occupied')
ON CONFLICT (id) DO NOTHING;

-- Insert sample tenants
INSERT INTO tenants (id, organization_id, first_name, last_name, email, phone)
VALUES
  ('30000000-0000-0000-0000-000000000001'::uuid, '00000000-0000-0000-0000-000000000001'::uuid, 'Alice', 'Johnson', 'alice.johnson@email.com', '555-0101'),
  ('30000000-0000-0000-0000-000000000002'::uuid, '00000000-0000-0000-0000-000000000001'::uuid, 'Bob', 'Smith', 'bob.smith@email.com', '555-0102'),
  ('30000000-0000-0000-0000-000000000003'::uuid, '00000000-0000-0000-0000-000000000001'::uuid, 'Carol', 'Williams', 'carol.williams@email.com', '555-0103'),
  ('30000000-0000-0000-0000-000000000004'::uuid, '00000000-0000-0000-0000-000000000001'::uuid, 'David', 'Brown', 'david.brown@email.com', '555-0104'),
  ('30000000-0000-0000-0000-000000000005'::uuid, '00000000-0000-0000-0000-000000000001'::uuid, 'Emma', 'Davis', 'emma.davis@email.com', '555-0105'),
  ('30000000-0000-0000-0000-000000000006'::uuid, '00000000-0000-0000-0000-000000000001'::uuid, 'Frank', 'Miller', 'frank.miller@email.com', '555-0106')
ON CONFLICT (id) DO NOTHING;

-- Insert sample leases
-- Note: Your leases table requires lease_start_date (not nullable)
INSERT INTO leases (id, organization_id, property_id, unit_id, tenant_id, lease_start_date, lease_end_date, rent_amount, status)
VALUES
  ('40000000-0000-0000-0000-000000000001'::uuid, '00000000-0000-0000-0000-000000000001'::uuid, '10000000-0000-0000-0000-000000000001'::uuid, '20000000-0000-0000-0000-000000000001'::uuid, '30000000-0000-0000-0000-000000000001'::uuid, '2024-01-01', '2025-12-31', 1200.00, 'active'),
  ('40000000-0000-0000-0000-000000000002'::uuid, '00000000-0000-0000-0000-000000000001'::uuid, '10000000-0000-0000-0000-000000000001'::uuid, '20000000-0000-0000-0000-000000000002'::uuid, '30000000-0000-0000-0000-000000000002'::uuid, '2024-06-01', '2025-05-31', 1200.00, 'active'),
  ('40000000-0000-0000-0000-000000000003'::uuid, '00000000-0000-0000-0000-000000000001'::uuid, '10000000-0000-0000-0000-000000000001'::uuid, '20000000-0000-0000-0000-000000000004'::uuid, '30000000-0000-0000-0000-000000000003'::uuid, '2024-03-01', '2026-02-28', 1400.00, 'active'),
  ('40000000-0000-0000-0000-000000000004'::uuid, '00000000-0000-0000-0000-000000000001'::uuid, '10000000-0000-0000-0000-000000000002'::uuid, '20000000-0000-0000-0000-000000000007'::uuid, '30000000-0000-0000-0000-000000000004'::uuid, '2023-09-01', '2025-08-31', 1800.00, 'active'),
  ('40000000-0000-0000-0000-000000000005'::uuid, '00000000-0000-0000-0000-000000000001'::uuid, '10000000-0000-0000-0000-000000000003'::uuid, '20000000-0000-0000-0000-000000000011'::uuid, '30000000-0000-0000-0000-000000000005'::uuid, '2024-01-15', '2025-01-14', 2200.00, 'active'),
  ('40000000-0000-0000-0000-000000000006'::uuid, '00000000-0000-0000-0000-000000000001'::uuid, '10000000-0000-0000-0000-000000000004'::uuid, '20000000-0000-0000-0000-000000000014'::uuid, '30000000-0000-0000-0000-000000000006'::uuid, '2024-07-01', '2025-11-30', 1600.00, 'active')
ON CONFLICT (id) DO NOTHING;

-- Insert sample maintenance requests
INSERT INTO maintenance_requests (id, organization_id, property_id, unit_id, title, description, priority, status, category)
VALUES
  ('50000000-0000-0000-0000-000000000001'::uuid, '00000000-0000-0000-0000-000000000001'::uuid, '10000000-0000-0000-0000-000000000001'::uuid, '20000000-0000-0000-0000-000000000001'::uuid, 'Leaking Faucet', 'Kitchen faucet is dripping constantly', 'medium', 'open', 'plumbing'),
  ('50000000-0000-0000-0000-000000000002'::uuid, '00000000-0000-0000-0000-000000000001'::uuid, '10000000-0000-0000-0000-000000000002'::uuid, '20000000-0000-0000-0000-000000000007'::uuid, 'AC Not Working', 'Air conditioning unit not cooling', 'high', 'in_progress', 'hvac'),
  ('50000000-0000-0000-0000-000000000003'::uuid, '00000000-0000-0000-0000-000000000001'::uuid, '10000000-0000-0000-0000-000000000003'::uuid, '20000000-0000-0000-0000-000000000013'::uuid, 'Broken Window', 'Bedroom window cracked', 'high', 'open', 'general'),
  ('50000000-0000-0000-0000-000000000004'::uuid, '00000000-0000-0000-0000-000000000001'::uuid, '10000000-0000-0000-0000-000000000001'::uuid, '20000000-0000-0000-0000-000000000004'::uuid, 'Light Fixture', 'Bathroom light not working', 'low', 'open', 'electrical')
ON CONFLICT (id) DO NOTHING;

-- Insert sample transactions (income)
INSERT INTO transactions (id, organization_id, type, category, amount, date, description, property_id, unit_id, tenant_id)
VALUES
  ('60000000-0000-0000-0000-000000000001'::uuid, '00000000-0000-0000-0000-000000000001'::uuid, 'income', 'rent', 1200.00, '2024-10-01', 'October Rent - Unit 101', '10000000-0000-0000-0000-000000000001'::uuid, '20000000-0000-0000-0000-000000000001'::uuid, '30000000-0000-0000-0000-000000000001'::uuid),
  ('60000000-0000-0000-0000-000000000002'::uuid, '00000000-0000-0000-0000-000000000001'::uuid, 'income', 'rent', 1200.00, '2024-10-01', 'October Rent - Unit 102', '10000000-0000-0000-0000-000000000001'::uuid, '20000000-0000-0000-0000-000000000002'::uuid, '30000000-0000-0000-0000-000000000002'::uuid),
  ('60000000-0000-0000-0000-000000000003'::uuid, '00000000-0000-0000-0000-000000000001'::uuid, 'income', 'rent', 1800.00, '2024-10-01', 'October Rent - Unit A1', '10000000-0000-0000-0000-000000000002'::uuid, '20000000-0000-0000-0000-000000000007'::uuid, '30000000-0000-0000-0000-000000000004'::uuid),
  ('60000000-0000-0000-0000-000000000004'::uuid, '00000000-0000-0000-0000-000000000001'::uuid, 'expense', 'maintenance', 150.00, '2024-10-05', 'Plumbing repair', '10000000-0000-0000-0000-000000000001'::uuid, '20000000-0000-0000-0000-000000000001'::uuid, NULL),
  ('60000000-0000-0000-0000-000000000005'::uuid, '00000000-0000-0000-0000-000000000001'::uuid, 'expense', 'utilities', 450.00, '2024-10-10', 'Electric bill - Main Street Lofts', '10000000-0000-0000-0000-000000000001'::uuid, NULL, NULL)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- SUMMARY
-- ============================================

-- This migration adds:
-- ✅ 1 Sample organization
-- ✅ 1 Sample user (admin)
-- ✅ 4 Sample properties (Main Street Lofts, Jefferson Ave Apartments, Jefferson House, Shiloh House)
-- ✅ 15 Sample units across all properties
-- ✅ 6 Sample tenants
-- ✅ 6 Sample active leases
-- ✅ 4 Sample maintenance requests (2 open, 1 in_progress, 1 low priority)
-- ✅ 5 Sample transactions (3 rent income, 2 expenses)

-- All sample IDs use a specific UUID pattern (starting with specific numbers) to avoid conflicts
-- All inserts use ON CONFLICT DO NOTHING to safely re-run this migration

SELECT 'Sample data migration complete!' as status;
