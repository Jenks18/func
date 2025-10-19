# 🎬 Step-by-Step Visual Guide: Supabase Setup

This is the EXACT sequence of clicks and actions you need to perform in Supabase.

---

## 📋 **Part 1: Run SQL Migration** (5 minutes)

### **Step 1.1: Open Supabase Dashboard**
1. Go to: https://app.supabase.com
2. Click on your project (or create a new one if you don't have one)

### **Step 1.2: Navigate to SQL Editor**
1. Look at the left sidebar
2. Click: **SQL Editor** (icon looks like `</>`)
3. Click the green **+ New query** button at the top

### **Step 1.3: Copy Migration Script**
1. On your computer, open: `supabase/migrations/002_complete_schema.sql`
2. Select all content: **Cmd+A** (Mac) or **Ctrl+A** (Windows)
3. Copy: **Cmd+C** or **Ctrl+C**

### **Step 1.4: Paste and Run**
1. Back in Supabase SQL Editor, paste: **Cmd+V** or **Ctrl+V**
2. You should see ~800 lines of SQL code
3. Click the green **Run** button (or press **Cmd+Enter** / **Ctrl+Enter**)
4. Wait 3-5 seconds
5. You should see: **"Success. No rows returned"** ✅

### **Step 1.5: Verify Tables Created**
1. Click **Table Editor** in the left sidebar
2. You should see a dropdown at the top showing all tables:
   - `chat_conversations`
   - `files`
   - `leases`
   - `maintenance_comments`
   - `maintenance_occurrences`
   - `maintenance_photos`
   - `maintenance_reminders`
   - `maintenance_requests`
   - `message_recipients`
   - `messages`
   - `organizations`
   - `properties`
   - `tenants`
   - `transactions` ← **This is for Income/Expenses**
   - `units`
   - `users`

If you see all 16 tables, you're done with Part 1! 🎉

---

## 🔑 **Part 2: Get API Credentials** (2 minutes)

### **Step 2.1: Open Project Settings**
1. Look at the left sidebar
2. Click the **gear icon** ⚙️ at the bottom (says "Project Settings")

### **Step 2.2: Navigate to API Section**
1. In the Project Settings menu, click **API** (under "Configuration")

### **Step 2.3: Copy Project URL**
1. Scroll down to the **"Project URL"** section
2. You'll see something like: `https://xyzcompany.supabase.co`
3. Click the **copy icon** 📋 next to it
4. Save this somewhere - you'll need it for `.env`

### **Step 2.4: Copy Anonymous Key**
1. Scroll down to **"Project API keys"**
2. You'll see two keys:
   - `anon` / `public` ← **Use this one**
   - `service_role` ← Don't use this (it's for backend only)
3. Find the **anon** key (long string starting with `eyJhbGci...`)
4. Click the **copy icon** 📋 next to it
5. Save this somewhere - you'll need it for `.env`

---

## 📁 **Part 3: Configure Environment Variables** (2 minutes)

### **Step 3.1: Open Your Project**
1. Open VS Code
2. Make sure you're in your project folder: `/Users/iannjenga/Documents/GitHub/func`

### **Step 3.2: Create/Edit .env File**
1. Look for `.env` file in the root of your project
2. If it doesn't exist, create it: Right-click → **New File** → name it `.env`
3. If it exists, open it

### **Step 3.3: Add Supabase Credentials**
Paste these lines (replace with your actual values from Step 2):

```bash
# Clerk (you already have this)
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_existing_clerk_key

# Supabase (add these)
VITE_SUPABASE_URL=https://xyzcompany.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhlbXh4cGtwaGtsZWRpcXdmY2Z3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDUxOTI4Mjd9.suRJ4
```

**Replace**:
- `https://xyzcompany.supabase.co` with your actual Project URL
- `eyJhbGci...` with your actual anon key

### **Step 3.4: Save and Restart**
1. Save the file: **Cmd+S** or **Ctrl+S**
2. Stop your dev server: **Ctrl+C** in the terminal
3. Start it again: `npm run dev`

---

## 🪣 **Part 4: Create Storage Buckets** (3 minutes)

### **Step 4.1: Navigate to Storage**
1. In Supabase Dashboard, click **Storage** in the left sidebar

### **Step 4.2: Create Maintenance Photos Bucket**
1. Click the green **+ New bucket** button
2. Fill in:
   - **Name**: `maintenance-photos`
   - **Public bucket**: ✅ (checked)
   - **File size limit**: Leave default (50 MB)
   - **Allowed MIME types**: Leave empty (allows all)
3. Click **Create bucket**

### **Step 4.3: Create Files Bucket**
1. Click the green **+ New bucket** button again
2. Fill in:
   - **Name**: `files`
   - **Public bucket**: ✅ (checked)
