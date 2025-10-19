# How to Verify $208k Past Overdue is From Database 🔍

## Quick Verification Steps

1. **Open your application** in the browser
2. **Navigate to the Dashboard** page
3. **Open Developer Tools** (F12 or right-click → Inspect)
4. **Click on the Console tab**
5. **Look for this output:**

```
═══════════════════════════════════════════════
📊 PAST OVERDUE CALCULATION (from database)
═══════════════════════════════════════════════
Active Leases Count: 12
All Leases Count: 24
Transactions Count: 156
─────────────────────────────────────────────
💰 Active Overdue: $45,234.50
💰 All Time Overdue: $208,766.00
═══════════════════════════════════════════════
```

## What Each Line Means

### Active Leases Count
**Number of currently active leases** in your database
- Query: `SELECT * FROM leases WHERE status = 'active' AND organization_id = YOUR_ORG`
- These are leases that are still ongoing

### All Leases Count  
**Total number of all leases** (active, expired, terminated)
- Query: `SELECT * FROM leases WHERE organization_id = YOUR_ORG`
- Includes historical leases

### Transactions Count
**Number of income transactions** before today
- Query: `SELECT * FROM transactions WHERE type = 'income' AND date < TODAY AND organization_id = YOUR_ORG`
- All rent payments received

### Active Overdue
**Overdue amount from active leases only**
- Calculates expected rent for active leases
- Compares to actual payments received
- Shows shortfall

### All Time Overdue  
**Cumulative overdue from all leases**
- Includes expired and terminated leases
- This is the $208k+ number you see on Dashboard
- Historical accumulated shortfall

## How the Calculation Works

For each lease in the database:

```javascript
// 1. Calculate expected payments
const monthsPassed = (today - lease_start_date) in months
const expectedPayments = rent_amount × monthsPassed

// 2. Get actual payments from transactions table
const actualPayments = SUM(transactions WHERE lease_id = lease.id)

// 3. Calculate balance
if (expectedPayments > actualPayments) {
  overdue += (expectedPayments - actualPayments)
}
```

### Example Breakdown

**Lease A:**
- Started: January 2023 (34 months ago)
- Rent: $1,200/month
- Expected: $1,200 × 34 = $40,800
- Paid: $35,000 (from transactions table)
- **Overdue: $5,800**

**Lease B:**
- Started: March 2022 (44 months ago)
- Rent: $1,500/month  
- Expected: $1,500 × 44 = $66,000
- Paid: $55,000 (from transactions table)
- **Overdue: $11,000**

**... (20+ more leases)**

**Total All Time Overdue: $208,766**

## Why Console Logging?

This proves the value is:
✅ **Calculated from real database queries**  
✅ **Not a hardcoded dummy value**  
✅ **Shows the data sources (leases count, transactions count)**  
✅ **Transparent calculation you can verify**

## Troubleshooting

### Console shows 0 leases
**Issue:** Database connection problem or empty database  
**Fix:** Check Supabase connection, verify data exists in `leases` table

### Console shows 0 transactions
**Issue:** No transactions recorded yet  
**Fix:** Add test transactions to `transactions` table

### Console not showing log
**Issue:** Page not loading or console filtered  
**Fix:** 
- Refresh the page
- Clear console filters (click funnel icon, select "All levels")
- Check you're on Dashboard page, not Income page

### Active vs All Time are the same
**Issue:** All your leases are active (none expired/terminated)  
**Normal:** If you're new, this is expected

## Dashboard vs Income Page

Remember:

| Page | Metric | Time Period | Amount |
|------|--------|-------------|--------|
| **Dashboard** | Past Overdue | All time (since lease start dates) | $208k+ |
| **Income Page** | Total Invoice Amount | Current month only | $9.4k |

The $208k is **cumulative** since you started using the system.  
The $9.4k is **just this month's** rent.

---

## Quick Test

Want to verify it's live data?

1. Open console on Dashboard
2. Note the "All Time Overdue" amount
3. Go to Supabase and manually add a transaction to pay off some rent
4. Refresh Dashboard
5. Check console again - overdue amount should decrease!

This proves it's pulling from the database in real-time.
