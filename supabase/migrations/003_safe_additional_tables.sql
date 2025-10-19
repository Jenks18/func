-- ============================================
-- SAFE MIGRATION: Add Additional Tables Only
-- This migration ONLY creates new tables that don't exist yet
-- It will NOT touch your existing data in:
--   - organizations
--   - users
--   - properties
--   - units
--   - tenants
--   - leases
--   - transactions (already exists)
--   - maintenance_requests (already exists)
--   - messages (already exists)
--   - files (already exists)
-- ============================================

-- Enable UUID extension (safe to run multiple times)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- ENSURE CORE TABLES EXIST (from 001_initial_schema)
-- ============================================

-- Organizations (Property Management Companies)
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  created_by TEXT NOT NULL, -- Clerk user ID
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'enterprise')),
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users (synced from Clerk)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clerk_id TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  role TEXT NOT NULL CHECK (role IN ('super_admin', 'org_admin', 'property_owner', 'manager', 'maintenance', 'tenant')),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  avatar_url TEXT,
  phone TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Properties
CREATE TABLE IF NOT EXISTS properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  owner_id UUID REFERENCES users(id),
  manager_id UUID REFERENCES users(id),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  country TEXT DEFAULT 'USA',
  property_type TEXT CHECK (property_type IN ('single_family', 'multi_family', 'apartment', 'condo', 'commercial')),
  units_count INTEGER DEFAULT 0,
  year_built INTEGER,
  square_footage INTEGER,
  purchase_price DECIMAL(12, 2),
  current_value DECIMAL(12, 2),
  notes TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Units
CREATE TABLE IF NOT EXISTS units (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE NOT NULL,
  unit_number TEXT NOT NULL,
  bedrooms INTEGER,
  bathrooms DECIMAL(3, 1),
  square_footage INTEGER,
  rent_amount DECIMAL(10, 2),
  deposit_amount DECIMAL(10, 2),
  status TEXT DEFAULT 'vacant' CHECK (status IN ('vacant', 'occupied', 'maintenance', 'reserved')),
  amenities TEXT[],
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(property_id, unit_number)
);

-- Tenants
CREATE TABLE IF NOT EXISTS tenants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES users(id),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Leases
CREATE TABLE IF NOT EXISTS leases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE NOT NULL,
  unit_id UUID REFERENCES units(id),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  rent_amount DECIMAL(10, 2) NOT NULL,
  security_deposit DECIMAL(10, 2),
  lease_type TEXT CHECK (lease_type IN ('fixed', 'month_to_month')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'pending', 'expired', 'terminated')),
  terms TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Transactions
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  category TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  date DATE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Files
CREATE TABLE IF NOT EXISTS files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  related_to_type TEXT CHECK (related_to_type IN ('property', 'unit', 'tenant', 'lease', 'maintenance', 'transaction')),
  related_to_id UUID,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT,
  file_size INTEGER,
  uploaded_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create maintenance_requests table if it doesn't exist
CREATE TABLE IF NOT EXISTS maintenance_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE NOT NULL,
  unit_id UUID REFERENCES units(id),
  tenant_id UUID REFERENCES tenants(id),
  assigned_to UUID REFERENCES users(id),
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'completed', 'cancelled')),
  category TEXT,
  cost DECIMAL(10, 2),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create messages table if it doesn't exist
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES users(id) NOT NULL,
  recipient_id UUID REFERENCES users(id),
  subject TEXT,
  body TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- NEW TABLES FOR MAINTENANCE SYSTEM
-- ============================================

