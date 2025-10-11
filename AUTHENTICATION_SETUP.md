# Multi-Tenant Authentication Setup Guide

## 🚀 Quick Start

### 1. Set Up Clerk (5 minutes)

1. **Create a Clerk account**: https://clerk.com
2. **Create a new application**
3. **Copy your API keys**:
   - Go to API Keys in your Clerk dashboard
   - Copy the "Publishable key" and "Secret key"

4. **Enable Organizations**:
   - Go to Settings → Organizations
   - Enable "Organizations feature"
   - Enable "Personal Accounts"

5. **Create JWT Template for Supabase**:
   - Go to JWT Templates
   - Click "New template"
   - Select "Supabase" from the templates
   - Name it "supabase"
   - Save

### 2. Set Up Supabase (5 minutes)

1. **Create a Supabase account**: https://supabase.com
2. **Create a new project**
3. **Copy your credentials**:
   - Go to Settings → API
   - Copy the "Project URL" and "anon public" key
   - Copy the "service_role secret" key

4. **Run the migration**:
   ```bash
   # Install Supabase CLI
   npm install -g supabase
   
   # Initialize Supabase in your project
   supabase init
   
   # Link to your project
   supabase link --project-ref YOUR_PROJECT_REF
   
   # Run the migration
   supabase db push
   ```

   Or manually copy the SQL from `supabase/migrations/001_initial_schema.sql` and run it in the Supabase SQL Editor.

5. **Configure Clerk JWT in Supabase**:
   - Go to Settings → Authentication
   - Scroll to "JWT Secret"
   - Add your Clerk JWT Secret (from Clerk dashboard → JWT Templates → supabase → Signing key)

### 3. Configure Environment Variables

Create a `.env` file in your project root:

```bash
# Clerk Configuration
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx
CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxxx

# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# App Configuration
VITE_APP_URL=http://localhost:5173
```

### 4. Install Dependencies

Already done! ✅ We installed:
- `@clerk/clerk-react`
- `@supabase/supabase-js`

### 5. Test the Setup

```bash
npm run dev
```

Visit http://localhost:5173 and try:
1. Sign up with a new account
2. Complete the onboarding flow
3. You should be redirected to the dashboard

## 📁 Project Structure

```
src/
├── config/
│   ├── clerk.js              # Clerk configuration & permissions
│   └── supabase.js           # Supabase client setup
├── hooks/
│   ├── useAuthenticatedSupabase.js  # Supabase with Clerk JWT
│   └── useCurrentUser.js     # Get current user with role
├── components/
│   └── auth/
│       ├── ClerkProvider.jsx        # Clerk wrapper
│       ├── ProtectedRoute.jsx       # Route protection
│       ├── OrganizationSwitcher.jsx # Org switcher
│       └── UserButton.jsx           # User menu
└── pages/
    └── auth/
        ├── SignInPage.jsx    # Sign in page
        ├── SignUpPage.jsx    # Sign up page
        └── OnboardingPage.jsx # Role selection & org setup
```

## 🔐 Authentication Flow

### New User Sign Up

1. User visits `/sign-up`
2. Clerk handles sign-up with email/password or OAuth
3. User redirected to `/onboarding`
4. User selects their role:
   - Property Owner → Creates organization
   - Property Manager → Creates organization
   - Maintenance → Creates organization
   - Tenant → No organization needed
5. User record created in Supabase with role and org
6. Redirect to `/dashboard`

### Returning User Sign In

1. User visits `/sign-in`
2. Clerk authenticates user
3. Clerk JWT includes user ID and metadata
4. All Supabase queries automatically filtered by RLS
5. Redirect to `/dashboard`

## 👥 Role-Based Access Control

### Roles

- **Super Admin**: Platform administrator (full access)
- **Org Admin**: Organization administrator (full org access)
- **Property Owner**: Owns properties, can view financials
- **Property Manager**: Manages properties, handles day-to-day operations
- **Maintenance**: Handles maintenance requests
- **Tenant**: Rents a property, submits maintenance requests

### Permissions

Use the `hasPermission` helper:

```javascript
import { hasPermission } from '../config/clerk';
import { useCurrentUser } from '../hooks/useCurrentUser';

function MyComponent() {
  const { role } = useCurrentUser();
  
  if (hasPermission(role, 'canCreateProperty')) {
    return <AddPropertyButton />;
  }
  
  return null;
}
```

### Protected Routes

Wrap routes that require authentication:

```javascript
import { ProtectedRoute } from '../components/auth/ProtectedRoute';

<ProtectedRoute requiredPermission="canViewFinancials">
  <FinancialsPage />
</ProtectedRoute>

<ProtectedRoute requiredRole="property_owner">
  <OwnerDashboard />
</ProtectedRoute>
```

