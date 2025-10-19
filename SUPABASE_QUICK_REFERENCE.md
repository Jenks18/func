# 🎯 Quick Reference: Supabase Integration

## 🚀 **3-Step Quick Start**

### **1. Run SQL Migration** (5 min)
```bash
# Go to: https://app.supabase.com → Your Project → SQL Editor
# Copy entire file: supabase/migrations/002_complete_schema.sql
# Paste in SQL Editor → Click "Run"
```

### **2. Configure .env** (2 min)
```bash
# Get credentials from: Supabase Dashboard → Project Settings → API
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Restart dev server:
npm run dev
```

### **3. Test Messaging Page** (1 min)
```bash
# Navigate to: http://localhost:5173/messaging
# Should see Email and Chat tabs with mock data
```

---

## 📂 **File Locations**

| File | Purpose |
|------|---------|
| `supabase/migrations/002_complete_schema.sql` | SQL script to run in Supabase |
| `src/services/supabaseClient.js` | Supabase connection |
| `src/services/transactionsService.js` | Income/Expenses helpers |
| `src/pages/MessagingPage.jsx` | Email & Chat UI |
| `SUPABASE_CONNECTION_GUIDE.md` | Full setup instructions |
| `SUPABASE_INTEGRATION_EXAMPLES.md` | Code snippets for each page |

---

## 💻 **Quick Code Snippets**

### **Fetch Income**
```javascript
import { fetchIncome } from '../services/transactionsService';
import { getCurrentOrgId } from '../services/supabaseClient';

const orgId = getCurrentOrgId(user);
const data = await fetchIncome(orgId, { status: 'completed' });
```

### **Fetch Maintenance Requests**
```javascript
import { supabase, getCurrentOrgId } from '../services/supabaseClient';

const orgId = getCurrentOrgId(user);
const { data, error } = await supabase
  .from('maintenance_requests')
  .select('*, property:properties(*), tenant:tenants(*)')
  .eq('organization_id', orgId);
```

### **Upload Photo**
```javascript
import { uploadFile } from '../services/supabaseClient';

const fileUrl = await uploadFile('maintenance-photos', 'path/to/file.jpg', file);
```

### **Send Email**
```javascript
import { supabase, getCurrentOrgId } from '../services/supabaseClient';

const { data } = await supabase
  .from('messages')
  .insert({
    organization_id: getCurrentOrgId(user),
    message_type: 'email',
    sender_id: user.id,
    recipient_ids: [tenantId],
    subject: 'Rent Reminder',
    body: 'Your rent is due...',
    status: 'sent'
  });
```

---

## 📊 **Database Tables**

| Table | Purpose | Key Columns |
|-------|---------|-------------|
| `transactions` | Income & Expenses | `type`, `category`, `amount`, `date`, `status` |
| `maintenance_requests` | Maintenance tickets | `title`, `status`, `priority`, `category` |
| `maintenance_photos` | Photo uploads | `file_url`, `maintenance_request_id` |
| `maintenance_reminders` | Recurring reminders | `first_occurrence`, `recurring`, `repeat_every` |
| `messages` | Email & Chat | `message_type`, `subject`, `body`, `status` |
| `chat_conversations` | Chat threads | `participant_ids`, `last_message_at` |

---

## 🎯 **Integration Checklist**

- [ ] Run SQL migration in Supabase
- [ ] Add `.env` variables
- [ ] Create Storage buckets (`maintenance-photos`, `files`)
- [ ] Test Messaging page loads
- [ ] Connect Reports - Rent tab
- [ ] Connect Reports - Expenses tab
- [ ] Connect Dashboard summary
- [ ] Connect Maintenance list
- [ ] Test photo upload
- [ ] Enable real-time chat

---

## 🔥 **Most Common Queries**

### **Get all income for current month**
```javascript
const { data } = await supabase
  .from('transactions')
  .select('*')
  .eq('organization_id', orgId)
  .eq('type', 'income')
  .gte('date', '2024-12-01')
  .lte('date', '2024-12-31');
```

### **Get maintenance requests with photos**
```javascript
const { data } = await supabase
  .from('maintenance_requests')
  .select('*, photos:maintenance_photos(*)')
  .eq('organization_id', orgId)
  .eq('status', 'open');
```

### **Get P/L summary**
```javascript
import { calculatePL } from '../services/transactionsService';

const summary = await calculatePL(orgId, '2024-01-01', '2024-12-31');
// Returns: { income: {...}, expenses: {...}, netProfit: 20000 }
```

---

## 🚨 **Troubleshooting**

| Error | Fix |
|-------|-----|
| "supabase is not defined" | Import: `import { supabase } from '../services/supabaseClient';` |
| "Cannot read organizationMemberships" | Add check: `if (!user) return;` |
| "RLS policy violation" | Ensure user exists in `users` table with correct `organization_id` |
| "No rows returned" | Check data exists in Supabase Table Editor |
| Environment variables not working | Restart dev server after adding to `.env` |

---

## 📱 **Routes**

| Page | Route | Component |
|------|-------|-----------|
| Dashboard | `/` or `/dashboard` | `DashboardPage` |
| Properties | `/properties` | `PropertiesPage` |
| Tenants | `/tenants` | `TenantsPage` |
| Users | `/users` | `UsersPage` |
| Leases & Files | `/leases` | `LeasesPage` |
| Income | `/income` | `IncomePageNew` |
| Expenses | `/expenses` | `ExpensesPage` |
| Maintenance | `/maintenance` | `MaintenancePage` |
| **Messaging** | `/messaging` | `MessagingPage` ✨ NEW |
| Reports | `/reports` | `ReportsPage` |
| Settings | `/settings` | `SettingsPage` |

---

## 🎨 **Theme Colors**

```css
Primary Teal: #14b8a6 (teal-500)
Dark Teal: #0d9488 (teal-600)
Darker Teal: #0f766e (teal-700)
Light Teal: #99f6e4 (teal-200)
```

---

## ✅ **What's Complete**

- ✅ Database schema (all tables)
- ✅ Supabase client service
- ✅ Transaction service helpers
- ✅ Messaging page UI (Email + Chat)
- ✅ Navigation updated
- ✅ RLS policies configured
- ✅ Setup guide written
- ✅ Integration examples provided

---

## ⏳ **What's Next**

1. Run SQL migration (you)
2. Configure .env (you)
3. Connect Reports page (you)
4. Connect Maintenance page (you)
5. Enable real-time features (optional)
6. Build tenant portal (future)

---

## 📖 **Full Documentation**

- **Setup Guide**: `SUPABASE_CONNECTION_GUIDE.md`
- **Integration Examples**: `SUPABASE_INTEGRATION_EXAMPLES.md`
- **Summary**: `SUPABASE_MESSAGING_COMPLETE.md`
- **This Quick Ref**: `SUPABASE_QUICK_REFERENCE.md`

---

**Ready to go!** 🚀 Just run the SQL migration, add .env vars, and start connecting pages.
