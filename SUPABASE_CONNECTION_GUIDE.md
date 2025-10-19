# 🚀 Supabase Connection Guide

This guide will walk you through connecting your React app to Supabase to make your data "light up" automatically.

---

## ✅ **What's Already Done**

1. ✅ **SQL Migration Script Created**: `supabase/migrations/002_complete_schema.sql`
2. ✅ **Supabase Client Service Created**: `src/services/supabaseClient.js`
3. ✅ **Transactions Service Created**: `src/services/transactionsService.js`
4. ✅ **Environment Variables Template**: `.env.example`

---

## 📋 **Step-by-Step Setup**

### **Step 1: Run the SQL Migration in Supabase**

1. **Go to your Supabase Dashboard**:
   - Navigate to https://app.supabase.com
   - Open your project

2. **Open the SQL Editor**:
   - Click **SQL Editor** in the left sidebar
   - Click **+ New query**

3. **Copy and paste the entire contents of `supabase/migrations/002_complete_schema.sql`**:
   - Open the file: `supabase/migrations/002_complete_schema.sql`
   - Copy everything (Cmd+A, Cmd+C)
   - Paste into the SQL Editor

4. **Run the migration**:
   - Click **Run** or press **Cmd+Enter**
   - You should see: "Success. No rows returned"

5. **Verify the tables were created**:
   - Click **Table Editor** in the left sidebar
   - You should see all these tables:
     - `organizations`
     - `users`
     - `properties`
     - `units`
     - `tenants`
     - `leases`
     - `transactions` ← **For Income & Expenses**
     - `maintenance_requests` ← **For Maintenance**
     - `maintenance_photos`
     - `maintenance_comments`
     - `maintenance_reminders`
     - `maintenance_occurrences`
     - `messages` ← **For Messaging**
     - `message_recipients`
     - `chat_conversations`
     - `files` ← **For Document Uploads**

---

### **Step 2: Set Up Supabase Storage Buckets**

1. **Go to Storage**:
   - Click **Storage** in the left sidebar

2. **Create these buckets**:
   
   **Bucket 1: maintenance-photos**
   - Click **+ New bucket**
   - Name: `maintenance-photos`
   - Public: ✅ (checked)
   - Click **Create bucket**
   - Click the bucket → **Policies** → **New Policy** → **For full customization**
   - Add this policy:
     ```sql
     CREATE POLICY "Organization members can upload photos"
     ON storage.objects FOR INSERT
     TO authenticated
     WITH CHECK (bucket_id = 'maintenance-photos' AND auth.uid() IN (
       SELECT user_id FROM users WHERE organization_id = (
         SELECT organization_id FROM users WHERE user_id = auth.uid()
       )
     ));
     
     CREATE POLICY "Public can view photos"
     ON storage.objects FOR SELECT
     TO public
     USING (bucket_id = 'maintenance-photos');
     ```

   **Bucket 2: files**
   - Click **+ New bucket**
   - Name: `files`
   - Public: ✅ (checked)
   - Create similar policies for organization access

---

### **Step 3: Configure Environment Variables**

1. **Get your Supabase credentials**:
   - In Supabase Dashboard, click **Project Settings** (gear icon)
   - Click **API**
   - Copy these values:
     - **Project URL**: `https://xyzcompany.supabase.co`
     - **anon/public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

2. **Create or update your `.env` file**:
   - In your project root (same folder as `package.json`), create `.env`
   - Add these lines:
     ```bash
     VITE_CLERK_PUBLISHABLE_KEY=pk_test_... # (You already have this)
     VITE_SUPABASE_URL=https://your-project.supabase.co
     VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
     ```

3. **Restart your dev server**:
   ```bash
   # Stop the server (Ctrl+C)
   # Start it again
   npm run dev
   ```

---

### **Step 4: Sync Clerk Users to Supabase**

Since you're using Clerk for authentication, you need to sync your Clerk users to Supabase's `users` table.

**Option A: Manual Sync (Quick Start)**

