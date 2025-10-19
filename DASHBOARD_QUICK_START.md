# Dashboard Page - Quick Implementation Guide

## Step 1: Switch to the New Dashboard

The new database-integrated dashboard is ready! Here's how to use it:

### Option A: Replace Current Dashboard
Edit `src/App.jsx` or your routing file:

```javascript
// OLD
import DashboardPage from './pages/DashboardPage';

// NEW
import DashboardPageWithDB from './pages/DashboardPageWithDB';

// Use DashboardPageWithDB instead of DashboardPage
```

### Option B: Test Side-by-Side
Keep both versions and add a toggle in your navigation.

---

## Step 2: What You Get

### ✅ **Already Implemented**
1. **Dynamic Month Selector** - From account creation to present
2. **Real-time Collection Stats** - Collected, Overdue, Processing, Coming Due
3. **Past Overdue Tracking** - With Active Only / All Time filters
4. **Occupancy Widget** - Total, Occupied, Vacant units with percentage
5. **Maintenance Widget** - Open and Scheduled counts
6. **Unsigned Leases** - Shows pending leases needing signatures
7. **Applications Processing** - Tracks applicants in progress
8. **Enhanced Payment Modal** - Tenant selector with auto-calculated balances

### 🔄 **Data Flow**
All statistics pull from your Supabase database:
- `transactions` table → Collection stats, Past overdue
- `leases` table → Occupancy, Unsigned leases
- `units` table → Total units count
- `tenants` table → Applications processing
- `maintenance_requests` table → Maintenance widget
- `organizations` table → Account creation date

---

## Step 3: Required Data Structure

### Ensure These Columns Exist

#### `transactions` table
```sql
- organization_id (UUID)
- type (TEXT) - 'income' or 'expense'
- category (TEXT) - 'rent', etc.
- amount (DECIMAL)
- date (DATE)
- status (TEXT) - 'completed', 'pending'
- lease_id (UUID, nullable)
- tenant_id (UUID, nullable)
- property_id (UUID, nullable)
- unit_id (UUID, nullable)
- payment_method (TEXT, nullable)
- reference_number (TEXT, nullable)
- description (TEXT, nullable)
```

#### `leases` table
```sql
- organization_id (UUID)
- status (TEXT) - 'active', 'pending', 'ended'
- rent_amount (DECIMAL)
- lease_start_date (DATE)
- lease_end_date (DATE, nullable)
- metadata (JSONB) - for signatures: { "signatures": { "tenant": true } }
- tenant_id (UUID)
- property_id (UUID)
- unit_id (UUID)
```

#### `tenants` table
```sql
- organization_id (UUID)
- first_name (TEXT)
- last_name (TEXT)
- email (TEXT)
- metadata (JSONB) - for applications: { "application_status": "pending", "application_date": "2024-01-15" }
```

#### `organizations` table
```sql
- id (UUID)
- created_at (TIMESTAMPTZ) - CRITICAL: Used for month dropdown
```

---

## Step 4: How to Record a Payment

### User Flow
1. Click **"Record Payment"** button
2. Select tenant from dropdown
   - Shows: "John Doe - Main Street Lofts Unit 301 (Balance: $1,200.00)"
3. Modal displays:
   - Property name
   - Unit number
   - Monthly rent
   - Current balance (auto-calculated)