3. Click **Create bucket**

### **Step 4.4: Add Storage Policies**
1. Click on **maintenance-photos** bucket
2. Click the **Policies** tab
3. Click **New Policy** → **For full customization**
4. Fill in:
   - **Policy name**: `Organization members can upload`
   - **Policy command**: `INSERT`
   - **Target roles**: `authenticated`
   - **USING expression**: Leave blank
   - **WITH CHECK expression**: 
     ```sql
     bucket_id = 'maintenance-photos'
     ```
5. Click **Review** → **Save policy**

6. Repeat for **files** bucket

---

## 👥 **Part 5: Sync Clerk Users to Supabase** (5 minutes)

This step ensures your Clerk users can access Supabase data.

### **Option A: Manual Sync (Quick Start)**

1. In Supabase, click **Table Editor** → Select **users** table
2. Click **Insert row** → **Insert row**
3. Fill in:
   - `clerk_id`: Copy from Clerk Dashboard → Users → Click user → Copy "User ID" (looks like `user_2abc123def`)
   - `email`: User's email
   - `full_name`: User's name
   - `organization_id`: Copy from Clerk Dashboard → Organizations → Click org → Copy "ID" (looks like `org_2xyz789ghi`)
   - Leave other fields as default
4. Click **Save**
5. Repeat for each user

### **Option B: Quick Test Data**

1. In Supabase SQL Editor, run this to create a test org and user:

```sql
-- Insert test organization
INSERT INTO organizations (id, name, slug, created_at)
VALUES (
  'org_test123',
  'Test Company',
  'test-company',
  NOW()
);

-- Insert test user
INSERT INTO users (clerk_id, email, full_name, organization_id, created_at)
VALUES (
  'user_test123', -- Replace with your Clerk user ID
  'you@example.com', -- Replace with your email
  'Your Name', -- Replace with your name
  'org_test123',
  NOW()
);
```

2. Replace `user_test123` with your actual Clerk User ID
3. Replace email and name
4. Click **Run**

---

## ✅ **Part 6: Verify Everything Works** (2 minutes)

### **Step 6.1: Check Dev Server**
1. Make sure your dev server is running: `npm run dev`
2. Open browser: http://localhost:5173

### **Step 6.2: Test Messaging Page**
1. Sign in with Clerk
2. Navigate to: http://localhost:5173/messaging
3. You should see:
   - "Messaging" page header ✅
   - Two tabs: "Sent Emails" and "Chat" ✅
   - Mock email data in table ✅
   - No errors in console ✅

### **Step 6.3: Open Browser Console**
1. Press **F12** or **Cmd+Option+I** (Mac) / **Ctrl+Shift+I** (Windows)
2. Click **Console** tab
3. Type: `import.meta.env.VITE_SUPABASE_URL`
4. Press Enter
5. You should see your Supabase URL ✅

If you don't see it:
- Check `.env` file has correct variables
- Restart dev server
- Hard refresh: **Cmd+Shift+R** (Mac) / **Ctrl+Shift+R** (Windows)

---

## 🎯 **Part 7: Test Database Connection** (5 minutes)

### **Step 7.1: Open Browser Console**
1. On the Messaging page, press F12 to open DevTools
2. Go to **Console** tab

### **Step 7.2: Test Supabase Client**
Paste this code in the console:

```javascript
const { supabase } = await import('/src/services/supabaseClient.js');
const { data, error } = await supabase.from('organizations').select('*');
console.log('Organizations:', data);
```

You should see your test organization data! ✅

### **Step 7.3: Test Transaction Query**
```javascript
const { data, error } = await supabase.from('transactions').select('*');
console.log('Transactions:', data);
```

You should see `[]` (empty array) because you haven't added any transactions yet. That's OK! ✅

---

## 📊 **Part 8: Add Test Data** (5 minutes)

Let's add some test data so you can see it in your app.

### **Step 8.1: Add Test Property**
In Supabase SQL Editor:

```sql
INSERT INTO properties (organization_id, name, address, city, state, zip_code)
VALUES (
  'org_test123', -- Your org ID
  'Sunset Apartments',
  '123 Main Street',
  'San Francisco',
  'CA',
  '94102'
);
```

### **Step 8.2: Add Test Unit**
```sql
INSERT INTO units (property_id, unit_number, bedrooms, bathrooms, square_feet, rent_amount)
SELECT 
  id,
  '301',
  2,
  2,
  1000,
  1500.00
FROM properties 
WHERE name = 'Sunset Apartments'
LIMIT 1;
```

### **Step 8.3: Add Test Tenant**
```sql
INSERT INTO tenants (organization_id, first_name, last_name, email, phone)
VALUES (
  'org_test123',
  'John',
  'Smith',
  'john.smith@example.com',
  '555-123-4567'
);
```

