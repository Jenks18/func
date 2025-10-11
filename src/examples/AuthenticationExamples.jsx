/**
 * Example: Using Authentication in Your Components
 */

import { useCurrentUser } from '../hooks/useCurrentUser';
import { useAuthenticatedSupabase } from '../hooks/useAuthenticatedSupabase';
import { hasPermission } from '../config/clerk';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { UserButton } from '../components/auth/UserButton';
import { OrganizationSwitcher } from '../components/auth/OrganizationSwitcher';

// ============================================
// Example 1: Get Current User Information
// ============================================

function UserProfile() {
  const { user, role, organization, loading } = useCurrentUser();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return (
    <div>
      <h2>Welcome, {user?.first_name}!</h2>
      <p>Role: {role}</p>
      <p>Organization: {organization?.name}</p>
    </div>
  );
}

// ============================================
// Example 2: Check User Permissions
// ============================================

function AddPropertyButton() {
  const { role } = useCurrentUser();
  
  // Check if user has permission to create properties
  if (!hasPermission(role, 'canCreateProperty')) {
    return null; // Don't show button if no permission
  }
  
  return (
    <button onClick={handleAddProperty}>
      Add Property
    </button>
  );
}

// ============================================
// Example 3: Query Data with Automatic Filtering
// ============================================

function PropertiesList() {
  const { supabase, isReady } = useAuthenticatedSupabase();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function fetchProperties() {
      if (!isReady) return;
      
      // This query automatically filters by organization thanks to RLS
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          owner:users!properties_owner_id_fkey(first_name, last_name),
          units(count)
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching properties:', error);
      } else {
        setProperties(data);
      }
      setLoading(false);
    }
    
    fetchProperties();
  }, [supabase, isReady]);
  
  if (loading) return <div>Loading properties...</div>;
  
  return (
    <div>
      {properties.map(property => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
}

// ============================================
// Example 4: Create Data
// ============================================

function AddPropertyForm() {
  const { supabase } = useAuthenticatedSupabase();
  const { user, organizationId } = useCurrentUser();
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    zip_code: ''
  });
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const { data, error } = await supabase
      .from('properties')
      .insert({
        ...formData,
        organization_id: organizationId,
        owner_id: user.id
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating property:', error);
      alert('Failed to create property');
    } else {
      console.log('Property created:', data);
      alert('Property created successfully!');
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Property Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />
      {/* More form fields... */}
      <button type="submit">Create Property</button>
    </form>
  );
}

// ============================================
// Example 5: Update Data
// ============================================

function EditPropertyForm({ propertyId }) {
  const { supabase } = useAuthenticatedSupabase();
  const [property, setProperty] = useState(null);
  
  useEffect(() => {
    async function fetchProperty() {
      const { data } = await supabase
        .from('properties')
        .select('*')
        .eq('id', propertyId)
        .single();
      
      setProperty(data);
    }
    fetchProperty();
  }, [propertyId, supabase]);
  
  const handleUpdate = async (updates) => {
    const { error } = await supabase
      .from('properties')
      .update(updates)
      .eq('id', propertyId);
    
    if (error) {
      console.error('Error updating property:', error);
    } else {
      alert('Property updated successfully!');
    }
  };
  
  if (!property) return <div>Loading...</div>;
  
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleUpdate(property);
    }}>
      <input
        value={property.name}
        onChange={(e) => setProperty({ ...property, name: e.target.value })}
      />
      <button type="submit">Update</button>
    </form>
  );
}

// ============================================
// Example 6: Real-time Subscriptions
// ============================================

function MaintenanceRequests() {
  const { supabase } = useAuthenticatedSupabase();
  const [requests, setRequests] = useState([]);
  
  useEffect(() => {
    if (!supabase) return;
    
    // Fetch initial data
    async function fetchRequests() {
      const { data } = await supabase
        .from('maintenance_requests')
        .select('*')
        .order('created_at', { ascending: false });
      
      setRequests(data || []);
    }
    fetchRequests();
    
    // Subscribe to real-time changes
    const subscription = supabase
      .channel('maintenance_requests')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'maintenance_requests'
        },
        (payload) => {
          console.log('Change received!', payload);
          fetchRequests(); // Refetch data
        }
      )
      .subscribe();
    
    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);
  
  return (
    <div>
      {requests.map(request => (
        <MaintenanceCard key={request.id} request={request} />
      ))}
    </div>
  );
}

