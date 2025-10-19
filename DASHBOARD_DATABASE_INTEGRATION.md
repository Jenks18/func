# Dashboard Page - Database Integration Guide

## Overview
The **DashboardPageWithDB** provides a comprehensive, real-time view of property management operations with full Supabase database integration. All statistics are calculated from actual database records and filtered by the selected month.

---

## Key Features

### 1. **Dynamic Month Filtering** 📅
- **Month dropdown**: Auto-generates from account creation date to present
- **Current month default**: Always starts on the current month
- **Historical data**: Navigate back to any month since account creation
- **Account creation tracking**: Stored in `organizations.created_at`

#### Implementation
```javascript
const generateMonthOptions = (startDate) => {
  const months = [];
  const now = new Date();
  const current = new Date(now.getFullYear(), now.getMonth(), 1);
  const start = new Date(startDate.getFullYear(), startDate.getMonth(), 1);

  while (current >= start) {
    months.push({
      value: `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}`,
      label: current.toLocaleString('default', { month: 'long', year: 'numeric' })
    });
    current.setMonth(current.getMonth() - 1);
  }
  return months;
};
```

---

### 2. **Collection Stats** 💰

#### Categories
1. **Collected**: Completed income transactions for the selected month
2. **Overdue**: Unpaid rent past the due date (typically 1st of month)
3. **Processing**: Rent due this month but not yet marked overdue
4. **Coming Due**: Rent approaching due date (last 5-6 days of previous month)

#### Database Queries
```javascript
// Fetch active leases
const { data: leases } = await supabase
  .from('leases')
  .select('id, rent_amount, status, lease_start_date, lease_end_date')
  .eq('organization_id', organizationId)
  .eq('status', 'active');

// Fetch transactions for selected month
const { data: transactions } = await supabase
  .from('transactions')
  .select('*')
  .eq('organization_id', organizationId)
  .eq('type', 'income')
  .gte('date', startDate)
  .lte('date', endDate);
```

#### Calculation Logic
```javascript
// Collected: Sum of all completed transactions
collected = transactions
  ?.filter(t => t.status === 'completed')
  .reduce((sum, t) => sum + parseFloat(t.amount), 0) || 0;

// For each lease, calculate what's owed
leases?.forEach(lease => {
  const rentAmount = parseFloat(lease.rent_amount);
  const leasePaid = transactions
    ?.filter(t => t.lease_id === lease.id && t.status === 'completed')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0) || 0;

  const balance = rentAmount - leasePaid;

  if (balance > 0) {
    const dueDate = new Date(year, month - 1, 1);
    if (today > dueDate) {
      overdue += balance;
    } else if (today.getDate() >= 25) {
      comingDue += balance;
    } else {
      processing += balance;
    }
  }
});
```

#### Donut Chart
- Visual representation of collection percentage
- Green circle fills based on `(collected / total) * 100`
- SVG circle with stroke-dashoffset animation

---

### 3. **Past Overdue** 🚨

#### Two Filter Modes
1. **Active Only**: Overdue amounts from currently active leases
2. **All Time**: Total historical overdue from all leases (past and present)

#### Database Query
```javascript
// Get active leases
const { data: activeLeases } = await supabase
  .from('leases')
  .select('id, rent_amount')
  .eq('organization_id', organizationId)
  .eq('status', 'active');

// Get all leases for all-time calculation
const { data: allLeases } = await supabase
  .from('leases')
  .select('id, rent_amount, status')
  .eq('organization_id', organizationId);

// Get all past transactions
const { data: transactions } = await supabase
  .from('transactions')
  .select('*')
  .eq('organization_id', organizationId)
  .eq('type', 'income')
  .lt('date', today);
```

#### Calculation Helper
```javascript
const calculateExpectedPayments = (lease) => {
  const rentAmount = parseFloat(lease.rent_amount);
  const startDate = new Date(lease.lease_start_date);
  const endDate = lease.lease_end_date ? new Date(lease.lease_end_date) : new Date();
  const today = new Date();
  
  const effectiveEndDate = endDate < today ? endDate : today;
  
  const monthsPassed = Math.max(0, 
    (effectiveEndDate.getFullYear() - startDate.getFullYear()) * 12 +
    (effectiveEndDate.getMonth() - startDate.getMonth()) + 1
  );

  return rentAmount * monthsPassed;
};
```

