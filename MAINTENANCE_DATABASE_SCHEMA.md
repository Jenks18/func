# Maintenance Module - Complete Database Schema

## Overview
Enterprise-level maintenance request tracking system with photo uploads, comments, notes, and client portal integration.

---

## Database Tables

### 1. `maintenance_requests` Table (Already exists, enhanced)

```sql
-- Enhanced maintenance_requests table
CREATE TABLE maintenance_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  
  -- Request Info
  request_number TEXT UNIQUE NOT NULL, -- e.g., "259416", auto-generated
  title TEXT NOT NULL,
  description TEXT,
  
  -- Location
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE NOT NULL,
  unit_id UUID REFERENCES units(id),
  location_details TEXT, -- Specific room/area
  
  -- People
  tenant_id UUID REFERENCES tenants(id),
  requested_by UUID REFERENCES users(id) NOT NULL, -- Who created it
  assigned_to UUID REFERENCES users(id), -- Maintenance person
  
  -- Classification
  category TEXT, -- 'plumbing', 'electrical', 'hvac', 'appliance', 'structural', 'other'
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'scheduled', 'in_progress', 'completed', 'cancelled')),
  
  -- Dates
  requested_on TIMESTAMPTZ DEFAULT NOW(),
  due_on TIMESTAMPTZ,
  scheduled_for TIMESTAMPTZ,
  completed_on TIMESTAMPTZ,
  
  -- Cost
  estimated_cost DECIMAL(10, 2),
  actual_cost DECIMAL(10, 2),
  
  -- Access
  permission_to_enter BOOLEAN DEFAULT false,
  access_instructions TEXT,
  
  -- Resolution
  resolution_notes TEXT,
  
  -- Metadata
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_maintenance_requests_organization ON maintenance_requests(organization_id);
CREATE INDEX idx_maintenance_requests_property ON maintenance_requests(property_id);
CREATE INDEX idx_maintenance_requests_status ON maintenance_requests(status);
CREATE INDEX idx_maintenance_requests_priority ON maintenance_requests(priority);
CREATE INDEX idx_maintenance_requests_assigned_to ON maintenance_requests(assigned_to);
CREATE INDEX idx_maintenance_requests_requested_by ON maintenance_requests(requested_by);
CREATE INDEX idx_maintenance_requests_tenant ON maintenance_requests(tenant_id);
CREATE INDEX idx_maintenance_requests_number ON maintenance_requests(request_number);

-- Auto-generate request number
CREATE OR REPLACE FUNCTION generate_maintenance_request_number()
RETURNS TRIGGER AS $$
BEGIN
  -- Generate 6-digit number based on sequence
  NEW.request_number := LPAD((FLOOR(RANDOM() * 900000) + 100000)::TEXT, 6, '0');
  
  -- Ensure uniqueness
  WHILE EXISTS (SELECT 1 FROM maintenance_requests WHERE request_number = NEW.request_number) LOOP
    NEW.request_number := LPAD((FLOOR(RANDOM() * 900000) + 100000)::TEXT, 6, '0');
  END LOOP;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_maintenance_request_number
BEFORE INSERT ON maintenance_requests
FOR EACH ROW
WHEN (NEW.request_number IS NULL)
EXECUTE FUNCTION generate_maintenance_request_number();
```

---

### 2. `maintenance_photos` Table

```sql
CREATE TABLE maintenance_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  maintenance_request_id UUID REFERENCES maintenance_requests(id) ON DELETE CASCADE NOT NULL,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  
  -- File Info
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL, -- 'image/jpeg', 'image/png', etc.
  file_size INTEGER, -- in bytes
  storage_path TEXT NOT NULL, -- Supabase Storage path
  url TEXT NOT NULL, -- Public or signed URL
  
  -- Metadata
  uploaded_by UUID REFERENCES users(id) NOT NULL,
  caption TEXT,
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Organization
  display_order INTEGER DEFAULT 0
);

CREATE INDEX idx_maintenance_photos_request ON maintenance_photos(maintenance_request_id);
CREATE INDEX idx_maintenance_photos_organization ON maintenance_photos(organization_id);
```