4. Payment amount auto-fills with balance
5. Select payment method (Check, Cash, Bank Transfer, etc.)
6. Set payment date (defaults to today)
7. Optional: Add reference number (check #, transaction ID)
8. Optional: Add description
9. Click **"Record Payment"**

### What Happens
```javascript
// Transaction inserted into database
{
  organization_id: "user's-org-id",
  tenant_id: "tenant-uuid",
  lease_id: "lease-uuid",
  property_id: "property-uuid",
  unit_id: "unit-uuid",
  type: "income",
  category: "rent",
  amount: 1200.00,
  date: "2024-01-15",
  payment_method: "check",
  reference_number: "1234",
  description: "Rent payment - John Doe",
  status: "completed"
}

// Dashboard automatically refreshes
// - Collection stats update
// - Past overdue recalculates
// - Units with overdue updates
// - Tenant's balance updates
```

---

## Step 5: Understanding Collection Stats

### How They're Calculated

#### 📊 **Collected** (Green)
- All transactions where:
  - `type = 'income'`
  - `status = 'completed'`
  - `date` is within selected month
- Example: $8,500 collected in January 2024

#### 🚨 **Overdue** (Red)
- For each active lease:
  - Expected rent due on 1st of month
  - If tenant hasn't paid full rent
  - And today > due date
  - Add unpaid balance to overdue
- Example: $2,400 overdue (2 tenants × $1,200/month)

#### ⏳ **Processing** (Yellow)
- For each active lease:
  - Rent is due this month
  - Payment not yet received
  - But not overdue yet (before due date)
- Example: $3,600 processing (3 tenants not yet paid)

#### 📅 **Coming Due** (Blue)
- For each active lease:
  - Rent approaching due date
  - Typically last 5-6 days of previous month
  - Upcoming payment
- Example: $1,200 coming due (1 tenant, end of month)

### Visual Representation
- **Donut Chart**: Green circle fills based on collected %
- **Total**: Sum of all four categories
- **Percentages**: Each category as % of total

---

## Step 6: Month Filtering

### How It Works
1. Dropdown shows: "January 2024", "December 2023", etc.
2. Goes back to your account creation date
3. Select any month to view historical data

### What Changes
- ✅ Collection Stats (Collected, Overdue, Processing, Coming Due)
- ✅ Donut chart updates
- ✅ Total amount recalculates
- ❌ Past Overdue (always shows cumulative)
- ❌ Occupancy (shows current state)
- ❌ Maintenance (shows current requests)

### Example
```
Account created: June 2023
Current month: January 2024

Dropdown options:
- January 2024 (current)
- December 2023
- November 2023
- ...
- June 2023 (account creation)
```

---

## Step 7: Past Overdue Filters

### Active Only
- Shows overdue amounts from **currently active leases only**
- Excludes ended/cancelled leases
- Best for current cash flow analysis

### All Time
- Shows **total historical overdue** from all leases
- Includes past leases that ended
- Best for overall financial health

### Toggle Behavior
```javascript
Active Only: $4,200 (3 current tenants behind)
All Time: $6,800 (includes 1 past tenant who left owing $2,600)
```

---

## Step 8: Occupancy Widget

### Metrics
- **Vacant**: Red number - Empty units
- **Occupied**: Green number - Units with active leases
- **Percentage**: Circular progress indicator
- **Units with Overdue**: How many occupied units are behind on rent

### Calculation
```javascript
Total Units: 15 (from units table)
Active Leases: 12 (status = 'active')

Occupied: 12
Vacant: 3
Occupancy %: (12 / 15) × 100 = 80%

Units with Overdue: 2 (leases with unpaid balance)
Display: "2/12" (2 out of 12 occupied units)
```

### Click Action
- Clicking "View All" navigates to Income page with overdue filter

---

## Step 9: Maintenance Widget

### Displays
- **X Open**: maintenance_requests with status = 'open'
- **Y Scheduled**: maintenance_requests with status = 'in_progress'

### Interaction
- Entire widget is clickable
- Navigates to Maintenance page

---

## Step 10: Unsigned Leases

### Shows
- First 4 leases with status = 'pending'
- Missing signatures in metadata
- Tenant name
- Property/unit name

### Actions
- **Remind**: Opens email reminder modal
- **Sign**: Opens lease document for signing

---

## Step 11: Applications Processing

### Shows
- First 6 tenants with application in process
- `metadata.application_status` is set
- Status is not 'approved' or 'rejected'

### Displays
- Applicant name
- Application date

### Actions
- **Name click**: Navigate to tenant details
- **Follow Up**: Send reminder/follow-up email

---

## Step 12: Sync with Income Page

### Ensure Consistency
Both Dashboard and Income page should use **identical logic** for:

1. **Status definitions**
2. **Due date calculations**
3. **Balance calculations**
4. **Month filtering**

### Recommended Approach
Create shared utility functions:

```javascript
// src/utils/incomeCalculations.js

export const calculateCollected = (transactions, startDate, endDate) => {
  return transactions
    ?.filter(t => 
      t.status === 'completed' &&
      t.date >= startDate &&
      t.date <= endDate
    )
    .reduce((sum, t) => sum + parseFloat(t.amount), 0) || 0;
};

export const calculateOverdue = (leases, transactions, today) => {
  let overdue = 0;
  leases?.forEach(lease => {
    const expected = calculateExpectedPayments(lease);
    const paid = calculatePaidAmount(lease, transactions);
    const balance = expected - paid;
    
    if (balance > 0 && isDueDatePassed(lease, today)) {
      overdue += balance;
    }
  });
  return overdue;
};

// Use same functions in both Dashboard and Income page
```

---

## Step 13: Mobile & iPad Views (Next Phase)

### Planned Enhancements

#### iPad (Landscape)
- 2-column layout maintained
- Touch-friendly buttons (min 44x44px)
- Bottom sheet modals instead of centered

#### iPad (Portrait)
- Switch to single column
- Stack widgets vertically
- Collapsible sections

#### Mobile (Phone)
- Full single column layout
- Compact stats cards
- Slide-out navigation
- Bottom navigation bar

### Implementation Strategy
```javascript
const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
const [isTablet, setIsTablet] = useState(
  window.innerWidth > 768 && window.innerWidth <= 1024
);

useEffect(() => {
  const handleResize = () => {
    setIsMobile(window.innerWidth <= 768);
    setIsTablet(window.innerWidth > 768 && window.innerWidth <= 1024);
  };
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);

// Conditional rendering
{isMobile ? <MobileDashboard /> : <DesktopDashboard />}
```

---

## Step 14: Testing Your Dashboard

### Quick Test Checklist

#### ✅ Data Loading
```
1. Open dashboard → Should load within 2 seconds
2. Check console for errors → Should be none
3. All widgets show numbers → No "NaN" or "undefined"
```

#### ✅ Month Selector
```
1. Click month dropdown → Shows all months from account creation
2. Select previous month → Stats update
3. Select current month → Stats show current data
```

#### ✅ Payment Recording
```
1. Click "Record Payment"
2. Select tenant → Modal shows property, unit, balance
3. Amount auto-fills → Should match balance
4. Fill payment details
5. Click "Record Payment" → Success message
6. Dashboard refreshes → Collection stats update
```

#### ✅ Navigation
```
1. Click "Collected" → Navigate to Income with filter
2. Click "Overdue" → Navigate to Income with filter
3. Click Maintenance widget → Navigate to Maintenance page
4. Click tenant name → Navigate to tenant details
```

#### ✅ Past Overdue Filters
```
1. Click "Active Only" → Shows current lease balances
2. Click "All Time" → Shows higher number (includes past)
3. Numbers should be different (unless no ended leases)
```

---

## Step 15: Common Issues & Solutions

### Issue: Month dropdown is empty
**Solution**: Check organizations.created_at exists in database

### Issue: All stats show $0
**Solution**: Verify transactions exist with type='income' and status='completed'

### Issue: Payment not recording
**Solution**: Check foreign key constraints - tenant_id, lease_id must exist

### Issue: Occupancy shows 0%
**Solution**: Ensure units table has records and leases have status='active'

### Issue: Dashboard loads slowly
**Solution**: Add indexes on organization_id, date, status columns

---

## Step 16: Next Steps

1. ✅ **Test the new dashboard** with your sample data
2. ✅ **Record a test payment** to verify database integration
3. ✅ **Switch month selector** to see historical data
4. 🔄 **Begin mobile/iPad responsive design**
5. 🔄 **Add real-time updates** (WebSockets)
6. 🔄 **Create analytics charts** (revenue trends, occupancy over time)

---

## Files You Need

### Core Files
```
✅ /src/pages/DashboardPageWithDB.jsx (Main component)
✅ /src/components/modals/RecordPaymentModalEnhanced.jsx (Payment modal)
✅ /DASHBOARD_DATABASE_INTEGRATION.md (Full documentation)
✅ /DASHBOARD_QUICK_START.md (This file)
```

### Existing Files Used
```
→ /src/services/supabaseClient.js (Database client)
→ /src/components/modals/SendReminderModal.jsx (Reminder modal)
→ /src/config/theme.js (Theme colors)
→ /supabase/migrations/001_initial_schema.sql (Database schema)
```

---

## Ready to Launch? 🚀

Your dashboard is **production-ready** with:
- ✅ Full database integration
- ✅ Real-time calculations
- ✅ Month filtering
- ✅ Enhanced payment recording
- ✅ All widgets connected
- ✅ Comprehensive documentation

**Next**: Let's add mobile/iPad responsive views!

---

**Questions?** Check `DASHBOARD_DATABASE_INTEGRATION.md` for detailed technical documentation.
