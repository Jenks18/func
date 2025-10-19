-- ============================================
-- ADD TRANSACTIONS TABLE (NO SAMPLE DATA)
-- ============================================
-- Run this in your Supabase SQL Editor

-- Drop existing table if it has errors (start fresh)
DROP TABLE IF EXISTS transactions CASCADE;

-- Create transactions table
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id TEXT NOT NULL,
  property_id UUID,
  unit_id UUID,
  tenant_id UUID,
  lease_id UUID,
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
CREATE INDEX idx_transactions_organization_id ON transactions(organization_id);
CREATE INDEX idx_transactions_property_id ON transactions(property_id);
CREATE INDEX idx_transactions_tenant_id ON transactions(tenant_id);
CREATE INDEX idx_transactions_lease_id ON transactions(lease_id);
CREATE INDEX idx_transactions_date ON transactions(date);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_status ON transactions(status);

-- Disable RLS for testing (enable later with proper policies)
ALTER TABLE transactions DISABLE ROW LEVEL SECURITY;

-- Verify the table was created
SELECT 'Transactions table created successfully!' AS message;
SELECT 'Table has been created. Use the Record Payment button in the dashboard to add transactions.' AS next_step;