---

### 4. **Occupancy Widget** 🏢

#### Metrics
- **Total Units**: Count from `units` table
- **Occupied**: Count of active leases
- **Vacant**: Total - Occupied
- **Occupancy %**: (Occupied / Total) × 100
- **Units with Overdue**: Active leases with unpaid balances

#### Database Queries
```javascript
// Get total units
const { data: units } = await supabase
  .from('units')
  .select('id')
  .eq('organization_id', organizationId);

// Get active leases (occupied units)
const { data: activeLeases } = await supabase
  .from('leases')
  .select('id, unit_id')
  .eq('organization_id', organizationId)
  .eq('status', 'active');

// Calculate units with overdue balances
// (Loop through leases, compare expected vs actual payments)
```

#### Visual Components
- Red number for vacant units
- Green number for occupied units
- Circular progress indicator with percentage
- Click "View All" to navigate to Income page with overdue filter

---

### 5. **Maintenance Widget** 🔧

#### Metrics
- **Open**: maintenance_requests with status = 'open'
- **Scheduled**: maintenance_requests with status = 'in_progress'

#### Database Query
```javascript
const { data } = await supabase
  .from('maintenance_requests')
  .select('status')
  .eq('organization_id', organizationId)
  .in('status', ['open', 'in_progress']);

const open = data?.filter(m => m.status === 'open').length || 0;
const scheduled = data?.filter(m => m.status === 'in_progress').length || 0;
```

#### Interaction
- Entire widget is clickable
- Navigates to Maintenance page on click

---

### 6. **Unsigned Leases** ✍️

#### Criteria
- Lease status = 'pending'
- `metadata.signatures` is empty or incomplete
- Shows first 4 unsigned leases

#### Database Query
```javascript
const { data } = await supabase
  .from('leases')
  .select(`
    id,
    status,
    metadata,
    properties (name),
    units (unit_number),
    tenants (id, first_name, last_name, email)
  `)
  .eq('organization_id', organizationId)
  .eq('status', 'pending');

// Filter for missing signatures
const unsigned = data?.filter(lease => {
  const signatures = lease.metadata?.signatures || {};
  return Object.keys(signatures).length === 0;
}) || [];
```

#### Actions
- **Remind**: Opens SendReminderModal for the tenant
- **Sign**: Navigates to LeasesFiles page with selectedLeaseId

---

### 7. **Applications Processing** 📋

#### Criteria
- Tenants with `metadata.application_status` set
- Status is not 'approved' or 'rejected'
- Shows first 6 applications

#### Database Query
```javascript
const { data } = await supabase
  .from('tenants')
  .select('id, first_name, last_name, email, metadata')
  .eq('organization_id', organizationId);

// Filter for applications in process
const processing = data?.filter(tenant => {
  const appStatus = tenant.metadata?.application_status;
  return appStatus && appStatus !== 'approved' && appStatus !== 'rejected';
}) || [];
```

#### Actions
- **Tenant name**: Click to navigate to Tenants page with selectedTenantId
- **Follow Up**: Opens SendReminderModal for the applicant

---

### 8. **Record Payment Modal** 💳

#### Features
- **Tenant selector dropdown**: Lists all tenants with active leases
- **Auto-calculated balance**: Shows current balance due
- **Property/unit display**: Shows where tenant resides
- **Monthly rent reference**: Displays expected rent amount
- **Pre-populated amount**: Auto-fills with balance due

#### Enhanced Modal Query
```javascript
// Get all active leases with full details
const { data } = await supabase
  .from('leases')
  .select(`
    id,
    rent_amount,
    lease_start_date,
    tenants (id, first_name, last_name, email),
    properties (id, name),
    units (id, unit_number)
  `)
  .eq('organization_id', organizationId)
  .eq('status', 'active');

// Calculate balance for each tenant
const balance = expectedTotal - paidTotal;
```