-- Maintenance Photos (NEW - doesn't exist in 001_initial_schema)
CREATE TABLE IF NOT EXISTS maintenance_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  maintenance_request_id UUID REFERENCES maintenance_requests(id) ON DELETE CASCADE NOT NULL,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  uploaded_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Maintenance Comments (NEW)
CREATE TABLE IF NOT EXISTS maintenance_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  maintenance_request_id UUID REFERENCES maintenance_requests(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  comment_text TEXT NOT NULL,
  is_internal BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Maintenance Reminders (NEW - for recurring maintenance)
CREATE TABLE IF NOT EXISTS maintenance_reminders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  maintenance_request_id UUID REFERENCES maintenance_requests(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  first_occurrence TIMESTAMPTZ NOT NULL,
  recurring BOOLEAN DEFAULT FALSE,
  repeat_every INTEGER, -- Number of time units
  repeat_unit TEXT CHECK (repeat_unit IN ('days', 'weeks', 'months', 'years')),
  ends_type TEXT CHECK (ends_type IN ('never', 'on_date', 'after_occurrences')),
  ends_on TIMESTAMPTZ,
  max_occurrences INTEGER,
  notify_email BOOLEAN DEFAULT TRUE,
  notify_sms BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Maintenance Occurrences (NEW - individual instances of recurring reminders)
CREATE TABLE IF NOT EXISTS maintenance_occurrences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reminder_id UUID REFERENCES maintenance_reminders(id) ON DELETE CASCADE NOT NULL,
  scheduled_date TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'skipped', 'in_progress')),
  completed_at TIMESTAMPTZ,
  completed_by UUID REFERENCES users(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- NEW TABLES FOR MESSAGING SYSTEM
-- ============================================

-- Message Recipients (NEW - tracks who received each message)
CREATE TABLE IF NOT EXISTS message_recipients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  message_id UUID REFERENCES messages(id) ON DELETE CASCADE NOT NULL,
  recipient_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chat Conversations (NEW - for real-time chat)
CREATE TABLE IF NOT EXISTS chat_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  participant_ids UUID[] NOT NULL,
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ADD MISSING COLUMNS TO EXISTING TABLES
-- (Uses ALTER TABLE ADD COLUMN IF NOT EXISTS - safe to run)
-- ============================================

-- Add columns to transactions table if they don't exist
DO $$ 
BEGIN
  -- Add reference_number column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'transactions' AND column_name = 'reference_number'
  ) THEN
    ALTER TABLE transactions ADD COLUMN reference_number TEXT;
  END IF;

  -- Add bank_account column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'transactions' AND column_name = 'bank_account'
  ) THEN
    ALTER TABLE transactions ADD COLUMN bank_account TEXT;
  END IF;

  -- Add property_id column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'transactions' AND column_name = 'property_id'
  ) THEN
    ALTER TABLE transactions ADD COLUMN property_id UUID REFERENCES properties(id) ON DELETE SET NULL;
  END IF;

  -- Add unit_id column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'transactions' AND column_name = 'unit_id'
  ) THEN
    ALTER TABLE transactions ADD COLUMN unit_id UUID REFERENCES units(id) ON DELETE SET NULL;
  END IF;

  -- Add tenant_id column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'transactions' AND column_name = 'tenant_id'
  ) THEN
    ALTER TABLE transactions ADD COLUMN tenant_id UUID REFERENCES tenants(id) ON DELETE SET NULL;
  END IF;

  -- Add notes column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'transactions' AND column_name = 'notes'
  ) THEN
    ALTER TABLE transactions ADD COLUMN notes TEXT;
  END IF;
END $$;

-- Add columns to maintenance_requests table if they don't exist
DO $$ 
BEGIN
  -- Add due_date column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'maintenance_requests' AND column_name = 'due_date'
  ) THEN
    ALTER TABLE maintenance_requests ADD COLUMN due_date TIMESTAMPTZ;
  END IF;

  -- Add completed_at column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'maintenance_requests' AND column_name = 'completed_at'
  ) THEN
    ALTER TABLE maintenance_requests ADD COLUMN completed_at TIMESTAMPTZ;
  END IF;

  -- Add estimated_cost column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'maintenance_requests' AND column_name = 'estimated_cost'
  ) THEN
    ALTER TABLE maintenance_requests ADD COLUMN estimated_cost DECIMAL(10, 2);
  END IF;

  -- Add actual_cost column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'maintenance_requests' AND column_name = 'actual_cost'
  ) THEN
    ALTER TABLE maintenance_requests ADD COLUMN actual_cost DECIMAL(10, 2);
  END IF;
END $$;