---

### 3. `maintenance_comments` Table

```sql
CREATE TABLE maintenance_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  maintenance_request_id UUID REFERENCES maintenance_requests(id) ON DELETE CASCADE NOT NULL,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  
  -- Comment
  comment_text TEXT NOT NULL,
  
  -- Author
  user_id UUID REFERENCES users(id) NOT NULL,
  user_name TEXT, -- Cached for display
  user_avatar TEXT,
  
  -- Type
  comment_type TEXT DEFAULT 'comment' CHECK (comment_type IN ('comment', 'status_update', 'internal_note')),
  
  -- Visibility
  visible_to_tenant BOOLEAN DEFAULT true,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_maintenance_comments_request ON maintenance_comments(maintenance_request_id);
CREATE INDEX idx_maintenance_comments_user ON maintenance_comments(user_id);
CREATE INDEX idx_maintenance_comments_created ON maintenance_comments(created_at DESC);
```

---

### 4. `maintenance_notes` Table

```sql
CREATE TABLE maintenance_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  maintenance_request_id UUID REFERENCES maintenance_requests(id) ON DELETE CASCADE NOT NULL,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  
  -- Note
  note_title TEXT,
  note_text TEXT NOT NULL,
  
  -- Author
  user_id UUID REFERENCES users(id) NOT NULL,
  user_name TEXT,
  
  -- Visibility (internal only by default)
  is_internal BOOLEAN DEFAULT true,
  pinned BOOLEAN DEFAULT false,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_maintenance_notes_request ON maintenance_notes(maintenance_request_id);
CREATE INDEX idx_maintenance_notes_pinned ON maintenance_notes(pinned);
```

---

### 5. `maintenance_status_history` Table

```sql
CREATE TABLE maintenance_status_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  maintenance_request_id UUID REFERENCES maintenance_requests(id) ON DELETE CASCADE NOT NULL,
  
  -- Status Change
  old_status TEXT,
  new_status TEXT NOT NULL,
  
  -- Changed By
  changed_by UUID REFERENCES users(id) NOT NULL,
  changed_by_name TEXT,
  
  -- Reason/Note
  change_reason TEXT,
  
  -- Timestamp
  changed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_maintenance_status_history_request ON maintenance_status_history(maintenance_request_id);
CREATE INDEX idx_maintenance_status_history_changed_at ON maintenance_status_history(changed_at DESC);

-- Trigger to log status changes
CREATE OR REPLACE FUNCTION log_maintenance_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO maintenance_status_history (
      maintenance_request_id,
      old_status,
      new_status,
      changed_by,
      changed_at
    ) VALUES (
      NEW.id,
      OLD.status,
      NEW.status,
      NEW.assigned_to, -- Or use session user
      NOW()
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER track_maintenance_status_changes
AFTER UPDATE ON maintenance_requests
FOR EACH ROW
EXECUTE FUNCTION log_maintenance_status_change();
```

---

## Supabase Storage Buckets

### Create Storage Bucket for Maintenance Photos

```sql
-- Storage bucket for maintenance photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('maintenance-photos', 'maintenance-photos', false);

-- RLS policies for storage
CREATE POLICY "Users can upload maintenance photos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'maintenance-photos' AND
  auth.uid() IN (SELECT clerk_id FROM users WHERE organization_id = current_organization_id())
);

CREATE POLICY "Users can view maintenance photos in their org"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'maintenance-photos' AND
  auth.uid() IN (SELECT clerk_id FROM users WHERE organization_id = current_organization_id())
);
```

---

## Sample Queries for UI

### Get Maintenance List with Summary