#### Payment Recording
```javascript
// Insert transaction
const { error } = await supabase
  .from('transactions')
  .insert({
    organization_id: organizationId,
    tenant_id: paymentData.tenantId,
    lease_id: paymentData.leaseId,
    property_id: paymentData.propertyId,
    unit_id: paymentData.unitId,
    type: 'income',
    category: 'rent',
    amount: paymentData.amount,
    date: paymentData.paymentDate,
    description: paymentData.description,
    payment_method: paymentData.paymentMethod,
    reference_number: paymentData.reference,
    status: 'completed'
  });
```

#### Payment Methods Supported
- Check
- Cash
- Bank Transfer
- Credit Card
- Money Order
- Online Payment
- ACH Transfer
- Wire Transfer

---

## Data Flow

### On Component Mount
1. Get Clerk user ID
2. Query `users` table for `organization_id`
3. Query `organizations` table for `created_at` date
4. Generate month options from creation date to now
5. Set current month as selected
6. Fetch all dashboard data

### On Month Change
1. Update `selectedMonth` state
2. Re-fetch all dashboard data with new date range
3. Collection stats filtered by selected month
4. Past overdue recalculates from all historical data

### On Payment Recorded
1. Insert transaction into database
2. Close modal
3. Re-fetch all dashboard data
4. Collection stats update automatically
5. Past overdue updates automatically
6. Units with overdue count updates

---

## Database Tables Used

### Primary Tables
- `organizations` - Account creation date
- `users` - Clerk ID to organization mapping
- `leases` - Active leases, rent amounts, dates
- `transactions` - All income/payment records
- `units` - Total units for occupancy
- `tenants` - Tenant info, application status
- `properties` - Property names for display
- `maintenance_requests` - Open and scheduled work

### Key Columns

#### leases
- `organization_id` (UUID)
- `status` (TEXT) - 'active', 'pending', 'ended'
- `rent_amount` (DECIMAL)
- `lease_start_date` (DATE)
- `lease_end_date` (DATE)
- `metadata` (JSONB) - signatures, etc.

#### transactions
- `organization_id` (UUID)
- `type` (TEXT) - 'income' or 'expense'
- `category` (TEXT) - 'rent', etc.
- `amount` (DECIMAL)
- `date` (DATE)
- `status` (TEXT) - 'completed', 'pending', 'failed'
- `lease_id` (UUID)
- `tenant_id` (UUID)
- `property_id` (UUID)
- `unit_id` (UUID)
- `payment_method` (TEXT)
- `reference_number` (TEXT)

#### tenants
- `organization_id` (UUID)
- `first_name` (TEXT)
- `last_name` (TEXT)
- `metadata` (JSONB) - application_status, application_date

---

## Consistency with Income Page

### Shared Logic
Both Dashboard and Income page should use **identical** queries and calculations:

1. **Collected**: `status = 'completed'` transactions
2. **Overdue**: Balance due with date past 1st of month
3. **Processing**: Balance due with current date before due date
4. **Coming Due**: Balance due with date in last week of previous month

### Month Filtering
- Dashboard filters by selected month dropdown
- Income page shows all invoices but can be filtered
- Both should respect organization_id isolation

### Status Definitions
Must be consistent across both pages:
- **Fully Paid**: balance = 0
- **Overdue**: balance > 0 and today > due date
- **Partial**: 0 < paid < expected
- **Pending**: No payments yet, not overdue

---

## Navigation Integration

### Click Handlers
```javascript
// Collection stats
handleViewCollected() → Navigate to Income with statusFilter='collected'
handleViewOverdue() → Navigate to Income with statusFilter='overdue'
handleViewProcessing() → Navigate to Income with statusFilter='processing'
handleViewComingDue() → Navigate to Income with statusFilter='coming-due'

// Widgets
Maintenance widget → Navigate to 'Maintenance'
Unsigned lease name → Navigate to 'LeasesFiles' with selectedLeaseId
Application name → Navigate to 'Tenants' with selectedTenantId
```

### Session Storage
Dashboard passes filter parameters via sessionStorage:
```javascript
sessionStorage.setItem('Income_params', JSON.stringify({ statusFilter: 'overdue' }));
```

---

## Performance Considerations