-- Add columns to messages table if they don't exist
DO $$ 
BEGIN
  -- Add message_type column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'messages' AND column_name = 'message_type'
  ) THEN
    ALTER TABLE messages ADD COLUMN message_type TEXT DEFAULT 'email' CHECK (message_type IN ('email', 'chat', 'sms'));
  END IF;

  -- Add conversation_id column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'messages' AND column_name = 'conversation_id'
  ) THEN
    ALTER TABLE messages ADD COLUMN conversation_id UUID REFERENCES chat_conversations(id) ON DELETE CASCADE;
  END IF;

  -- Add thread_id column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'messages' AND column_name = 'thread_id'
  ) THEN
    ALTER TABLE messages ADD COLUMN thread_id UUID REFERENCES messages(id) ON DELETE CASCADE;
  END IF;

  -- Add recipient_ids column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'messages' AND column_name = 'recipient_ids'
  ) THEN
    ALTER TABLE messages ADD COLUMN recipient_ids UUID[];
  END IF;
END $$;

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

-- Only create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_maintenance_photos_request ON maintenance_photos(maintenance_request_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_comments_request ON maintenance_comments(maintenance_request_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_reminders_request ON maintenance_reminders(maintenance_request_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_occurrences_reminder ON maintenance_occurrences(reminder_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_occurrences_status ON maintenance_occurrences(status);
CREATE INDEX IF NOT EXISTS idx_maintenance_occurrences_date ON maintenance_occurrences(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_message_recipients_message ON message_recipients(message_id);
CREATE INDEX IF NOT EXISTS idx_message_recipients_recipient ON message_recipients(recipient_id);
CREATE INDEX IF NOT EXISTS idx_message_recipients_read ON message_recipients(read);
CREATE INDEX IF NOT EXISTS idx_transactions_property ON transactions(property_id);
CREATE INDEX IF NOT EXISTS idx_transactions_tenant ON transactions(tenant_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Enable RLS on new tables
-- ============================================

ALTER TABLE maintenance_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_occurrences ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_recipients ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_conversations ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts on re-run)
DROP POLICY IF EXISTS "Users can view photos from their organization" ON maintenance_photos;
DROP POLICY IF EXISTS "Users can upload photos to their org's maintenance" ON maintenance_photos;
DROP POLICY IF EXISTS "Users can view comments from their organization" ON maintenance_comments;
DROP POLICY IF EXISTS "Users can add comments to their org's maintenance" ON maintenance_comments;
DROP POLICY IF EXISTS "Users can view reminders from their organization" ON maintenance_reminders;
DROP POLICY IF EXISTS "Users can create reminders for their org" ON maintenance_reminders;
DROP POLICY IF EXISTS "Users can view occurrences from their organization" ON maintenance_occurrences;
DROP POLICY IF EXISTS "Users can update occurrences from their organization" ON maintenance_occurrences;
DROP POLICY IF EXISTS "Users can view their own message receipts" ON message_recipients;
DROP POLICY IF EXISTS "Users can view their own conversations" ON chat_conversations;

-- RLS Policies for maintenance_photos
CREATE POLICY "Users can view photos from their organization" ON maintenance_photos
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM maintenance_requests mr
      JOIN users u ON u.organization_id = mr.organization_id
      WHERE mr.id = maintenance_photos.maintenance_request_id
      AND u.clerk_id = auth.uid()::text
    )
  );

CREATE POLICY "Users can upload photos to their org's maintenance" ON maintenance_photos
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM maintenance_requests mr
      JOIN users u ON u.organization_id = mr.organization_id
      WHERE mr.id = maintenance_photos.maintenance_request_id
      AND u.clerk_id = auth.uid()::text
    )
  );

-- RLS Policies for maintenance_comments
CREATE POLICY "Users can view comments from their organization" ON maintenance_comments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM maintenance_requests mr
      JOIN users u ON u.organization_id = mr.organization_id
      WHERE mr.id = maintenance_comments.maintenance_request_id
      AND u.clerk_id = auth.uid()::text
    )
  );

