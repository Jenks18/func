# Income Circle Visualization - Payment Status Breakdown 🎯

## Updated Logic: Payment-Based Circle

The Income page circle now shows a **payment status breakdown** of your total invoice amounts:
- 🟢 **Green** = Collected/Paid amounts
- 🟡 **Yellow** = Processing payments
- 🔴 **Red** = Overdue unpaid balance

## How It Works

### Example Scenario:

```
Total Invoice Amount: $9,400
├─ $5,200 Collected (Green) ✅
│  ├─ $3,000 Fully paid invoices
│  ├─ $1,500 Paid portion of overdue invoices
│  └─ $700 Paid portion of partial invoices
├─ $800 Processing (Yellow) 💳
└─ $3,400 Overdue Balance (Red) ⚠️
   └─ Still owed on overdue invoices
```

**Circle Display:**
```
🟢 Green segment = 55% (Collected $5,200)
🟡 Yellow segment = 9% (Processing $800)
🔴 Red segment = 36% (Overdue Balance $3,400)
```

## Visual Breakdown

### The Three Segments:

#### 🟢 Collected (Green)
**What it includes:**
- Fully paid invoices (100% paid)
- Paid portions of partially paid invoices
- Paid portions of overdue invoices (even if not fully paid)

**Formula:**
```javascript
collected = fullyPaid + overduePaid + partiallyPaid
```

**What it means:**
- Money that has been successfully collected
- Already in your account
- No action needed

#### 🟡 Processing (Yellow)
**What it includes:**
- Payments currently being processed
- ACH transfers in progress
- Credit card payments pending
- Check deposits being cleared

**Formula:**
```javascript
processing = processingFromPartial + processingFromOverdue
```

**What it means:**
- Money on the way
- Should clear within 1-5 business days
- Monitor for completion

#### 🔴 Overdue Balance (Red)
**What it includes:**
- Unpaid portion of overdue invoices
- Balance still owed after due date

**Formula:**
```javascript
overdueBalance = overdueInvoiceAmount - paidOnOverdue - processingOnOverdue
```

**What it means:**
- Money still owed and late
- Immediate action needed
- Send reminders or follow up

## Background Circle Color

The background circle is now **light red (#fee2e2)** to emphasize unpaid amounts. As payments are collected, the green segment grows and covers the red background.

## Past Overdue ($208k) - Where Does It Come From? 🔍

**Important:** The $208k "Past Overdue" is from the **Dashboard**, NOT the Income page!

### Dashboard vs Income Page:

| Metric | Location | Time Period | Calculation |
|--------|----------|-------------|-------------|
| **Past Overdue** | Dashboard | All time (historical) | Expected rent - Actual payments from lease start |
| **Overdue Balance** | Income Page | Current period | Current month's unpaid overdue invoices |

### Dashboard "Past Overdue" Calculation:

```javascript
// Dashboard looks at ALL LEASES from start date to today
For each lease:
  monthsPassed = (today - lease_start_date) in months
  expectedPayments = rent_amount × monthsPassed
  actualPayments = sum of all transactions for this lease
  
  if (expectedPayments > actualPayments) {
    pastOverdue += (expectedPayments - actualPayments)
  }

Total Past Overdue = $208,766
```

### Example: How $208k Accumulates

```
Lease 1: Started Jan 2023 ($1,200/month)
├─ Months passed: 34
├─ Expected: $1,200 × 34 = $40,800
├─ Paid: $35,000
└─ Overdue: $5,800

Lease 2: Started Mar 2022 ($1,500/month)
├─ Months passed: 44
├─ Expected: $1,500 × 44 = $66,000
├─ Paid: $55,000
└─ Overdue: $11,000

... (multiple leases over years)

Total Past Overdue = $208,766
```

### Why You Don't See $208k on Income Page:

The Income page shows **current month's invoices only**, not historical accumulated overdue amounts.

**Income Page:**
- Shows: October 2025 rent invoices
- Total: $9,400 (current month)
- Overdue: $3,400 (this month's unpaid)

**Dashboard:**
- Shows: All rent from all lease start dates
- Total Expected: $500,000+ (since 2022)
- Past Overdue: $208,766 (accumulated shortfall)

## How to Reconcile the Two Numbers

### Scenario:

**Dashboard shows:** $208,766 Past Overdue  
**Income page shows:** $9,400 Total, $3,400 Overdue Balance

**Breakdown:**
```
Total historical rent owed (since 2022): $500,000
├─ Collected to date: $291,234 (58%)
├─ Past Overdue (cumulative): $208,766 (42%)
│
Current month (October 2025):
├─ October rent due: $9,400
├─ Collected: $5,200
├─ Processing: $800
└─ Overdue balance: $3,400

The $3,400 is PART OF the $208,766 total!
```

## Circle Interpretation Guide

### Healthy Status:
```
Circle: 85% Green, 10% Yellow, 5% Red
├─ Collected: $8,000 ✅
├─ Processing: $940 💳
└─ Overdue: $460 ⚠️
```
**Action:** Monitor processing, send reminder for $460

### Warning Status:
```
Circle: 50% Green, 10% Yellow, 40% Red
├─ Collected: $4,700 ✅
├─ Processing: $940 💳
└─ Overdue: $3,760 ⚠️
```
**Action:** Immediate follow-up needed, consider late fees

### Critical Status:
```
Circle: 15% Green, 5% Yellow, 80% Red
├─ Collected: $1,410 ✅
├─ Processing: $470 💳
└─ Overdue: $7,520 🚨
```
**Action:** Urgent collection needed, legal action possible

## Code Changes Summary

### Updated `calculateTotals()`:

**Before:**
```javascript
// Tracked by invoice status
if (status === 'Overdue') overdue += invoice.amount;
if (status === 'Fully Paid') fullyPaid += invoice.paid;
```

**After:**
```javascript
// Tracks actual payment breakdown
if (status === 'Overdue') {
  overdueUnpaid += invoice.balance;    // Red
  overduePaid += invoice.paid;         // Green
  overdueProcessing += invoice.processing; // Yellow
}
```

### Circle Segments:

**Before:**
- Green = Fully paid invoices
- Red = Overdue invoices (full amount)
- Yellow = Partially paid invoices

**After:**
- 🟢 Green = All collected amounts (fullyPaid + overduePaid + partiallyPaid)
- 🟡 Yellow = All processing amounts (processing + overdueProcessing)
- 🔴 Red = Unpaid overdue balance only (overdueUnpaid)

## Quick Reference

### What Each Color Means:

| Color | Status | Action Required | Urgency |
|-------|--------|----------------|---------|
| 🟢 Green | Collected | None - already paid | ✅ None |
| 🟡 Yellow | Processing | Monitor for clearing | ⏳ Low |
| 🔴 Red | Overdue Unpaid | Send reminders, follow up | 🚨 High |

### When to Act:

- **Red > 30%**: Schedule tenant calls this week
- **Red > 50%**: Send late notices immediately
- **Red > 70%**: Consider legal action
- **Yellow > 20%**: Verify processing times
- **Green < 50%**: Review collection processes

---

## Summary

✅ **Circle now shows payment breakdown** of total invoice amount  
✅ **Green** = Money collected (in your account)  
✅ **Yellow** = Money in transit (processing)  
✅ **Red** = Money still owed and late  
✅ **$208k Past Overdue** is on Dashboard (historical, all leases)  
✅ **$9.4k Total** is on Income page (current month only)  

The circle gives you an instant visual of how much of your monthly rent is collected vs still outstanding!