### **Step 8.4: Add Test Lease**
```sql
INSERT INTO leases (organization_id, property_id, unit_id, tenant_id, start_date, end_date, rent_amount, status)
SELECT 
  'org_test123',
  p.id,
  u.id,
  t.id,
  '2024-01-01',
  '2024-12-31',
  1500.00,
  'active'
FROM properties p
JOIN units u ON u.property_id = p.id
CROSS JOIN tenants t
WHERE p.name = 'Sunset Apartments'
AND u.unit_number = '301'
AND t.email = 'john.smith@example.com'
LIMIT 1;
```

### **Step 8.5: Add Test Income Transaction**
```sql
INSERT INTO transactions (
  organization_id, 
  type, 
  category, 
  amount, 
  date, 
  payment_method, 
  status,
  property_id,
  unit_id,
  tenant_id
)
SELECT 
  'org_test123',
  'income',
  'Rent',
  1500.00,
  '2024-12-01',
  'Bank Transfer',
  'completed',
  p.id,
  u.id,
  t.id
FROM properties p
JOIN units u ON u.property_id = p.id
CROSS JOIN tenants t
WHERE p.name = 'Sunset Apartments'
AND u.unit_number = '301'
AND t.email = 'john.smith@example.com'
LIMIT 1;
```

### **Step 8.6: Add Test Maintenance Request**
```sql
INSERT INTO maintenance_requests (
  organization_id,
  property_id,
  unit_id,
  tenant_id,
  title,
  description,
  category,
  priority,
  status
)
SELECT 
  'org_test123',
  p.id,
  u.id,
  t.id,
  'Leaking Faucet',
  'The kitchen faucet is dripping constantly',
  'Plumbing',
  'medium',
  'open'
FROM properties p
JOIN units u ON u.property_id = p.id
CROSS JOIN tenants t
WHERE p.name = 'Sunset Apartments'
AND u.unit_number = '301'
AND t.email = 'john.smith@example.com'
LIMIT 1;
```

---

## 🎉 **Part 9: See Your Data in the App** (10 minutes)

Now let's connect the Reports page to see real data!

### **Step 9.1: Edit Reports Page**

1. Open: `src/pages/ReportsPage.jsx`
2. At the top, add imports:

```javascript
import { useUser } from '@clerk/clerk-react';
import { getCurrentOrgId } from '../services/supabaseClient';
import { fetchIncome } from '../services/transactionsService';
```

3. Inside the `ReportsPage` component, add:

```javascript
const { user } = useUser();
const [rentTransactions, setRentTransactions] = useState([]);

useEffect(() => {
  const loadData = async () => {
    if (!user) return;
    
    try {
      const orgId = getCurrentOrgId(user);
      const data = await fetchIncome(orgId, { category: 'Rent' });
      console.log('Loaded rent data:', data);
      setRentTransactions(data);
    } catch (err) {
      console.error('Error:', err);
    }
  };
  
  loadData();
}, [user]);
```

4. In the Rent tab section, replace the mock data loop with:

```javascript
{rentTransactions.map(transaction => (
  <tr key={transaction.id}>
    <td>
      {transaction.tenant?.first_name} {transaction.tenant?.last_name}
    </td>
    <td>{transaction.property?.name}</td>
    <td>{transaction.unit?.unit_number}</td>
    <td>${transaction.amount}</td>
    <td>{new Date(transaction.date).toLocaleDateString()}</td>
    <td>
      <span className={`status-badge ${transaction.status}`}>
        {transaction.status}
      </span>
    </td>
  </tr>
))}
```

5. Save the file

### **Step 9.2: Test It**

1. Go to: http://localhost:5173/reports
2. Click the **Rent** tab
3. You should see:
   - John Smith
   - Sunset Apartments
   - Unit 301
   - $1,500
   - 12/1/2024
   - Status: completed

**You did it!** 🎉 Your data is now coming from Supabase!

---

## ✅ **Checklist**

- [ ] Ran SQL migration in Supabase
- [ ] Verified 16 tables created
- [ ] Copied Project URL
- [ ] Copied anon key
- [ ] Added to `.env` file
- [ ] Restarted dev server
- [ ] Created `maintenance-photos` bucket
- [ ] Created `files` bucket
- [ ] Added storage policies
- [ ] Synced Clerk user to Supabase
- [ ] Tested Messaging page loads
- [ ] Tested Supabase connection in console
- [ ] Added test data
- [ ] Connected Reports page
- [ ] Saw real data in the app

---

## 🎊 **Congratulations!**

You've successfully:
✅ Set up Supabase database
✅ Connected your React app
✅ Created the Messaging page
✅ Loaded real data from Supabase

**Next steps**: Follow `SUPABASE_INTEGRATION_EXAMPLES.md` to connect other pages!
