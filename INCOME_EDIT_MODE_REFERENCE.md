# Invoice Edit Mode - Quick Reference

## Button States Overview

### 🔵 View Mode (Normal)
```
┌─────────────────────────────────────────────────┐
│  Invoice Detail Header                          │
│                                                  │
│  [Record Payment] [Edit Invoice] [Delete]       │
└─────────────────────────────────────────────────┘

• Record Payment: ENABLED (teal gradient)
• Edit Invoice: ENABLED (teal border, white bg)
• Delete: ENABLED (red border, white bg)
• Add Note: HIDDEN
```

### 🟢 Edit Mode (Active)
```
┌─────────────────────────────────────────────────┐
│  Invoice Detail Header           [Add Note]     │
│                                                  │
│  [Record Payment] [Cancel] [Save]               │
│    (disabled)                                    │
└─────────────────────────────────────────────────┘

• Record Payment: DISABLED (gray, opacity 0.5)
• Cancel: ENABLED (gray border)
• Save: ENABLED (teal gradient)
• Edit Invoice: HIDDEN
• Delete: HIDDEN
• Add Note: VISIBLE
```

---

## State Transitions

### Enter Edit Mode
```
User clicks "Edit Invoice"
         ↓
setIsEditMode(true)
         ↓
┌──────────────────────┐
│ UI Updates:          │
│ • Hide Edit/Delete   │
│ • Show Cancel/Save   │
│ • Show Add Note      │
│ • Disable Payment    │
└──────────────────────┘
```

### Save Changes
```
User clicks "Save"
         ↓
handleSaveInvoice()
         ↓
API: PUT /api/invoices/:id
         ↓
┌──────────────────────┐
│ On Success:          │
│ • Exit edit mode     │
│ • Refresh invoice    │
│ • Show notification  │
└──────────────────────┘
         ↓
setIsEditMode(false)
```

### Cancel Changes
```
User clicks "Cancel"
         ↓
handleCancelEdit()
         ↓
┌──────────────────────┐
│ Actions:             │
│ • Reset to original  │
│ • Exit edit mode     │
│ • No API call        │
└──────────────────────┘
         ↓
setIsEditMode(false)
```

---

## Component Logic

### State Setup
```javascript
// InvoiceDetailView.jsx
const [isEditMode, setIsEditMode] = useState(false);
const [editableInvoice, setEditableInvoice] = useState(selectedInvoice);

useEffect(() => {
  setEditableInvoice(selectedInvoice);
  setIsEditMode(false);
}, [selectedInvoice]);
```

### Conditional Rendering
```javascript
{/* Add Note - only in edit mode */}
{isEditMode && (
  <button onClick={addNoteHandler}>Add Note</button>
)}

{/* Action Buttons */}
<button disabled={isEditMode}>Record Payment</button>

{!isEditMode ? (
  <>
    <button onClick={() => setIsEditMode(true)}>Edit Invoice</button>
    <button onClick={deleteHandler}>Delete</button>
  </>
) : (
  <>
    <button onClick={handleCancelEdit}>Cancel</button>
    <button onClick={handleSaveInvoice}>Save</button>
  </>
)}
```

---

## Visual Styles

### Record Payment (Disabled in Edit Mode)
```javascript
style={{
  opacity: isEditMode ? 0.5 : 1,
  cursor: isEditMode ? 'not-allowed' : 'pointer',
  background: isEditMode 
    ? '#d1d5db' 
    : 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)'
}}
```

### Cancel Button
```javascript
style={{
  border: '1px solid #e5e7eb',
  background: 'white',
  color: '#6b7280',
  fontWeight: '600',
  // Hover: background → #f9fafb
}}
```

### Save Button
```javascript
style={{
  background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
  color: 'white',
  fontWeight: '600',
  boxShadow: '0 4px 12px rgba(20,184,166,0.3)',
  // Hover: darker gradient + enhanced shadow
}}
```

