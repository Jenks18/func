# Income Management - Database Schema & API Integration

## Overview
This document outlines the complete database schema and API integration requirements for the Income Management system implemented in `IncomePageNew.jsx`, `InvoiceDetailView.jsx`, and `RecordPaymentModal.jsx`.

---

## Database Tables

### 1. `invoices` Table
Stores all invoice records for properties and tenants.

```sql
CREATE TABLE invoices (
  id BIGSERIAL PRIMARY KEY,
  tenant_id BIGINT REFERENCES tenants(id) ON DELETE CASCADE,
  property_id BIGINT REFERENCES properties(id) ON DELETE CASCADE,
  unit_number VARCHAR(50),
  
  -- Dates
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  due_date DATE NOT NULL,
  paid_date DATE,
  
  -- Amounts
  total_amount DECIMAL(10, 2) NOT NULL,
  paid_amount DECIMAL(10, 2) DEFAULT 0,
  balance DECIMAL(10, 2) GENERATED ALWAYS AS (total_amount - paid_amount) STORED,
  
  -- Status & Tracking
  status VARCHAR(20) NOT NULL CHECK (status IN ('Pending', 'Partial', 'Fully Paid', 'Overdue')),
  days_late INT DEFAULT 0,
  reminders_sent INT DEFAULT 0,
  
  -- Additional Info
  subject VARCHAR(255),
  notes TEXT,
  
  -- Metadata
  organization_id BIGINT REFERENCES organizations(id) ON DELETE CASCADE,
  created_by BIGINT REFERENCES users(id)
);

-- Indexes
CREATE INDEX idx_invoices_tenant ON invoices(tenant_id);
CREATE INDEX idx_invoices_property ON invoices(property_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_due_date ON invoices(due_date);
CREATE INDEX idx_invoices_org ON invoices(organization_id);
```

### 2. `invoice_items` Table
Stores individual line items for each invoice (Rent, Late Fees, Utilities, etc.)

```sql
CREATE TABLE invoice_items (
  id BIGSERIAL PRIMARY KEY,
  invoice_id BIGINT REFERENCES invoices(id) ON DELETE CASCADE,
  
  -- Item Details
  name VARCHAR(100) NOT NULL, -- e.g., 'Rent', 'Late Fee', 'Water Bill'
  description TEXT,
  amount DECIMAL(10, 2) NOT NULL,
  quantity INT DEFAULT 1,
  unit_price DECIMAL(10, 2),
  
  -- Categorization
  category VARCHAR(50), -- 'rent', 'utilities', 'fees', 'other'
  is_recurring BOOLEAN DEFAULT false,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  created_by BIGINT REFERENCES users(id)
);

-- Indexes
CREATE INDEX idx_invoice_items_invoice ON invoice_items(invoice_id);
CREATE INDEX idx_invoice_items_category ON invoice_items(category);
```

### 3. `payments` Table
Records all payments made against invoices.

```sql
CREATE TABLE payments (
  id BIGSERIAL PRIMARY KEY,
  invoice_id BIGINT REFERENCES invoices(id) ON DELETE CASCADE,
  tenant_id BIGINT REFERENCES tenants(id) ON DELETE CASCADE,
  
  -- Payment Details
  amount DECIMAL(10, 2) NOT NULL,
  payment_method VARCHAR(50) NOT NULL, -- 'Cash', 'Check', 'Credit Card', 'Bank Transfer', 'ACH'
  payment_date DATE NOT NULL,
  
  -- Additional Info
  reference_number VARCHAR(100), -- Check number, transaction ID, etc.
  notes TEXT,
  bank_account VARCHAR(100), -- Which landlord account received the payment
  
  -- Status
  status VARCHAR(20) DEFAULT 'Completed' CHECK (status IN ('Pending', 'Completed', 'Failed', 'Reversed')),
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  created_by BIGINT REFERENCES users(id),
  organization_id BIGINT REFERENCES organizations(id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX idx_payments_invoice ON payments(invoice_id);
CREATE INDEX idx_payments_tenant ON payments(tenant_id);
CREATE INDEX idx_payments_date ON payments(payment_date);
CREATE INDEX idx_payments_org ON payments(organization_id);
```

### 4. Related Tables (Required)

