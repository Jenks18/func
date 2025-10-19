-- ============================================
-- COMPLETE TENANT & LEASE SETUP REFERENCE
-- NO MIGRATION NEEDED - This is what you already have
-- ============================================
-- This file documents your current database schema
-- The tenant_id constraint fix only required code changes, not SQL
-- ============================================

-- Your existing tables already have the correct structure:

-- TENANTS TABLE (Already exists with correct schema)
-- ================================================
CREATE TABLE IF NOT EXISTS tenants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tenants_organization_id ON tenants(organization_id);
CREATE INDEX IF NOT EXISTS idx_tenants_email ON tenants(email);
CREATE INDEX IF NOT EXISTS idx_tenants_status ON tenants(status);

-- LEASES TABLE (Already exists with correct FK constraint)
-- ========================================================
CREATE TABLE IF NOT EXISTS leases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE NOT NULL,
  unit_id UUID REFERENCES units(id) ON DELETE CASCADE,
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE NOT NULL,  -- ✅ This constraint already exists
  lease_start_date DATE NOT NULL,
  lease_end_date DATE NOT NULL,
  rent_amount DECIMAL(10, 2) NOT NULL,
  deposit_amount DECIMAL(10, 2),
  payment_due_day INTEGER DEFAULT 1,
  status TEXT DEFAULT 'active' CHECK (status IN ('draft', 'active', 'expired', 'terminated')),
  lease_terms TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_leases_tenant_id ON leases(tenant_id);

-- RLS POLICIES (Already enabled and configured)
-- =============================================
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE leases ENABLE ROW LEVEL SECURITY;

-- Tenants policies
CREATE POLICY "Users can view tenants in their organization"
  ON tenants FOR SELECT
  USING (organization_id = (auth.jwt() -> 'app_metadata' ->> 'organization_id')::uuid);

CREATE POLICY "Users can create tenants in their organization"  -- ✅ This allows tenant creation
  ON tenants FOR INSERT
  WITH CHECK (organization_id = (auth.jwt() -> 'app_metadata' ->> 'organization_id')::uuid);

CREATE POLICY "Users can update tenants in their organization"
  ON tenants FOR UPDATE
  USING (organization_id = (auth.jwt() -> 'app_metadata' ->> 'organization_id')::uuid);

CREATE POLICY "Users can delete tenants in their organization"
  ON tenants FOR DELETE
  USING (organization_id = (auth.jwt() -> 'app_metadata' ->> 'organization_id')::uuid);

-- Leases policies
CREATE POLICY "Users can view leases in their organization"
  ON leases FOR SELECT
  USING (organization_id = (auth.jwt() -> 'app_metadata' ->> 'organization_id')::uuid);

CREATE POLICY "Users can create leases in their organization"  -- ✅ This allows lease creation
  ON leases FOR INSERT
  WITH CHECK (organization_id = (auth.jwt() -> 'app_metadata' ->> 'organization_id')::uuid);

CREATE POLICY "Users can update leases in their organization"
  ON leases FOR UPDATE
  USING (organization_id = (auth.jwt() -> 'app_metadata' ->> 'organization_id')::uuid);

CREATE POLICY "Users can delete leases in their organization"
  ON leases FOR DELETE
  USING (organization_id = (auth.jwt() -> 'app_metadata' ->> 'organization_id')::uuid);

-- ============================================
-- WHAT WAS FIXED?
-- ============================================
-- The database schema was already correct!
-- The error "null value in tenant_id violates not-null constraint" happened because:
--
-- ❌ OLD CODE: Tried to create lease with tenant_id = null (no tenant existed yet)
-- ✅ NEW CODE: Creates tenant records FIRST, then uses their IDs when creating lease
--
-- This is a code-level fix, not a database migration.
-- See TENANT_CREATION_FIX.md for the code changes.
-- ============================================

-- VERIFY YOUR SCHEMA (Run this to confirm everything is set up)
-- ============================================================

-- 1. Check tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('properties', 'units', 'tenants', 'leases', 'files')
ORDER BY table_name;

-- 2. Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('tenants', 'leases');

-- 3. Verify tenant_id constraint exists
SELECT
  tc.constraint_name,
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_name = 'leases'
  AND kcu.column_name = 'tenant_id';

-- Expected result: Should show tenant_id references tenants(id)

-- ============================================
-- TESTING THE FIX
-- ============================================
-- To test that tenant creation works:

-- 1. Go to your Create Lease wizard
-- 2. Fill out all steps including adding a tenant
-- 3. Click "Create Lease"
-- 4. Check console logs for the creation sequence:
--    - "Creating tenants..."
--    - "Tenant created: [tenant data]"
--    - "Creating lease with data: [lease data]"
--    - "Lease created successfully: [lease data]"
-- 5. Verify in Supabase:
SELECT 
  t.first_name,
  t.last_name,
  t.email,
  l.rent_amount,
  l.lease_start_date,
  l.lease_end_date
FROM leases l
JOIN tenants t ON l.tenant_id = t.id
ORDER BY l.created_at DESC
LIMIT 5;

-- You should see your newly created lease with the tenant's name
