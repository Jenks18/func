-- ============================================
-- ADD TRANSACTIONS TABLE TO EXISTING DATABASE
-- ============================================
-- Run this in your Supabase SQL Editor to add the missing transactions table

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id TEXT NOT NULL,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  unit_id UUID REFERENCES units(id) ON DELETE CASCADE,
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  lease_id UUID REFERENCES leases(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  category TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
  date DATE NOT NULL,
  description TEXT,
  payment_method TEXT,
  reference_number TEXT,
  status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_transactions_organization_id ON transactions(organization_id);
CREATE INDEX IF NOT EXISTS idx_transactions_property_id ON transactions(property_id);
CREATE INDEX IF NOT EXISTS idx_transactions_tenant_id ON transactions(tenant_id);
CREATE INDEX IF NOT EXISTS idx_transactions_lease_id ON transactions(lease_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);

-- Disable RLS for testing (enable later with proper policies)
ALTER TABLE transactions DISABLE ROW LEVEL SECURITY;

-- Insert sample transactions for existing leases
INSERT INTO transactions (organization_id, property_id, unit_id, tenant_id, lease_id, type, category, amount, date, description, payment_method, status)
VALUES 
  -- Payment for first lease (Unit 101)
  ('00000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333', '40000000-0000-0000-0000-000000000001', 'income', 'rent', 1200.00, '2024-10-01', 'October 2024 Rent - Unit 101', 'bank_transfer', 'completed'),
  
  -- Payment for second lease (Unit 201)
  ('00000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222223', '33333333-3333-3333-3333-333333333334', '40000000-0000-0000-0000-000000000002', 'income', 'rent', 1500.00, '2024-10-01', 'October 2024 Rent - Unit 201', 'credit_card', 'completed'),
  
  -- Payment for third lease (Unit 202)
  ('00000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222224', '33333333-3333-3333-3333-333333333335', '40000000-0000-0000-0000-000000000003', 'income', 'rent', 1800.00, '2024-10-01', 'October 2024 Rent - Unit 202', 'bank_transfer', 'completed'),
  
  -- Payment for fourth lease
  ('00000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222225', '33333333-3333-3333-3333-333333333336', '40000000-0000-0000-0000-000000000004', 'income', 'rent', 1400.00, '2024-10-01', 'October 2024 Rent - Unit 301', 'check', 'completed'),
  
  -- Payment for fifth lease
  ('00000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222226', '33333333-3333-3333-3333-333333333337', '40000000-0000-0000-0000-000000000005', 'income', 'rent', 1350.00, '2024-10-01', 'October 2024 Rent - Unit 302', 'bank_transfer', 'completed'),
  
  -- Payment for sixth lease
  ('00000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222227', '33333333-3333-3333-3333-333333333338', '40000000-0000-0000-0000-000000000006', 'income', 'rent', 1600.00, '2024-10-01', 'October 2024 Rent - Unit 401', 'credit_card', 'completed'),
  
  -- Add some historical payments (September)
  ('00000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333', '40000000-0000-0000-0000-000000000001', 'income', 'rent', 1200.00, '2024-09-01', 'September 2024 Rent - Unit 101', 'bank_transfer', 'completed'),
  ('00000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222223', '33333333-3333-3333-3333-333333333334', '40000000-0000-0000-0000-000000000002', 'income', 'rent', 1500.00, '2024-09-01', 'September 2024 Rent - Unit 201', 'credit_card', 'completed'),
  
  -- Add some expense transactions
  ('00000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', NULL, NULL, NULL, 'expense', 'maintenance', 350.00, '2024-10-05', 'HVAC Repair - Unit 101', 'check', 'completed'),
  ('00000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', NULL, NULL, NULL, 'expense', 'utilities', 180.00, '2024-10-10', 'Water Bill - October', 'bank_transfer', 'completed');

-- Verify the table was created
SELECT 'Transactions table created successfully!' AS message;
SELECT COUNT(*) AS transaction_count FROM transactions;