CREATE POLICY "Users can add comments to their org's maintenance" ON maintenance_comments
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM maintenance_requests mr
      JOIN users u ON u.organization_id = mr.organization_id
      WHERE mr.id = maintenance_comments.maintenance_request_id
      AND u.clerk_id = auth.uid()::text
    )
  );

-- RLS Policies for maintenance_reminders
CREATE POLICY "Users can view reminders from their organization" ON maintenance_reminders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM maintenance_requests mr
      JOIN users u ON u.organization_id = mr.organization_id
      WHERE mr.id = maintenance_reminders.maintenance_request_id
      AND u.clerk_id = auth.uid()::text
    )
  );

CREATE POLICY "Users can create reminders for their org" ON maintenance_reminders
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM maintenance_requests mr
      JOIN users u ON u.organization_id = mr.organization_id
      WHERE mr.id = maintenance_reminders.maintenance_request_id
      AND u.clerk_id = auth.uid()::text
    )
  );

-- RLS Policies for maintenance_occurrences
CREATE POLICY "Users can view occurrences from their organization" ON maintenance_occurrences
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM maintenance_reminders mr2
      JOIN maintenance_requests mr ON mr.id = mr2.maintenance_request_id
      JOIN users u ON u.organization_id = mr.organization_id
      WHERE mr2.id = maintenance_occurrences.reminder_id
      AND u.clerk_id = auth.uid()::text
    )
  );

CREATE POLICY "Users can update occurrences from their organization" ON maintenance_occurrences
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM maintenance_reminders mr2
      JOIN maintenance_requests mr ON mr.id = mr2.maintenance_request_id
      JOIN users u ON u.organization_id = mr.organization_id
      WHERE mr2.id = maintenance_occurrences.reminder_id
      AND u.clerk_id = auth.uid()::text
    )
  );

-- RLS Policies for message_recipients
CREATE POLICY "Users can view their own message receipts" ON message_recipients
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = message_recipients.recipient_id
      AND users.clerk_id = auth.uid()::text
    )
  );

-- RLS Policies for chat_conversations
CREATE POLICY "Users can view their own conversations" ON chat_conversations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = ANY(chat_conversations.participant_ids)
      AND users.clerk_id = auth.uid()::text
    )
  );

-- ============================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================

-- Create trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers to new tables
DROP TRIGGER IF EXISTS update_maintenance_comments_updated_at ON maintenance_comments;
CREATE TRIGGER update_maintenance_comments_updated_at
  BEFORE UPDATE ON maintenance_comments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_maintenance_reminders_updated_at ON maintenance_reminders;
CREATE TRIGGER update_maintenance_reminders_updated_at
  BEFORE UPDATE ON maintenance_reminders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_maintenance_occurrences_updated_at ON maintenance_occurrences;
CREATE TRIGGER update_maintenance_occurrences_updated_at
  BEFORE UPDATE ON maintenance_occurrences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_chat_conversations_updated_at ON chat_conversations;
CREATE TRIGGER update_chat_conversations_updated_at
  BEFORE UPDATE ON chat_conversations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- MIGRATION COMPLETE
-- ============================================

-- This migration safely adds:
-- ✅ maintenance_photos table (NEW)
-- ✅ maintenance_comments table (NEW)
-- ✅ maintenance_reminders table (NEW)
-- ✅ maintenance_occurrences table (NEW)
-- ✅ message_recipients table (NEW)
-- ✅ chat_conversations table (NEW)
-- ✅ Additional columns to existing tables (SAFE - only adds if missing)
-- ✅ Indexes for performance
-- ✅ RLS policies for security
-- ✅ Triggers for auto-updating timestamps

-- Your existing data is SAFE:
-- ✅ organizations - NOT TOUCHED
-- ✅ users - NOT TOUCHED
-- ✅ properties - NOT TOUCHED
-- ✅ units - NOT TOUCHED
-- ✅ tenants - NOT TOUCHED
-- ✅ leases - NOT TOUCHED
-- ✅ transactions - Only new columns added (data preserved)
-- ✅ maintenance_requests - Only new columns added (data preserved)
-- ✅ messages - Only new columns added (data preserved)
-- ✅ files - NOT TOUCHED
