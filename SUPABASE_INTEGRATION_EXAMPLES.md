# 📊 Supabase Integration Examples

Ready-to-use code snippets for integrating Supabase into each page of your app.

---

## 📄 **1. Reports Page - Rent Tab**

### **Current State**: Uses mock data
### **Goal**: Fetch real transactions from Supabase

```javascript
// src/pages/ReportsPage.jsx

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { getCurrentOrgId } from '../services/supabaseClient';
import { fetchTransactions } from '../services/transactionsService';

// Inside ReportsPage component:
const { user } = useUser();
const [rentTransactions, setRentTransactions] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

// Load rent transactions
useEffect(() => {
  const loadRentData = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const orgId = getCurrentOrgId(user);
      
      // Fetch all income transactions with category "Rent"
      const data = await fetchTransactions(orgId, {
        type: 'income',
        category: 'Rent',
        // Optional: Add date filters
        // startDate: '2024-01-01',
        // endDate: '2024-12-31'
      });
      
      setRentTransactions(data);
    } catch (err) {
      console.error('Error loading rent data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  loadRentData();
}, [user]);

// In your JSX:
{loading && <div>Loading rent data...</div>}
{error && <div>Error: {error}</div>}
{!loading && !error && (
  <table>
    <tbody>
      {rentTransactions.map(transaction => (
        <tr key={transaction.id}>
          <td>{transaction.tenant?.first_name} {transaction.tenant?.last_name}</td>
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
    </tbody>
  </table>
)}
```

---

## 💰 **2. Reports Page - Expenses Tab**

```javascript
// Similar to Rent tab, but for expenses:

const [expenseTransactions, setExpenseTransactions] = useState([]);

useEffect(() => {
  const loadExpenses = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const orgId = getCurrentOrgId(user);
      
      const data = await fetchTransactions(orgId, {
        type: 'expense',
        // Filter by specific categories if needed:
        // category: 'Maintenance' // or 'Utilities', 'Insurance', etc.
      });
      
      setExpenseTransactions(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  loadExpenses();
}, [user]);

// Display in table similar to rent tab
```

---

## 📊 **3. Reports Page - P/L Report**

```javascript
import { calculatePL } from '../services/transactionsService';

const [plData, setPlData] = useState(null);

useEffect(() => {
  const loadPLReport = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const orgId = getCurrentOrgId(user);
      
      // Get current year's data
      const startDate = '2024-01-01';
      const endDate = '2024-12-31';
      
      const data = await calculatePL(orgId, startDate, endDate);
      
      setPlData(data);
      // data structure:
      // {
      //   income: { total: 50000, count: 120, byCategory: {...} },
      //   expenses: { total: 30000, count: 80, byCategory: {...} },
      //   netProfit: 20000
      // }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  loadPLReport();
}, [user]);

// Display in your P/L report format:
<div className="pl-summary">
  <div className="income-section">
    <h3>Total Income: ${plData?.income.total.toLocaleString()}</h3>
    {Object.entries(plData?.income.byCategory || {}).map(([category, amount]) => (
      <div key={category}>
        {category}: ${amount.toLocaleString()}
      </div>
    ))}
  </div>
  
  <div className="expenses-section">
    <h3>Total Expenses: ${plData?.expenses.total.toLocaleString()}</h3>
    {Object.entries(plData?.expenses.byCategory || {}).map(([category, amount]) => (
      <div key={category}>
        {category}: ${amount.toLocaleString()}
      </div>
    ))}
  </div>
  
  <div className="net-profit">
    <h2>Net Profit: ${plData?.netProfit.toLocaleString()}</h2>
  </div>
</div>
```

---

## 🔧 **4. Maintenance Page - List View**

```javascript
import { supabase, getCurrentOrgId } from '../services/supabaseClient';

const [maintenanceRequests, setMaintenanceRequests] = useState([]);
const [filters, setFilters] = useState({
  status: 'all', // 'all', 'open', 'in-progress', 'completed'
  priority: 'all', // 'all', 'low', 'medium', 'high', 'urgent'
  category: 'all' // 'all', 'Plumbing', 'Electrical', etc.
});

useEffect(() => {
  const loadMaintenanceRequests = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const orgId = getCurrentOrgId(user);
      
      let query = supabase
        .from('maintenance_requests')
        .select(`
          *,
          property:properties(id, name, address, city, state),
          unit:units(id, unit_number),
          tenant:tenants(id, first_name, last_name, email, phone),
          photos:maintenance_photos(id, file_url),
          comments:maintenance_comments(id, comment_text, created_at)
        `)
        .eq('organization_id', orgId);
      
      // Apply filters
      if (filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }
      if (filters.priority !== 'all') {
        query = query.eq('priority', filters.priority);
      }
      if (filters.category !== 'all') {
        query = query.eq('category', filters.category);
      }
      
      query = query.order('created_at', { ascending: false });
      
      const { data, error } = await query;
      
      if (error) throw error;
      setMaintenanceRequests(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  loadMaintenanceRequests();
}, [user, filters]); // Reload when filters change
```