### Query Optimization
- Use `.select()` to fetch only needed columns
- Use `.eq()` filters to leverage indexes
- Fetch related data with joins: `properties (name), units (unit_number)`
- Avoid N+1 queries by fetching transactions once

### Caching Strategy
- Dashboard data refetches on month change
- Payment recording triggers full refresh
- Consider adding local state cache for unchanged data

### Loading States
- Show "Loading dashboard..." while fetching
- Disable buttons during payment recording
- Consider skeleton screens for better UX

---

## Error Handling

### Database Errors
```javascript
try {
  const { data, error } = await supabase.from('table').select();
  if (error) throw error;
  // Process data
} catch (error) {
  console.error('Error fetching data:', error);
  // Show user-friendly error message
}
```

### Empty States
- No unsigned leases: "✓ All leases are signed"
- No applications: "No applications in process"
- Zero units: Handle division by zero in occupancy %

---

## Future Enhancements

### Mobile & iPad Views
- Responsive grid layouts
- Touch-friendly buttons
- Collapsible sections
- Bottom sheet modals

### Real-time Updates
- WebSocket integration for live updates
- Auto-refresh on data changes
- Push notifications for new payments

### Advanced Filtering
- Filter by property
- Filter by date range
- Export dashboard report
- Compare month-over-month

### Analytics
- Revenue trends chart
- Occupancy over time
- Maintenance cost tracking
- Tenant payment history

---

## Testing Checklist

### Data Accuracy
- [ ] Collection stats match transaction records
- [ ] Overdue calculations correct for different dates
- [ ] Occupancy % calculates correctly
- [ ] Past overdue filters work (active vs all-time)
- [ ] Month dropdown shows all months from account creation

### User Interactions
- [ ] Month selector updates all widgets
- [ ] Record payment inserts transaction correctly
- [ ] Tenant selector shows all active leases
- [ ] Balance auto-calculates in payment modal
- [ ] Navigation buttons work correctly
- [ ] Click handlers pass correct parameters

### Edge Cases
- [ ] No data for selected month
- [ ] No active leases
- [ ] No tenants in system
- [ ] Account created today (only 1 month)
- [ ] Lease with $0 rent
- [ ] Overpayment scenarios

---

## SQL Query Examples

### Get monthly revenue
```sql
SELECT SUM(amount) as total_collected
FROM transactions
WHERE organization_id = 'uuid-here'
  AND type = 'income'
  AND status = 'completed'
  AND date >= '2024-01-01'
  AND date <= '2024-01-31';
```

### Get tenants with balance
```sql
SELECT 
  t.id,
  t.first_name,
  t.last_name,
  l.rent_amount,
  COALESCE(SUM(tr.amount), 0) as paid,
  l.rent_amount - COALESCE(SUM(tr.amount), 0) as balance
FROM tenants t
JOIN leases l ON l.tenant_id = t.id
LEFT JOIN transactions tr ON tr.lease_id = l.id AND tr.status = 'completed'
WHERE l.organization_id = 'uuid-here'
  AND l.status = 'active'
GROUP BY t.id, t.first_name, t.last_name, l.rent_amount
HAVING l.rent_amount - COALESCE(SUM(tr.amount), 0) > 0;
```

---

## Troubleshooting

### Stats showing 0
- Check organization_id is correct
- Verify transactions exist in selected month
- Check lease status is 'active'
- Ensure transaction status is 'completed'

### Month dropdown empty
- Verify organizations.created_at exists
- Check date parsing logic
- Ensure user has organization_id

### Payment not recording
- Check all required fields in transaction
- Verify foreign key constraints (lease_id, tenant_id exist)
- Check organization_id matches user's org
- Review Supabase logs for SQL errors

---

## Related Files
- `/src/pages/DashboardPageWithDB.jsx` - Main component
- `/src/components/modals/RecordPaymentModalEnhanced.jsx` - Enhanced payment modal
- `/src/pages/IncomePageNew.jsx` - Income page (should use same logic)
- `/src/services/supabaseClient.js` - Database client
- `/supabase/migrations/001_initial_schema.sql` - Database schema

---

**Last Updated**: October 2025
**Version**: 1.0.0
**Status**: Production Ready ✅
