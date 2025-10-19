# Security Deposit Due Date - Database Migration Guide

## Overview
Changed the `securityDepositDue` field from a text dropdown to a date picker for more precise tracking.

## Changes Made

### 1. Frontend Changes
**File**: `src/pages/LeasesFilesPageNew.jsx`

**Before**:
- Dropdown with options: "Before Move-in", "On Move-in", "Within 30 days", "Other"
- Stored as text string

**After**:
- Date picker (`<input type="date">`)
- Stores actual date in YYYY-MM-DD format
- More precise tracking of when security deposit is due

### 2. Database Schema Changes Needed

**Table**: `leases`

**Option A - Update Existing Column**:
If your `leases` table stores security deposit info in a text column, you'll need to convert it:

```sql
-- Check current data type
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'leases' 
AND column_name LIKE '%deposit%due%';

-- If it's a text field, migrate the data
-- First, add a new column for the date
ALTER TABLE leases 
ADD COLUMN security_deposit_due_date DATE;

-- Copy old text values to new column (if needed)
-- This depends on your existing data format

-- Drop old column (after backing up data!)
-- ALTER TABLE leases DROP COLUMN security_deposit_due;

-- Rename new column
-- ALTER TABLE leases RENAME COLUMN security_deposit_due_date TO security_deposit_due;
```

**Option B - New Installation**:
If this is a new installation or the column doesn't exist yet:

```sql
-- Add security deposit due date column
ALTER TABLE leases 
ADD COLUMN security_deposit_due DATE;

-- Make it required (optional)
ALTER TABLE leases 
ALTER COLUMN security_deposit_due SET NOT NULL;
```

### 3. Data Format

**Frontend State**:
```javascript
leaseFormData.securityDepositDue = "2025-10-25"  // YYYY-MM-DD format
```

**Database Storage**:
- Column Type: `DATE`
- Format: PostgreSQL DATE type (automatically handles YYYY-MM-DD)

### 4. Validation Rules

**Frontend Validation**:
- Field is required before proceeding to next step
- Must be a valid date
- No specific restrictions on past/future dates (can be customized)

**Suggested Additional Validations** (optional):
```javascript
// Ensure due date is between lease start and end
if (dueDate < leaseFormData.startDate) {
  alert('Security deposit due date cannot be before lease start date');
}

// Or ensure it's not too far in the future
const maxDate = new Date(leaseFormData.startDate);
maxDate.setDate(maxDate.getDate() + 90); // 90 days after lease start
if (dueDate > maxDate) {
  alert('Security deposit must be due within 90 days of lease start');
}
```

## Testing Checklist

- [ ] Test creating new lease with security deposit due date
- [ ] Verify date is stored correctly in database
- [ ] Test validation: try to proceed without selecting date
- [ ] Test date picker works on different browsers
- [ ] Verify date format is consistent across app
- [ ] Test lease submission with security deposit date
- [ ] Check existing leases still display correctly

## Migration Steps

### For Existing Production Database:

1. **Backup your database first!**
   ```bash
   pg_dump your_database > backup_before_security_deposit_migration.sql
   ```

2. **Add new column**:
   ```sql
   ALTER TABLE leases ADD COLUMN security_deposit_due_date DATE;
   ```

3. **Migrate existing data** (if you have existing leases):
   ```sql
   -- Example: Convert text to approximate dates
   -- Adjust based on your actual data
   UPDATE leases 
   SET security_deposit_due_date = lease_start_date - INTERVAL '7 days'
   WHERE security_deposit_due = 'Before Move-in';
   
   UPDATE leases 
   SET security_deposit_due_date = lease_start_date
   WHERE security_deposit_due = 'On Move-in';
   
   UPDATE leases 
   SET security_deposit_due_date = lease_start_date + INTERVAL '30 days'
   WHERE security_deposit_due = 'Within 30 days';
   ```

4. **Drop old column** (after verifying migration):
   ```sql
   ALTER TABLE leases DROP COLUMN security_deposit_due;
   ```

5. **Rename new column**:
   ```sql
   ALTER TABLE leases RENAME COLUMN security_deposit_due_date TO security_deposit_due;
   ```

6. **Add constraint** (optional):
   ```sql
   ALTER TABLE leases ALTER COLUMN security_deposit_due SET NOT NULL;
   ```

## Rollback Plan

If you need to rollback:

```sql
-- Restore from backup
psql your_database < backup_before_security_deposit_migration.sql
```

Or if you kept the old column:

```sql
-- Revert to old column
ALTER TABLE leases DROP COLUMN security_deposit_due_date;
-- Old column still exists, just need to update frontend code back
```

## Benefits of This Change

1. **Precision**: Exact date tracking instead of vague descriptions
2. **Automation**: Can trigger reminders/notifications on specific dates
3. **Reporting**: Better analytics on deposit collection timelines
4. **Flexibility**: Landlords can set any date that works for them
5. **Compliance**: Some jurisdictions require specific deposit due dates

## Notes

- The date picker uses the browser's native date input (`type="date"`)
- Format is automatically YYYY-MM-DD (ISO 8601)
- Works on all modern browsers
- Mobile-friendly with native date pickers on iOS/Android