---

## 🖼️ **5. Maintenance Page - Upload Photo**

```javascript
import { uploadFile, supabase } from '../services/supabaseClient';

const handleUploadPhoto = async (file, maintenanceRequestId) => {
  try {
    setUploading(true);
    
    // 1. Upload to Supabase Storage
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
    
    // 3. Update UI
    setMaintenanceRequests(prev => 
      prev.map(req => 
        req.id === maintenanceRequestId 
          ? { ...req, photos: [...req.photos, data] }
          : req
      )
    );
    
    alert('Photo uploaded successfully!');
  } catch (err) {
    console.error('Error uploading photo:', err);
    alert('Failed to upload photo: ' + err.message);
  } finally {
    setUploading(false);
  }
};

// In JSX:
<input
  type="file"
  accept="image/*"
  onChange={(e) => {
    const file = e.target.files[0];
    if (file) handleUploadPhoto(file, selectedRequest.id);
  }}
/>
```

---

## 💬 **6. Maintenance Page - Add Comment**

```javascript
const handleAddComment = async (maintenanceRequestId, commentText) => {
  try {
    const { data, error } = await supabase
      .from('maintenance_comments')
      .insert({
        maintenance_request_id: maintenanceRequestId,
        user_id: user.id,
        comment_text: commentText,
        is_internal: false // true for internal notes
      })
      .select(`
        *,
        user:users(id, full_name, email)
      `)
      .single();
    
    if (error) throw error;
    
    // Update UI
    setMaintenanceRequests(prev => 
      prev.map(req => 
        req.id === maintenanceRequestId 
          ? { ...req, comments: [...req.comments, data] }
          : req
      )
    );
    
    setNewComment(''); // Clear input
  } catch (err) {
    console.error('Error adding comment:', err);
  }
};
```

---

## 🔔 **7. Maintenance Page - Create Reminder**

```javascript
const handleCreateReminder = async (reminderData) => {
  try {
    const { data: reminder, error } = await supabase
      .from('maintenance_reminders')
      .insert({
        maintenance_request_id: selectedRequest.id,
        title: reminderData.title,
        description: reminderData.description,
        first_occurrence: reminderData.firstOccurrence,
        recurring: reminderData.recurring,
        repeat_every: reminderData.repeatEvery,
        repeat_unit: reminderData.repeatUnit, // 'days', 'weeks', 'months', 'years'
        ends_type: reminderData.endsType, // 'never', 'on_date', 'after_occurrences'
        ends_on: reminderData.endsOn,
        max_occurrences: reminderData.maxOccurrences,
        notify_email: reminderData.notifyEmail,
        notify_sms: reminderData.notifySms,
        created_by: user.id
      })
      .select()
      .single();
    
    if (error) throw error;
    
    // If recurring, create first few occurrences
    if (reminderData.recurring) {
      const occurrences = generateOccurrences(reminder); // Helper function
      
      await supabase
        .from('maintenance_occurrences')
        .insert(
          occurrences.map(date => ({
            reminder_id: reminder.id,
            scheduled_date: date,
            status: 'pending'
          }))
        );
    }
    
    alert('Reminder created successfully!');
    setShowReminderModal(false);
    // Reload maintenance request to show new reminder
  } catch (err) {
    console.error('Error creating reminder:', err);
  }
};
```

---

## 📧 **8. Messaging Page - Fetch Sent Emails**

```javascript
import { supabase, getCurrentOrgId } from '../services/supabaseClient';

const [sentEmails, setSentEmails] = useState([]);

useEffect(() => {
  const loadSentEmails = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const orgId = getCurrentOrgId(user);
      
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          recipients:message_recipients(
            recipient:users(id, full_name, email)
          )
        `)
        .eq('organization_id', orgId)
        .eq('message_type', 'email')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setSentEmails(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  loadSentEmails();
}, [user]);
```

---

## 💬 **9. Messaging Page - Send Email**

```javascript
const handleSendEmail = async (emailData) => {
  try {
    const orgId = getCurrentOrgId(user);
    
    // 1. Create message
    const { data: message, error: messageError } = await supabase
      .from('messages')
      .insert({
        organization_id: orgId,
        message_type: 'email',
        sender_id: user.id,
        recipient_ids: emailData.recipients, // Array of user IDs
        subject: emailData.subject,
        body: emailData.body,
        status: 'sent'
      })
      .select()
      .single();
    
    if (messageError) throw messageError;
    
    // 2. Create recipient records
    const recipientRecords = emailData.recipients.map(recipientId => ({
      message_id: message.id,
      recipient_id: recipientId,
      read: false
    }));
    
    const { error: recipientsError } = await supabase
      .from('message_recipients')
      .insert(recipientRecords);
    
    if (recipientsError) throw recipientsError;
    
    // 3. TODO: Send actual email via email service (SendGrid, etc.)
    
    alert('Email sent successfully!');
    setShowNewMessageModal(false);
    // Reload emails
  } catch (err) {
    console.error('Error sending email:', err);
    alert('Failed to send email: ' + err.message);
  }
};
```

---

## 💬 **10. Messaging Page - Real-Time Chat**

```javascript
import { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';

const [messages, setMessages] = useState([]);
const [conversationId, setConversationId] = useState(null);

// Load existing messages
useEffect(() => {
  if (!conversationId) return;
  
  const loadMessages = async () => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });
    
    if (error) {
      console.error('Error loading messages:', error);
      return;
    }
    
    setMessages(data);
  };
  
  loadMessages();
  
  // Subscribe to real-time updates
  const subscription = supabase
    .channel(`chat:${conversationId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`
      },
      (payload) => {
        setMessages(prev => [...prev, payload.new]);
      }
    )
    .subscribe();
  
  // Cleanup subscription
  return () => {
    subscription.unsubscribe();
  };
}, [conversationId]);