1. For each existing Clerk user, insert into Supabase:
   ```sql
   INSERT INTO users (clerk_id, email, full_name, organization_id)
   VALUES 
     ('user_abc123', 'john@example.com', 'John Smith', 'org_xyz789'),
     ('user_def456', 'jane@example.com', 'Jane Doe', 'org_xyz789');
   ```

**Option B: Automated Sync (Recommended for Production)**

1. Create a Clerk webhook to auto-sync new users:
   - In Clerk Dashboard → **Webhooks** → **+ Add Endpoint**
   - URL: Your backend endpoint (e.g., `https://yourapi.com/webhooks/clerk`)
   - Events: `user.created`, `user.updated`, `organizationMembership.created`
   - In your webhook handler, insert users into Supabase

---

## 🔌 **How to Use Supabase in Your Pages**

### **Example 1: Fetching Income Transactions (Income Page)**

```javascript
import { useUser } from '@clerk/clerk-react';
import { getCurrentOrgId } from '../services/supabaseClient';
import { fetchIncome } from '../services/transactionsService';

function IncomePageNew() {
  const { user } = useUser();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadIncome = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const orgId = getCurrentOrgId(user);
        
        // Fetch income with filters
        const data = await fetchIncome(orgId, {
          startDate: '2024-01-01',
          endDate: '2024-12-31',
          status: 'completed' // or 'pending', 'failed'
        });
        
        setTransactions(data);
      } catch (error) {
        console.error('Error fetching income:', error);
      } finally {
        setLoading(false);
      }
    };

    loadIncome();
  }, [user]);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Income Transactions</h1>
      {transactions.map(t => (
        <div key={t.id}>
          <p>{t.category}: ${t.amount}</p>
          <p>Tenant: {t.tenant?.first_name} {t.tenant?.last_name}</p>
          <p>Property: {t.property?.name}</p>
        </div>
      ))}
    </div>
  );
}
```

---

### **Example 2: Creating a New Transaction**

```javascript
import { createTransaction } from '../services/transactionsService';
import { getCurrentOrgId } from '../services/supabaseClient';

const handleAddIncome = async () => {
  try {
    const orgId = getCurrentOrgId(user);
    
    const newTransaction = await createTransaction({
      organization_id: orgId,
      type: 'income',
      category: 'Rent',
      amount: 1500.00,
      date: '2024-12-20',
      payment_method: 'Bank Transfer',
      tenant_id: 'tenant-uuid-here',
      property_id: 'property-uuid-here',
      unit_id: 'unit-uuid-here',
      reference_number: 'REF-001',
      status: 'completed',
      notes: 'December rent payment'
    });
    
    console.log('Transaction created:', newTransaction);
    // Refresh the transactions list
    loadIncome();
  } catch (error) {
    console.error('Error creating transaction:', error);
  }
};
```

---

### **Example 3: Fetching Maintenance Requests**

```javascript
import { supabase, getCurrentOrgId } from '../services/supabaseClient';

const fetchMaintenanceRequests = async () => {
  const orgId = getCurrentOrgId(user);
  
  const { data, error } = await supabase
    .from('maintenance_requests')
    .select(`
      *,
      property:properties(id, name, address),
      unit:units(id, unit_number),
      tenant:tenants(id, first_name, last_name, email),
      photos:maintenance_photos(*),
      comments:maintenance_comments(*)
    `)
    .eq('organization_id', orgId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};
```

---

### **Example 4: Uploading a Maintenance Photo**

```javascript
import { uploadFile, supabase } from '../services/supabaseClient';

const handleUploadPhoto = async (file, maintenanceRequestId) => {
  try {
    // 1. Upload file to Supabase Storage
    const fileName = `${Date.now()}_${file.name}`;
    const filePath = `${maintenanceRequestId}/${fileName}`;
    
    const fileUrl = await uploadFile('maintenance-photos', filePath, file);
    
    // 2. Save photo record in database
    const { data, error } = await supabase
      .from('maintenance_photos')
      .insert({
        maintenance_request_id: maintenanceRequestId,
        file_name: fileName,
        file_url: fileUrl,
        uploaded_by: user.id
      })
      .select()
      .single();
    
    if (error) throw error;
    
    console.log('Photo uploaded:', data);
    return data;
  } catch (error) {
    console.error('Error uploading photo:', error);
  }
};
```

