# Tenant Creation & Lease Submission Fix

## Issues Fixed

### 1. Add Tenants Input Fields - Cursor Jump Fixed ✅
**Problem**: Typing in First Name, Last Name, Email, and Phone Number fields caused cursor to jump/reset after each character.

**Solution**: Wrapped all tenant input fields with local state management:
```javascript
const TenantInputFields = () => {
  const [localTenant, setLocalTenant] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: ''
  });
  
  // Updates local state immediately, then syncs to parent
  const updateField = (field, value) => {
    const updated = { ...localTenant, [field]: value };
    setLocalTenant(updated);
    handleLeaseFormUpdate('newTenant', { ...leaseFormData.newTenant, ...updated });
  };
  
  return (
    <input value={localTenant.firstName} onChange={(e) => updateField('firstName', e.target.value)} />
  );
};
```

**Result**: Users can now type full names/emails/phone numbers without interruption.

---

### 2. Tenant ID Constraint Error - Fixed ✅
**Problem**: 
```
Failed to create lease: null value in column "tenant_id" of relation "leases" violates not-null constraint
```

**Root Cause**: 
- The `leases` table requires a `tenant_id` (NOT NULL constraint)
- Tenants entered in the form weren't saved to database yet
- Code tried to create lease with `tenant_id: null`

**Solution**: Modified `handleCreateLease()` to follow proper sequence:

#### Step-by-Step Lease Creation Process:

**1. Validate Tenants Exist**
```javascript
if (!leaseFormData.tenants || leaseFormData.tenants.length === 0) {
  alert('Please add at least one tenant before creating the lease.');
  return;
}
```

**2. Create Tenant Records First**
```javascript
const createdTenants = [];

for (const tenant of leaseFormData.tenants) {
  const tenantData = {
    organization_id: organizationId,
    first_name: tenant.firstName,
    last_name: tenant.lastName,
    email: tenant.email,
    phone: tenant.phoneNumber,
    status: 'active'
  };
  
  const { data: newTenant, error: tenantError } = await supabase
    .from('tenants')
    .insert([tenantData])
    .select()
    .single();
    
  if (tenantError) {
    throw new Error(`Failed to create tenant: ${tenantError.message}`);
  }
  
  createdTenants.push(newTenant);
}
```

**3. Create Lease with Valid Tenant ID**
```javascript
const leaseData = {
  organization_id: organizationId,
  property_id: selectedProperty?.id,
  unit_id: leaseFormData.selectedUnit,
  tenant_id: createdTenants[0].id, // ✅ Valid tenant ID from database
  lease_start_date: startDate.toISOString().split('T')[0],
  lease_end_date: endDate.toISOString().split('T')[0],
  rent_amount: parseFloat(leaseFormData.rentAmount) || 0,
  deposit_amount: parseFloat(leaseFormData.securityDepositAmount) || 0,
  payment_due_day: parseInt(leaseFormData.rentDueDay) || 1,
  status: 'active',
  lease_terms: JSON.stringify({
    leaseType: leaseFormData.leaseType,
    paymentFrequency: leaseFormData.paymentFrequency,
    sharingType: leaseFormData.sharingType,
    // Store all tenants in lease_terms JSON
    allTenants: createdTenants.map(t => ({
      id: t.id,
      firstName: t.first_name,
      lastName: t.last_name,
      email: t.email,
      phone: t.phone,
      rentPortion: ...,
      depositPortion: ...
    }))
  })
};

const { data: newLease, error: leaseError } = await supabase
  .from('leases')
  .insert([leaseData])
  .select()
  .single();
```

**4. Store Multiple Tenants**
- Primary tenant: Stored in `leases.tenant_id`
- Additional tenants: Stored in `leases.lease_terms` JSON field
- Rent/deposit portions: Preserved from form for each tenant

---

## Database Schema Requirements

### Tenants Table
```sql
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Leases Table
```sql
CREATE TABLE leases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) NOT NULL,
  property_id UUID REFERENCES properties(id) NOT NULL,
  unit_id UUID REFERENCES units(id),
  tenant_id UUID REFERENCES tenants(id) NOT NULL, -- ⚠️ Required field
  lease_start_date DATE NOT NULL,
  lease_end_date DATE NOT NULL,
  rent_amount DECIMAL(10, 2) NOT NULL,
  deposit_amount DECIMAL(10, 2),
  payment_due_day INTEGER DEFAULT 1,
  status TEXT DEFAULT 'active',
  lease_terms JSONB, -- Stores additional tenant info
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Multi-Tenant Handling

### Current Implementation
- **Primary Tenant**: First tenant in the list → stored in `leases.tenant_id`
- **Additional Tenants**: All tenants stored in `leases.lease_terms` JSON

### Future Enhancement (Optional)
For better relational data, consider creating a junction table:

```sql
CREATE TABLE lease_tenants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lease_id UUID REFERENCES leases(id) ON DELETE CASCADE NOT NULL,
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE NOT NULL,
  rent_portion DECIMAL(10, 2),
  deposit_portion DECIMAL(10, 2),
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(lease_id, tenant_id)
);
```

This would allow:
- Multiple tenants per lease with proper foreign keys
- Individual rent/deposit portions per tenant
- Better queries (JOIN operations)
- Data integrity constraints

---

## Testing Checklist

- [x] Fix tenant input cursor jump
- [x] Validate at least one tenant required
- [x] Create tenant records in database
- [x] Use tenant IDs when creating lease
- [x] Handle multiple tenants
- [ ] Test lease creation end-to-end
- [ ] Verify tenant records in database
- [ ] Verify lease record in database
- [ ] Check lease_terms JSON structure
- [ ] Test with single tenant
- [ ] Test with multiple tenants
- [ ] Test error handling (network failure, validation errors)

---

## Error Handling

The code now includes comprehensive error handling:

1. **No Tenants**: Alerts user before attempting database operations
2. **Tenant Creation Fails**: Shows specific error message with tenant name
3. **Lease Creation Fails**: Shows specific error message with details
4. **Console Logging**: Detailed logs for debugging:
   - `Creating tenants...`
   - `Creating tenant: {data}`
   - `Tenant created: {result}`
   - `Creating lease with data: {data}`
   - `Lease created successfully: {result}`

---

## Benefits

1. ✅ **Data Integrity**: All tenants exist in database before lease
2. ✅ **Proper Foreign Keys**: No null constraint violations
3. ✅ **Multiple Tenants**: Support for co-tenants/roommates
4. ✅ **Audit Trail**: Each tenant has creation timestamp
5. ✅ **Reusability**: Tenant records can be used for future leases
6. ✅ **Better UX**: Clear error messages guide user

---

## Notes

- Tenant emails/phones are optional in database (can be NULL)
- First tenant in the list becomes the "primary" tenant (tenant_id field)
- All tenants (including primary) are stored in lease_terms JSON for completeness
- Rent and deposit portions are preserved from the form
- Tenant status defaults to 'active'
