-- ============================================
-- JumbaJot Complete Database Schema
-- Run this script in your Supabase SQL Editor
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- EXISTING TABLES (from 001_initial_schema.sql)
-- ============================================
-- These should already exist. If not, uncomment and run.

/*
-- Organizations
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  created_by TEXT NOT NULL,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'enterprise')),
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users
CREATE TABLE users (
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
CREATE TABLE properties (
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
CREATE TABLE units (
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
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  employment_info JSONB,
  credit_score INTEGER,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Leases
CREATE TABLE leases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE NOT NULL,
  unit_id UUID REFERENCES units(id) ON DELETE CASCADE,
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE NOT NULL,
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
*/

-- ============================================
-- TRANSACTIONS TABLE (Income & Expenses)
-- This is the MAIN table for financial data
-- ============================================

CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  unit_id UUID REFERENCES units(id) ON DELETE CASCADE,
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  lease_id UUID REFERENCES leases(id) ON DELETE CASCADE,
  
  -- Transaction details
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  category TEXT NOT NULL, -- 'rent', 'utilities', 'maintenance', 'fees', 'late_fee', etc.
  amount DECIMAL(10, 2) NOT NULL,
  date DATE NOT NULL,
  description TEXT,
  
  -- Payment details
  payment_method TEXT, -- 'cash', 'check', 'credit_card', 'bank_transfer', 'ach'
  reference_number TEXT, -- Check number, transaction ID, invoice number
  bank_account TEXT, -- Which bank account received/sent the payment
  
  -- Status tracking
  status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  
  -- Metadata
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES users(id)
);

-- Indexes for transactions
CREATE INDEX idx_transactions_organization ON transactions(organization_id);
CREATE INDEX idx_transactions_property ON transactions(property_id);
CREATE INDEX idx_transactions_tenant ON transactions(tenant_id);
CREATE INDEX idx_transactions_date ON transactions(date);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_category ON transactions(category);
CREATE INDEX idx_transactions_status ON transactions(status);

-- ============================================
-- MAINTENANCE TABLES
-- ============================================

-- Maintenance Requests
CREATE TABLE IF NOT EXISTS maintenance_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE NOT NULL,
  unit_id UUID REFERENCES units(id) ON DELETE CASCADE,
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  
  -- Assignment
  requested_by UUID REFERENCES users(id),
  assigned_to UUID REFERENCES users(id),
  
  -- Request details
  request_number TEXT UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT CHECK (category IN ('plumbing', 'electrical', 'hvac', 'appliance', 'structural', 'other')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'scheduled', 'in_progress', 'resolved', 'cancelled')),
  
  -- Dates
  due_date DATE,
  completed_date DATE,
  
  -- Costs
  estimated_cost DECIMAL(10, 2),
  actual_cost DECIMAL(10, 2),
  
  -- Metadata
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Maintenance Photos
CREATE TABLE IF NOT EXISTS maintenance_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  maintenance_request_id UUID REFERENCES maintenance_requests(id) ON DELETE CASCADE NOT NULL,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  caption TEXT,
  uploaded_by UUID REFERENCES users(id),
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Maintenance Comments (includes Notes)
CREATE TABLE IF NOT EXISTS maintenance_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  maintenance_request_id UUID REFERENCES maintenance_requests(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES users(id) NOT NULL,
  comment_text TEXT NOT NULL,
  is_internal BOOLEAN DEFAULT FALSE, -- TRUE = Notes (team only), FALSE = Comments (visible to tenants)
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Maintenance Reminders (Recurring)
CREATE TABLE IF NOT EXISTS maintenance_reminders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  maintenance_request_id UUID REFERENCES maintenance_requests(id) ON DELETE CASCADE NOT NULL,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  
  -- Recurrence settings
  first_occurrence DATE NOT NULL,
  recurring BOOLEAN DEFAULT FALSE,
  repeat_every INTEGER DEFAULT 1,
  repeat_unit TEXT CHECK (repeat_unit IN ('day', 'week', 'month', 'year')),
  
  -- End conditions
  ends_type TEXT CHECK (ends_type IN ('never', 'on', 'after')),
  ends_date DATE,
  ends_after INTEGER,
  
  -- Reminders
  team_members UUID[], -- Array of user IDs
  add_tenants BOOLEAN DEFAULT FALSE,
  next_reminder_date DATE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Maintenance Occurrences (for recurring maintenance)
CREATE TABLE IF NOT EXISTS maintenance_occurrences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  maintenance_request_id UUID REFERENCES maintenance_requests(id) ON DELETE CASCADE NOT NULL,
  maintenance_reminder_id UUID REFERENCES maintenance_reminders(id) ON DELETE CASCADE,
  scheduled_date DATE NOT NULL,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'done', 'skipped')),
  notes TEXT,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for maintenance
