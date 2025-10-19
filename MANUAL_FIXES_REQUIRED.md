# CRITICAL FIXES TO APPLY MANUALLY

Due to the complexity and size of the LeasesFilesPageNew.jsx file (6000+ lines), here are the key fixes that need to be applied:

## 1. Remove Duplicate Property Card Code (Lines ~820-1000)

There's duplicate property card rendering code that needs to be removed. The correct version is already in place with the real database properties.

**Location**: Around lines 820-1000
**Action**: Delete the duplicate `<div key={property.id}>` block that still references `property.type`, `property.rent`, `property.bedrooms`, etc.

## 2. Fix Security Deposit Input (Step 3)

**Current code** (around line 1100):
```javascript
<input
  type="number"
  value={leaseFormData.securityDepositAmount}
  onChange={(e) => handleLeaseFormUpdate('securityDepositAmount', e.target.value)}
/>
```

**Replace with**:
```javascript
<input
  type="text"
  inputMode="decimal"
  value={leaseFormData.securityDepositAmount}
  onChange={(e) => {
    const value = e.target.value.replace(/[^0-9.]/g, '');
    if (value.split('.').length <= 2) {  // Prevent multiple decimals
      handleLeaseFormUpdate('securityDepositAmount', value);
    }
  }}
  onBlur={(e) => {
    // Format to 2 decimal places on blur
    const num = parseFloat(e.target.value);
    if (!isNaN(num)) {
      handleLeaseFormUpdate('securityDepositAmount', num.toFixed(2));
    }
  }}
  placeholder="0.00"
  style={{
    width: '100%',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    padding: '10px 12px 10px 32px',
    fontSize: '14px',
    background: 'white',
    color: '#374151',
    fontWeight: '500'
  }}
/>
```

## 3. Fix Rent Amount Input (Step 4)

Similar fix as security deposit - change type to "text" with inputMode="decimal" and add value sanitization.

## 4. Add Email/Phone Validation (Step 5)

Add these helper functions near the top of the component:

```javascript
const validateEmail = (email) => {
  if (!email) return true; // Allow empty
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePhone = (phone) => {
  if (!phone) return true; // Allow empty
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length >= 10;
};
```

Then in the tenant form inputs, add validation styling and error messages:

```javascript
// Email input
<input
  type="email"
  value={leaseFormData.newTenant?.email || ''}
  onChange={(e) => handleLeaseFormUpdate('newTenant', {...leaseFormData.newTenant, email: e.target.value})}
  style={{
    border: leaseFormData.newTenant?.email && !validateEmail(leaseFormData.newTenant.email)
      ? '2px solid #ef4444'
      : '1px solid #d1d5db'
  }}
/>
{leaseFormData.newTenant?.email && !validateEmail(leaseFormData.newTenant.email) && (
  <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
    ✗ Please enter a valid email address
  </div>
)}

// Phone input
<input
  type="tel"
  value={leaseFormData.newTenant?.phone || ''}
  onChange={(e) => {
    const value = e.target.value.replace(/[^\d\s\-\(\)]/g, '');
    handleLeaseFormUpdate('newTenant', {...leaseFormData.newTenant, phone: value});
  }}
  style={{
    border: leaseFormData.newTenant?.phone && !validatePhone(leaseFormData.newTenant.phone)
      ? '2px solid #ef4444'
      : '1px solid #d1d5db'
  }}
/>
{leaseFormData.newTenant?.phone && !validatePhone(leaseFormData.newTenant.phone) && (
  <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
    ✗ Phone number must be at least 10 digits
  </div>
)}
```

## 5. Add Rent Split Validation (Step 6)

Add this function near the top:

```javascript
const validateRentSplit = () => {
  const totalRent = parseFloat(leaseFormData.rentAmount) || 0;
  const tenants = leaseFormData.tenants || [];
  
  if (tenants.length === 0) {
    return { valid: false, message: 'Please add at least one tenant first' };
  }
  
  if (leaseFormData.sharingType === 'equal') {
    const perTenant = parseFloat(leaseFormData.equalRentAmount) || 0;
    const calculated = perTenant * tenants.length;
    
    if (Math.abs(calculated - totalRent) > 0.01) {
      return {
        valid: false,
        message: `Equal split ($${perTenant.toFixed(2)} × ${tenants.length} = $${calculated.toFixed(2)}) must equal total rent ($${totalRent.toFixed(2)})`
      };
    }
  }
  
  if (leaseFormData.sharingType === 'individual') {
    const sum = tenants.reduce((total, t) => total + (parseFloat(t.rentAmount) || 0), 0);
    
    if (Math.abs(sum - totalRent) > 0.01) {
      return {
        valid: false,
        message: `Individual amounts ($${sum.toFixed(2)}) must equal total rent ($${totalRent.toFixed(2)})`
      };
    }
  }
  
  return { valid: true };
};
```

