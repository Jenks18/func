-- ============================================
-- ADD MISSING LEASE COLUMNS
-- This migration adds date columns to leases table if they don't exist
-- ============================================

-- Add start_date column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'leases' AND column_name = 'start_date'
  ) THEN
    ALTER TABLE leases ADD COLUMN start_date DATE;
    COMMENT ON COLUMN leases.start_date IS 'Lease start date';
  END IF;
END $$;

-- Add end_date column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'leases' AND column_name = 'end_date'
  ) THEN
    ALTER TABLE leases ADD COLUMN end_date DATE;
    COMMENT ON COLUMN leases.end_date IS 'Lease end date';
  END IF;
END $$;

-- Add security_deposit column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'leases' AND column_name = 'security_deposit'
  ) THEN
    ALTER TABLE leases ADD COLUMN security_deposit DECIMAL(10, 2);
    COMMENT ON COLUMN leases.security_deposit IS 'Security deposit amount';
  END IF;
END $$;

-- Add lease_type column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'leases' AND column_name = 'lease_type'
  ) THEN
    ALTER TABLE leases ADD COLUMN lease_type TEXT CHECK (lease_type IN ('fixed', 'month_to_month'));
    COMMENT ON COLUMN leases.lease_type IS 'Type of lease agreement';
  END IF;
END $$;

SELECT 'Missing lease columns added successfully!' as status;