## 🗄️ Database Queries with RLS

### Automatic Filtering

All queries are automatically filtered by organization:

```javascript
import { useAuthenticatedSupabase } from '../hooks/useAuthenticatedSupabase';

function PropertiesPage() {
  const { supabase } = useAuthenticatedSupabase();
  
  // This automatically only returns properties in your organization
  const { data: properties } = await supabase
    .from('properties')
    .select('*');
  
  return <PropertiesList properties={properties} />;
}
```

### Role-Based Queries

Different roles see different data:

- **Org Admin**: Sees all properties in organization
- **Property Owner**: Sees only their owned properties
- **Property Manager**: Sees only properties they manage
- **Tenant**: Sees only properties they're leasing

This is all handled automatically by RLS policies!

## 🔄 Syncing Clerk and Supabase

### Webhook Setup (Recommended for Production)

1. Create a webhook endpoint in your backend
2. Subscribe to Clerk user events:
   - `user.created`
   - `user.updated`
   - `user.deleted`
3. Sync data to Supabase

Example webhook handler:

```javascript
export async function POST(req) {
  const { type, data } = await req.json();
  
  if (type === 'user.created') {
    await supabase.from('users').insert({
      clerk_id: data.id,
      email: data.email_addresses[0].email_address,
      first_name: data.first_name,
      last_name: data.last_name,
      role: data.public_metadata.role,
      organization_id: data.public_metadata.organization_id
    });
  }
  
  return new Response('OK', { status: 200 });
}
```

### Manual Sync (Current Implementation)

Users are created in Supabase during onboarding.

## 🎨 Customization

### Clerk Appearance

All Clerk components are styled to match JumbaJot's blue theme. Customize in `src/config/clerk.js`:

```javascript
appearance: {
  variables: {
    colorPrimary: '#3b82f6',  // Your brand color
    colorText: '#1e40af',      // Text color
    // ... more customization
  }
}
```

### Role Permissions

Add or modify permissions in `src/config/clerk.js`:

```javascript
export const PERMISSIONS = {
  canDoSomething: ['org_admin', 'manager'],
  // Add your custom permissions
};
```

## 🧪 Testing

### Test Accounts

The migration includes sample users:

- **Admin**: admin@demo.com
- **Owner**: owner@demo.com
- **Manager**: manager@demo.com
- **Tenant**: tenant@demo.com

### Test Different Roles

1. Sign up with different email addresses
2. Select different roles during onboarding
3. Verify data isolation and permissions

## 🚀 Deployment

### Environment Variables

Set these in your production environment:

- Vercel/Netlify: Add in dashboard
- Railway/Render: Add in environment settings

### Clerk Production

1. Upgrade to production in Clerk dashboard
2. Update API keys in environment variables
3. Configure production domain in Clerk settings

### Supabase Production

1. Your Supabase project is already production-ready
2. Consider upgrading plan for more resources
3. Set up database backups

## 📚 Next Steps

### Immediate

1. ✅ Get Clerk API keys
2. ✅ Get Supabase credentials
3. ✅ Run database migration
4. ✅ Configure `.env` file
5. ✅ Test sign up and sign in

### Future Enhancements

- [ ] Add email notifications (Resend/SendGrid)
- [ ] Add file upload for documents (Supabase Storage)
- [ ] Add real-time updates (Supabase Realtime)
- [ ] Add multi-language support
- [ ] Add mobile apps (React Native)
- [ ] Add payment processing (Stripe)
- [ ] Add SMS notifications (Twilio)

## 🆘 Troubleshooting

### "Missing Clerk Publishable Key"

Make sure `.env` file exists and contains `VITE_CLERK_PUBLISHABLE_KEY`

### "User not found in database"

Check that:
1. Onboarding completed successfully
2. Database migration ran successfully
3. Supabase JWT template configured correctly

### "Permission denied"

Check:
1. User has correct role in database
2. RLS policies are enabled
3. Clerk JWT template includes necessary claims

### Database Connection Issues

1. Verify Supabase URL and anon key
2. Check if Supabase project is active
3. Verify RLS policies don't block legitimate access

## 📞 Support

- **Clerk Docs**: https://clerk.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **JumbaJot Issues**: Open an issue on GitHub

---

## 🎉 You're All Set!

Your JumbaJot app now has:
- ✅ Multi-tenant authentication
- ✅ Role-based access control
- ✅ Organization management
- ✅ Secure data isolation
- ✅ Beautiful auth UI matching your theme

Happy coding! 🚀