```sql
-- Get all maintenance requests with summary info
SELECT 
  mr.id,
  mr.request_number,
  mr.title,
  mr.status,
  mr.priority,
  mr.category,
  mr.requested_on,
  mr.due_on,
  p.name as property_name,
  u.unit_number,
  t.first_name || ' ' || t.last_name as tenant_name,
  assigned_user.first_name || ' ' || assigned_user.last_name as assigned_to_name,
  (SELECT COUNT(*) FROM maintenance_photos WHERE maintenance_request_id = mr.id) as photo_count,
  (SELECT COUNT(*) FROM maintenance_comments WHERE maintenance_request_id = mr.id) as comment_count
FROM maintenance_requests mr
LEFT JOIN properties p ON mr.property_id = p.id
LEFT JOIN units u ON mr.unit_id = u.id
LEFT JOIN tenants t ON mr.tenant_id = t.id
LEFT JOIN users assigned_user ON mr.assigned_to = assigned_user.id
WHERE mr.organization_id = ?
ORDER BY 
  CASE mr.priority
    WHEN 'urgent' THEN 1
    WHEN 'high' THEN 2
    WHEN 'medium' THEN 3
    WHEN 'low' THEN 4
  END,
  mr.requested_on DESC;
```

---

### Get Maintenance Detail

```sql
-- Get complete maintenance request details
SELECT 
  mr.*,
  p.name as property_name,
  p.address as property_address,
  u.unit_number,
  t.first_name || ' ' || t.last_name as tenant_name,
  t.email as tenant_email,
  t.phone as tenant_phone,
  requested_user.first_name || ' ' || requested_user.last_name as requested_by_name,
  assigned_user.first_name || ' ' || assigned_user.last_name as assigned_to_name
FROM maintenance_requests mr
LEFT JOIN properties p ON mr.property_id = p.id
LEFT JOIN units u ON mr.unit_id = u.id
LEFT JOIN tenants t ON mr.tenant_id = t.id
LEFT JOIN users requested_user ON mr.requested_by = requested_user.id
LEFT JOIN users assigned_user ON mr.assigned_to = assigned_user.id
WHERE mr.id = ?;
```

---

### Get Photos for Request

```sql
SELECT 
  mp.*,
  u.first_name || ' ' || u.last_name as uploaded_by_name
FROM maintenance_photos mp
LEFT JOIN users u ON mp.uploaded_by = u.id
WHERE mp.maintenance_request_id = ?
ORDER BY mp.display_order, mp.uploaded_at;
```

---

### Get Comments for Request

```sql
SELECT 
  mc.*,
  u.avatar_url
FROM maintenance_comments mc
LEFT JOIN users u ON mc.user_id = u.id
WHERE mc.maintenance_request_id = ?
ORDER BY mc.created_at ASC;
```

---

### Get Notes for Request

```sql
SELECT 
  mn.*,
  u.avatar_url
FROM maintenance_notes mn
LEFT JOIN users u ON mn.user_id = u.id
WHERE mn.maintenance_request_id = ?
ORDER BY mn.pinned DESC, mn.created_at DESC;
```

---

## Client Portal Integration

### Tenant Submission Form

When tenants submit maintenance requests through the client portal:

```javascript
// Client portal submission
const submitMaintenanceRequest = async (formData) => {
  const { data, error } = await supabase
    .from('maintenance_requests')
    .insert({
      organization_id: tenantOrgId,
      property_id: tenantPropertyId,
      unit_id: tenantUnitId,
      tenant_id: tenantId,
      requested_by: tenantUserId,
      title: formData.title,
      description: formData.description,
      category: formData.category,
      priority: 'medium', // Default for tenant submissions
      status: 'open',
      permission_to_enter: formData.permissionToEnter
    })
    .select()
    .single();
  
  // Upload photos if provided
  if (formData.photos && formData.photos.length > 0) {
    for (const photo of formData.photos) {
      const filePath = `${data.id}/${photo.name}`;
      await supabase.storage
        .from('maintenance-photos')
        .upload(filePath, photo);
      
      const { data: { publicUrl } } = supabase.storage
        .from('maintenance-photos')
        .getPublicUrl(filePath);
      
      await supabase
        .from('maintenance_photos')
        .insert({
          maintenance_request_id: data.id,
          organization_id: tenantOrgId,
          file_name: photo.name,
          file_type: photo.type,
          file_size: photo.size,
          storage_path: filePath,
          url: publicUrl,
          uploaded_by: tenantUserId
        });
    }
  }
  
  return data;
};
```