// Send a message
const sendChatMessage = async (text) => {
  try {
    const { data, error } = await supabase
      .from('messages')
      .insert({
        organization_id: getCurrentOrgId(user),
        message_type: 'chat',
        conversation_id: conversationId,
        sender_id: user.id,
        body: text,
        status: 'sent'
      })
      .select()
      .single();
    
    if (error) throw error;
    
    // Message will appear automatically via subscription
  } catch (err) {
    console.error('Error sending message:', err);
  }
};
```

---

## 🏠 **11. Dashboard Page - Summary Cards**

```javascript
import { getTransactionSummary } from '../services/transactionsService';

const [summary, setSummary] = useState(null);

useEffect(() => {
  const loadSummary = async () => {
    if (!user) return;
    
    try {
      const orgId = getCurrentOrgId(user);
      const data = await getTransactionSummary(orgId);
      
      setSummary(data);
      // data structure:
      // {
      //   collected: 45000,
      //   overdue: 5000,
      //   processing: 2000,
      //   comingDue: 8000,
      //   totalIncome: 60000,
      //   totalExpenses: 30000
      // }
    } catch (err) {
      console.error('Error loading summary:', err);
    }
  };

  loadSummary();
}, [user]);

// Display in cards:
<div className="summary-cards">
  <div className="card">
    <h3>Collected</h3>
    <p className="amount">${summary?.collected.toLocaleString()}</p>
  </div>
  <div className="card">
    <h3>Overdue</h3>
    <p className="amount">${summary?.overdue.toLocaleString()}</p>
  </div>
  {/* More cards... */}
</div>
```

---

## 🔄 **12. General Pattern: Loading States**

Use this pattern for all pages:

```javascript
function YourPage() {
  const { user } = useUser();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      // Don't run if user not loaded yet
      if (!user) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Your Supabase query here
        const orgId = getCurrentOrgId(user);
        const { data, error } = await supabase
          .from('your_table')
          .select('*')
          .eq('organization_id', orgId);
        
        if (error) throw error;
        setData(data);
      } catch (err) {
        console.error('Error loading data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  if (loading) {
    return (
      <div className="loading-spinner">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        Error: {error}
      </div>
    );
  }

  return (
    <div>
      {/* Your page content */}
    </div>
  );
}
```

---

## 🎯 **Integration Priority**

Recommended order for integrating Supabase:

1. ✅ **Reports Page - Rent Tab** (easiest, just fetch and display)
2. ✅ **Reports Page - Expenses Tab** (similar to rent)
3. ✅ **Dashboard Summary Cards** (simple aggregations)
4. ✅ **Maintenance List View** (fetch with relations)
5. ✅ **Maintenance Detail View** (single record with all relations)
6. ⏳ **Maintenance Photo Upload** (requires Storage)
7. ⏳ **Maintenance Comments** (simple create)
8. ⏳ **Maintenance Reminders** (complex logic)
9. ⏳ **Messaging - Sent Emails** (fetch and display)
10. ⏳ **Messaging - Chat** (real-time subscriptions)

---

## 🚀 **Quick Start Command**

Once you've set up Supabase (see `SUPABASE_CONNECTION_GUIDE.md`), just add this to any page:

```javascript
import { useUser } from '@clerk/clerk-react';
import { supabase, getCurrentOrgId } from '../services/supabaseClient';

// Inside your component:
const { user } = useUser();

// Fetch data:
const loadData = async () => {
  const orgId = getCurrentOrgId(user);
  const { data, error } = await supabase
    .from('your_table')
    .select('*')
    .eq('organization_id', orgId);
  
  if (error) console.error(error);
  else setYourState(data);
};
```

That's it! Your data will automatically be filtered by organization thanks to RLS policies. 🎉
