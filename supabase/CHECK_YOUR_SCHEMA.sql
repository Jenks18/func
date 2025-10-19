-- ============================================
-- DATABASE SCHEMA INSPECTOR
-- Run this in Supabase SQL Editor to see your actual table structures
-- ============================================

-- Check all columns in the PROPERTIES table
SELECT 
  column_name, 
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'properties'
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check all columns in the UNITS table
SELECT 
  column_name, 
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'units'
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check all columns in the LEASES table
SELECT 
  column_name, 
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'leases'
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check all columns in the TENANTS table
SELECT 
  column_name, 
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'tenants'
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check all columns in the MAINTENANCE_REQUESTS table
SELECT 
  column_name, 
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'maintenance_requests'
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check all columns in the TRANSACTIONS table
SELECT 
  column_name, 
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'transactions'
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- ============================================
-- INSTRUCTIONS
-- ============================================

-- 1. Run each query above separately in Supabase SQL Editor
-- 2. Copy the results and share them
-- 3. We'll create a sample data script that matches your EXACT schema
-- 4. This will prevent any more column errors

-- Example: If 'units' only has: id, property_id, unit_number, status
-- Then we'll only use those columns in the INSERT statements