---

## RLS Policies

### Maintenance Requests

```sql
-- View maintenance requests
CREATE POLICY maintenance_requests_select ON maintenance_requests
FOR SELECT USING (
  organization_id = current_organization_id() OR
  -- Tenants can see their own requests
  tenant_id IN (
    SELECT id FROM tenants WHERE user_id = current_user_id()
  )
);

-- Create maintenance requests
CREATE POLICY maintenance_requests_insert ON maintenance_requests
FOR INSERT WITH CHECK (
  organization_id = current_organization_id() OR
  -- Tenants can create requests for their units
  (tenant_id IN (
    SELECT id FROM tenants WHERE user_id = current_user_id()
  ) AND requested_by = current_user_id())
);

-- Update maintenance requests (staff only)
CREATE POLICY maintenance_requests_update ON maintenance_requests
FOR UPDATE USING (
  organization_id = current_organization_id() AND
  current_user_role() IN ('org_admin', 'manager', 'maintenance')
);
```

---

## Summary Statistics

### Dashboard Maintenance Widget Query

```sql
-- Get maintenance summary for dashboard
SELECT 
  COUNT(*) FILTER (WHERE status = 'open') as open_count,
  COUNT(*) FILTER (WHERE status = 'scheduled') as scheduled_count,
  COUNT(*) FILTER (WHERE status = 'in_progress') as in_progress_count,
  COUNT(*) FILTER (WHERE status = 'completed') as completed_count,
  COUNT(*) FILTER (WHERE priority = 'urgent') as urgent_count
FROM maintenance_requests
WHERE organization_id = ?
  AND status NOT IN ('completed', 'cancelled')
  AND requested_on >= NOW() - INTERVAL '30 days';
```

---

## File Upload Integration

### Supabase Storage Upload (React)

```javascript
// Upload photo to maintenance request
const uploadMaintenancePhoto = async (requestId, file) => {
  const fileName = `${requestId}/${Date.now()}_${file.name}`;
  
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('maintenance-photos')
    .upload(fileName, file);
  
  if (uploadError) throw uploadError;
  
  const { data: { publicUrl } } = supabase.storage
    .from('maintenance-photos')
    .getPublicUrl(fileName);
  
  const { data, error } = await supabase
    .from('maintenance_photos')
    .insert({
      maintenance_request_id: requestId,
      organization_id: currentOrgId,
      file_name: file.name,
      file_type: file.type,
      file_size: file.size,
      storage_path: fileName,
      url: publicUrl,
      uploaded_by: currentUserId
    })
    .select()
    .single();
  
  return data;
};
```

---

## Complete Database Schema Summary

✅ **Tables Created:**
1. `maintenance_requests` - Main request tracking
2. `maintenance_photos` - Photo attachments
3. `maintenance_comments` - Discussion thread
4. `maintenance_notes` - Internal/team notes
5. `maintenance_status_history` - Audit trail

✅ **Features:**
- Auto-generated request numbers
- Photo uploads with Supabase Storage
- Comments and notes system
- Status change tracking
- Tenant portal integration
- RLS policies for multi-tenant security
- Performance indexes

✅ **Enterprise Ready:**
- Multi-tenant isolation
- Audit trails
- File management
- Role-based access
- Client portal support
- Status workflow tracking