// ============================================
// Example 7: Protected Route Usage
// ============================================

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/sign-in" element={<SignInPage />} />
      <Route path="/sign-up" element={<SignUpPage />} />
      
      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      
      {/* Role-specific routes */}
      <Route
        path="/financials"
        element={
          <ProtectedRoute requiredPermission="canViewFinancials">
            <FinancialsPage />
          </ProtectedRoute>
        }
      />
      
      {/* Admin only */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRole="org_admin">
            <AdminPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

// ============================================
// Example 8: Role-Based UI
// ============================================

function PropertyActions({ property }) {
  const { role } = useCurrentUser();
  
  return (
    <div>
      {/* Everyone can view */}
      <button>View Details</button>
      
      {/* Managers and owners can edit */}
      {hasPermission(role, 'canEditProperty') && (
        <button>Edit Property</button>
      )}
      
      {/* Only owners and admins can delete */}
      {hasPermission(role, 'canDeleteProperty') && (
        <button>Delete Property</button>
      )}
      
      {/* Only admins */}
      {role === 'org_admin' && (
        <button>Advanced Settings</button>
      )}
    </div>
  );
}

// ============================================
// Example 9: Organization Switcher in Header
// ============================================

function AppHeader() {
  return (
    <header>
      <div className="logo">
        <h1>JumbaJot</h1>
      </div>
      
      <div className="header-actions">
        <OrganizationSwitcher />
        <UserButton />
      </div>
    </header>
  );
}

// ============================================
// Example 10: File Upload to Supabase Storage
// ============================================

function UploadLeaseDocument({ leaseId }) {
  const { supabase } = useAuthenticatedSupabase();
  const { organizationId, user } = useCurrentUser();
  
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    // Upload to Supabase Storage
    const fileName = `${organizationId}/${leaseId}/${file.name}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('lease-documents')
      .upload(fileName, file);
    
    if (uploadError) {
      console.error('Upload error:', uploadError);
      return;
    }
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('lease-documents')
      .getPublicUrl(fileName);
    
    // Save file record to database
    const { error: dbError } = await supabase
      .from('files')
      .insert({
        organization_id: organizationId,
        uploaded_by: user.id,
        lease_id: leaseId,
        file_name: file.name,
        file_type: file.type,
        file_size: file.size,
        storage_path: fileName,
        url: publicUrl,
        category: 'lease_document'
      });
    
    if (dbError) {
      console.error('Database error:', dbError);
    } else {
      alert('File uploaded successfully!');
    }
  };
  
  return (
    <input
      type="file"
      onChange={handleFileUpload}
      accept=".pdf,.doc,.docx"
    />
  );
}

// ============================================
// Example 11: Filtering by Tenant (Tenant View)
// ============================================

function TenantDashboard() {
  const { supabase } = useAuthenticatedSupabase();
  const { user } = useCurrentUser();
  const [myLeases, setMyLeases] = useState([]);
  
  useEffect(() => {
    async function fetchMyLeases() {
      // Get tenant record for current user
      const { data: tenantData } = await supabase
        .from('tenants')
        .select('id')
        .eq('user_id', user.id)
        .single();
      
      if (!tenantData) return;
      
      // Get leases for this tenant
      const { data: leasesData } = await supabase
        .from('leases')
        .select(`
          *,
          property:properties(*),
          unit:units(*)
        `)
        .eq('tenant_id', tenantData.id)
        .eq('status', 'active');
      
      setMyLeases(leasesData || []);
    }
    
    fetchMyLeases();
  }, [supabase, user]);
  
  return (
    <div>
      <h2>My Leases</h2>
      {myLeases.map(lease => (
        <LeaseCard key={lease.id} lease={lease} />
      ))}
    </div>
  );
}

// ============================================
// Example 12: Complex Queries with Joins
// ============================================

function FinancialReport() {
  const { supabase } = useAuthenticatedSupabase();
  const [report, setReport] = useState(null);
  
  useEffect(() => {
    async function generateReport() {
      // Get all transactions grouped by property
      const { data } = await supabase
        .from('transactions')
        .select(`
          *,
          property:properties(name, address),
          tenant:tenants(first_name, last_name)
        `)
        .gte('date', '2024-01-01')
        .lte('date', '2024-12-31')
        .order('date', { ascending: false });
      
      // Calculate totals
      const income = data
        ?.filter(t => t.type === 'income')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);
      
      const expenses = data
        ?.filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);
      
      setReport({
        transactions: data,
        income,
        expenses,
        netProfit: income - expenses
      });
    }
    
    generateReport();
  }, [supabase]);
  
  if (!report) return <div>Loading report...</div>;
  
  return (
    <div>
      <h2>Financial Report</h2>
      <div>Total Income: ${report.income}</div>
      <div>Total Expenses: ${report.expenses}</div>
      <div>Net Profit: ${report.netProfit}</div>
    </div>
  );
}

export {
  UserProfile,
  AddPropertyButton,
  PropertiesList,
  AddPropertyForm,
  EditPropertyForm,
  MaintenanceRequests,
  PropertyActions,
  AppHeader,
  UploadLeaseDocument,
  TenantDashboard,
  FinancialReport
};