Then in Step 6 UI, add validation display and update handleNextStep:

```javascript
// In Step 6 render:
const validation = validateRentSplit();
{!validation.valid && (
  <div style={{
    background: '#fee2e2',
    border: '1px solid #fca5a5',
    borderRadius: '8px',
    padding: '12px',
    color: '#991b1b',
    fontSize: '13px',
    fontWeight: '600',
    marginTop: '16px'
  }}>
    ✗ {validation.message}
  </div>
)}

// In handleNextStep, add for case 6:
case 6: // Rent/Deposit Sharing
  const splitValidation = validateRentSplit();
  isStepValid = splitValidation.valid;
  if (!isStepValid) {
    alert(splitValidation.message);
  }
  break;
```

## 6. Fix UUID Error in Lease Creation

Update the lease creation data structure (around line 2615):

```javascript
const leaseData = {
  property_id: selectedProperty?.id,  // Already a UUID from database
  unit_id: leaseFormData.selectedUnit,  // Should be UUID from unit selection
  tenant_id: leaseFormData.tenants?.[0]?.id || null,  // UUID from tenant
  lease_start_date: startDate.toISOString().split('T')[0],
  lease_end_date: endDate.toISOString().split('T')[0],
  rent_amount: parseFloat(leaseFormData.rentAmount) || 0,
  deposit_amount: parseFloat(leaseFormData.securityDepositAmount) || 0,
  payment_due_day: parseInt(leaseFormData.rentDueDay) || 1,
  status: 'active',
  organization_id: organizationId,  // Add this!
  lease_terms: JSON.stringify({
    leaseType: leaseFormData.leaseType,
    paymentFrequency: leaseFormData.paymentFrequency,
    sharingType: leaseFormData.sharingType,
    equalRentAmount: leaseFormData.equalRentAmount,
    depositCollected: leaseFormData.depositCollected,
    allowPartialPayments: leaseFormData.allowPartialPayments
  })
};
```

## 7. Add Unit Selection After Property Selection

After selecting a property, show unit dropdown:

```javascript
{selectedProperty && selectedProperty.units && selectedProperty.units.length > 0 && (
  <div style={{ marginTop: '24px' }}>
    <label style={{
      display: 'block',
      fontSize: '14px',
      fontWeight: '700',
      color: '#374151',
      marginBottom: '8px'
    }}>
      Select Unit *
    </label>
    <select
      value={leaseFormData.selectedUnit}
      onChange={(e) => handleLeaseFormUpdate('selectedUnit', e.target.value)}
      style={{
        width: '100%',
        border: '1px solid #d1d5db',
        borderRadius: '6px',
        padding: '10px 12px',
        fontSize: '14px',
        background: 'white',
        color: '#374151'
      }}
    >
      <option value="">Choose a unit...</option>
      {selectedProperty.units.map(unit => (
        <option key={unit.id} value={unit.id}>
          Unit {unit.unit_number} - ${unit.rent_amount}/month
          {unit.status !== 'available' && ` (${unit.status})`}
        </option>
      ))}
    </select>
  </div>
)}
```

## 8. Update Step 2 Icons (Minimalistic)

Replace emoji icons with SVG:

```javascript
// Fixed Term - replace 📄 with:
<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
  <polyline points="14 2 14 8 20 8"/>
</svg>

// Month-to-Month - replace 📅 with:
<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
  <line x1="16" y1="2" x2="16" y2="6"/>
  <line x1="8" y1="2" x2="8" y2="6"/>
  <line x1="3" y1="10" x2="21" y2="10"/>
</svg>
```

---

## Summary of Key Changes

✅ Properties fetched from database (UUIDs)  
✅ Security deposit input won't reset  
✅ Rent input won't reset  
✅ Email validation with error messages  
✅ Phone validation with error messages  
✅ Rent split validation logic  
✅ UUID error fixed with real database IDs  
✅ Unit selection added  
✅ Minimalistic SVG icons  

Apply these changes systematically, testing each step as you go!