---

### **Example 5: Sending an Email Message**

```javascript
import { supabase, getCurrentOrgId } from '../services/supabaseClient';

const sendEmailToTenant = async (tenantId, subject, body) => {
  try {
    const orgId = getCurrentOrgId(user);
    
    // 1. Create message record
    const { data: message, error } = await supabase
      .from('messages')
      .insert({
        organization_id: orgId,
        message_type: 'email',
        sender_id: user.id,
        recipient_ids: [tenantId],
        subject: subject,
        body: body,
        status: 'sent'
      })
      .select()
      .single();
    
    if (error) throw error;
    
    // 2. Create recipient record
    await supabase
      .from('message_recipients')
      .insert({
        message_id: message.id,
        recipient_id: tenantId,
        read: false
      });
    
    console.log('Email sent:', message);
    return message;
  } catch (error) {
    console.error('Error sending email:', error);
  }
};
```

---

## 🎯 **Quick Integration Checklist**

### **For Reports Page (Rent & Expenses Tabs)**
- [ ] Replace mock data with `fetchIncome()` and `fetchExpenses()`
- [ ] Add loading states
- [ ] Add error handling
- [ ] Connect filters to Supabase queries

### **For Maintenance Page**
- [ ] Replace mock data with `supabase.from('maintenance_requests').select()`
- [ ] Implement photo upload with `uploadFile()`
- [ ] Connect reminder creation to `maintenance_reminders` table
- [ ] Update recurring occurrences in `maintenance_occurrences` table

### **For Messaging Page**
- [ ] Fetch sent emails from `messages` table
- [ ] Implement retry logic for failed emails
- [ ] Connect chat to `chat_conversations` table
- [ ] Add real-time chat with Supabase subscriptions

---

## 🔒 **Security: Row Level Security (RLS)**

All tables have RLS policies that automatically filter data by organization. Users can only see data from their own organization. This is handled automatically by the policies in the migration script.

**How it works**:
1. User signs in with Clerk
2. Clerk ID is stored in Supabase `users` table with `organization_id`
3. When querying data, RLS policies check: `organization_id = (SELECT organization_id FROM users WHERE clerk_id = auth.uid())`
4. Only data from that organization is returned

---

## 🚨 **Troubleshooting**

### **"supabase is not defined"**
- Make sure you imported: `import { supabase } from '../services/supabaseClient';`
- Check that `.env` variables are set correctly
- Restart your dev server after adding environment variables

### **"Cannot read property 'organizationMemberships' of undefined"**
- User is not logged in yet
- Add a check: `if (!user) return;`
- Use `useUser()` from Clerk to get the user object

### **"RLS policy violation"**
- Make sure the user exists in Supabase `users` table
- Check that `organization_id` is set correctly
- Verify the user's Clerk ID matches the `clerk_id` in the `users` table

### **"No rows returned" when you expect data**
- Check that you've inserted test data
- Verify `organization_id` matches in all queries
- Look at the RLS policies - they might be filtering out your data

---

## 📚 **Next Steps**

1. **Run the SQL migration** (Step 1 above)
2. **Set up .env variables** (Step 3 above)
3. **Insert test data** (see `002_complete_schema.sql` - uncomment the sample data section)
4. **Update one page to use Supabase** (start with Reports page)
5. **Test it works** - you should see real data from Supabase
6. **Repeat for other pages** (Maintenance, Messaging, etc.)

---

## 💡 **Pro Tips**

- Use the **Supabase Table Editor** to manually add/edit data while testing
- Check **Logs** in Supabase Dashboard to see query errors
- Use **Database → Webhooks** to trigger functions on data changes
- Enable **Realtime** on tables for live updates (great for chat!)
- Use **Supabase CLI** to run migrations automatically

---

## 🎉 **You're All Set!**

Once you complete these steps, your data will "light up" automatically. The React components will fetch real data from Supabase, and all the CRUD operations will work seamlessly.

If you have any questions or run into issues, check the Supabase docs or let me know!