CREATE INDEX idx_maintenance_org ON maintenance_requests(organization_id);
CREATE INDEX idx_maintenance_property ON maintenance_requests(property_id);
CREATE INDEX idx_maintenance_status ON maintenance_requests(status);
CREATE INDEX idx_maintenance_assigned ON maintenance_requests(assigned_to);

-- ============================================
-- MESSAGING TABLES
-- ============================================

-- Messages/Emails
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  
  -- Message type
  message_type TEXT NOT NULL CHECK (message_type IN ('email', 'chat')),
  
  -- Participants
  sender_id UUID REFERENCES users(id) NOT NULL,
  recipient_ids UUID[], -- Array of recipient user IDs
  
  -- Content
  subject TEXT, -- For emails
  body TEXT NOT NULL,
  
  -- Status
  read BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'sent' CHECK (status IN ('sent', 'failed', 'retry')),
  
  -- Thread/Chat grouping
  thread_id UUID, -- For grouping related messages
  parent_message_id UUID REFERENCES messages(id), -- For replies
  
  -- Context references
  property_id UUID REFERENCES properties(id),
  maintenance_request_id UUID REFERENCES maintenance_requests(id),
  lease_id UUID REFERENCES leases(id),
  
  -- Metadata
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  sent_at TIMESTAMPTZ
);

-- Message Recipients (for tracking individual read status)
CREATE TABLE IF NOT EXISTS message_recipients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  message_id UUID REFERENCES messages(id) ON DELETE CASCADE NOT NULL,
  recipient_id UUID REFERENCES users(id) NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chat Conversations
CREATE TABLE IF NOT EXISTS chat_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  name TEXT, -- Optional name for group chats
  is_group BOOLEAN DEFAULT FALSE,
  participant_ids UUID[], -- Array of user IDs in the conversation
  last_message_id UUID REFERENCES messages(id),
  last_message_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for messaging
