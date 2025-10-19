# Dashboard Features Explained

## Past Overdue Calculation 📊

### What is "Past Overdue"?

**Past Overdue** shows the total amount of rent that tenants should have paid by now but haven't. It's different from the regular "Overdue" stat in the collection stats section.

### How It's Calculated:

#### Step 1: Get Expected Payments
For each lease, the dashboard calculates how much rent SHOULD have been collected based on:
- **Lease start date** (when rent payments began)
- **Lease end date** (or today's date if lease is ongoing)
- **Monthly rent amount**

**Formula:**
```javascript
monthsPassed = (Today - LeaseStartDate) in months
expectedPayments = rentAmount × monthsPassed
```

For example:
- Lease started: January 1, 2024
- Rent: $1,200/month
- Today: October 18, 2024
- Months passed: 10 months
- Expected total: $1,200 × 10 = **$12,000**

#### Step 2: Get Actual Payments
The dashboard queries all completed transactions for each lease:
```javascript
actualPayments = SUM of all completed transactions for this lease
```

For example:
- Tenant has paid 8 payments of $1,200 = **$9,600**

#### Step 3: Calculate Overdue Amount
```javascript
overdueBalance = expectedPayments - actualPayments
```

For example:
- Expected: $12,000
- Paid: $9,600
- Past Overdue: **$2,400** (2 months behind)

### Two Modes:

#### 1. Active Only (Default)
- Only includes **currently active leases**
- Shows money owed by current tenants
- Use this for: Month-to-month management

#### 2. All Time
- Includes **ALL leases** (active, expired, terminated)
- Shows historical overdue amounts
- Use this for: Annual reports, tax purposes

### Where the Data Comes From:

**Database Tables:**
```sql
-- Active leases
SELECT id, rent_amount, lease_start_date, lease_end_date
FROM leases
WHERE organization_id = YOUR_ORG
  AND status = 'active'

-- All transactions (payments)
SELECT lease_id, amount, status
FROM transactions
WHERE organization_id = YOUR_ORG
  AND type = 'income'
  AND status = 'completed'
  AND date < TODAY
```

**Code Location:**
- File: `src/pages/DashboardPageWithDB_Fixed.jsx`
- Function: `fetchPastOverdue()` (lines 240-315)
- Helper: `calculateExpectedPayments()` (lines 317-338)

### Example Scenario:

**Property:** Main Street Lofts, Unit 101
- **Lease Start:** June 1, 2024 (5 months ago)
- **Rent:** $1,500/month
- **Expected by now:** $1,500 × 5 = $7,500

**Payments Received:**
- June 1: $1,500 ✅
- July 1: $1,500 ✅
- August 1: $1,500 ✅
- September 1: $750 ⚠️ (partial)
- October 1: $0 ❌ (missed)

**Actual Paid:** $6,250

**Past Overdue:** $7,500 - $6,250 = **$1,250**

---

## Occupancy Click Navigation 🏢

### What Changed:

The **Occupancy widget** on the dashboard is now clickable! You can click on "Vacant" or "Occupied" to navigate to the Properties page with the appropriate filter applied.

### How to Use:

#### Click "Vacant" (Red Number)
- Navigates to Properties page
- Automatically filters to show **only vacant units**
- Properties with 0% occupancy are highlighted

#### Click "Occupied" (Teal Number)
- Navigates to Properties page
- Automatically filters to show **only occupied units**  
- Properties with 100% occupancy are shown

### Visual Feedback:

When you hover over the numbers:
- **Vacant**: Background turns light red, number scales up
- **Occupied**: Background turns light teal, number scales up
- Cursor changes to pointer to indicate clickability

### Code Changes:

**Dashboard (`DashboardPageWithDB_Fixed.jsx`):**
```javascript
// Vacant - clicks navigate to Properties with vacant filter
<div 
  onClick={() => onNavigate && onNavigate('Properties', { filterStatus: 'vacant' })}
  style={{ cursor: 'pointer' }}
>
  <div>{occupancy.vacant}</div>
  <div>Vacant</div>
</div>

// Occupied - clicks navigate to Properties with occupied filter
<div 
  onClick={() => onNavigate && onNavigate('Properties', { filterStatus: 'occupied' })}
  style={{ cursor: 'pointer' }}
>
  <div>{occupancy.occupied}</div>
  <div>Occupied</div>
</div>
```

**Properties Page (`PropertiesPageRedesigned.jsx`):**
```javascript
// Load navigation params from sessionStorage
useEffect(() => {
  const paramsStr = sessionStorage.getItem('Properties_params');
  if (paramsStr) {
    const params = JSON.parse(paramsStr);
    if (params.filterStatus) {
      setFilterStatus(params.filterStatus); // Auto-set filter
    }
    sessionStorage.removeItem('Properties_params');
  }
}, []);
```

### Filter Options on Properties Page:

Once you arrive at the Properties page, you can change the filter using the dropdown:
- **All** - Show all properties
- **Occupied** - 100% occupancy (all units filled)
- **Vacant** - 0% occupancy (all units empty)
- **Partial** - Between 0-100% (some units filled, some vacant)

### Navigation Flow:

```
Dashboard → Click "Vacant" (5 units)
    ↓
Properties Page (filter: vacant)
    ↓
Shows only properties with vacant units
    ↓
Can see which specific units are available
```

---

## Quick Reference:

### Dashboard Widgets You Can Click:

| Widget | Click Target | Navigates To | Filter Applied |
|--------|-------------|--------------|----------------|
| Collection Stats | "Collected" | Income Page | collected |
| Collection Stats | "Overdue" | Income Page | overdue |
| Collection Stats | "Processing" | Income Page | processing |
| Collection Stats | "Coming Due" | Income Page | coming-due |
| Collection Stats | "View All" (overdue units) | Income Page | overdue |
| **Occupancy** | **"Vacant"** | **Properties** | **vacant** |
| **Occupancy** | **"Occupied"** | **Properties** | **occupied** |
| Maintenance | Entire widget | Maintenance Page | all |

### Where Data Lives:

| Metric | Database Table | Key Columns |
|--------|---------------|-------------|
| Past Overdue | `leases` + `transactions` | rent_amount, lease_start_date, amount |
| Occupancy | `units` + `leases` | status (unit), status (lease) |
| Vacant Count | `units` | status = 'available' |
| Occupied Count | `leases` | status = 'active' |

---

## Testing the Features:

### Test Past Overdue:

1. Create a lease with start date 3 months ago
2. Set rent to $1,000/month
3. Don't record any payments
4. Dashboard should show Past Overdue: **$3,000** (active)

### Test Occupancy Navigation:

1. Go to Dashboard
2. Note the Vacant count (e.g., "5 Vacant")
3. Click on the "5"
4. Should navigate to Properties page
5. Filter dropdown should show "Vacant"
6. Only vacant properties should be visible

### Test Toggle:

1. On Properties page (after clicking Vacant)
2. Change filter dropdown to "Occupied"
3. Now only occupied properties show
4. Click back to Dashboard
5. Click "Occupied" count
6. Properties page opens with Occupied filter again

---

## Troubleshooting:

### Past Overdue shows $0.00 but tenants are late:
- Check that lease_start_date is in the past
- Verify rent_amount is set on the lease
- Ensure transactions table exists and has data
- Check that lease status = 'active'

### Clicking Occupancy doesn't navigate:
- Verify `onNavigate` prop is passed to Dashboard
- Check browser console for JavaScript errors
- Ensure sessionStorage is enabled in browser

### Properties page doesn't filter after click:
- Check that sessionStorage params are being set
- Verify Properties page has the useEffect for params
- Clear browser cache and try again

---

This documentation covers both the Past Overdue calculation logic and the new clickable occupancy navigation feature!