---

## Database Integration Points

### 1. Save Handler (PUT)
```javascript
const handleSaveInvoice = async () => {
  const response = await fetch(`/api/invoices/${editableInvoice.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(editableInvoice)
  });
  
  if (response.ok) {
    const data = await response.json();
    onInvoiceUpdated(data.invoice);
    setIsEditMode(false);
  }
};
```

### 2. Delete Handler (DELETE)
```javascript
const handleDelete = async () => {
  if (!confirm('Delete this invoice?')) return;
  
  const response = await fetch(`/api/invoices/${invoice.id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  if (response.ok) {
    onInvoiceDeleted(invoice.id);
    onClose();
  }
};
```

### 3. Remove Item Handler (DELETE)
```javascript
const handleRemoveItem = async (itemId) => {
  const response = await fetch(
    `/api/invoices/${invoice.id}/items/${itemId}`,
    {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    }
  );
  
  if (response.ok) {
    const data = await response.json();
    setEditableInvoice(data.updatedInvoice);
  }
};
```

---

## Common Patterns

### Pattern 1: Conditional Button Visibility
```javascript
{isEditMode ? (
  <ComponentA />
) : (
  <ComponentB />
)}
```

### Pattern 2: Disabled State
```javascript
<button 
  disabled={isEditMode}
  style={{
    opacity: isEditMode ? 0.5 : 1,
    cursor: isEditMode ? 'not-allowed' : 'pointer'
  }}
>
  Action
</button>
```

### Pattern 3: Reset on Invoice Change
```javascript
useEffect(() => {
  setEditableInvoice(selectedInvoice);
  setIsEditMode(false);
}, [selectedInvoice]);
```

---

## Testing Scenarios

✅ **Basic Toggle**
1. Click "Edit Invoice" → Buttons change
2. Click "Cancel" → Buttons revert
3. Click "Edit Invoice" again → Works

✅ **Data Persistence**
1. Enter edit mode
2. Modify invoice data
3. Click "Cancel"
4. Verify data reverted to original

✅ **Save Flow**
1. Enter edit mode
2. Modify invoice data
3. Click "Save"
4. Verify API called with correct data
5. Verify UI exits edit mode

✅ **Delete Protection**
1. Enter edit mode
2. Verify "Delete" button hidden
3. Exit edit mode
4. Verify "Delete" button visible

✅ **Payment Disabled**
1. Enter edit mode
2. Verify "Record Payment" grayed out
3. Try to click → No action
4. Exit edit mode → Button enabled again

---

## Keyboard Shortcuts (Future)
```javascript
useEffect(() => {
  const handleKeyPress = (e) => {
    if (isEditMode) {
      if (e.key === 'Escape') handleCancelEdit();
      if (e.key === 's' && e.metaKey) {
        e.preventDefault();
        handleSaveInvoice();
      }
    }
  };
  
  window.addEventListener('keydown', handleKeyPress);
  return () => window.removeEventListener('keydown', handleKeyPress);
}, [isEditMode]);
```

---

## Files Reference

| File | Lines | Purpose |
|------|-------|---------|
| `InvoiceDetailView.jsx` | 1-15 | State setup |
| `InvoiceDetailView.jsx` | 44-80 | Save/Cancel handlers |
| `InvoiceDetailView.jsx` | 382-412 | Add Note conditional |
| `InvoiceDetailView.jsx` | 550-712 | Action buttons conditional |
| `RecordPaymentModal.jsx` | 18-68 | Payment submission |
| `IncomePageNew.jsx` | 18-60 | Invoice fetching |

---

**Quick Commands:**
- Enable Edit Mode: `setIsEditMode(true)`
- Disable Edit Mode: `setIsEditMode(false)`
- Reset Data: `setEditableInvoice(selectedInvoice)`
- Check Mode: `isEditMode ? 'editing' : 'viewing'`