#### `tenants` Table
```sql
CREATE TABLE tenants (
  id BIGSERIAL PRIMARY KEY,
  organization_id BIGINT REFERENCES organizations(id) ON DELETE CASCADE,
  
  -- Personal Info
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  
  -- Lease Info
  property_id BIGINT REFERENCES properties(id),
  unit_number VARCHAR(50),
  lease_start DATE,
  lease_end DATE,
  
  -- Balance Tracking
  current_balance DECIMAL(10, 2) DEFAULT 0,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### `properties` Table
```sql
CREATE TABLE properties (
  id BIGSERIAL PRIMARY KEY,
  organization_id BIGINT REFERENCES organizations(id) ON DELETE CASCADE,
  
  -- Property Info
  name VARCHAR(255) NOT NULL,
  address VARCHAR(500),
  city VARCHAR(100),
  state VARCHAR(50),
  zip_code VARCHAR(20),
  
  -- Details
  total_units INT,
  property_type VARCHAR(50), -- 'Single Family', 'Multi-Family', 'Commercial'
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## API Endpoints

### Invoice Management

#### 1. **GET /api/invoices**
Fetch all invoices with optional filtering and grouping.

**Query Parameters:**
- `groupBy` (optional): `property` | `tenant` | `status`
- `status` (optional): `Pending` | `Partial` | `Fully Paid` | `Overdue` | `all`
- `propertyId` (optional): Filter by specific property
- `tenantId` (optional): Filter by specific tenant
- `startDate` (optional): Filter invoices due after this date
- `endDate` (optional): Filter invoices due before this date

**Response:**
```json
{
  "success": true,
  "invoices": [
    {
      "id": 7158766,
      "tenant": {
        "id": 101,
        "name": "Michael Scott",
        "email": "michael@dundermifflin.com"
      },
      "property": {
        "id": 1,
        "name": "605 Race Street",
        "address": "605 Race St, Philadelphia, PA"
      },
      "unit": "100",
      "dueDate": "2025-01-01",
      "paidDate": null,
      "amount": 1220.00,
      "paidAmount": 0,
      "balance": 1220.00,
      "status": "Overdue",
      "daysLate": 29,
      "remindersSent": 2,
      "subject": "January 2025 Rent",
      "items": [
        { "id": 1, "name": "Rent", "description": "Monthly rent", "amount": 1200.00 },
        { "id": 2, "name": "Late Fee", "description": "Late fee charge", "amount": 20.00 }
      ],
      "payments": [],
      "notes": "Tenant notified of overdue status"
    }
  ],
  "summary": {
    "totalDue": 15000.00,
    "totalPaid": 8500.00,
    "totalOverdue": 2500.00,
    "invoiceCount": 12,
    "overdueCount": 3
  }
}
```

---

#### 2. **PUT /api/invoices/:invoiceId**
Update an existing invoice (used in Edit Invoice mode).

**Request Body:**
```json
{
  "subject": "Updated invoice subject",
  "dueDate": "2025-02-01",
  "items": [
    { "id": 1, "name": "Rent", "description": "Monthly rent", "amount": 1250.00 },
    { "id": 2, "name": "Utilities", "description": "Water & Sewer", "amount": 50.00 }
  ],
  "notes": "Updated payment terms"
}
```

**Response:**
```json
{
  "success": true,
  "invoice": {
    "id": 7158766,
    "subject": "Updated invoice subject",
    "dueDate": "2025-02-01",
    "totalAmount": 1300.00,
    "items": [...],
    "updatedAt": "2025-01-30T10:30:00Z"
  },
  "message": "Invoice updated successfully"
}
```

**Side Effects:**
- Recalculates `total_amount` based on updated items
- Updates `balance` if `total_amount` changed
- May change `status` if balance affects payment status
- Triggers update to `updated_at` timestamp

---

#### 3. **DELETE /api/invoices/:invoiceId**
Delete an invoice and all related items/payments.

**Response:**
```json
{
  "success": true,
  "message": "Invoice deleted successfully",
  "deletedInvoiceId": 7158766
}
```

**Side Effects:**
- Deletes all related `invoice_items` (CASCADE)
- Deletes all related `payments` (CASCADE)
- Updates tenant's `current_balance`
- Creates audit log entry

---

### Invoice Items Management

#### 4. **POST /api/invoices/:invoiceId/items**
Add a new item to an existing invoice.

**Request Body:**
```json
{
  "name": "Pet Fee",
  "description": "Monthly pet fee for 1 dog",
  "amount": 50.00,
  "category": "fees"
}
```

**Response:**
```json
{
  "success": true,
  "item": {
    "id": 123,
    "invoiceId": 7158766,
    "name": "Pet Fee",
    "amount": 50.00,
    "createdAt": "2025-01-30T10:30:00Z"
  },
  "updatedInvoice": {
    "id": 7158766,
    "totalAmount": 1270.00,
    "balance": 1270.00,
    "items": [...]
  }
}
```

**Side Effects:**
- Updates invoice `total_amount`
- Recalculates invoice `balance`
- May change invoice `status`

---

#### 5. **DELETE /api/invoices/:invoiceId/items/:itemId**
Remove an item from an invoice (e.g., remove late fee).

**Response:**
```json
{
  "success": true,
  "message": "Item removed successfully",
  "updatedInvoice": {
    "id": 7158766,
    "totalAmount": 1200.00,
    "balance": 1200.00,
    "items": [...]
  }
}
```

**Side Effects:**
- Updates invoice `total_amount`
- Recalculates invoice `balance`
- May change invoice `status`

---

### Payment Management

#### 6. **POST /api/invoices/:invoiceId/payments**
Record a payment against an invoice.

**Request Body:**
```json
{
  "tenantId": 101,
  "amount": 600.00,
  "paymentMethod": "Check",
  "paymentDate": "2025-01-30",
  "referenceNumber": "Check #1234",
  "bankAccount": "Landlord Checking",
  "notes": "Partial payment for January"
}
```

**Response:**
```json
{
  "success": true,
  "payment": {
    "id": 456,
    "invoiceId": 7158766,
    "amount": 600.00,
    "paymentMethod": "Check",
    "paymentDate": "2025-01-30",
    "status": "Completed",
    "createdAt": "2025-01-30T10:30:00Z"
  },
  "updatedInvoice": {
    "id": 7158766,
    "totalAmount": 1220.00,
    "paidAmount": 600.00,
    "balance": 620.00,
    "status": "Partial",
    "paidDate": null
  },
  "message": "Payment recorded successfully"
}
```

**Side Effects:**
- Updates invoice `paid_amount`
- Recalculates invoice `balance`
- Updates invoice `status`:
  - If balance = 0: Set to "Fully Paid", set `paid_date`
  - If 0 < balance < total: Set to "Partial"
- Updates tenant's `current_balance`
- May clear `days_late` if fully paid

---

## Database Triggers & Functions

### Auto-Update Invoice Status
```sql
CREATE OR REPLACE FUNCTION update_invoice_status()
RETURNS TRIGGER AS $$
BEGIN
  -- Update status based on balance and due date
  IF NEW.balance = 0 THEN
    NEW.status := 'Fully Paid';
    NEW.paid_date := CURRENT_DATE;
    NEW.days_late := 0;
  ELSIF NEW.balance > 0 AND NEW.paid_amount > 0 THEN
    NEW.status := 'Partial';
  ELSIF NEW.due_date < CURRENT_DATE AND NEW.balance > 0 THEN
    NEW.status := 'Overdue';
    NEW.days_late := CURRENT_DATE - NEW.due_date;
  ELSE
    NEW.status := 'Pending';
  END IF;
  
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER invoice_status_trigger
  BEFORE UPDATE ON invoices
  FOR EACH ROW
  EXECUTE FUNCTION update_invoice_status();
```

### Update Tenant Balance
```sql
CREATE OR REPLACE FUNCTION update_tenant_balance()
RETURNS TRIGGER AS $$
BEGIN
  -- Recalculate tenant's total balance from all invoices
  UPDATE tenants
  SET current_balance = (
    SELECT COALESCE(SUM(balance), 0)
    FROM invoices
    WHERE tenant_id = NEW.tenant_id
  )
  WHERE id = NEW.tenant_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tenant_balance_trigger
  AFTER INSERT OR UPDATE ON invoices
  FOR EACH ROW
  EXECUTE FUNCTION update_tenant_balance();
```

---

## Authentication & Authorization

All API endpoints require authentication using JWT tokens.

**Headers Required:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Permission Levels:**
- **Owner/Admin**: Full access to all invoices
- **Property Manager**: Access to invoices for assigned properties only
- **Tenant**: Read-only access to their own invoices

**Multi-Tenancy:**
All queries are scoped to the authenticated user's `organization_id` to ensure data isolation.

---

## Component Integration Map

### IncomePageNew.jsx
- **Fetches**: `GET /api/invoices?groupBy=property`
- **Displays**: Table view with property grouping, expandable rows, circular progress
- **Updates On**: Invoice created, updated, deleted, payment recorded

### InvoiceDetailView.jsx
- **Displays**: Split-screen detail view of selected invoice
- **Edit Mode APIs**:
  - Save: `PUT /api/invoices/:invoiceId`
  - Delete: `DELETE /api/invoices/:invoiceId`
  - Remove Item: `DELETE /api/invoices/:invoiceId/items/:itemId`
  - Add Note: Updates `notes` field via PUT
- **Payment**: Opens `RecordPaymentModal`

### RecordPaymentModal.jsx
- **Submits**: `POST /api/invoices/:invoiceId/payments`
- **Updates**: Parent components to refresh invoice data

---

## Error Handling

All API endpoints should return consistent error responses:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Payment amount cannot exceed invoice balance",
    "field": "amount"
  }
}
```

**Common Error Codes:**
- `VALIDATION_ERROR`: Invalid input data
- `NOT_FOUND`: Invoice/item/payment not found
- `UNAUTHORIZED`: Invalid or missing auth token
- `FORBIDDEN`: User doesn't have permission
- `CONFLICT`: Operation conflicts with current state (e.g., deleting paid invoice)
- `SERVER_ERROR`: Internal server error

---

## Next Steps for Implementation

1. **Backend Setup**:
   - Create database tables with migrations
   - Implement API endpoints with Express/Fastify/etc.
   - Add authentication middleware
   - Set up multi-tenant data scoping

2. **Frontend Integration**:
   - Replace all `alert()` and `console.log()` with actual API calls
   - Add loading states and error handling
   - Implement optimistic UI updates
   - Add toast notifications for success/error

3. **Testing**:
   - Unit tests for API endpoints
   - Integration tests for payment flow
   - E2E tests for invoice CRUD operations

4. **Monitoring**:
   - Track API performance
   - Monitor payment success rates
   - Alert on failed payment processing

---

## Related Documentation
- See `LEASES_DETAIL_PANEL_UPDATE.md` for similar split-screen pattern
- See `RBAC_GUIDE.md` for role-based access control
- See `MULTI_TENANT_ARCHITECTURE.md` for data isolation patterns