CREATE INDEX idx_messages_org ON messages(organization_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_type ON messages(message_type);
CREATE INDEX idx_messages_thread ON messages(thread_id);
CREATE INDEX idx_message_recipients ON message_recipients(recipient_id);
CREATE INDEX idx_chat_conversations_org ON chat_conversations(organization_id);

-- ============================================
-- FILES TABLE (for document uploads)
-- ============================================

CREATE TABLE IF NOT EXISTS files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  uploaded_by UUID REFERENCES users(id) NOT NULL,
  
  -- Context references
  property_id UUID REFERENCES properties(id),
  lease_id UUID REFERENCES leases(id),
  maintenance_request_id UUID REFERENCES maintenance_requests(id),
  message_id UUID REFERENCES messages(id),
  
  -- File details
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER,
  storage_path TEXT NOT NULL, -- Path in Supabase Storage
  url TEXT NOT NULL, -- Public or signed URL
  category TEXT, -- 'lease', 'maintenance', 'photo', 'document', etc.
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_files_org ON files(organization_id);
CREATE INDEX idx_files_property ON files(property_id);

-- ============================================
-- TRIGGERS FOR AUTO-UPDATING updated_at
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_maintenance_updated_at BEFORE UPDATE ON maintenance_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reminders_updated_at BEFORE UPDATE ON maintenance_reminders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chat_conversations_updated_at BEFORE UPDATE ON chat_conversations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_occurrences ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_recipients ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;

-- Helper functions for RLS (assumes these exist from initial schema)
-- If not, uncomment and create:

/*
CREATE OR REPLACE FUNCTION current_user_id()
RETURNS UUID AS $$
  SELECT id FROM users WHERE clerk_id = (auth.jwt() ->> 'sub')::text;
$$ LANGUAGE SQL SECURITY DEFINER;

CREATE OR REPLACE FUNCTION current_organization_id()
RETURNS UUID AS $$
  SELECT organization_id FROM users WHERE clerk_id = (auth.jwt() ->> 'sub')::text;
$$ LANGUAGE SQL SECURITY DEFINER;

CREATE OR REPLACE FUNCTION current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM users WHERE clerk_id = (auth.jwt() ->> 'sub')::text;
$$ LANGUAGE SQL SECURITY DEFINER;
*/

-- ============================================
-- TRANSACTIONS POLICIES
-- ============================================

CREATE POLICY transactions_select ON transactions
FOR SELECT USING (
  organization_id = current_organization_id() OR
  -- Tenants can see their own transactions
  tenant_id IN (
    SELECT id FROM tenants WHERE user_id = current_user_id()
  )
);

CREATE POLICY transactions_insert ON transactions
FOR INSERT WITH CHECK (
  organization_id = current_organization_id() AND
  current_user_role() IN ('org_admin', 'manager', 'property_owner')
);

CREATE POLICY transactions_update ON transactions
FOR UPDATE USING (
  organization_id = current_organization_id() AND
  current_user_role() IN ('org_admin', 'manager')
);

-- ============================================
-- MAINTENANCE POLICIES
-- ============================================

CREATE POLICY maintenance_select ON maintenance_requests
FOR SELECT USING (
  organization_id = current_organization_id() OR
  assigned_to = current_user_id() OR
  tenant_id IN (
    SELECT id FROM tenants WHERE user_id = current_user_id()
  )
);

CREATE POLICY maintenance_insert ON maintenance_requests
FOR INSERT WITH CHECK (
  organization_id = current_organization_id() OR
  tenant_id IN (
    SELECT id FROM tenants WHERE user_id = current_user_id()
  )
);

CREATE POLICY maintenance_update ON maintenance_requests
FOR UPDATE USING (
  assigned_to = current_user_id() OR
  (organization_id = current_organization_id() AND
   current_user_role() IN ('org_admin', 'manager'))
);

-- ============================================
-- MESSAGING POLICIES
-- ============================================

CREATE POLICY messages_select ON messages
FOR SELECT USING (
  sender_id = current_user_id() OR
  current_user_id() = ANY(recipient_ids)
);

CREATE POLICY messages_insert ON messages
FOR INSERT WITH CHECK (
  sender_id = current_user_id() AND
  organization_id = current_organization_id()
);

CREATE POLICY message_recipients_select ON message_recipients
FOR SELECT USING (
  recipient_id = current_user_id()
);

CREATE POLICY chat_conversations_select ON chat_conversations
FOR SELECT USING (
  organization_id = current_organization_id() AND
  current_user_id() = ANY(participant_ids)
);

-- ============================================
-- FILES POLICIES
-- ============================================

CREATE POLICY files_select ON files
FOR SELECT USING (
  organization_id = current_organization_id() OR
  uploaded_by = current_user_id()
);

CREATE POLICY files_insert ON files
FOR INSERT WITH CHECK (
  organization_id = current_organization_id() AND
  uploaded_by = current_user_id()
);

-- ============================================
-- SAMPLE DATA FOR TESTING
-- ============================================

-- Insert sample transactions (OPTIONAL - for testing)
/*
INSERT INTO transactions (organization_id, type, category, amount, date, payment_method, status, description)
VALUES
  ('your-org-id-here', 'income', 'rent', 1200.00, '2025-01-15', 'bank_transfer', 'completed', 'January rent payment'),
  ('your-org-id-here', 'income', 'late_fee', 50.00, '2025-01-20', 'cash', 'completed', 'Late fee for January'),
  ('your-org-id-here', 'expense', 'maintenance', 350.00, '2025-01-25', 'credit_card', 'completed', 'Plumbing repair - unit 205'),
  ('your-org-id-here', 'expense', 'utilities', 125.00, '2025-01-30', 'check', 'completed', 'Water bill - January');
*/

-- ============================================
-- STORAGE BUCKETS (Run in Supabase Dashboard)
-- ============================================

/*
1. Go to Storage in Supabase Dashboard
2. Create these buckets:
   - maintenance-photos (Public or Private as needed)
   - lease-documents (Private)
   - message-attachments (Private)
   - property-photos (Public)

3. Set up RLS policies for each bucket in the Supabase UI
*/

-- ============================================
-- COMPLETION MESSAGE
-- ============================================

SELECT 'Database schema created successfully! ✅' AS status,
       'Now set up Supabase Storage buckets and configure RLS policies' AS next_step;
