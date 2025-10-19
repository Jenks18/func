import React, { useState, useEffect } from 'react';
import { useAuthenticatedSupabase } from '../hooks/useAuthenticatedSupabase';
import { SupabaseLeaseService } from '../services/supabaseLeaseService';

export default function LeasesFilesPageNew() {
  // Supabase integration
  const { supabase, isReady } = useAuthenticatedSupabase();
  const [leaseService, setLeaseService] = useState(null);
  const [isLoadingLeases, setIsLoadingLeases] = useState(true);
  const [leasesError, setLeasesError] = useState(null);
  const [properties, setProperties] = useState([]);
  const [organizationId, setOrganizationId] = useState(null);

  // Initialize lease service when Supabase is ready
  useEffect(() => {
    if (isReady && supabase) {
      setLeaseService(new SupabaseLeaseService(supabase));
    }
  }, [isReady, supabase]);

  // Fetch organization ID and properties
  useEffect(() => {
    const fetchOrgAndProperties = async () => {
      if (!supabase || !isReady) return;

      try {
        // Get Clerk user
        const clerkUser = await window.Clerk?.user;
        if (!clerkUser) return;

        // Get organization ID
        const { data: userData } = await supabase
          .from('users')
          .select('organization_id')
          .eq('clerk_id', clerkUser.id)
          .single();

        if (userData) {
          setOrganizationId(userData.organization_id);
        }

        // Fetch ALL properties (like PropertiesPageRedesigned does)
        // Note: rent_amount is in leases table, not units table
        const { data: propsData, error } = await supabase
          .from('properties')
          .select(`
            *,
            units (
              id,
              unit_number,
              bedrooms,
              bathrooms,
              square_feet,
              status
            ),
            leases (
              id,
              unit_id,
              rent_amount,
              status
            )
          `)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching properties:', error);
          console.error('Error details:', JSON.stringify(error, null, 2));
          setProperties([]);
        } else {
          // Attach rent_amount from active leases to units
          const enrichedProperties = propsData?.map(prop => ({
            ...prop,
            units: prop.units?.map(unit => {
              const activeLease = prop.leases?.find(
                lease => lease.unit_id === unit.id && lease.status === 'active'
              );
              return {
                ...unit,
                rent_amount: activeLease?.rent_amount || null
              };
            }) || []
          })) || [];
          
          setProperties(enrichedProperties);
        }
      } catch (error) {
        console.error('Error in fetchOrgAndProperties:', error);
      }
    };

    fetchOrgAndProperties();
  }, [supabase, isReady]);

  // Detect mobile screen size
  const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 768);
  
  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Main component states
  const [activeTab, setActiveTab] = useState('BASIC INFORMATION');
  const [selectedListing, setSelectedListing] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeMainTab, setActiveMainTab] = useState('leases'); // leases or templates
  const [showNewLeaseWizard, setShowNewLeaseWizard] = useState(false);
  
  // Sorting state
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc'); // 'asc' or 'desc'
  
  // Created leases data - now fetched from Supabase
  const [createdLeases, setCreatedLeases] = useState([]);

  // Fetch leases from Supabase when lease service is ready
  useEffect(() => {
    const fetchLeases = async () => {
      if (!leaseService) return;

      try {
        setIsLoadingLeases(true);
        setLeasesError(null);
        const leases = await leaseService.getAllLeases();
        setCreatedLeases(leases);
      } catch (error) {
        setLeasesError(error.message);
        // Empty array for clean multi-tenant install
        setCreatedLeases([]);
      } finally {
        setIsLoadingLeases(false);
      }
    };

    fetchLeases();
  }, [leaseService]);
  
  // Wizard states
  const [showReviewPage, setShowReviewPage] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showAdditionalFeeModal, setShowAdditionalFeeModal] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [customInvoices, setCustomInvoices] = useState({}); // Track manually edited invoices
  const [selectedLeaseDetail, setSelectedLeaseDetail] = useState(null); // For detailed lease view
  
  // Wizard steps
  const [steps, setSteps] = useState([
    { id: 0, title: "Property Details", icon: "🏠", completed: false },
    { id: 1, title: "Unit & Lease Type", icon: "📄", completed: false },
    { id: 2, title: "Lease Dates", icon: "📅", completed: false },
    { id: 3, title: "Security Deposit", icon: "💰", completed: false },
    { id: 4, title: "Rent/Additional Fee", icon: "💵", completed: false },
    { id: 5, title: "Add Tenants", icon: "👥", completed: false },
    { id: 6, title: "Rent/Deposit Sharing", icon: "🤝", completed: false },
    { id: 7, title: "Lease/Documents", icon: "📑", completed: false },
  ]);
  
  // Lease form data
  const [leaseFormData, setLeaseFormData] = useState({
    selectedUnit: '',
    leaseTermType: 'New Term',
    leaseType: '', // 'fixed' or 'month-to-month'
    startDate: '',
    endDate: '', // Only used for fixed-term leases
    securityDepositAmount: '',
    securityDepositDue: '',
    depositCollected: false,
    rentAmount: '',
    paymentFrequency: '',
    rentDueDay: '',
    customDueDay: '',
    firstInvoiceDueDate: '',
    showAdditionalFees: false,
    tenants: [], // Array of tenant objects
    newTenant: {}, // Form data for adding new tenant
    sharingType: 'equal', // 'equal' or 'individual' for rent/deposit sharing
    equalRentAmount: '', // Amount to collect for equal sharing
    depositPercentage: '100', // Percentage of deposit to collect
    allowPartialPayments: false, // Whether partial payments are allowed
    tenantsCount: '',
    scheduledInvoices: []
  });
  
  // Counter to force re-render of tenant form inputs
  const [tenantFormKey, setTenantFormKey] = useState(0);
  
  // Sort handler
  const handleSort = (field) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // New field, default to ascending
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Sort leases based on current sort state
  const sortedLeases = React.useMemo(() => {
    if (!sortField) return createdLeases;

    return [...createdLeases].sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      // Handle special cases
      if (sortField === 'property') {
        aVal = a.property?.toLowerCase() || '';
        bVal = b.property?.toLowerCase() || '';
      } else if (sortField === 'unit') {
        aVal = parseInt(a.unit) || 0;
        bVal = parseInt(b.unit) || 0;
      } else if (sortField === 'start' || sortField === 'end') {
        aVal = new Date(a[sortField]);
        bVal = new Date(b[sortField]);
      } else if (sortField === 'rent') {
        aVal = parseFloat(a.rent?.replace(/[$,]/g, '')) || 0;
        bVal = parseFloat(b.rent?.replace(/[$,]/g, '')) || 0;
      }

      if (sortDirection === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });
  }, [createdLeases, sortField, sortDirection]);
  
  const handleEditView = (listing) => {
    setSelectedListing(listing);
    setIsEditMode(true);
  };

  const handleCloseEdit = () => {
    setIsEditMode(false);
    setSelectedListing(null);
  };

  const EditView = () => {
    if (!isEditMode || !selectedListing) return null;

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
        <div className="relative top-20 mx-auto p-5 border w-3/4 shadow-lg rounded-md bg-white">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Edit Listing</h2>
            <button onClick={handleCloseEdit} className="text-gray-500 hover:text-gray-700">
              <span className="text-2xl">&times;</span>
            </button>
          </div>
          
          <EditTabs activeTab={activeTab} onTabChange={setActiveTab} />
          
          <TabContent 
            activeTab={activeTab}
            formData={selectedListing}
            onUpdate={(updates) => {
              setSelectedListing(prev => ({...prev, ...updates}));
            }}
          />

          <div className="mt-4 flex justify-end space-x-2">
            <button
              onClick={handleCloseEdit}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                // TODO: Save changes
                handleCloseEdit();
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Helper functions and data
  const tabs = [
  'BASIC INFORMATION',
  'RENTAL TERMS',
  'UNIT FEATURES',
  'UPLOAD PHOTOS',
  'PREVIEW & PUBLISH'
];

const leaseData = {
  propertyName: "Main Street Lofts",
  address: "101 Main St, Milford Oaks",
  unit: "Unit 201",
  rentalLeaseFee: "KSH 2,500",
  start: "Jan 1, 2024",
  end: "Dec 31, 2024",
  securityDeposit: "KSH 45,000",
  monthlyRent: "KSH 75,000",
  tenants: 2,
  rentersInsurance: "Required",
  propertyType: "Apartment",
};

const templateData = [
  {
    id: 1,
    name: "Lease Agreement",
    tenants: 1,
    description: "Leases",
    type: "Lease"
  }
];

const EditTabs = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex border-b border-gray-200 mb-4">
      {tabs.map((tab) => (
        <button
          key={tab}
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === tab
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => onTabChange(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

// Helper function to generate scheduled invoices
const generateScheduledInvoices = (formData, customInvoices = {}) => {
  if (!formData.startDate || !formData.paymentFrequency || !formData.rentDueDay || !formData.firstInvoiceDueDate) {
    return [];
  }

  const invoices = [];
  const firstInvoiceDate = new Date(formData.firstInvoiceDueDate);
  
  // Generate 12 invoices for demonstration
  for (let i = 0; i < 12; i++) {
    const invoiceDate = new Date(firstInvoiceDate);
    
    if (formData.paymentFrequency === 'Monthly') {
      invoiceDate.setMonth(firstInvoiceDate.getMonth() + i);
      
      // Set the day based on the due day selection
      if (formData.rentDueDay === '1st') {
        invoiceDate.setDate(1);
      } else if (formData.rentDueDay === '15th') {
        invoiceDate.setDate(15);
      } else if (formData.rentDueDay === 'Last') {
        // Set to last day of month
        invoiceDate.setMonth(invoiceDate.getMonth() + 1, 0);
      } else if (formData.rentDueDay === 'Custom' && formData.customDueDay) {
        invoiceDate.setDate(parseInt(formData.customDueDay));
      }
      
      // For the first invoice, use the exact date selected
      if (i === 0) {
        invoiceDate.setTime(firstInvoiceDate.getTime());
      }
    } else if (formData.paymentFrequency === 'Quarterly') {
      invoiceDate.setMonth(firstInvoiceDate.getMonth() + (i * 3));
    } else if (formData.paymentFrequency === 'Annually') {
      invoiceDate.setFullYear(firstInvoiceDate.getFullYear() + i);
    }

    // Check if this invoice has been customized
    const customInvoice = customInvoices[i];
    const finalDate = customInvoice?.date ? new Date(customInvoice.date) : invoiceDate;
    const finalAmount = customInvoice?.amount || formData.rentAmount;

    invoices.push({
      id: i,
      date: finalDate.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      }),
      amount: finalAmount,
      rawDate: finalDate
    });
  }

  return invoices;
};

const TabContent = ({ activeTab, formData, onUpdate }) => {
  switch (activeTab) {
    case 'BASIC INFORMATION':
      return (
        <div className="p-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Property Name</label>
              <input
                type="text"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                value={formData.propertyName}
                onChange={(e) => onUpdate({ propertyName: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                value={formData.description}
                onChange={(e) => onUpdate({ description: e.target.value })}
              />
            </div>
          </div>
        </div>
      );
    case 'RENTAL TERMS':
      return (
        <div className="p-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Monthly Rent</label>
              <input
                type="text"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                value={formData.monthlyRent}
                onChange={(e) => onUpdate({ monthlyRent: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Security Deposit</label>
              <input
                type="text"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                value={formData.securityDeposit}
                onChange={(e) => onUpdate({ securityDeposit: e.target.value })}
              />
            </div>
          </div>
        </div>
      );
    case 'UNIT FEATURES':
      return (
        <div className="p-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Pet Policy</label>
              <select
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                value={formData.petPolicy}
                onChange={(e) => onUpdate({ petPolicy: e.target.value })}
              >
                <option value="all">All Pets Allowed</option>
                <option value="none">No Pets Allowed</option>
                <option value="cats">Only Cats Allowed</option>
                <option value="small">Only Small Dogs Allowed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Amenities</label>
              {/* Add checkboxes for amenities */}
            </div>
          </div>
        </div>
      );
    case 'UPLOAD PHOTOS':
      return (
        <div className="p-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Property Photos</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <div className="flex text-sm text-gray-600">
                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                      <span>Upload files</span>
                      <input type="file" className="sr-only" multiple />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    case 'PREVIEW & PUBLISH':
      return (
        <div className="p-4">
          <div className="space-y-4">
            {/* Add preview content */}
            <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-md">
              Publish Listing
            </button>
          </div>
        </div>
      );
    default:
      return null;
  }
};

function StepContent({ 
  step, 
  selectedProperty, 
  leaseFormData, 
  handlePropertySelect, 
  handleLeaseTermSelect, 
  handleLeaseFormUpdate, 
  steps,
  showAdditionalFeeModal,
  setShowAdditionalFeeModal,
  editingInvoice,
  setEditingInvoice,
  handleEditInvoice,
  handleDeleteInvoice,
  handleUpdateInvoice,
  customInvoices
}) {
  switch (step) {
    case 0:
      return (
        <div style={{ padding: '24px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px'
          }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: '700',
              color: '#134e4a',
              margin: 0
            }}>
              Select a Property
            </h2>
            <button style={{
              background: 'linear-gradient(135deg, #14b8a6 0%, #2dd4bf 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 14px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(20,184,166,0.3)',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 4px 12px rgba(20,184,166,0.4)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 2px 8px rgba(20,184,166,0.3)';
            }}>
              + New Property
            </button>
          </div>
          
          <div style={{
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <select style={{
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              padding: '6px 10px',
              fontSize: '13px',
              background: 'white',
              color: '#374151',
              minWidth: '140px',
              cursor: 'pointer'
            }}>
              <option>All Properties</option>
            </select>
            <div style={{
              position: 'relative',
              flex: 1,
              maxWidth: '280px'
            }}>
              <input
                type="text"
                placeholder="Search..."
                style={{
                  width: '100%',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  padding: '6px 10px 6px 32px',
                  fontSize: '13px',
                  background: 'white',
                  color: '#374151'
                }}
              />
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" style={{
                position: 'absolute',
                left: '10px',
                top: '50%',
                transform: 'translateY(-50%)'
              }}>
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </div>
          </div>
          
          {/* Card-based layout matching Innago reference */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '16px',
            maxHeight: '500px',
            overflowY: 'auto',
            padding: '4px'
          }}>
            {properties.length === 0 ? (
              <div style={{
                gridColumn: '1 / -1',
                textAlign: 'center',
                padding: '40px',
                color: '#6b7280'
              }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="2" style={{ margin: '0 auto 16px' }}>
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
                <div style={{ fontSize: '14px', fontWeight: '600' }}>No properties found</div>
                <div style={{ fontSize: '12px', marginTop: '4px' }}>Add a property to get started</div>
              </div>
            ) : (
              properties.map((property) => (
                <div 
                  key={property.id} 
                  onClick={() => handlePropertySelect(property)}
                  style={{
                  background: 'white',
                  borderRadius: '10px',
                  border: selectedProperty?.id === property.id ? '2px solid #14b8a6' : '1px solid #e5e7eb',
                  padding: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: selectedProperty?.id === property.id 
                    ? '0 4px 12px rgba(20,184,166,0.2)' 
                    : '0 1px 3px rgba(0,0,0,0.1)',
                  position: 'relative'
                }}
                onMouseOver={(e) => {
                  if (selectedProperty?.id !== property.id) {
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                    e.currentTarget.style.borderColor = '#14b8a6';
                  }
                }}
                onMouseOut={(e) => {
                  if (selectedProperty?.id !== property.id) {
                    e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                    e.currentTarget.style.borderColor = '#e5e7eb';
                  }
                }}>
                  {/* Selection indicator */}
                  {selectedProperty?.id === property.id && (
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      background: '#14b8a6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '12px'
                    }}>
                      ✓
                    </div>
                  )}
                  
                  {/* Property icon and name */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    marginBottom: '12px'
                  }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      background: selectedProperty?.id === property.id 
                        ? 'linear-gradient(135deg, #14b8a6 0%, #2dd4bf 100%)' 
                        : '#f3f4f6',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={selectedProperty?.id === property.id ? 'white' : '#6b7280'} strokeWidth="2">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                        <polyline points="9 22 9 12 15 12 15 22"/>
                      </svg>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontWeight: '700',
                        color: '#111827',
                        fontSize: '15px',
                        marginBottom: '2px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {property.name}
                      </div>
                      <div style={{
                        color: '#6b7280',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}>
                        {property.units?.length || 0} unit{property.units?.length !== 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>
                  
                  {/* Address */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '8px',
                    marginBottom: '12px',
                    paddingBottom: '12px',
                    borderBottom: '1px solid #f3f4f6'
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" style={{ marginTop: '2px', flexShrink: 0 }}>
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                    <div style={{
                      color: '#6b7280',
                      fontSize: '13px',
                      lineHeight: '1.4',
                      wordBreak: 'break-word'
                    }}>
                      {property.address}, {property.city}, {property.state} {property.zip_code}
                    </div>
                  </div>
                  
                  {/* Details row */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '12px'
                  }}>
                    <div>
                      <div style={{
                        fontSize: '11px',
                        color: '#9ca3af',
                        fontWeight: '600',
                        marginBottom: '4px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        Type
                      </div>
                      <div style={{
                        fontSize: '13px',
                        fontWeight: '600',
                        color: '#374151'
                      }}>
                        {property.property_type || 'Residential'}
                      </div>
                    </div>
                    <div>
                      <div style={{
                        fontSize: '11px',
                        color: '#9ca3af',
                        fontWeight: '600',
                        marginBottom: '4px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        Units
                      </div>
                      <div style={{
                        fontSize: '13px',
                        fontWeight: '600',
                        color: '#14b8a6'
                      }}>
                        {property.units?.length || 0} available
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      );
    case 1:
      return (
        <div style={{ 
          padding: '32px',
          maxWidth: '900px',
          margin: '0 auto'
        }}>
          <h2 style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#134e4a',
            marginBottom: '8px'
          }}>
            Unit & Lease Type
          </h2>
          <p style={{
            fontSize: '14px',
            color: '#6b7280',
            marginBottom: '32px',
            fontWeight: '500'
          }}>
            Select the unit, lease term type, and lease duration
          </p>

          {/* Main Container Card */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)',
            padding: '32px',
            border: '1px solid #e5e7eb'
          }}>
            {/* Unit Selection Dropdown */}
            {selectedProperty && selectedProperty.units && selectedProperty.units.length > 0 ? (
              <div style={{ marginBottom: '28px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '700',
                  color: '#134e4a',
                  marginBottom: '10px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Select Unit *
                </label>
                <select
                  value={leaseFormData.selectedUnit}
                  onChange={(e) => handleLeaseFormUpdate('selectedUnit', e.target.value)}
                  style={{
                    width: '100%',
                    maxWidth: '420px',
                    boxSizing: 'border-box',
                    border: '2px solid #d1d5db',
                    borderRadius: '10px',
                    padding: '14px 16px',
                    fontSize: '15px',
                    background: 'white',
                    color: '#1f2937',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    outline: 'none'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#14b8a6';
                    e.target.style.boxShadow = '0 0 0 3px rgba(20,184,166,0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  <option value="">-- Select a unit --</option>
                  {selectedProperty.units.map(unit => (
                    <option key={unit.id} value={unit.id}>
                      Unit {unit.unit_number}
                      {unit.rent_amount && ` - $${unit.rent_amount}/month`}
                      {unit.bedrooms && ` • ${unit.bedrooms} bed`}
                      {unit.bathrooms && ` • ${unit.bathrooms} bath`}
                      {unit.square_feet && ` • ${unit.square_feet} sqft`}
                      {unit.status && unit.status !== 'available' && ` (${unit.status})`}
                    </option>
                  ))}
                </select>
                {!leaseFormData.selectedUnit && (
                  <div style={{
                    marginTop: '8px',
                    fontSize: '12px',
                    color: '#9ca3af',
                    fontStyle: 'italic'
                  }}>
                    Choose a unit to continue
                  </div>
                )}
              </div>
            ) : (
              <div style={{
                marginBottom: '28px',
                padding: '20px',
                background: '#fef3c7',
                border: '1px solid #fde047',
                borderRadius: '10px',
                color: '#92400e'
              }}>
                <strong>⚠️ No units found</strong>
                <p style={{ margin: '8px 0 0 0', fontSize: '14px' }}>
                  This property doesn't have any units yet. Please add units to this property first.
                </p>
              </div>
            )}

            {/* Lease Term Type Dropdown */}
            <div style={{ marginBottom: '28px' }}>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '700',
                color: '#134e4a',
                marginBottom: '10px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Select Lease Term *
              </label>
              <select
                value={leaseFormData.leaseTermType}
                onChange={(e) => handleLeaseFormUpdate('leaseTermType', e.target.value)}
                style={{
                  width: '100%',
                  maxWidth: '420px',
                  boxSizing: 'border-box',
                  border: '2px solid #d1d5db',
                  borderRadius: '10px',
                  padding: '14px 16px',
                  fontSize: '15px',
                  background: 'white',
                  color: '#1f2937',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#14b8a6';
                  e.target.style.boxShadow = '0 0 0 3px rgba(20,184,166,0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <option value="New Term">New Term</option>
                <option value="Transfer">Transfer</option>
                <option value="Renewal">Renewal</option>
              </select>
            </div>

            {/* Lease Type Section */}
            <div style={{ marginTop: '32px', paddingTop: '32px', borderTop: '2px solid #f3f4f6' }}>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '700',
                color: '#134e4a',
                marginBottom: '16px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Lease Type *
              </label>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '20px'
              }}>
                <div 
                  onClick={() => handleLeaseTermSelect('fixed')}
                  style={{
                    background: leaseFormData.leaseType === 'fixed' ? 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%)' : 'white',
                    border: leaseFormData.leaseType === 'fixed' ? '2px solid #14b8a6' : '2px solid #e5e7eb',
                    borderRadius: '12px',
                    padding: '24px 20px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: leaseFormData.leaseType === 'fixed' 
                      ? '0 8px 24px rgba(20,184,166,0.15), 0 4px 8px rgba(20,184,166,0.08)' 
                      : '0 2px 4px rgba(0,0,0,0.04)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseOver={(e) => {
                    if (leaseFormData.leaseType !== 'fixed') {
                      e.currentTarget.style.background = '#fafafa';
                      e.currentTarget.style.borderColor = '#14b8a6';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(20,184,166,0.1)';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (leaseFormData.leaseType !== 'fixed') {
                      e.currentTarget.style.background = 'white';
                      e.currentTarget.style.borderColor = '#e5e7eb';
                      e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.04)';
                    }
                  }}
                >
                  {leaseFormData.leaseType === 'fixed' && (
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: '#14b8a6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 8px rgba(20,184,166,0.3)'
                    }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </div>
                  )}
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: leaseFormData.leaseType === 'fixed' ? 'rgba(20,184,166,0.15)' : '#f3f4f6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '16px'
                  }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={leaseFormData.leaseType === 'fixed' ? '#14b8a6' : '#6b7280'} strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                    </svg>
                  </div>
                  <h3 style={{
                    fontSize: '17px',
                    fontWeight: '700',
                    color: '#134e4a',
                    marginBottom: '8px'
                  }}>
                    Fixed Term
                  </h3>
                  <p style={{
                    color: '#6b7280',
                    fontSize: '13px',
                    fontWeight: '500',
                    margin: 0,
                    lineHeight: '1.6'
                  }}>
                    Traditional lease with a fixed end date and optional automatic renewal
                  </p>
                </div>
                
                <div 
                  onClick={() => handleLeaseTermSelect('month-to-month')}
                  style={{
                    background: leaseFormData.leaseType === 'month-to-month' ? 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%)' : 'white',
                    border: leaseFormData.leaseType === 'month-to-month' ? '2px solid #14b8a6' : '2px solid #e5e7eb',
                    borderRadius: '12px',
                    padding: '24px 20px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: leaseFormData.leaseType === 'month-to-month' 
                      ? '0 8px 24px rgba(20,184,166,0.15), 0 4px 8px rgba(20,184,166,0.08)' 
                      : '0 2px 4px rgba(0,0,0,0.04)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseOver={(e) => {
                    if (leaseFormData.leaseType !== 'month-to-month') {
                      e.currentTarget.style.background = '#fafafa';
                      e.currentTarget.style.borderColor = '#14b8a6';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(20,184,166,0.1)';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (leaseFormData.leaseType !== 'month-to-month') {
                      e.currentTarget.style.background = 'white';
                      e.currentTarget.style.borderColor = '#e5e7eb';
                      e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.04)';
                    }
                  }}
                >
                  {leaseFormData.leaseType === 'month-to-month' && (
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: '#14b8a6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 8px rgba(20,184,166,0.3)'
                    }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </div>
                  )}
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: leaseFormData.leaseType === 'month-to-month' ? 'rgba(20,184,166,0.15)' : '#f3f4f6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '16px'
                  }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={leaseFormData.leaseType === 'month-to-month' ? '#14b8a6' : '#6b7280'} strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                      <line x1="16" y1="2" x2="16" y2="6"/>
                      <line x1="8" y1="2" x2="8" y2="6"/>
                      <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                  </div>
                  <h3 style={{
                    fontSize: '17px',
                    fontWeight: '700',
                    color: '#134e4a',
                    marginBottom: '8px'
                  }}>
                    Month to Month
                  </h3>
                  <p style={{
                    color: '#6b7280',
                    fontSize: '13px',
                    fontWeight: '500',
                    margin: 0,
                    lineHeight: '1.6'
                  }}>
                    Flexible lease that continues monthly and can be terminated with proper notice
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    case 2:
      return (
        <div style={{ 
          padding: '32px',
          maxWidth: '900px',
          margin: '0 auto'
        }}>
          <h2 style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#134e4a',
            marginBottom: '8px'
          }}>
            Lease Dates
          </h2>
          <p style={{
            fontSize: '14px',
            color: '#6b7280',
            marginBottom: '32px',
            fontWeight: '500'
          }}>
            Set the start and end dates for this lease
          </p>

          {/* Main Container Card */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)',
            padding: '32px',
            border: '1px solid #e5e7eb',
            maxWidth: '500px'
          }}>
            {/* Lease Start Date - Always shown */}
            <div style={{ marginBottom: leaseFormData.leaseType === 'fixed' ? '24px' : '16px' }}>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '700',
                color: '#134e4a',
                marginBottom: '10px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Lease Start Date *
              </label>
              <input
                type="date"
                value={leaseFormData.startDate}
                onChange={(e) => handleLeaseFormUpdate('startDate', e.target.value)}
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  border: '2px solid #d1d5db',
                  borderRadius: '10px',
                  padding: '14px 16px',
                  fontSize: '15px',
                  background: 'white',
                  color: '#1f2937',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#14b8a6';
                  e.target.style.boxShadow = '0 0 0 3px rgba(20,184,166,0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Lease End Date - Only for Fixed Term */}
            {leaseFormData.leaseType === 'fixed' && (
              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '700',
                  color: '#134e4a',
                  marginBottom: '10px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Lease End Date *
                </label>
                <input
                  type="date"
                  value={leaseFormData.endDate || ''}
                  onChange={(e) => handleLeaseFormUpdate('endDate', e.target.value)}
                  min={leaseFormData.startDate}
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    border: '2px solid #d1d5db',
                    borderRadius: '10px',
                    padding: '14px 16px',
                    fontSize: '15px',
                    background: 'white',
                    color: '#1f2937',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    outline: 'none'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#14b8a6';
                    e.target.style.boxShadow = '0 0 0 3px rgba(20,184,166,0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            )}

            {/* Info Box */}
            <div style={{
              fontSize: '13px',
              color: '#14b8a6',
              fontWeight: '600',
              padding: '16px',
              background: '#f0fdfa',
              borderRadius: '10px',
              border: '1px solid #ccfbf1',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              marginTop: '20px'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0, marginTop: '2px' }}>
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="16" x2="12" y2="12"/>
                <line x1="12" y1="8" x2="12.01" y2="8"/>
              </svg>
              <span style={{ lineHeight: '1.6' }}>
                {leaseFormData.leaseType === 'month-to-month' 
                  ? 'This lease continues month-to-month with no fixed end date. Either party may terminate with proper notice.'
                  : 'This lease will run from the start date to the end date. You can set auto-renewal options later.'}
              </span>
            </div>
          </div>
        </div>
      );
    case 3:
      const SecurityDepositInput = () => {
        const [localValue, setLocalValue] = React.useState(leaseFormData.securityDepositAmount || '');
        
        React.useEffect(() => {
          setLocalValue(leaseFormData.securityDepositAmount || '');
        }, [leaseFormData.securityDepositAmount]);
        
        return (
          <div style={{ position: 'relative', maxWidth: '400px' }}>
            <span style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#14b8a6',
              fontSize: '14px',
              fontWeight: '700',
              pointerEvents: 'none',
              zIndex: 1
            }}>
              $
            </span>
            <input
              type="text"
              inputMode="decimal"
              value={localValue}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9.]/g, '');
                if (value.split('.').length <= 2) {
                  setLocalValue(value);
                }
              }}
              onBlur={(e) => {
                const value = e.target.value;
                if (value) {
                  const num = parseFloat(value);
                  if (!isNaN(num) && num >= 0) {
                    const formatted = num.toFixed(2);
                    setLocalValue(formatted);
                    handleLeaseFormUpdate('securityDepositAmount', formatted);
                  }
                } else {
                  handleLeaseFormUpdate('securityDepositAmount', '');
                }
              }}
              placeholder="0.00"
              style={{
                width: '100%',
                boxSizing: 'border-box',
                border: '2px solid #99f6e4',
                borderRadius: '8px',
                padding: '10px 12px 10px 32px',
                fontSize: '14px',
                background: '#f0fdfa',
                color: '#134e4a',
                fontWeight: '600'
              }}
            />
          </div>
        );
      };
      
      return (
        <div style={{ padding: '24px', maxWidth: '600px' }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#134e4a',
            marginBottom: '24px'
          }}>
            Security Deposit
          </h2>
          <div style={{
            background: 'white',
            border: '2px solid #ccfbf1',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 4px 16px rgba(20,184,166,0.1)'
          }}>
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '700',
                color: '#134e4a',
                marginBottom: '8px'
              }}>
                Security Deposit Amount *
              </label>
              <SecurityDepositInput />
            </div>
            
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '700',
                color: '#134e4a',
                marginBottom: '8px'
              }}>
                Due Date *
              </label>
              <input
                type="date"
                value={leaseFormData.securityDepositDue || ''}
                onChange={(e) => handleLeaseFormUpdate('securityDepositDue', e.target.value)}
                style={{
                  width: '100%',
                  maxWidth: '400px',
                  boxSizing: 'border-box',
                  border: '2px solid #99f6e4',
                  borderRadius: '8px',
                  padding: '10px 12px',
                  fontSize: '14px',
                  background: '#f0fdfa',
                  color: '#134e4a',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              />
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '16px'
            }}>
              <input
                type="checkbox"
                id="depositCollected"
                checked={leaseFormData.depositCollected}
                onChange={(e) => handleLeaseFormUpdate('depositCollected', e.target.checked)}
                style={{
                  width: '16px',
                  height: '16px',
                  accentColor: '#14b8a6',
                  cursor: 'pointer'
                }}
              />
              <label
                htmlFor="depositCollected"
                style={{
                  fontSize: '14px',
                  color: '#134e4a',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                I have already collected the Security Deposit
              </label>
            </div>
            
            <div style={{
              fontSize: '14px',
              color: '#14b8a6',
              fontWeight: '600',
              padding: '12px',
              background: '#f0fdfa',
              borderRadius: '8px',
              border: '2px solid #ccfbf1'
            }}>
              💡 Security deposits are typically 1-2 months rent and are refundable at the end of the lease term, minus any damages or unpaid rent.
            </div>
          </div>
        </div>
      );
    case 4:
      return (
        <div style={{ padding: '24px', display: 'flex', gap: '24px', maxWidth: '1200px' }}>
          {/* Left side - Progressive form */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#134e4a',
              marginBottom: '24px'
            }}>
              Rent/Additional Fee
            </h2>
            
            <div style={{
              background: 'white',
              border: '2px solid #ccfbf1',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 4px 16px rgba(20,184,166,0.1)'
            }}>
              {/* Step 1: Payment Frequency */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '700',
                  color: '#134e4a',
                  marginBottom: '8px'
                }}>
                  Payment Frequency *
                </label>
                <select
                  value={leaseFormData.paymentFrequency}
                  onChange={(e) => handleLeaseFormUpdate('paymentFrequency', e.target.value)}
                  style={{
                    width: '100%',
                    maxWidth: '400px',
                    boxSizing: 'border-box',
                    border: '2px solid #99f6e4',
                    borderRadius: '8px',
                    padding: '10px 12px',
                    fontSize: '14px',
                    background: '#f0fdfa',
                    color: '#134e4a',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  <option value="">Select frequency...</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Quarterly">Quarterly</option>
                  <option value="Annually">Annually</option>
                </select>
              </div>

              {/* Step 2: Rent Amount - Shows after frequency is selected */}
              {leaseFormData.paymentFrequency && (
                <div style={{ marginBottom: '24px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '700',
                    color: '#134e4a',
                    marginBottom: '8px'
                  }}>
                    Rent Amount *
                  </label>
                  {(() => {
                    const RentAmountInput = () => {
                      const [localValue, setLocalValue] = React.useState(leaseFormData.rentAmount || '');
                      
                      React.useEffect(() => {
                        setLocalValue(leaseFormData.rentAmount || '');
                      }, [leaseFormData.rentAmount]);
                      
                      return (
                        <div style={{ position: 'relative', maxWidth: '400px' }}>
                          <span style={{
                            position: 'absolute',
                            left: '12px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: '#14b8a6',
                            fontSize: '14px',
                            fontWeight: '700',
                            pointerEvents: 'none',
                            zIndex: 1
                          }}>
                            $
                          </span>
                          <input
                            type="text"
                            inputMode="decimal"
                            value={localValue}
                            onChange={(e) => {
                              const value = e.target.value.replace(/[^0-9.]/g, '');
                              if (value.split('.').length <= 2) {
                                setLocalValue(value);
                              }
                            }}
                            onBlur={(e) => {
                              const value = e.target.value;
                              if (value) {
                                const num = parseFloat(value);
                                if (!isNaN(num) && num > 0) {
                                  const formatted = num.toFixed(2);
                                  setLocalValue(formatted);
                                  handleLeaseFormUpdate('rentAmount', formatted);
                                }
                              } else {
                                handleLeaseFormUpdate('rentAmount', '');
                              }
                            }}
                            placeholder="0.00"
                            style={{
                              width: '100%',
                              boxSizing: 'border-box',
                              border: '2px solid #99f6e4',
                              borderRadius: '8px',
                              padding: '10px 12px 10px 32px',
                              fontSize: '14px',
                              background: '#f0fdfa',
                              color: '#134e4a',
                              fontWeight: '600'
                            }}
                          />
                        </div>
                      );
                    };
                    return <RentAmountInput />;
                  })()}
                </div>
              )}

              {/* Step 3: Due Date - Shows after rent amount is entered */}
              {leaseFormData.paymentFrequency && leaseFormData.rentAmount && (
                <div style={{ marginBottom: '24px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '700',
                    color: '#134e4a',
                    marginBottom: '8px'
                  }}>
                    Due on the *
                  </label>
                  <select
                    value={leaseFormData.rentDueDay}
                    onChange={(e) => handleLeaseFormUpdate('rentDueDay', e.target.value)}
                    style={{
                      width: '100%',
                      border: '2px solid #99f6e4',
                      borderRadius: '8px',
                      padding: '10px 12px',
                      fontSize: '14px',
                      background: '#f0fdfa',
                      color: '#134e4a',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="">Select day...</option>
                    <option value="1st">1st of every month</option>
                    <option value="15th">15th of every month</option>
                    <option value="Last">Last day of every month</option>
                    <option value="Custom">Custom date</option>
                  </select>
                  
                  {/* Custom date input - Shows when Custom is selected */}
                  {leaseFormData.rentDueDay === 'Custom' && (
                    <div style={{ marginTop: '12px' }}>
                      <label style={{
                        display: 'block',
                        fontSize: '12px',
                        fontWeight: '700',
                        color: '#134e4a',
                        marginBottom: '4px'
                      }}>
                        Day of month (1-31)
                      </label>
                      {(() => {
                        const CustomDueDayInput = () => {
                          const [localValue, setLocalValue] = React.useState(leaseFormData.customDueDay || '');
                          
                          React.useEffect(() => {
                            setLocalValue(leaseFormData.customDueDay || '');
                          }, [leaseFormData.customDueDay]);
                          
                          return (
                            <input
                              type="text"
                              inputMode="numeric"
                              value={localValue}
                              onChange={(e) => {
                                const value = e.target.value.replace(/[^0-9]/g, '');
                                const num = parseInt(value);
                                if (value === '' || (num >= 1 && num <= 31)) {
                                  setLocalValue(value);
                                }
                              }}
                              onBlur={(e) => {
                                handleLeaseFormUpdate('customDueDay', e.target.value);
                              }}
                              placeholder="Enter day (1-31)"
                              style={{
                                width: '100%',
                                maxWidth: '150px',
                                boxSizing: 'border-box',
                                border: '2px solid #99f6e4',
                                borderRadius: '8px',
                                padding: '8px 12px',
                                fontSize: '14px',
                                background: '#f0fdfa',
                                color: '#134e4a',
                                fontWeight: '600'
                              }}
                            />
                          );
                        };
                        return <CustomDueDayInput />;
                      })()}
                    </div>
                  )}
                </div>
              )}

              {/* Step 4: First Invoice Due Date - Shows after due day is selected */}
              {leaseFormData.paymentFrequency && leaseFormData.rentAmount && leaseFormData.rentDueDay && (leaseFormData.rentDueDay !== 'Custom' || leaseFormData.customDueDay) && (
                <div style={{ marginBottom: '24px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '700',
                    color: '#134e4a',
                    marginBottom: '8px'
                  }}>
                    On which date should the first rental invoice be due? *
                  </label>
                  <input
                    type="date"
                    value={leaseFormData.firstInvoiceDueDate}
                    onChange={(e) => handleLeaseFormUpdate('firstInvoiceDueDate', e.target.value)}
                    style={{
                      width: '100%',
                      border: '2px solid #99f6e4',
                      borderRadius: '8px',
                      padding: '10px 12px',
                      fontSize: '14px',
                      background: '#f0fdfa',
                      color: '#134e4a',
                      fontWeight: '600'
                    }}
                  />
                  <div style={{
                    fontSize: '12px',
                    color: '#14b8a6',
                    fontWeight: '600',
                    marginTop: '4px'
                  }}>
                    Subsequent invoices will follow the "Due on the" schedule you selected above.
                  </div>
                </div>
              )}

              {/* Add Additional Fee button - Shows after all main fields are filled */}
              {leaseFormData.paymentFrequency && leaseFormData.rentAmount && leaseFormData.rentDueDay && (leaseFormData.rentDueDay !== 'Custom' || leaseFormData.customDueDay) && leaseFormData.firstInvoiceDueDate && (
                <button
                  onClick={() => setShowAdditionalFeeModal(true)}
                  style={{
                    background: 'linear-gradient(135deg, #14b8a6 0%, #2dd4bf 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '10px 16px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 2px 8px rgba(20,184,166,0.3)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 4px 12px rgba(20,184,166,0.4)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 2px 8px rgba(20,184,166,0.3)';
                  }}
                >
                  + Add Additional Fee (Optional)
                </button>
              )}
            </div>
          </div>

          {/* Right side - Scheduled Invoices */}
          {leaseFormData.paymentFrequency && leaseFormData.rentAmount && leaseFormData.rentDueDay && (leaseFormData.rentDueDay !== 'Custom' || leaseFormData.customDueDay) && leaseFormData.firstInvoiceDueDate && (
            <div style={{ width: '400px' }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '700',
                color: '#134e4a',
                marginBottom: '16px'
              }}>
                Scheduled Invoices
              </h3>
              
              <div style={{
                background: 'white',
                border: '2px solid #ccfbf1',
                borderRadius: '12px',
                maxHeight: '500px',
                overflowY: 'auto',
                boxShadow: '0 4px 16px rgba(20,184,166,0.1)'
              }}>
                {/* Generate scheduled invoices based on form data */}
                {generateScheduledInvoices(leaseFormData, customInvoices).map((invoice, index) => (
                  <div key={invoice.id} style={{
                    padding: '16px',
                    borderBottom: index === generateScheduledInvoices(leaseFormData, customInvoices).length - 1 ? 'none' : '2px solid #f0fdfa',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = '#f0fdfa';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}>
                    {editingInvoice === index ? (
                      /* Edit mode */
                      <div style={{ flex: 1, display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <input
                          type="date"
                          defaultValue={invoice.rawDate.toISOString().split('T')[0]}
                          onChange={(e) => handleUpdateInvoice(index, 'date', e.target.value)}
                          style={{
                            border: '2px solid #99f6e4',
                            borderRadius: '6px',
                            padding: '4px 8px',
                            fontSize: '12px',
                            width: '120px',
                            background: '#f0fdfa',
                            color: '#134e4a',
                            fontWeight: '600'
                          }}
                        />
                        <input
                          type="text"
                          inputMode="decimal"
                          defaultValue={invoice.amount}
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9.]/g, '');
                            if (value.split('.').length <= 2) {
                              handleUpdateInvoice(index, 'amount', value);
                            }
                          }}
                          onBlur={(e) => {
                            const num = parseFloat(e.target.value);
                            if (!isNaN(num) && num > 0) {
                              e.target.value = num.toFixed(2);
                            }
                          }}
                          style={{
                            border: '2px solid #99f6e4',
                            borderRadius: '6px',
                            padding: '4px 8px',
                            fontSize: '12px',
                            width: '80px',
                            boxSizing: 'border-box',
                            background: '#f0fdfa',
                            color: '#134e4a',
                            fontWeight: '600'
                          }}
                        />
                        <button
                          onClick={() => setEditingInvoice(null)}
                          style={{
                            background: 'linear-gradient(135deg, #14b8a6 0%, #2dd4bf 100%)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '6px 12px',
                            fontSize: '12px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            boxShadow: '0 2px 6px rgba(20,184,166,0.3)'
                          }}
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      /* View mode */
                      <>
                        <div style={{ flex: 1 }}>
                          <div style={{
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#14b8a6',
                            marginBottom: '4px'
                          }}>
                            {invoice.date}
                          </div>
                          <div style={{
                            fontSize: '16px',
                            fontWeight: '700',
                            color: '#134e4a'
                          }}>
                            ${invoice.amount}
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button 
                            onClick={() => handleEditInvoice(index)}
                            style={{
                              background: '#f0fdfa',
                              border: '2px solid #99f6e4',
                              borderRadius: '6px',
                              padding: '6px 12px',
                              fontSize: '12px',
                              fontWeight: '600',
                              cursor: 'pointer',
                              color: '#14b8a6',
                              transition: 'all 0.2s ease'
                            }}
                            onMouseOver={(e) => {
                              e.target.style.background = '#ccfbf1';
                              e.target.style.borderColor = '#14b8a6';
                            }}
                            onMouseOut={(e) => {
                              e.target.style.background = '#f0fdfa';
                              e.target.style.borderColor = '#99f6e4';
                            }}
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDeleteInvoice(index)}
                            style={{
                              background: 'white',
                              border: '2px solid #fecaca',
                              borderRadius: '6px',
                              padding: '6px 12px',
                              fontSize: '12px',
                              fontWeight: '600',
                              cursor: 'pointer',
                              color: '#ef4444',
                              transition: 'all 0.2s ease'
                            }}
                            onMouseOver={(e) => {
                              e.target.style.background = '#fee2e2';
                              e.target.style.borderColor = '#ef4444';
                            }}
                            onMouseOut={(e) => {
                              e.target.style.background = 'white';
                              e.target.style.borderColor = '#fecaca';
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Additional Fee Modal */}
          {showAdditionalFeeModal && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000
            }}>
              <div style={{
                background: 'white',
                borderRadius: '8px',
                padding: '24px',
                width: '500px',
                maxHeight: '80vh',
                overflowY: 'auto'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '24px'
                }}>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#374151',
                    margin: 0
                  }}>
                    Add Additional Fee
                  </h3>
                  <button
                    onClick={() => setShowAdditionalFeeModal(false)}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: '20px',
                      cursor: 'pointer',
                      color: '#6b7280'
                    }}
                  >
                    ×
                  </button>
                </div>

                <div style={{
                  fontSize: '14px',
                  color: '#6b7280',
                  marginBottom: '24px',
                  padding: '12px',
                  background: '#f9fafb',
                  borderRadius: '6px',
                  border: '1px solid #e5e7eb'
                }}>
                  💡 Add additional fees like pet fees, parking fees, or utility charges to your lease.
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '12px'
                }}>
                  <button
                    onClick={() => setShowAdditionalFeeModal(false)}
                    style={{
                      background: '#6b7280',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '10px 20px',
                      fontSize: '14px',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setShowAdditionalFeeModal(false)}
                    style={{
                      background: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '10px 20px',
                      fontSize: '14px',
                      cursor: 'pointer'
                    }}
                  >
                    Add Fee
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    case 5:
      return (
        <div style={{ padding: '24px' }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#134e4a',
            marginBottom: '24px'
          }}>
            Add Tenants
          </h2>
          
          <div style={{
            background: 'white',
            border: '2px solid #ccfbf1',
            borderRadius: '12px',
            padding: '24px',
            maxWidth: '900px',
            boxShadow: '0 4px 16px rgba(20,184,166,0.1)'
          }}>
            {/* Tenant List */}
            {leaseFormData.tenants && leaseFormData.tenants.length > 0 && (
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: '700',
                  color: '#134e4a',
                  marginBottom: '16px'
                }}>
                  Added Tenants ({leaseFormData.tenants.length})
                </h3>
                
                <div style={{
                  border: '2px solid #ccfbf1',
                  borderRadius: '8px',
                  overflow: 'hidden'
                }}>
                  {/* Header */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '150px 150px 200px 150px 120px 120px 100px',
                    gap: '16px',
                    padding: '12px 16px',
                    background: 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%)',
                    borderBottom: '2px solid #99f6e4',
                    fontSize: '12px',
                    fontWeight: '700',
                    color: '#134e4a'
                  }}>
                    <div>First Name</div>
                    <div>Last Name</div>
                    <div>Email</div>
                    <div>Phone Number</div>
                    <div>Screening</div>
                    <div>Application Status</div>
                    <div>Actions</div>
                  </div>
                  
                  {/* Tenant Rows */}
                  {leaseFormData.tenants.map((tenant, index) => (
                    <div key={index} style={{
                      display: 'grid',
                      gridTemplateColumns: '150px 150px 200px 150px 120px 120px 100px',
                      gap: '16px',
                      padding: '12px 16px',
                      borderBottom: index === leaseFormData.tenants.length - 1 ? 'none' : '2px solid #f0fdfa',
                      alignItems: 'center',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = '#f0fdfa';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = 'white';
                    }}>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#134e4a' }}>{tenant.firstName}</div>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#134e4a' }}>{tenant.lastName}</div>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#14b8a6' }}>{tenant.email}</div>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#14b8a6' }}>{tenant.phoneNumber}</div>
                      <div>
                        <select
                          value={tenant.screening}
                          onChange={(e) => handleLeaseFormUpdate('tenants', leaseFormData.tenants.map((t, i) => 
                            i === index ? { ...t, screening: e.target.value } : t
                          ))}
                          style={{
                            width: '100%',
                            border: '2px solid #99f6e4',
                            borderRadius: '6px',
                            padding: '4px 8px',
                            fontSize: '12px',
                            background: '#f0fdfa',
                            color: '#134e4a',
                            fontWeight: '600',
                            cursor: 'pointer'
                          }}
                        >
                          <option value="">Not Required</option>
                          <option value="Basic">Basic Package</option>
                        </select>
                      </div>
                      <div style={{ fontSize: '12px', fontWeight: '600', color: '#14b8a6' }}>
                        {tenant.applicationStatus || 'No Applied Yet'}
                      </div>
                      <div>
                        <button
                          onClick={() => {
                            const updatedTenants = leaseFormData.tenants.filter((_, i) => i !== index);
                            handleLeaseFormUpdate('tenants', updatedTenants);
                          }}
                          style={{
                            background: 'white',
                            color: '#dc2626',
                            border: '2px solid #fecaca',
                            borderRadius: '6px',
                            padding: '6px 12px',
                            fontSize: '12px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseOver={(e) => {
                            e.target.style.background = '#fee2e2';
                            e.target.style.borderColor = '#ef4444';
                          }}
                          onMouseOut={(e) => {
                            e.target.style.background = 'white';
                            e.target.style.borderColor = '#fecaca';
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add New Tenant Form */}
            <div style={{
              border: '2px solid #ccfbf1',
              borderRadius: '8px',
              padding: '20px',
              background: '#f0fdfa'
            }}>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '700',
                color: '#134e4a',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                👥 Add Another Tenant
              </h3>
              
              {(() => {
                const TenantInputs = () => {
                  const firstNameRef = React.useRef();
                  const lastNameRef = React.useRef();
                  const emailRef = React.useRef();
                  const phoneRef = React.useRef();
                  
                  // Store refs in window so button can access them
                  React.useEffect(() => {
                    window.__tenantFormRefs = {
                      firstNameRef,
                      lastNameRef,
                      emailRef,
                      phoneRef
                    };
                  }, []);
                  
                  return (
                    <>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '16px',
                        marginBottom: '16px'
                      }}>
                        <div>
                          <label style={{
                            display: 'block',
                            fontSize: '14px',
                            fontWeight: '700',
                            color: '#134e4a',
                            marginBottom: '4px'
                          }}>
                            First Name *
                          </label>
                          <input
                            ref={firstNameRef}
                            type="text"
                            defaultValue=""
                            placeholder="First Name"
                            style={{
                              width: '100%',
                              border: '2px solid #99f6e4',
                              borderRadius: '8px',
                              padding: '8px 12px',
                              fontSize: '14px',
                              background: 'white',
                              color: '#134e4a',
                              fontWeight: '600'
                            }}
                          />
                        </div>
                        
                        <div>
                          <label style={{
                            display: 'block',
                            fontSize: '14px',
                            fontWeight: '700',
                            color: '#134e4a',
                            marginBottom: '4px'
                          }}>
                            Last Name *
                          </label>
                          <input
                            ref={lastNameRef}
                            type="text"
                            defaultValue=""
                            placeholder="Last Name"
                            style={{
                              width: '100%',
                              border: '2px solid #99f6e4',
                              borderRadius: '8px',
                              padding: '8px 12px',
                              fontSize: '14px',
                              background: 'white',
                              color: '#134e4a',
                              fontWeight: '600'
                            }}
                          />
                        </div>
                      </div>

                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '16px',
                        marginBottom: '16px'
                      }}>
                        <div>
                          <label style={{
                            display: 'block',
                            fontSize: '14px',
                            fontWeight: '700',
                            color: '#134e4a',
                            marginBottom: '4px'
                          }}>
                            Email *
                          </label>
                          <input
                            ref={emailRef}
                            type="email"
                            defaultValue=""
                            placeholder="Email"
                            style={{
                              width: '100%',
                              border: '2px solid #99f6e4',
                              borderRadius: '8px',
                              padding: '8px 12px',
                              fontSize: '14px',
                              background: 'white',
                              color: '#134e4a',
                              fontWeight: '600'
                            }}
                          />
                        </div>
                        
                        <div>
                          <label style={{
                            display: 'block',
                            fontSize: '14px',
                            fontWeight: '700',
                            color: '#134e4a',
                            marginBottom: '4px'
                          }}>
                            Phone Number *
                          </label>
                          <input
                            ref={phoneRef}
                            type="tel"
                            defaultValue=""
                            placeholder="Phone Number"
                            style={{
                              width: '100%',
                              border: '2px solid #99f6e4',
                              borderRadius: '8px',
                              padding: '8px 12px',
                              fontSize: '14px',
                              background: 'white',
                              color: '#134e4a',
                              fontWeight: '600'
                            }}
                          />
                        </div>
                      </div>
                    </>
                  );
                };
                return <TenantInputs key={tenantFormKey} />;
              })()}

              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '700',
                  color: '#134e4a',
                  marginBottom: '4px'
                }}>
                  Screening
                </label>
                <select
                  value={leaseFormData.newTenant?.screening || ''}
                  onChange={(e) => handleLeaseFormUpdate('newTenant', {
                    ...leaseFormData.newTenant,
                    screening: e.target.value
                  })}
                  style={{
                    width: '200px',
                    border: '2px solid #99f6e4',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    fontSize: '14px',
                    background: 'white',
                    color: '#134e4a',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  <option value="">Not Required</option>
                  <option value="Basic">Basic Package</option>
                </select>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{
                  fontSize: '12px',
                  color: '#14b8a6',
                  fontWeight: '600',
                  background: '#fff',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '2px solid #ccfbf1'
                }}>
                  💡 You can add multiple tenants to this lease
                </div>
                
                <button
                  onClick={() => {
                    // Get values from uncontrolled inputs via refs
                    const refs = window.__tenantFormRefs;
                    if (refs) {
                      const firstName = refs.firstNameRef.current?.value?.trim() || '';
                      const lastName = refs.lastNameRef.current?.value?.trim() || '';
                      const email = refs.emailRef.current?.value?.trim() || '';
                      const phoneNumber = refs.phoneRef.current?.value?.trim() || '';
                      
                      if (firstName && lastName && email && phoneNumber) {
                        const updatedTenants = [...(leaseFormData.tenants || []), {
                          firstName,
                          lastName,
                          email,
                          phoneNumber,
                          applicationStatus: 'No Applied Yet'
                        }];
                        handleLeaseFormUpdate('tenants', updatedTenants);
                        setTenantFormKey(prev => prev + 1); // Force re-render to clear inputs
                      } else {
                        alert('Please fill in all tenant fields (First Name, Last Name, Email, Phone Number)');
                      }
                    }
                  }}
                  style={{
                    background: 'linear-gradient(135deg, #14b8a6 0%, #2dd4bf 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '10px 20px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 2px 8px rgba(20,184,166,0.3)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 4px 12px rgba(20,184,166,0.4)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 2px 8px rgba(20,184,166,0.3)';
                  }}
                >
                  + Add Another Tenant
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    case 6:
      return (
        <div style={{ padding: '24px' }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#134e4a',
            marginBottom: '24px'
          }}>
            Rent/Deposit Sharing
          </h2>
          
          <div style={{
            background: 'white',
            border: '2px solid #ccfbf1',
            borderRadius: '12px',
            padding: '24px',
            maxWidth: '800px',
            boxShadow: '0 4px 16px rgba(20,184,166,0.1)'
          }}>
            {/* Sharing Options */}
            <div style={{ marginBottom: '32px' }}>
              <div style={{
                display: 'flex',
                gap: '24px',
                marginBottom: '24px'
              }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer'
                }}>
                  <input
                    type="radio"
                    name="sharingType"
                    value="equal"
                    checked={leaseFormData.sharingType === 'equal'}
                    onChange={(e) => handleLeaseFormUpdate('sharingType', e.target.value)}
                    style={{ width: '16px', height: '16px', accentColor: '#14b8a6', cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#134e4a' }}>
                    All tenants are equally responsible
                  </span>
                  <span style={{
                    background: '#ccfbf1',
                    color: '#14b8a6',
                    fontSize: '12px',
                    fontWeight: '600',
                    padding: '2px 6px',
                    borderRadius: '12px',
                    marginLeft: '8px'
                  }}>
                    ℹ️
                  </span>
                </label>
                
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer'
                }}>
                  <input
                    type="radio"
                    name="sharingType"
                    value="individual"
                    checked={leaseFormData.sharingType === 'individual'}
                    onChange={(e) => handleLeaseFormUpdate('sharingType', e.target.value)}
                    style={{ width: '16px', height: '16px', accentColor: '#14b8a6', cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#134e4a' }}>
                    Each tenant is only responsible for his/her portion
                  </span>
                  <span style={{
                    background: '#ccfbf1',
                    color: '#14b8a6',
                    fontSize: '12px',
                    fontWeight: '600',
                    padding: '2px 6px',
                    borderRadius: '12px',
                    marginLeft: '8px'
                  }}>
                    ℹ️
                  </span>
                </label>
              </div>
            </div>

            {/* All Tenants Equally Responsible */}
            {leaseFormData.sharingType === 'equal' && (
              <div style={{ marginBottom: '32px' }}>
                <div style={{
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '20px',
                  background: '#f9fafb'
                }}>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '24px',
                    marginBottom: '20px'
                  }}>
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#374151',
                        marginBottom: '8px'
                      }}>
                        How much rent will you collect? *
                      </label>
                      {(() => {
                        const EqualRentInput = () => {
                          const [localValue, setLocalValue] = React.useState(leaseFormData.equalRentAmount || leaseFormData.rentAmount || '');
                          
                          React.useEffect(() => {
                            setLocalValue(leaseFormData.equalRentAmount || leaseFormData.rentAmount || '');
                          }, [leaseFormData.equalRentAmount, leaseFormData.rentAmount]);
                          
                          return (
                            <div style={{ position: 'relative' }}>
                              <span style={{
                                position: 'absolute',
                                left: '12px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: '#6b7280',
                                fontSize: '14px',
                                zIndex: 1
                              }}>
                                $
                              </span>
                              <input
                                type="text"
                                inputMode="decimal"
                                value={localValue}
                                onChange={(e) => {
                                  const value = e.target.value.replace(/[^0-9.]/g, '');
                                  if (value.split('.').length <= 2) {
                                    setLocalValue(value);
                                  }
                                }}
                                onBlur={(e) => {
                                  const value = e.target.value;
                                  if (value) {
                                    const num = parseFloat(value);
                                    if (!isNaN(num) && num > 0) {
                                      const formatted = num.toFixed(2);
                                      setLocalValue(formatted);
                                      handleLeaseFormUpdate('equalRentAmount', formatted);
                                    }
                                  } else {
                                    handleLeaseFormUpdate('equalRentAmount', '');
                                  }
                                }}
                                placeholder="0.00"
                                style={{
                                  width: '100%',
                                  border: '1px solid #d1d5db',
                                  borderRadius: '6px',
                                  padding: '10px 12px 10px 32px',
                                  fontSize: '14px',
                                  background: 'white'
                                }}
                              />
                            </div>
                          );
                        };
                        return <EqualRentInput />;
                      })()}
                    </div>

                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#374151',
                        marginBottom: '8px'
                      }}>
                        What % of the deposit will you collect? *
                      </label>
                      {(() => {
                        const DepositPercentageInput = () => {
                          const [localValue, setLocalValue] = React.useState(leaseFormData.depositPercentage || '100');
                          
                          React.useEffect(() => {
                            setLocalValue(leaseFormData.depositPercentage || '100');
                          }, [leaseFormData.depositPercentage]);
                          
                          return (
                            <div style={{ position: 'relative' }}>
                              <input
                                type="text"
                                inputMode="numeric"
                                value={localValue}
                                onChange={(e) => {
                                  const value = e.target.value.replace(/[^0-9]/g, '');
                                  const num = parseInt(value);
                                  if (value === '' || (num >= 0 && num <= 100)) {
                                    setLocalValue(value);
                                  }
                                }}
                                onBlur={(e) => {
                                  handleLeaseFormUpdate('depositPercentage', e.target.value);
                                }}
                                placeholder="100"
                                style={{
                                  width: '100%',
                                  maxWidth: '150px',
                                  boxSizing: 'border-box',
                                  border: '1px solid #d1d5db',
                                  borderRadius: '6px',
                                  padding: '10px 32px 10px 12px',
                                  fontSize: '14px',
                                  background: 'white'
                                }}
                              />
                              <span style={{
                                position: 'absolute',
                                right: '12px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: '#6b7280',
                                fontSize: '14px',
                                pointerEvents: 'none'
                              }}>
                                %
                              </span>
                            </div>
                          );
                        };
                        return <DepositPercentageInput />;
                      })()}
                    </div>
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer'
                    }}>
                      <input
                        type="checkbox"
                        checked={leaseFormData.allowPartialPayments || false}
                        onChange={(e) => handleLeaseFormUpdate('allowPartialPayments', e.target.checked)}
                        style={{ width: '16px', height: '16px' }}
                      />
                      <span style={{ fontSize: '14px', color: '#374151' }}>
                        Partial payments are acceptable on invoices
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Individual Responsibility */}
            {leaseFormData.sharingType === 'individual' && leaseFormData.tenants && leaseFormData.tenants.length > 0 && (
              <div>
                <div style={{
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  overflow: 'hidden'
                }}>
                  {/* Header */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '200px 150px 150px',
                    gap: '16px',
                    padding: '12px 16px',
                    background: '#f9fafb',
                    borderBottom: '1px solid #e5e7eb',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#6b7280'
                  }}>
                    <div>Tenants</div>
                    <div>Rent</div>
                    <div>Deposit</div>
                  </div>
                  
                  {/* Tenant Rows */}
                  {leaseFormData.tenants.map((tenant, index) => (
                    <div key={index} style={{
                      display: 'grid',
                      gridTemplateColumns: '200px 150px 150px',
                      gap: '16px',
                      padding: '12px 16px',
                      borderBottom: index === leaseFormData.tenants.length - 1 ? 'none' : '1px solid #f3f4f6',
                      alignItems: 'center'
                    }}>
                      <div style={{ fontSize: '14px', color: '#374151', fontWeight: '500' }}>
                        {tenant.firstName} {tenant.lastName}
                      </div>
                      {(() => {
                        const TenantRentPortionInput = ({ tenant, index }) => {
                          const [localValue, setLocalValue] = React.useState(tenant.rentPortion || '');
                          
                          React.useEffect(() => {
                            setLocalValue(tenant.rentPortion || '');
                          }, [tenant.rentPortion]);
                          
                          return (
                            <div style={{ position: 'relative' }}>
                              <span style={{
                                position: 'absolute',
                                left: '12px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: '#6b7280',
                                fontSize: '14px',
                                pointerEvents: 'none',
                                zIndex: 1
                              }}>
                                $
                              </span>
                              <input
                                type="text"
                                inputMode="decimal"
                                value={localValue}
                                onChange={(e) => {
                                  const value = e.target.value.replace(/[^0-9.]/g, '');
                                  if (value.split('.').length <= 2) {
                                    setLocalValue(value);
                                  }
                                }}
                                onBlur={(e) => {
                                  const value = e.target.value;
                                  if (value) {
                                    const num = parseFloat(value);
                                    if (!isNaN(num) && num > 0) {
                                      const formatted = num.toFixed(2);
                                      setLocalValue(formatted);
                                      handleLeaseFormUpdate('tenants', leaseFormData.tenants.map((t, i) => 
                                        i === index ? { ...t, rentPortion: formatted } : t
                                      ));
                                    }
                                  } else {
                                    handleLeaseFormUpdate('tenants', leaseFormData.tenants.map((t, i) => 
                                      i === index ? { ...t, rentPortion: '' } : t
                                    ));
                                  }
                                }}
                                placeholder="0.00"
                                style={{
                                  width: '100%',
                                  boxSizing: 'border-box',
                                  border: '1px solid #d1d5db',
                                  borderRadius: '6px',
                                  padding: '8px 12px 8px 28px',
                                  fontSize: '14px',
                                  background: 'white'
                                }}
                              />
                            </div>
                          );
                        };
                        return <TenantRentPortionInput tenant={tenant} index={index} />;
                      })()}
                      {(() => {
                        const TenantDepositPortionInput = ({ tenant, index }) => {
                          const [localValue, setLocalValue] = React.useState(tenant.depositPortion || '');
                          
                          React.useEffect(() => {
                            setLocalValue(tenant.depositPortion || '');
                          }, [tenant.depositPortion]);
                          
                          return (
                            <div style={{ position: 'relative' }}>
                              <span style={{
                                position: 'absolute',
                                left: '12px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: '#6b7280',
                                fontSize: '14px',
                                pointerEvents: 'none',
                                zIndex: 1
                              }}>
                                $
                              </span>
                              <input
                                type="text"
                                inputMode="decimal"
                                value={localValue}
                                onChange={(e) => {
                                  const value = e.target.value.replace(/[^0-9.]/g, '');
                                  if (value.split('.').length <= 2) {
                                    setLocalValue(value);
                                  }
                                }}
                                onBlur={(e) => {
                                  const value = e.target.value;
                                  if (value) {
                                    const num = parseFloat(value);
                                    if (!isNaN(num) && num > 0) {
                                      const formatted = num.toFixed(2);
                                      setLocalValue(formatted);
                                      handleLeaseFormUpdate('tenants', leaseFormData.tenants.map((t, i) => 
                                        i === index ? { ...t, depositPortion: formatted } : t
                                      ));
                                    }
                                  } else {
                                    handleLeaseFormUpdate('tenants', leaseFormData.tenants.map((t, i) => 
                                      i === index ? { ...t, depositPortion: '' } : t
                                    ));
                                  }
                                }}
                                placeholder="0.00"
                                style={{
                                  width: '100%',
                                  border: '1px solid #d1d5db',
                                  borderRadius: '6px',
                                  padding: '8px 12px 8px 28px',
                                  fontSize: '14px',
                                  background: 'white'
                                }}
                              />
                            </div>
                          );
                        };
                        return <TenantDepositPortionInput tenant={tenant} index={index} />;
                      })()}
                    </div>
                  ))}
                  
                  {/* Total Row */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '200px 150px 150px',
                    gap: '16px',
                    padding: '12px 16px',
                    background: '#f9fafb',
                    borderTop: '1px solid #e5e7eb',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151'
                  }}>
                    <div>Total</div>
                    <div>
                      $ {leaseFormData.tenants.reduce((sum, tenant) => sum + (parseFloat(tenant.rentPortion) || 0), 0).toFixed(2)}
                    </div>
                    <div>
                      $ {leaseFormData.tenants.reduce((sum, tenant) => sum + (parseFloat(tenant.depositPortion) || 0), 0).toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* Partial Payment Warning */}
                <div style={{
                  marginTop: '16px',
                  padding: '12px',
                  background: '#fef3c7',
                  border: '1px solid #f59e0b',
                  borderRadius: '6px',
                  fontSize: '14px',
                  color: '#92400e',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span>⚠️</span>
                  <div>
                    <strong>Partial Payment</strong><br />
                    Tenants are not permitted to submit partial payments on invoices.
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      );
    case 7:
      return (
        <div style={{ padding: '24px' }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '600',
            color: '#374151',
            marginBottom: '24px'
          }}>
            Sign and Share Documents
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '24px',
            maxWidth: '1200px'
          }}>
            {/* Send documents to sign */}
            <div style={{
              background: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '24px'
            }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '16px'
              }}>
                Send documents to sign
              </h3>
              
              <div style={{
                border: '2px dashed #d1d5db',
                borderRadius: '8px',
                padding: '40px',
                textAlign: 'center',
                background: '#f9fafb'
              }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  background: '#f3f4f6',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  fontSize: '24px'
                }}>
                  📄
                </div>
                
                <div style={{
                  fontSize: '14px',
                  color: '#374151',
                  marginBottom: '8px',
                  fontWeight: '500'
                }}>
                  Select a template to send and sign
                </div>
                
                <div style={{
                  fontSize: '12px',
                  color: '#6b7280',
                  marginBottom: '16px'
                }}>
                  📄 Add a Document
                </div>
                
                <button style={{
                  background: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '8px 16px',
                  fontSize: '12px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  margin: '0 auto'
                }}>
                  <span>➡️</span>
                </button>
              </div>
            </div>

            {/* Upload Documents to Share */}
            <div style={{
              background: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '24px'
            }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '16px'
              }}>
                Upload Documents to Share
              </h3>
              
              <div style={{
                border: '2px dashed #d1d5db',
                borderRadius: '8px',
                padding: '40px',
                textAlign: 'center',
                background: '#f9fafb'
              }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  background: '#f3f4f6',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  fontSize: '24px'
                }}>
                  📤
                </div>
                
                <div style={{
                  fontSize: '14px',
                  color: '#374151',
                  marginBottom: '8px',
                  fontWeight: '500'
                }}>
                  Drag & Drop
                </div>
                
                <div style={{
                  fontSize: '12px',
                  color: '#6b7280',
                  marginBottom: '16px'
                }}>
                  Upload any previously signed agreement (like a lease) or if you need to share files a new document.
                </div>
                
                <div style={{
                  fontSize: '12px',
                  color: '#6b7280',
                  marginBottom: '16px'
                }}>
                  Formats supported are any office file or .rar, .zip, etc (max 25MB):
                </div>
                
                <button style={{
                  background: '#f3f4f6',
                  color: '#374151',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  padding: '8px 16px',
                  fontSize: '12px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}>
                  Browse Files
                </button>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div style={{
            marginTop: '24px',
            padding: '16px',
            background: '#f0f9ff',
            border: '1px solid #bfdbfe',
            borderRadius: '8px',
            fontSize: '14px',
            color: '#1e40af'
          }}>
            💡 <strong>Tip:</strong> You can upload lease documents, property rules, tenant handbooks, or any other documents you want to share with your tenants.
          </div>
        </div>
      );
    default:
      return (
        <div style={{ padding: '24px' }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '600',
            color: '#374151',
            marginBottom: '24px'
          }}>
            {steps[step]?.title}
          </h2>
          <div style={{
            background: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '24px',
            textAlign: 'center',
            color: '#6b7280'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚧</div>
            <div>This step is under construction</div>
          </div>
        </div>
      );
  }
}

  const handlePropertySelect = (property) => {
    setSelectedProperty(property);
    // Auto-populate form data when property is selected
    setLeaseFormData(prev => ({
      ...prev,
      selectedUnit: `${property.name} - ${property.type}`
    }));
  };

  const handleLeaseTermSelect = (leaseType) => {
    setLeaseFormData(prev => ({
      ...prev,
      leaseType: leaseType
    }));
  };

  const handleLeaseFormUpdate = (field, value) => {
    setLeaseFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEditInvoice = (invoiceIndex) => {
    setEditingInvoice(invoiceIndex);
  };

  const handleDeleteInvoice = (invoiceIndex) => {
    // In a real app, you might want to show a confirmation dialog
    // For now, just log the action
  };

  const handleUpdateInvoice = (invoiceIndex, field, value) => {
    // Update specific invoice field
    setCustomInvoices(prevCustom => ({
      ...prevCustom,
      [invoiceIndex]: {
        ...prevCustom[invoiceIndex],
        [field]: value
      }
    }));
  };

  // Function to handle lease creation - NOW WITH SUPABASE
  const handleCreateLease = async () => {
    if (!leaseService) {
      alert('Database connection not ready. Please try again.');
      return;
    }

    try {
      // Validate we have at least one tenant
      if (!leaseFormData.tenants || leaseFormData.tenants.length === 0) {
        alert('Please add at least one tenant before creating the lease.');
        return;
      }

      const startDate = leaseFormData.startDate ? new Date(leaseFormData.startDate) : new Date();
      
      // Calculate end date based on lease type
      let endDate;
      if (leaseFormData.leaseType === 'month-to-month') {
        // For month-to-month, set end date to 1 month from start
        endDate = new Date(startDate);
        endDate.setMonth(startDate.getMonth() + 1);
      } else if (leaseFormData.endDate) {
        // Use the end date from the form
        endDate = new Date(leaseFormData.endDate);
      } else {
        // Default to 1 year lease for fixed term
        endDate = new Date(startDate);
        endDate.setFullYear(startDate.getFullYear() + 1);
      }

      // Step 1: Create tenant records in the database
      console.log('Creating tenants...', leaseFormData.tenants);
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
        
        console.log('Creating tenant:', tenantData);
        const { data: newTenant, error: tenantError } = await supabase
          .from('tenants')
          .insert([tenantData])
          .select()
          .single();
          
        if (tenantError) {
          console.error('Error creating tenant:', tenantError);
          throw new Error(`Failed to create tenant ${tenant.firstName} ${tenant.lastName}: ${tenantError.message}`);
        }
        
        console.log('Tenant created:', newTenant);
        createdTenants.push(newTenant);
      }

      // Step 2: Get the selected unit ID
      const unitId = leaseFormData.selectedUnit;
      console.log('Selected unit ID:', unitId);
      console.log('Selected property:', selectedProperty);
      
      if (!unitId) {
        throw new Error('No unit selected. Please select a unit before creating the lease.');
      }

      // Step 3: Prepare lease data for Supabase (use first tenant as primary)
      const leaseData = {
        organization_id: organizationId,
        property_id: selectedProperty?.id,
        unit_id: unitId,
        tenant_id: createdTenants[0].id, // Use first tenant as primary tenant
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
          equalRentAmount: leaseFormData.equalRentAmount,
          depositCollected: leaseFormData.depositCollected,
          allowPartialPayments: leaseFormData.allowPartialPayments,
          securityDepositDue: leaseFormData.securityDepositDue,
          allTenants: createdTenants.map(t => ({
            id: t.id,
            firstName: t.first_name,
            lastName: t.last_name,
            email: t.email,
            phone: t.phone,
            rentPortion: leaseFormData.tenants.find(ft => ft.firstName === t.first_name && ft.lastName === t.last_name)?.rentPortion,
            depositPortion: leaseFormData.tenants.find(ft => ft.firstName === t.first_name && ft.lastName === t.last_name)?.depositPortion
          }))
        })
      };

      console.log('Creating lease with data:', leaseData);

      // Step 4: Save lease to Supabase
      const { data: newLease, error: leaseError } = await supabase
        .from('leases')
        .insert([leaseData])
        .select()
        .single();
        
      if (leaseError) {
        console.error('Error creating lease:', leaseError);
        throw new Error(`Failed to create lease: ${leaseError.message}`);
      }
      
      console.log('Lease created successfully:', newLease);

      // Show success message
      alert('Lease created successfully!');
      
      // Re-fetch all leases to get complete data with property/unit info
      try {
        const updatedLeases = await leaseService.getAllLeases();
        setCreatedLeases(updatedLeases);
      } catch (error) {
        console.error('Error refreshing leases:', error);
        // Still add the new lease even if refresh fails
        setCreatedLeases(prev => [newLease, ...prev]);
      }
      
      // Reset the wizard
      setShowNewLeaseWizard(false);
      setShowReviewPage(false);
      setCurrentStep(0);
      setLeaseFormData({
        selectedUnit: '',
        leaseTermType: 'New Term',
        leaseType: '',
        startDate: '',
        securityDepositAmount: '',
        securityDepositDue: '',
        depositCollected: false,
        rentAmount: '',
        paymentFrequency: '',
        rentDueDay: '',
        customDueDay: '',
        firstInvoiceDueDate: '',
        showAdditionalFees: false,
        tenants: [],
        newTenant: {},
        sharingType: 'equal',
        equalRentAmount: '',
        depositPercentage: '100',
        allowPartialPayments: false,
        tenantsCount: '',
        scheduledInvoices: []
      });
      setSelectedProperty(null);
    } catch (error) {
      alert(`Failed to create lease: ${error.message}`);
    }
  };

  const handleNextStep = () => {
    // Validate current step before allowing progression
    let isStepValid = false;
    
    switch (currentStep) {
      case 0: // Property Details
        isStepValid = selectedProperty !== null;
        if (!isStepValid) {
          alert('Please select a property before proceeding.');
        }
        break;
      case 1: // Unit & Lease Type Selection
        if (!leaseFormData.leaseType) {
          alert('Please select a lease type (Fixed Term or Month-to-Month).');
          isStepValid = false;
        } else if (!leaseFormData.selectedUnit) {
          alert('Please select a unit before proceeding.');
          isStepValid = false;
        } else {
          isStepValid = true;
        }
        break;
      case 2: // Lease Dates
        if (!leaseFormData.startDate) {
          alert('Please select a lease start date.');
          isStepValid = false;
        } else if (leaseFormData.leaseType === 'fixed' && !leaseFormData.endDate) {
          alert('Please select a lease end date for fixed-term leases.');
          isStepValid = false;
        } else {
          isStepValid = true;
        }
        break;
      case 3: // Security Deposit
        if (!leaseFormData.securityDepositAmount) {
          alert('Please enter a security deposit amount.');
          isStepValid = false;
        } else if (!leaseFormData.securityDepositDue) {
          alert('Please select a security deposit due date.');
          isStepValid = false;
        } else {
          isStepValid = true;
        }
        break;
      case 4: // Rent/Additional Fee
        isStepValid = leaseFormData.rentAmount !== '' && leaseFormData.paymentFrequency !== '';
        if (!isStepValid) {
          alert('Please enter rent amount and payment frequency.');
        }
        break;
      case 5: // Add Tenants
        isStepValid = leaseFormData.tenants.length > 0;
        if (!isStepValid) {
          alert('Please add at least one tenant.');
        }
        break;
      case 6: // Rent/Deposit Sharing
        isStepValid = true; // Optional step, can skip
        break;
      case 7: // Lease/Documents
        isStepValid = true; // Optional step, can skip
        break;
      default:
        isStepValid = true;
    }
    
    if (!isStepValid) {
      // Show error message
      alert('Please complete all required fields before proceeding to the next step.');
      return;
    }
    
    if (currentStep < steps.length - 1) {
      // Mark current step as completed when moving to next step
      setSteps(prevSteps => 
        prevSteps.map((step, index) => 
          index === currentStep ? { ...step, completed: true } : step
        )
      );
      
      setCurrentStep(currentStep + 1);
    } else {
      // On last step, go to review page
      setSteps(prevSteps => 
        prevSteps.map((step, index) => 
          index === currentStep ? { ...step, completed: true } : step
        )
      );
      setShowReviewPage(true);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // If showing lease detail view - now as split screen
  const renderLeaseDetailPanel = () => {
    if (!selectedLeaseDetail) return null;
    
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        right: 0,
        width: isMobile ? '100%' : '65%',
        height: '100vh',
        background: '#f8fafc',
        borderLeft: '2px solid #e5e7eb',
        boxShadow: '-4px 0 20px rgba(0,0,0,0.08)',
        overflow: 'auto',
        zIndex: 100
      }}>
        {/* Header Bar */}
        <div style={{
          position: 'sticky',
          top: 0,
          background: 'white',
          borderBottom: '2px solid #e5e7eb',
          padding: '20px 32px',
          zIndex: 10,
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <button
                onClick={() => setSelectedLeaseDetail(null)}
                style={{
                  background: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  width: '36px',
                  height: '36px',
                  cursor: 'pointer',
                  color: '#6b7280',
                  fontSize: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '600',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.background = '#f9fafb';
                  e.target.style.borderColor = '#14b8a6';
                  e.target.style.color = '#14b8a6';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = 'white';
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.color = '#6b7280';
                }}
              >
                ←
              </button>
              <div>
                <h1 style={{
                  fontSize: '22px',
                  fontWeight: '700',
                  color: '#134e4a',
                  margin: 0,
                  marginBottom: '4px'
                }}>
                  Lease Detail
                </h1>
                <div style={{ fontSize: '13px', color: '#6b7280', fontWeight: '500' }}>
                  {selectedLeaseDetail.property} | Unit {selectedLeaseDetail.unit}
                </div>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '12px' }}>
              <button style={{
                background: 'white',
                border: '1.5px solid #e5e7eb',
                borderRadius: '8px',
                padding: '10px 20px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                color: '#374151',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.background = '#f9fafb';
                e.target.style.borderColor = '#14b8a6';
                e.target.style.color = '#14b8a6';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'white';
                e.target.style.borderColor = '#e5e7eb';
                e.target.style.color = '#374151';
              }}>
                Edit Lease
              </button>
              <button style={{
                background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '10px 20px',
                fontSize: '14px',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(20,184,166,0.3)',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)';
                e.target.style.boxShadow = '0 4px 12px rgba(20,184,166,0.4)';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)';
                e.target.style.boxShadow = '0 2px 8px rgba(20,184,166,0.3)';
              }}>
                + New Document
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ padding: '24px 32px' }}>
          {/* Top Info Card */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            padding: '24px',
            marginBottom: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
              <span style={{
                background: selectedLeaseDetail.status === 'Active' ? '#dcfce7' : 
                            selectedLeaseDetail.status === 'In Process' ? '#dbeafe' : '#fee2e2',
                color: selectedLeaseDetail.status === 'Active' ? '#16a34a' : 
                       selectedLeaseDetail.status === 'In Process' ? '#2563eb' : '#dc2626',
                fontSize: '12px',
                padding: '6px 14px',
                borderRadius: '20px',
                fontWeight: '700',
                display: 'inline-block',
                textTransform: 'uppercase'
              }}>
                {selectedLeaseDetail.status}
              </span>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px' }}>
              <div>
                <div style={{
                  fontSize: '11px',
                  fontWeight: '700',
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '6px'
                }}>
                  Lease Period
                </div>
                <div style={{
                  fontSize: '15px',
                  fontWeight: '600',
                  color: '#134e4a'
                }}>
                  {selectedLeaseDetail.start} - M to M
                </div>
              </div>
              
              <div>
                <div style={{
                  fontSize: '11px',
                  fontWeight: '700',
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '6px'
                }}>
                  Monthly Rent
                </div>
                <div style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  color: '#134e4a'
                }}>
                  {selectedLeaseDetail.rent}
                </div>
                <div style={{
                  fontSize: '12px',
                  color: '#6b7280',
                  marginTop: '2px'
                }}>
                  Due on the 1st of every month
                </div>
              </div>
              
              <div>
                <div style={{
                  fontSize: '11px',
                  fontWeight: '700',
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '6px'
                }}>
                  Property
                </div>
                <div style={{
                  fontSize: '15px',
                  fontWeight: '600',
                  color: '#134e4a'
                }}>
                  {selectedLeaseDetail.property}
                </div>
                <div style={{
                  fontSize: '13px',
                  color: '#14b8a6',
                  fontWeight: '500',
                  marginTop: '2px'
                }}>
                  Unit {selectedLeaseDetail.unit}
                </div>
              </div>
            </div>
          </div>

          {/* Open Documents Section */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            marginBottom: '20px',
            overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}>
            {/* Section Header */}
            <div style={{
              background: '#f9fafb',
              padding: '16px 20px',
              borderBottom: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{
                fontSize: '14px',
                fontWeight: '700',
                color: '#134e4a',
                textTransform: 'uppercase',
                letterSpacing: '0.03em'
              }}>
                ▼ OPEN DOCUMENTS (1)
              </div>
            </div>

            {/* Document Subsection */}
            <div style={{
              borderBottom: '1px solid #f3f4f6'
            }}>
              <div style={{
                background: '#fafafa',
                padding: '12px 20px',
                borderBottom: '1px solid #e5e7eb',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{
                  fontSize: '12px',
                  fontWeight: '700',
                  color: '#6b7280',
                  textTransform: 'uppercase'
                }}>
                  ► LEASE DOCUMENT • 1 Tenant
                </div>
                <button style={{
                  background: '#14b8a6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '8px 16px',
                  fontSize: '12px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.background = '#0d9488';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = '#14b8a6';
                }}>
                  Sign Now
                </button>
              </div>

              {/* Tenant Row with Status Timeline */}
              <div style={{
                padding: '20px',
                background: 'white'
              }}>
                {/* Table Header */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '200px 150px 300px 150px',
                  gap: '20px',
                  paddingBottom: '12px',
                  borderBottom: '1px solid #f3f4f6',
                  marginBottom: '16px'
                }}>
                  <div style={{
                    fontSize: '11px',
                    fontWeight: '700',
                    color: '#6b7280',
                    textTransform: 'uppercase'
                  }}>
                    Tenant
                  </div>
                  <div style={{
                    fontSize: '11px',
                    fontWeight: '700',
                    color: '#6b7280',
                    textTransform: 'uppercase'
                  }}>
                    Last Activity
                  </div>
                  <div style={{
                    fontSize: '11px',
                    fontWeight: '700',
                    color: '#6b7280',
                    textTransform: 'uppercase'
                  }}>
                    Status
                  </div>
                  <div style={{
                    fontSize: '11px',
                    fontWeight: '700',
                    color: '#6b7280',
                    textTransform: 'uppercase'
                  }}>
                    Insurance Status
                  </div>
                </div>

                {/* Table Row */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '200px 150px 300px 150px',
                  gap: '20px',
                  alignItems: 'center'
                }}>
                  {/* Tenant Info */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      background: 'linear-gradient(135deg, #14b8a6 0%, #2dd4bf 100%)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: '700',
                      fontSize: '13px',
                      flexShrink: 0
                    }}>
                      {selectedLeaseDetail.tenantsDetails?.[0]?.firstName?.[0]}{selectedLeaseDetail.tenantsDetails?.[0]?.lastName?.[0]}
                    </div>
                    <div>
                      <div style={{
                        fontSize: '13px',
                        fontWeight: '600',
                        color: '#134e4a'
                      }}>
                        {selectedLeaseDetail.tenantsDetails?.[0]?.firstName} {selectedLeaseDetail.tenantsDetails?.[0]?.lastName}
                      </div>
                      <div style={{
                        fontSize: '12px',
                        color: '#6b7280'
                      }}>
                        {selectedLeaseDetail.tenantsDetails?.[0]?.email}
                      </div>
                    </div>
                  </div>

                  {/* Last Activity */}
                  <div>
                    <div style={{
                      fontSize: '13px',
                      color: '#374151',
                      fontWeight: '500'
                    }}>
                      Jan 30, 2025 | 9:05 AM
                    </div>
                  </div>

                  {/* Status Timeline - Horizontal with colored circles */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    {/* Sent */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        background: '#22c55e',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '14px',
                        fontWeight: '700',
                        border: '3px solid #dcfce7'
                      }}>
                        ✓
                      </div>
                      <div style={{
                        fontSize: '10px',
                        color: '#6b7280',
                        fontWeight: '600',
                        textAlign: 'center'
                      }}>
                        Sent
                      </div>
                    </div>

                    {/* Viewed */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        background: '#22c55e',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '14px',
                        fontWeight: '700',
                        border: '3px solid #dcfce7'
                      }}>
                        ✓
                      </div>
                      <div style={{
                        fontSize: '10px',
                        color: '#6b7280',
                        fontWeight: '600',
                        textAlign: 'center'
                      }}>
                        Viewed
                      </div>
                    </div>

                    {/* Signed - Pending */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        background: '#e5e7eb',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#9ca3af',
                        fontSize: '18px',
                        fontWeight: '300',
                        border: '3px solid #f3f4f6'
                      }}>
                        ○
                      </div>
                      <div style={{
                        fontSize: '10px',
                        color: '#9ca3af',
                        fontWeight: '600',
                        textAlign: 'center'
                      }}>
                        Signed
                      </div>
                    </div>
                  </div>

                  {/* Insurance Status */}
                  <div>
                    <div style={{
                      fontSize: '13px',
                      color: '#374151',
                      marginBottom: '4px'
                    }}>
                      Not Requested
                    </div>
                    <button style={{
                      background: 'none',
                      border: 'none',
                      color: '#14b8a6',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      padding: 0
                    }}>
                      Request Renter's Insurance
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tenants Section */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            padding: '20px 24px',
            marginBottom: '20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = '#f9fafb';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'white';
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: 'linear-gradient(135deg, #14b8a6 0%, #2dd4bf 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '18px',
              flexShrink: 0
            }}>
              👤
            </div>
            <div style={{
              fontSize: '15px',
              fontWeight: '600',
              color: '#134e4a'
            }}>
              Tenants of this property
            </div>
          </div>

          {/* Lease History */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            padding: '20px 24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = '#f9fafb';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'white';
          }}>
            <div style={{
              fontSize: '15px',
              fontWeight: '600',
              color: '#134e4a'
            }}>
              ▶ Lease History
            </div>
          </div>
        </div>
      </div>
    );
  };

  // If showing lease detail view as full page (OLD - now removed)
  if (false) {
    return (
      <div style={{
        width: '100%',
        height: '100vh',
        background: '#f8fafc',
        display: 'flex'
      }}>
        {/* Header */}
        <div style={{
          position: 'fixed',
          top: '64px',
          left: '240px',
          right: 0,
          height: '80px',
          background: 'white',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          zIndex: 10,
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={() => setSelectedLeaseDetail(null)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '20px',
                cursor: 'pointer',
                padding: '8px',
                borderRadius: '4px',
                color: '#6b7280'
              }}
            >
              ←
            </button>
            <div>
              <h1 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: '#374151',
                margin: 0
              }}>
                Lease Detail
              </h1>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <button style={{
              background: 'white',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              padding: '8px 16px',
              fontSize: '14px',
              cursor: 'pointer',
              color: '#374151'
            }}>
              Edit Lease
            </button>
            <button style={{
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: '8px 16px',
              fontSize: '14px',
              cursor: 'pointer'
            }}>
              New Document
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div style={{
          marginTop: '144px',
          marginLeft: '240px',
          padding: '24px',
          width: 'calc(100% - 240px)',
          height: 'calc(100vh - 144px)',
          overflow: 'auto'
        }}>
          <div style={{ display: 'flex', gap: '24px' }}>
            {/* Left Column */}
            <div style={{ flex: '1', maxWidth: '400px' }}>
              {/* Property Card */}
              <div style={{
                background: 'white',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                padding: '20px',
                marginBottom: '24px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '16px'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    background: '#f3f4f6',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px'
                  }}>
                    🏠
                  </div>
                  <div>
                    <h3 style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      color: '#374151',
                      margin: 0,
                      marginBottom: '4px'
                    }}>
                      {selectedLeaseDetail.property} | {selectedLeaseDetail.unit}
                    </h3>
                    <p style={{
                      fontSize: '14px',
                      color: '#6b7280',
                      margin: 0
                    }}>
                      {selectedLeaseDetail.address}
                    </p>
                  </div>
                </div>
                
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 0',
                  borderTop: '1px solid #f3f4f6'
                }}>
                  <div>
                    <div style={{
                      fontSize: '14px',
                      color: '#6b7280',
                      marginBottom: '2px'
                    }}>
                      {selectedLeaseDetail.start} - {selectedLeaseDetail.end}
                    </div>
                    <div style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      color: '#374151'
                    }}>
                      {selectedLeaseDetail.rent}
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: '#6b7280'
                    }}>
                      Monthly Rent • Due 1st of every month
                    </div>
                  </div>
                  <div>
                    <span style={{
                      background: '#dcfce7',
                      color: '#16a34a',
                      fontSize: '12px',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontWeight: '500'
                    }}>
                      {selectedLeaseDetail.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Open Documents */}
              <div style={{
                background: 'white',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                padding: '20px',
                marginBottom: '24px'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '16px'
                }}>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#374151',
                    margin: 0
                  }}>
                    Open Documents
                  </h3>
                  <span style={{
                    background: '#f3f4f6',
                    color: '#6b7280',
                    fontSize: '12px',
                    padding: '2px 6px',
                    borderRadius: '4px'
                  }}>
                    {selectedLeaseDetail.documents?.length || 0}
                  </span>
                </div>

                {selectedLeaseDetail.documents?.map((doc) => (
                  <div key={doc.id} style={{
                    padding: '12px 0',
                    borderBottom: '1px solid #f3f4f6'
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '8px'
                    }}>
                      <div>
                        <div style={{
                          fontSize: '14px',
                          fontWeight: '500',
                          color: '#374151',
                          marginBottom: '2px'
                        }}>
                          {doc.name}
                        </div>
                        <div style={{
                          fontSize: '12px',
                          color: '#6b7280'
                        }}>
                          {doc.type} • {doc.status}
                        </div>
                      </div>
                      <button style={{
                        background: '#f3f4f6',
                        border: '1px solid #d1d5db',
                        borderRadius: '4px',
                        padding: '4px 8px',
                        fontSize: '12px',
                        cursor: 'pointer',
                        color: '#374151'
                      }}>
                        {doc.actionRequired}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column */}
            <div style={{ flex: '1' }}>
              {/* Tenant Information */}
              <div style={{
                background: 'white',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                padding: '20px',
                marginBottom: '24px'
              }}>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#374151',
                  margin: 0,
                  marginBottom: '16px'
                }}>
                  Tenant
                </h3>

                {selectedLeaseDetail.tenantsDetails?.map((tenant) => (
                  <div key={tenant.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 0',
                    borderBottom: '1px solid #f3f4f6'
                  }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      background: '#e5e7eb',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                      color: '#6b7280'
                    }}>
                      👤
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#374151',
                        marginBottom: '2px'
                      }}>
                        {tenant.firstName} {tenant.lastName}
                      </div>
                      <div style={{
                        fontSize: '12px',
                        color: '#6b7280'
                      }}>
                        {tenant.email}
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div style={{
                        fontSize: '12px',
                        color: '#6b7280',
                        textAlign: 'right'
                      }}>
                        Last Activity
                      </div>
                      <div style={{
                        fontSize: '12px',
                        color: '#374151',
                        textAlign: 'right'
                      }}>
                        {selectedLeaseDetail.documents?.[0]?.lastActivity || 'No activity'}
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div style={{
                        fontSize: '12px',
                        color: '#6b7280',
                        textAlign: 'right'
                      }}>
                        Status
                      </div>
                      <div style={{
                        fontSize: '12px',
                        color: '#374151',
                        textAlign: 'right'
                      }}>
                        📄 Sent
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div style={{
                        fontSize: '12px',
                        color: '#6b7280',
                        textAlign: 'right'
                      }}>
                        Insurance Status
                      </div>
                      <div style={{
                        fontSize: '12px',
                        color: '#ef4444',
                        textAlign: 'right'
                      }}>
                        {selectedLeaseDetail.documents?.[0]?.insuranceStatus || 'Not Purchased'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Lease History */}
              <div style={{
                background: 'white',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                padding: '20px'
              }}>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#374151',
                  margin: 0,
                  marginBottom: '16px'
                }}>
                  Lease History
                </h3>

                {selectedLeaseDetail.leaseHistory?.map((entry) => (
                  <div key={entry.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 0',
                    borderBottom: '1px solid #f3f4f6'
                  }}>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      background: '#3b82f6',
                      borderRadius: '50%'
                    }}></div>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontSize: '14px',
                        color: '#374151',
                        marginBottom: '2px'
                      }}>
                        {entry.action}
                      </div>
                      <div style={{
                        fontSize: '12px',
                        color: '#6b7280'
                      }}>
                        {entry.date} at {entry.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If showing review page
  if (showReviewPage) {
    return (
      <div style={{
        width: '100%',
        height: '100vh',
        background: '#f8fafc',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '24px'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '32px',
          maxWidth: '600px',
          width: '100%',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          {/* Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '32px'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              background: '#3b82f6',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '24px'
            }}>
              🏠
            </div>
            <div>
              <h1 style={{
                fontSize: '24px',
                fontWeight: '600',
                color: '#374151',
                margin: 0,
                marginBottom: '4px'
              }}>
                {selectedProperty?.name || 'Main Street Lofts'}
              </h1>
              <p style={{
                fontSize: '14px',
                color: '#6b7280',
                margin: 0
              }}>
                {selectedProperty?.address || '101 Main St, Milford Oaks 45140'}
              </p>
            </div>
          </div>

          {/* Review Lease Summary */}
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '16px'
            }}>
              Review Lease Summary
            </h2>
            <p style={{
              fontSize: '14px',
              color: '#6b7280',
              marginBottom: '24px',
              lineHeight: '1.5'
            }}>
              Please review the terms of this lease to ensure everything is accurate. Nothing has been sent to your tenants yet. Click Finalize below to complete the Add Lease process and send invitations.
            </p>

            {/* Lease Details Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px',
              marginBottom: '24px'
            }}>
              <div>
                <div style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#6b7280',
                  marginBottom: '4px'
                }}>
                  Rental Lease For
                </div>
                <div style={{
                  fontSize: '14px',
                  color: '#374151'
                }}>
                  {leaseFormData.leaseType === 'month-to-month' ? 'Month to Month' : 'Fixed Term'}
                </div>
              </div>

              <div>
                <div style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#6b7280',
                  marginBottom: '4px'
                }}>
                  Start
                </div>
                <div style={{
                  fontSize: '14px',
                  color: '#374151'
                }}>
                  {leaseFormData.startDate || 'Not set'}
                </div>
              </div>

              <div>
                <div style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#6b7280',
                  marginBottom: '4px'
                }}>
                  End
                </div>
                <div style={{
                  fontSize: '14px',
                  color: '#374151'
                }}>
                  {leaseFormData.leaseType === 'month-to-month' ? 'M to M' : leaseFormData.leaseType === 'fixed' ? 'TBD' : 'Not set'}
                </div>
              </div>

              <div>
                <div style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#6b7280',
                  marginBottom: '4px'
                }}>
                  Deposit
                </div>
                <div style={{
                  fontSize: '14px',
                  color: '#374151'
                }}>
                  ${leaseFormData.securityDepositAmount || '0.00'}
                </div>
              </div>

              <div>
                <div style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#6b7280',
                  marginBottom: '4px'
                }}>
                  Monthly Rent
                </div>
                <div style={{
                  fontSize: '14px',
                  color: '#374151'
                }}>
                  ${leaseFormData.rentAmount || '0.00'}
                </div>
              </div>

              <div>
                <div style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#6b7280',
                  marginBottom: '4px'
                }}>
                  Additional Fee
                </div>
                <div style={{
                  fontSize: '14px',
                  color: '#374151'
                }}>
                  $0.00
                </div>
              </div>

              <div>
                <div style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#6b7280',
                  marginBottom: '4px'
                }}>
                  Tenants
                </div>
                <div style={{
                  fontSize: '14px',
                  color: '#374151'
                }}>
                  {leaseFormData.tenants?.length || 0}
                </div>
              </div>
            </div>
          </div>

          {/* What will happen next */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '16px'
            }}>
              What will happen next?
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{
                  width: '20px',
                  height: '20px',
                  background: '#dcfce7',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: '2px'
                }}>
                  <span style={{ fontSize: '10px' }}>✓</span>
                </div>
                <div>
                  <div style={{
                    fontSize: '14px',
                    color: '#374151',
                    fontWeight: '500'
                  }}>
                    Once all documents are signed, invoices including rent, deposits, and any other charges will be generated.
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{
                  width: '20px',
                  height: '20px',
                  background: '#dcfce7',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: '2px'
                }}>
                  <span style={{ fontSize: '10px' }}>✓</span>
                </div>
                <div>
                  <div style={{
                    fontSize: '14px',
                    color: '#374151',
                    fontWeight: '500'
                  }}>
                    {leaseFormData.tenants?.[0] ? 
                      `${leaseFormData.tenants[0].firstName} ${leaseFormData.tenants[0].lastName}` : 
                      'John Smith'} will receive a request to provide proof of insurance.
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{
                  width: '20px',
                  height: '20px',
                  background: '#dcfce7',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: '2px'
                }}>
                  <span style={{ fontSize: '10px' }}>✓</span>
                </div>
                <div>
                  <div style={{
                    fontSize: '14px',
                    color: '#374151',
                    fontWeight: '500'
                  }}>
                    {leaseFormData.tenants?.[0] ? 
                      `${leaseFormData.tenants[0].firstName} ${leaseFormData.tenants[0].lastName}` : 
                      'John Smith'} will receive an email inviting them to Innago to fill and sign Lease Agreement.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <button
              onClick={() => {
                setShowReviewPage(false);
                setCurrentStep(steps.length - 1);
              }}
              style={{
                background: '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 24px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              Back
            </button>

            <button
              onClick={handleCreateLease}
              style={{
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 24px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              Create Lease
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If showing new lease wizard
  if (showNewLeaseWizard) {
    return (
      <div style={{
        width: '100%',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 50%, #99f6e4 100%)',
        padding: isMobile ? '16px' : '24px'
      }}>
        {/* Page Header - Same position as main Leases & Files header */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '24px 32px',
          marginBottom: '24px',
          border: '2px solid #ccfbf1',
          boxShadow: '0 4px 16px rgba(20,184,166,0.1)'
        }}>
          <h1 style={{
            fontSize: '32px',
            fontWeight: '700',
            color: '#134e4a',
            margin: 0,
            marginBottom: '8px'
          }}>
            Create New Lease
          </h1>
          <p style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#14b8a6',
            margin: 0
          }}>
            {selectedProperty ? `Creating lease for ${selectedProperty.name}` : 'Select a property to begin creating a lease'}
          </p>
        </div>

        {/* Wizard Container */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          border: '2px solid #ccfbf1',
          boxShadow: '0 4px 16px rgba(20,184,166,0.1)',
          overflow: 'hidden',
          minHeight: 'calc(100vh - 200px)'
        }}>
          {/* Property Info Bar (shown when property is selected) */}
          {selectedProperty && (
            <div style={{
              background: 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%)',
              borderBottom: '2px solid #99f6e4',
              padding: '16px 24px'
            }}>
              {/* Property header row */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                marginBottom: '16px'
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: 'linear-gradient(135deg, #14b8a6 0%, #2dd4bf 100%)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '20px',
                  boxShadow: '0 2px 8px rgba(20,184,166,0.3)'
                }}>
                  🏠
                </div>
                <div>
                  <div style={{
                    fontSize: '18px',
                    fontWeight: '700',
                    color: '#134e4a'
                  }}>
                    {selectedProperty.name}
                  </div>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#14b8a6'
                  }}>
                    {selectedProperty.address}
                  </div>
                </div>
              </div>
              
              {/* Lease details grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(6, 1fr)',
                gap: '16px',
                fontSize: '12px',
                color: '#14b8a6'
              }}>
                <div>
                  <div style={{ fontWeight: '700', marginBottom: '4px', color: '#134e4a' }}>Rental Lease For</div>
                  <div style={{ fontWeight: '600' }}>{leaseFormData.leaseType === 'month-to-month' ? 'Month to Month' : leaseFormData.leaseType === 'fixed' ? 'Fixed Term' : '-'}</div>
                </div>
                <div>
                  <div style={{ fontWeight: '700', marginBottom: '4px', color: '#134e4a' }}>Start</div>
                  <div style={{ fontWeight: '600' }}>{leaseFormData.startDate || '-'}</div>
                </div>
                <div>
                  <div style={{ fontWeight: '700', marginBottom: '4px', color: '#134e4a' }}>End</div>
                  <div style={{ fontWeight: '600' }}>{leaseFormData.leaseType === 'month-to-month' ? 'M to M' : leaseFormData.leaseType === 'fixed' ? '-' : '-'}</div>
                </div>
                <div>
                  <div style={{ fontWeight: '700', marginBottom: '4px', color: '#134e4a' }}>Security Deposit</div>
                  <div style={{ fontWeight: '600' }}>{leaseFormData.securityDepositAmount ? `$${leaseFormData.securityDepositAmount}` : '$0.00'}</div>
                </div>
                <div>
                  <div style={{ fontWeight: '700', marginBottom: '4px', color: '#134e4a' }}>Monthly Rent</div>
                  <div style={{ fontWeight: '600' }}>{leaseFormData.rentAmount ? `$${leaseFormData.rentAmount}` : '$0.00'}</div>
                </div>
                <div>
                  <div style={{ fontWeight: '700', marginBottom: '4px', color: '#134e4a' }}>Tenants</div>
                  <div style={{ fontWeight: '600' }}>{leaseFormData.tenants?.length || 0}</div>
                </div>
              </div>
            </div>
          )}

          {/* Main wizard content */}
          <div style={{
            display: 'flex',
            minHeight: 'calc(100vh - 280px)'
          }}>
            {/* Left sidebar with steps */}
            <div style={{
              width: '300px',
              background: 'white',
              borderRight: '2px solid #ccfbf1',
              minHeight: '600px',
              overflowY: 'auto',
              boxShadow: '4px 0 16px rgba(20,184,166,0.05)'
            }}>
            <div style={{
              padding: '24px 0'
            }}>
              {steps.map((step, index) => {
                // Only allow clicking on completed steps or current step
                const isClickable = index <= currentStep || step.completed;
                
                return (
                  <div
                    key={step.id}
                    onClick={() => {
                      if (isClickable) {
                        setCurrentStep(index);
                      }
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 24px',
                      cursor: isClickable ? 'pointer' : 'not-allowed',
                      backgroundColor: currentStep === index ? '#f0fdfa' : 'transparent',
                      borderRight: currentStep === index ? '3px solid #14b8a6' : '3px solid transparent',
                      transition: 'all 0.2s ease',
                      opacity: isClickable ? 1 : 0.5
                    }}
                  >
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: currentStep === index 
                        ? 'linear-gradient(135deg, #14b8a6 0%, #2dd4bf 100%)' 
                        : step.completed 
                          ? '#14b8a6' 
                          : isClickable 
                            ? '#e5e7eb' 
                            : '#f3f4f6',
                      color: currentStep === index || step.completed ? 'white' : '#6b7280',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '16px',
                      fontWeight: '600',
                      boxShadow: currentStep === index || step.completed ? '0 2px 8px rgba(20,184,166,0.3)' : 'none'
                    }}>
                      {step.completed ? '✓' : index + 1}
                    </div>
                    <div style={{
                      color: currentStep === index ? '#134e4a' : isClickable ? '#6b7280' : '#d1d5db',
                      fontWeight: currentStep === index ? '600' : '500',
                      fontSize: '14px'
                    }}>
                      {step.title}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right content area */}
          <div style={{
            flex: 1,
            background: '#f8fafc',
            minHeight: '600px',
            overflowY: 'auto',
            padding: '0 0 80px 0' // Add bottom padding for navigation bar
          }}>
            <StepContent 
              step={currentStep} 
              selectedProperty={selectedProperty}
              leaseFormData={leaseFormData}
              handlePropertySelect={handlePropertySelect}
              handleLeaseTermSelect={handleLeaseTermSelect}
              handleLeaseFormUpdate={handleLeaseFormUpdate}
              steps={steps}
              showAdditionalFeeModal={showAdditionalFeeModal}
              setShowAdditionalFeeModal={setShowAdditionalFeeModal}
              editingInvoice={editingInvoice}
              setEditingInvoice={setEditingInvoice}
              handleEditInvoice={handleEditInvoice}
              handleDeleteInvoice={handleDeleteInvoice}
              handleUpdateInvoice={handleUpdateInvoice}
              customInvoices={customInvoices}
            />
          </div>
          </div>
            
          {/* Bottom navigation */}
          <div style={{
            background: 'white',
            borderTop: '2px solid #ccfbf1',
            borderRadius: '0 0 16px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '20px 24px',
            boxShadow: '0 -4px 16px rgba(20,184,166,0.08)',
            marginTop: 'auto'
          }}>
              <button
                onClick={() => setShowNewLeaseWizard(false)}
                style={{
                  background: 'white',
                  color: '#6b7280',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.background = '#f9fafb';
                  e.target.style.borderColor = '#d1d5db';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = 'white';
                  e.target.style.borderColor = '#e5e7eb';
                }}
              >
                Cancel
              </button>
              
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={handlePrevStep}
                  disabled={currentStep === 0}
                  style={{
                    background: currentStep === 0 ? '#f3f4f6' : 'white',
                    color: currentStep === 0 ? '#9ca3af' : '#14b8a6',
                    border: currentStep === 0 ? '2px solid #e5e7eb' : '2px solid #99f6e4',
                    borderRadius: '8px',
                    padding: '12px 24px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: currentStep === 0 ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    if (currentStep !== 0) {
                      e.target.style.background = '#f0fdfa';
                      e.target.style.borderColor = '#14b8a6';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (currentStep !== 0) {
                      e.target.style.background = 'white';
                      e.target.style.borderColor = '#99f6e4';
                    }
                  }}
                >
                  Back
                </button>
                <button
                  onClick={handleNextStep}
                  disabled={
                    (currentStep === 0 && !selectedProperty) ||
                    (currentStep === 1 && (!leaseFormData.leaseType || !leaseFormData.selectedUnit)) || // Step 1: Unit & Lease Type
                    (currentStep === 2 && !leaseFormData.startDate) || // Step 2: Lease Dates
                    (currentStep === 3 && (!leaseFormData.securityDepositAmount || !leaseFormData.securityDepositDue)) || // Step 3: Security Deposit
                    (currentStep === 4 && (!leaseFormData.paymentFrequency || !leaseFormData.rentAmount || !leaseFormData.rentDueDay || (leaseFormData.rentDueDay === 'Custom' && !leaseFormData.customDueDay) || !leaseFormData.firstInvoiceDueDate)) || // Step 4: Rent
                    (currentStep === 5 && (!leaseFormData.tenants || leaseFormData.tenants.length === 0)) || // Step 5: Tenants
                    (currentStep === 6 && (!leaseFormData.sharingType || (leaseFormData.sharingType === 'equal' && !leaseFormData.equalRentAmount))) // Step 6: Sharing
                  }
                  style={{
                    background: (
                      (currentStep === 0 && !selectedProperty) ||
                      (currentStep === 1 && (!leaseFormData.leaseType || !leaseFormData.selectedUnit)) ||
                      (currentStep === 2 && !leaseFormData.startDate) ||
                      (currentStep === 3 && (!leaseFormData.securityDepositAmount || !leaseFormData.securityDepositDue)) ||
                      (currentStep === 4 && (!leaseFormData.paymentFrequency || !leaseFormData.rentAmount || !leaseFormData.rentDueDay || (leaseFormData.rentDueDay === 'Custom' && !leaseFormData.customDueDay) || !leaseFormData.firstInvoiceDueDate)) ||
                      (currentStep === 5 && (!leaseFormData.tenants || leaseFormData.tenants.length === 0)) ||
                      (currentStep === 6 && (!leaseFormData.sharingType || (leaseFormData.sharingType === 'equal' && !leaseFormData.equalRentAmount)))
                    ) ? '#e5e7eb' : 'linear-gradient(135deg, #14b8a6 0%, #2dd4bf 100%)',
                    color: (
                      (currentStep === 0 && !selectedProperty) ||
                      (currentStep === 1 && (!leaseFormData.leaseType || !leaseFormData.selectedUnit)) ||
                      (currentStep === 2 && !leaseFormData.startDate) ||
                      (currentStep === 3 && (!leaseFormData.securityDepositAmount || !leaseFormData.securityDepositDue)) ||
                      (currentStep === 4 && (!leaseFormData.paymentFrequency || !leaseFormData.rentAmount || !leaseFormData.rentDueDay || (leaseFormData.rentDueDay === 'Custom' && !leaseFormData.customDueDay) || !leaseFormData.firstInvoiceDueDate)) ||
                      (currentStep === 5 && (!leaseFormData.tenants || leaseFormData.tenants.length === 0)) ||
                      (currentStep === 6 && (!leaseFormData.sharingType || (leaseFormData.sharingType === 'equal' && !leaseFormData.equalRentAmount)))
                    ) ? '#9ca3af' : 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '12px 24px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: (
                      (currentStep === 0 && !selectedProperty) ||
                      (currentStep === 1 && (!leaseFormData.leaseType || !leaseFormData.selectedUnit)) ||
                      (currentStep === 2 && !leaseFormData.startDate) ||
                      (currentStep === 3 && (!leaseFormData.securityDepositAmount || !leaseFormData.securityDepositDue)) ||
                      (currentStep === 4 && (!leaseFormData.paymentFrequency || !leaseFormData.rentAmount || !leaseFormData.rentDueDay || (leaseFormData.rentDueDay === 'Custom' && !leaseFormData.customDueDay) || !leaseFormData.firstInvoiceDueDate)) ||
                      (currentStep === 5 && (!leaseFormData.tenants || leaseFormData.tenants.length === 0)) ||
                      (currentStep === 6 && (!leaseFormData.sharingType || (leaseFormData.sharingType === 'equal' && !leaseFormData.equalRentAmount)))
                    ) ? 'not-allowed' : 'pointer',
                    boxShadow: (
                      (currentStep === 0 && !selectedProperty) ||
                      (currentStep === 1 && !leaseFormData.leaseType) ||
                      (currentStep === 2 && !leaseFormData.startDate) ||
                      (currentStep === 3 && !leaseFormData.securityDepositAmount) ||
                      (currentStep === 4 && (!leaseFormData.paymentFrequency || !leaseFormData.rentAmount || !leaseFormData.rentDueDay || (leaseFormData.rentDueDay === 'Custom' && !leaseFormData.customDueDay) || !leaseFormData.firstInvoiceDueDate)) ||
                      (currentStep === 5 && (!leaseFormData.tenants || leaseFormData.tenants.length === 0)) ||
                      (currentStep === 6 && (!leaseFormData.sharingType || (leaseFormData.sharingType === 'equal' && !leaseFormData.equalRentAmount)))
                    ) ? 'none' : '0 4px 12px rgba(20,184,166,0.3)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    const isDisabled = (
                      (currentStep === 0 && !selectedProperty) ||
                      (currentStep === 1 && !leaseFormData.leaseType) ||
                      (currentStep === 2 && !leaseFormData.startDate) ||
                      (currentStep === 3 && !leaseFormData.securityDepositAmount) ||
                      (currentStep === 4 && (!leaseFormData.paymentFrequency || !leaseFormData.rentAmount || !leaseFormData.rentDueDay || (leaseFormData.rentDueDay === 'Custom' && !leaseFormData.customDueDay) || !leaseFormData.firstInvoiceDueDate)) ||
                      (currentStep === 5 && (!leaseFormData.tenants || leaseFormData.tenants.length === 0)) ||
                      (currentStep === 6 && (!leaseFormData.sharingType || (leaseFormData.sharingType === 'equal' && !leaseFormData.equalRentAmount)))
                    );
                    if (!isDisabled) {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 6px 16px rgba(20,184,166,0.4)';
                    }
                  }}
                  onMouseOut={(e) => {
                    const isDisabled = (
                      (currentStep === 0 && !selectedProperty) ||
                      (currentStep === 1 && !leaseFormData.leaseType) ||
                      (currentStep === 2 && !leaseFormData.startDate) ||
                      (currentStep === 3 && !leaseFormData.securityDepositAmount) ||
                      (currentStep === 4 && (!leaseFormData.paymentFrequency || !leaseFormData.rentAmount || !leaseFormData.rentDueDay || (leaseFormData.rentDueDay === 'Custom' && !leaseFormData.customDueDay) || !leaseFormData.firstInvoiceDueDate)) ||
                      (currentStep === 5 && (!leaseFormData.tenants || leaseFormData.tenants.length === 0)) ||
                      (currentStep === 6 && (!leaseFormData.sharingType || (leaseFormData.sharingType === 'equal' && !leaseFormData.equalRentAmount)))
                    );
                    if (!isDisabled) {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 4px 12px rgba(20,184,166,0.3)';
                    }
                  }}
                >
                  {currentStep === steps.length - 1 ? 'Review' : 'Next'}
                </button>
              </div>
            </div>
        </div>
      </div>
    );
  }





  // Main Leases & Files page
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 50%, #99f6e4 100%)',
      padding: isMobile ? '16px' : '24px',
      position: 'relative'
    }}>
      {/* Centered Tab Navigation - Clean Teal Theme */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(20,184,166,0.15)',
        border: '1px solid #99f6e4',
        padding: '0',
        marginBottom: '16px',
        overflow: 'hidden'
      }}>
        {/* Centered Tabs */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          borderBottom: '2px solid #ccfbf1'
        }}>
          <button
            onClick={() => setActiveMainTab('leases')}
            style={{
              padding: '16px 40px',
              border: 'none',
              background: activeMainTab === 'leases' ? '#f0fdfa' : 'transparent',
              borderBottom: activeMainTab === 'leases' ? '3px solid #14b8a6' : '3px solid transparent',
              color: activeMainTab === 'leases' ? '#0f766e' : '#94a3b8',
              fontWeight: activeMainTab === 'leases' ? '700' : '500',
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'all 0.2s ease',
              marginBottom: '-2px',
              textTransform: 'uppercase',
              letterSpacing: '0.03em'
            }}
          >
            LEASES
          </button>
          <button
            onClick={() => setActiveMainTab('templates')}
            style={{
              padding: '16px 40px',
              border: 'none',
              background: activeMainTab === 'templates' ? '#f0fdfa' : 'transparent',
              borderBottom: activeMainTab === 'templates' ? '3px solid #14b8a6' : '3px solid transparent',
              color: activeMainTab === 'templates' ? '#0f766e' : '#94a3b8',
              fontWeight: activeMainTab === 'templates' ? '700' : '500',
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '-2px',
              textTransform: 'uppercase',
              letterSpacing: '0.03em'
            }}
          >
            TEMPLATES
            <span style={{
              background: '#ccfbf1',
              color: '#0f766e',
              fontSize: '10px',
              padding: '2px 6px',
              borderRadius: '10px',
              fontWeight: '700',
              minWidth: '18px',
              textAlign: 'center'
            }}>
              1
            </span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ 
        marginBottom: '24px'
      }}>
        {activeMainTab === 'leases' ? (
          <div>
            {/* Filters and Actions - Full Width */}
            <div style={{
              background: 'white',
              borderRadius: '12px',
              border: '1px solid #99f6e4',
              boxShadow: '0 4px 12px rgba(20,184,166,0.15)',
              padding: '16px 20px',
              marginBottom: '16px'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '16px'
              }}>
                {/* Left side - Single Filter and Count */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  flex: 1
                }}>
                  <select style={{
                    background: '#f0fdfa',
                    border: '1px solid #99f6e4',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    fontSize: '13px',
                    cursor: 'pointer',
                    color: '#0f766e',
                    fontWeight: '600',
                    outline: 'none',
                    transition: 'all 0.2s ease'
                  }}>
                    <option>All Statuses</option>
                    <option>Active</option>
                    <option>Pending</option>
                    <option>Expired</option>
                  </select>

                  {!isLoadingLeases && !leasesError && createdLeases.length > 0 && (
                    <div style={{
                      fontSize: '13px',
                      color: '#14b8a6',
                      fontWeight: '600'
                    }}>
                      Showing {createdLeases.length} of {createdLeases.length}
                    </div>
                  )}
                </div>
              
                {/* Right side - Actions */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <button
                    style={{
                      padding: '8px 16px',
                      background: 'white',
                      color: '#0f766e',
                      border: '1px solid #99f6e4',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.background = '#f0fdfa';
                      e.target.style.borderColor = '#14b8a6';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.background = 'white';
                      e.target.style.borderColor = '#99f6e4';
                    }}
                  >
                    Export
                  </button>

                  <button
                    onClick={() => setShowNewLeaseWizard(true)}
                    style={{
                      padding: '8px 20px',
                      background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 2px 8px rgba(20,184,166,0.3)'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.background = 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)';
                      e.target.style.boxShadow = '0 4px 12px rgba(20,184,166,0.4)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.background = 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)';
                      e.target.style.boxShadow = '0 2px 8px rgba(20,184,166,0.3)';
                    }}
                  >
                    + New Lease
                  </button>
                </div>
              </div>
            </div>

            {/* Two-column layout: Table on left, Summary cards on right OR Full-width split view when detail selected */}
            {selectedLeaseDetail ? (
              /* FULL WIDTH Split view for lease detail */
              <div style={{
                display: 'flex',
                gap: '0',
                height: 'calc(100vh - 280px)',
                overflow: 'hidden',
                borderRadius: '16px',
                border: '1px solid #99f6e4',
                boxShadow: '0 4px 16px rgba(20,184,166,0.1)',
                width: '100%'
              }}>
                {/* Left side - Compressed lease list */}
                <div style={{
                  width: '280px',
                  minWidth: '280px',
                  maxWidth: '280px',
                  borderRight: '2px solid #e5e7eb',
                  background: 'white',
                  overflow: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  flexShrink: 0
                }}>
                  {/* Filter Section */}
                  <div style={{
                    padding: '16px 20px',
                    borderBottom: '1px solid #e5e7eb',
                    background: 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%)',
                    flexShrink: 0
                  }}>
                    <div style={{
                      fontSize: '10px',
                      fontWeight: '700',
                      color: '#0f766e',
                      marginBottom: '6px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      FILTER
                    </div>
                    <div style={{
                      fontSize: '13px',
                      color: '#134e4a',
                      fontWeight: '600'
                    }}>
                      Showing {sortedLeases.length} of {sortedLeases.length}
                    </div>
                  </div>

                  {/* Compressed Table */}
                  <div style={{ padding: '12px', flex: 1, overflow: 'auto' }}>
                    <table style={{
                      width: '100%',
                      borderCollapse: 'separate',
                      borderSpacing: '0 6px'
                    }}>
                      <thead>
                        <tr>
                          <th style={{
                            padding: '8px 10px',
                            textAlign: 'left',
                            fontSize: '9px',
                            fontWeight: '700',
                            color: '#0f766e',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            background: '#f0fdfa',
                            position: 'sticky',
                            top: 0
                          }}>
                            STATUS
                          </th>
                          <th style={{
                            padding: '8px 10px',
                            textAlign: 'left',
                            fontSize: '9px',
                            fontWeight: '700',
                            color: '#0f766e',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            background: '#f0fdfa',
                            position: 'sticky',
                            top: 0
                          }}>
                            PROPERTY
                          </th>
                          <th style={{
                            padding: '8px 10px',
                            textAlign: 'left',
                            fontSize: '9px',
                            fontWeight: '700',
                            color: '#0f766e',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            width: '50px',
                            background: '#f0fdfa',
                            position: 'sticky',
                            top: 0
                          }}>
                            UNIT
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {sortedLeases.map((lease) => (
                          <tr 
                            key={lease.id}
                            onClick={() => setSelectedLeaseDetail(lease)}
                            style={{
                              cursor: 'pointer',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            <td style={{ 
                              padding: '10px',
                              background: selectedLeaseDetail.id === lease.id ? '#ccfbf1' : 'white',
                              borderLeft: selectedLeaseDetail.id === lease.id ? '3px solid #14b8a6' : '3px solid transparent',
                              borderTop: '1px solid #f3f4f6',
                              borderBottom: '1px solid #f3f4f6'
                            }}>
                              <span style={{
                                background: lease.status === 'Active' ? '#dcfce7' : 
                                            lease.status === 'In Process' ? '#dbeafe' :
                                            lease.status === 'Expired' ? '#fee2e2' : '#f3f4f6',
                                color: lease.status === 'Active' ? '#16a34a' : 
                                       lease.status === 'In Process' ? '#2563eb' :
                                       lease.status === 'Expired' ? '#dc2626' : '#6b7280',
                                padding: '3px 7px',
                                borderRadius: '10px',
                                fontSize: '8px',
                                fontWeight: '700',
                                textTransform: 'uppercase',
                                whiteSpace: 'nowrap',
                                display: 'inline-block'
                              }}>
                                {lease.status === 'In Process' ? 'PROCESS' : lease.status.toUpperCase()}
                              </span>
                            </td>
                            <td style={{
                              padding: '10px',
                              color: '#134e4a',
                              fontSize: '11px',
                              fontWeight: '600',
                              maxWidth: '110px',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              background: selectedLeaseDetail.id === lease.id ? '#ccfbf1' : 'white',
                              borderTop: '1px solid #f3f4f6',
                              borderBottom: '1px solid #f3f4f6'
                            }}>
                              {lease.property}
                            </td>
                            <td style={{
                              padding: '10px',
                              color: '#14b8a6',
                              fontSize: '12px',
                              fontWeight: '700',
                              background: selectedLeaseDetail.id === lease.id ? '#ccfbf1' : 'white',
                              borderRight: selectedLeaseDetail.id === lease.id ? '3px solid transparent' : 'none',
                              borderTop: '1px solid #f3f4f6',
                              borderBottom: '1px solid #f3f4f6'
                            }}>
                              {lease.unit}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Right side - Full Detail View - Takes remaining space */}
                <div style={{
                  flex: 1,
                  overflow: 'auto',
                  background: '#f8fafc',
                  minWidth: 0
                }}>
                  {/* Lease Detail Header */}
                  <div style={{
                    background: 'white',
                    borderBottom: '2px solid #e5e7eb',
                    padding: '20px 32px',
                    position: 'sticky',
                    top: 0,
                    zIndex: 10,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <button
                        onClick={() => setSelectedLeaseDetail(null)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#6b7280',
                          cursor: 'pointer',
                          padding: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          fontSize: '20px',
                          transition: 'color 0.2s ease'
                        }}
                        onMouseOver={(e) => e.target.style.color = '#374151'}
                        onMouseOut={(e) => e.target.style.color = '#6b7280'}
                      >
                        ←
                      </button>
                      <div>
                        <h2 style={{
                          fontSize: '18px',
                          fontWeight: '700',
                          color: '#1f2937',
                          margin: 0
                        }}>
                          Lease Detail
                        </h2>
                        <div style={{
                          fontSize: '12px',
                          color: '#6b7280',
                          marginTop: '2px'
                        }}>
                          {selectedLeaseDetail.property} | Unit {selectedLeaseDetail.unit}
                        </div>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button style={{
                        background: 'white',
                        border: '1.5px solid #99f6e4',
                        borderRadius: '8px',
                        padding: '8px 16px',
                        fontSize: '13px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        color: '#14b8a6',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.background = '#f0fdfa';
                        e.target.style.borderColor = '#14b8a6';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.background = 'white';
                        e.target.style.borderColor = '#99f6e4';
                      }}>
                        Edit Lease
                      </button>
                      <button style={{
                        background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '8px 18px',
                        fontSize: '13px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        boxShadow: '0 2px 8px rgba(20,184,166,0.3)',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.background = 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)';
                        e.target.style.boxShadow = '0 4px 12px rgba(20,184,166,0.4)';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.background = 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)';
                        e.target.style.boxShadow = '0 2px 8px rgba(20,184,166,0.3)';
                      }}>
                        + New Document
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div style={{ padding: '24px 32px' }}>
                    {/* Top Info Card - Teal Themed */}
                    <div style={{
                      background: 'white',
                      borderRadius: '12px',
                      border: '1px solid #99f6e4',
                      padding: '28px 32px',
                      marginBottom: '20px',
                      boxShadow: '0 4px 12px rgba(20,184,166,0.15)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <span style={{
                            background: selectedLeaseDetail.status === 'Active' ? '#ccfbf1' : 
                                        selectedLeaseDetail.status === 'In Process' ? '#dbeafe' : '#fee2e2',
                            color: selectedLeaseDetail.status === 'Active' ? '#0f766e' : 
                                   selectedLeaseDetail.status === 'In Process' ? '#2563eb' : '#dc2626',
                            fontSize: '11px',
                            padding: '6px 14px',
                            borderRadius: '16px',
                            fontWeight: '700',
                            display: 'inline-block',
                            textTransform: 'uppercase',
                            letterSpacing: '0.03em'
                          }}>
                            {selectedLeaseDetail.status}
                          </span>
                          <div style={{
                            fontSize: '20px',
                            fontWeight: '700',
                            color: '#134e4a'
                          }}>
                            {selectedLeaseDetail.property} | {selectedLeaseDetail.unit}
                          </div>
                        </div>
                        
                        <button style={{
                          background: 'white',
                          border: '1.5px solid #99f6e4',
                          borderRadius: '8px',
                          padding: '10px 20px',
                          fontSize: '13px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          color: '#14b8a6',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseOver={(e) => {
                          e.target.style.background = '#f0fdfa';
                          e.target.style.borderColor = '#14b8a6';
                        }}
                        onMouseOut={(e) => {
                          e.target.style.background = 'white';
                          e.target.style.borderColor = '#99f6e4';
                        }}>
                          Tenants of this property
                        </button>
                      </div>
                      
                      <div style={{ display: 'flex', gap: '80px', alignItems: 'center' }}>
                        <div>
                          <div style={{
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#6b7280',
                            marginBottom: '4px'
                          }}>
                            {selectedLeaseDetail.start} - M to M
                          </div>
                        </div>
                        
                        <div style={{ flex: 1 }}>
                          <div style={{
                            fontSize: '26px',
                            fontWeight: '700',
                            color: '#134e4a',
                            marginBottom: '4px'
                          }}>
                            {selectedLeaseDetail.rent}
                          </div>
                          <div style={{
                            fontSize: '12px',
                            color: '#6b7280'
                          }}>
                            Monthly Rent · Due on the 1st of every month
                          </div>
                        </div>
                        
                        <div style={{ textAlign: 'right' }}>
                          <div style={{
                            fontSize: '11px',
                            fontWeight: '600',
                            color: '#6b7280',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            marginBottom: '6px'
                          }}>
                            PROPERTY
                          </div>
                          <div style={{
                            fontSize: '16px',
                            fontWeight: '700',
                            color: '#134e4a'
                          }}>
                            {selectedLeaseDetail.property}
                          </div>
                          <div style={{
                            fontSize: '14px',
                            color: '#14b8a6',
                            fontWeight: '600',
                            marginTop: '4px'
                          }}>
                            Unit {selectedLeaseDetail.unit}
                          </div>
                        </div>
                      </div>
                    </div>

                    {renderLeaseDetailPanel().props.children[1]}
                  </div>
                </div>
              </div>
            ) : (
              /* Normal View - Two Column Layout */
              <div>
                <div style={{
              display: isMobile ? 'block' : 'flex',
              gap: '16px',
              alignItems: 'flex-start',
              width: '100%',
              flexWrap: 'nowrap'
            }}>
              {/* Left side - Main Table */}
              <div style={{
                flex: selectedLeaseDetail && !isMobile ? '1' : (!isMobile ? '1 1 0' : 'none'),
                maxWidth: selectedLeaseDetail && !isMobile ? '55%' : (!isMobile ? 'calc(100% - 220px)' : '100%'),
                minWidth: 0,
                transition: 'all 0.3s ease'
              }}>
            {/* Loading State */}
            {isLoadingLeases ? (
                  <div style={{
                    background: 'white',
                    borderRadius: '16px',
                    border: '2px solid #99f6e4',
                    boxShadow: '0 4px 16px rgba(20,184,166,0.2)',
                    padding: '48px 24px',
                    textAlign: 'center'
                  }}>
                    <div style={{ 
                      fontSize: '48px', 
                      marginBottom: '16px',
                      animation: 'pulse 1.5s ease-in-out infinite'
                    }}>
                      ⏳
                    </div>
                    <div style={{ fontSize: '18px', color: '#0f766e', fontWeight: '700', marginBottom: '8px' }}>
                      Loading leases...
                    </div>
                    <div style={{ fontSize: '14px', color: '#14b8a6', fontWeight: '600' }}>
                      Fetching data from database
                    </div>
                  </div>
                ) : leasesError ? (
                  /* Error State */
                  <div style={{
                    background: 'white',
                    borderRadius: '16px',
                    border: '2px solid #fecaca',
                    boxShadow: '0 4px 16px rgba(239,68,68,0.2)',
                    padding: '48px 24px',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '64px', marginBottom: '16px' }}>⚠️</div>
                    <div style={{ fontSize: '18px', color: '#dc2626', fontWeight: '700', marginBottom: '8px' }}>
                      Error loading leases
                    </div>
                    <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '16px', fontWeight: '500' }}>
                      {leasesError}
                    </div>
                    <button
                      onClick={() => window.location.reload()}
                      style={{
                        padding: '10px 20px',
                        background: '#dc2626',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      Retry
                    </button>
                  </div>
                ) : createdLeases.length === 0 ? (
                  /* Empty State */
                  <div style={{
                    background: 'white',
                    borderRadius: '16px',
                    border: '1px solid #99f6e4',
                    boxShadow: '0 4px 16px rgba(20,184,166,0.1)',
                    padding: '48px 24px',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '64px', marginBottom: '16px', opacity: 0.5 }}>📄</div>
                    <div style={{ fontSize: '18px', color: '#134e4a', fontWeight: '600', marginBottom: '8px' }}>
                      No leases found
                    </div>
                    <div style={{ fontSize: '14px', color: '#14b8a6' }}>
                      Create your first lease to get started
                    </div>
                  </div>
                ) : (
                  <div style={{
                    background: 'white',
                    borderRadius: '16px',
                    border: '1px solid #99f6e4',
                    boxShadow: '0 4px 16px rgba(20,184,166,0.1)',
                    overflow: 'hidden',
                    maxWidth: '100%',
                    transition: 'all 0.3s ease'
                  }}>
                  {isMobile ? (
                    /* Mobile Card View */
                    <div style={{ padding: '12px' }}>
                      {createdLeases.map((lease, index) => (
                        <div
                          key={lease.id}
                          onClick={() => setSelectedLeaseDetail(lease)}
                          style={{
                            background: '#f0fdfa',
                            border: '1px solid #99f6e4',
                            borderRadius: '12px',
                            padding: '16px',
                            marginBottom: index < createdLeases.length - 1 ? '12px' : 0,
                            cursor: 'pointer',
                            boxShadow: '0 2px 8px rgba(20,184,166,0.1)',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'start',
                            marginBottom: '16px'
                          }}>
                            <div style={{ flex: 1 }}>
                              <div style={{
                                fontSize: '16px',
                                fontWeight: '700',
                                color: '#134e4a',
                                marginBottom: '6px'
                              }}>
                                {lease.property}
                              </div>
                              <div style={{
                                fontSize: '13px',
                                color: '#14b8a6',
                                fontWeight: '500'
                              }}>
                                Unit {lease.unit}
                              </div>
                            </div>
                            <div style={{
                              background: lease.status === 'Active' ? '#ccfbf1' : '#fee2e2',
                              color: lease.status === 'Active' ? '#134e4a' : '#dc2626',
                              padding: '6px 12px',
                              borderRadius: '20px',
                              fontSize: '12px',
                              fontWeight: '700'
                            }}>
                              {lease.status}
                            </div>
                          </div>
                          
                          <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '12px',
                            marginBottom: '12px'
                          }}>
                            <div>
                              <div style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '2px' }}>Start</div>
                              <div style={{ fontSize: '13px', color: '#374151' }}>{lease.start}</div>
                            </div>
                            <div>
                              <div style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '2px' }}>End</div>
                              <div style={{ fontSize: '13px', color: '#374151' }}>{lease.end}</div>
                            </div>
                          </div>
                          
                          <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '12px',
                            paddingTop: '12px',
                            borderTop: '1px solid #f3f4f6'
                          }}>
                            <div>
                              <div style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '2px' }}>Rent</div>
                              <div style={{ fontSize: '14px', color: '#374151', fontWeight: '500' }}>{lease.rent}</div>
                            </div>
                            <div>
                              <div style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '2px' }}>Tenants</div>
                              <div style={{ fontSize: '14px', color: '#374151' }}>{lease.tenants}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    /* Desktop Table View - Proper HTML Table with Sorting - Innago Columns */
                    <table style={{
                      width: '100%',
                      borderCollapse: 'collapse'
                    }}>
                      <thead>
                        <tr style={{
                          background: 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%)',
                          borderBottom: '2px solid #14b8a6'
                        }}>
                          <th onClick={() => handleSort('status')} style={{
                            padding: '16px 20px',
                            textAlign: 'left',
                            fontSize: '11px',
                            fontWeight: '700',
                            color: '#0f766e',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            cursor: 'pointer',
                            userSelect: 'none',
                            width: '110px'
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              Status
                              <div style={{ 
                                display: 'flex', 
                                flexDirection: 'column', 
                                gap: '0px',
                                fontSize: '8px',
                                lineHeight: '6px'
                              }}>
                                <span style={{ 
                                  color: sortField === 'status' && sortDirection === 'asc' ? '#14b8a6' : '#cbd5e1'
                                }}>▲</span>
                                <span style={{ 
                                  color: sortField === 'status' && sortDirection === 'desc' ? '#14b8a6' : '#cbd5e1'
                                }}>▼</span>
                              </div>
                            </div>
                          </th>
                          <th onClick={() => handleSort('property')} style={{
                            padding: '16px 20px',
                            textAlign: 'left',
                            fontSize: '11px',
                            fontWeight: '700',
                            color: '#0f766e',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            cursor: 'pointer',
                            userSelect: 'none'
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              Property
                              <div style={{ 
                                display: 'flex', 
                                flexDirection: 'column', 
                                gap: '0px',
                                fontSize: '8px',
                                lineHeight: '6px'
                              }}>
                                <span style={{ 
                                  color: sortField === 'property' && sortDirection === 'asc' ? '#14b8a6' : '#cbd5e1'
                                }}>▲</span>
                                <span style={{ 
                                  color: sortField === 'property' && sortDirection === 'desc' ? '#14b8a6' : '#cbd5e1'
                                }}>▼</span>
                              </div>
                            </div>
                          </th>
                          <th onClick={() => handleSort('unit')} style={{
                            padding: '16px 20px',
                            textAlign: 'left',
                            fontSize: '11px',
                            fontWeight: '700',
                            color: '#0f766e',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            cursor: 'pointer',
                            userSelect: 'none',
                            width: '80px'
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              Unit
                              <div style={{ 
                                display: 'flex', 
                                flexDirection: 'column', 
                                gap: '0px',
                                fontSize: '8px',
                                lineHeight: '6px'
                              }}>
                                <span style={{ 
                                  color: sortField === 'unit' && sortDirection === 'asc' ? '#14b8a6' : '#cbd5e1'
                                }}>▲</span>
                                <span style={{ 
                                  color: sortField === 'unit' && sortDirection === 'desc' ? '#14b8a6' : '#cbd5e1'
                                }}>▼</span>
                              </div>
                            </div>
                          </th>
                          {!selectedLeaseDetail && (
                            <>
                              <th onClick={() => handleSort('address')} style={{
                                padding: '16px 20px',
                                textAlign: 'left',
                                fontSize: '11px',
                                fontWeight: '700',
                                color: '#0f766e',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                cursor: 'pointer',
                                userSelect: 'none'
                              }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  Address
                                  <div style={{ 
                                    display: 'flex', 
                                    flexDirection: 'column', 
                                    gap: '0px',
                                    fontSize: '8px',
                                    lineHeight: '6px'
                                  }}>
                                    <span style={{ 
                                      color: sortField === 'address' && sortDirection === 'asc' ? '#14b8a6' : '#cbd5e1'
                                    }}>▲</span>
                                    <span style={{ 
                                      color: sortField === 'address' && sortDirection === 'desc' ? '#14b8a6' : '#cbd5e1'
                                    }}>▼</span>
                                  </div>
                                </div>
                              </th>
                              <th onClick={() => handleSort('tenants')} style={{
                                padding: '16px 20px',
                                textAlign: 'left',
                                fontSize: '11px',
                                fontWeight: '700',
                                color: '#0f766e',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                cursor: 'pointer',
                                userSelect: 'none',
                                width: '100px'
                              }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  Tenants
                                  <div style={{ 
                                    display: 'flex', 
                                    flexDirection: 'column', 
                                    gap: '0px',
                                    fontSize: '8px',
                                    lineHeight: '6px'
                                  }}>
                                    <span style={{ 
                                      color: sortField === 'tenants' && sortDirection === 'asc' ? '#14b8a6' : '#cbd5e1'
                                    }}>▲</span>
                                    <span style={{ 
                                      color: sortField === 'tenants' && sortDirection === 'desc' ? '#14b8a6' : '#cbd5e1'
                                    }}>▼</span>
                                  </div>
                                </div>
                              </th>
                              <th onClick={() => handleSort('start')} style={{
                                padding: '16px 20px',
                                textAlign: 'left',
                                fontSize: '11px',
                                fontWeight: '700',
                                color: '#0f766e',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                cursor: 'pointer',
                                userSelect: 'none',
                                width: '100px'
                              }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  Start
                                  <div style={{ 
                                    display: 'flex', 
                                    flexDirection: 'column', 
                                    gap: '0px',
                                    fontSize: '8px',
                                    lineHeight: '6px'
                                  }}>
                                    <span style={{ 
                                      color: sortField === 'start' && sortDirection === 'asc' ? '#14b8a6' : '#cbd5e1'
                                    }}>▲</span>
                                    <span style={{ 
                                      color: sortField === 'start' && sortDirection === 'desc' ? '#14b8a6' : '#cbd5e1'
                                    }}>▼</span>
                                  </div>
                                </div>
                              </th>
                              <th onClick={() => handleSort('end')} style={{
                                padding: '16px 20px',
                                textAlign: 'left',
                                fontSize: '11px',
                                fontWeight: '700',
                                color: '#0f766e',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                cursor: 'pointer',
                                userSelect: 'none',
                                width: '100px'
                              }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  End
                                  <div style={{ 
                                    display: 'flex', 
                                    flexDirection: 'column', 
                                    gap: '0px',
                                    fontSize: '8px',
                                    lineHeight: '6px'
                                  }}>
                                    <span style={{ 
                                      color: sortField === 'end' && sortDirection === 'asc' ? '#14b8a6' : '#cbd5e1'
                                    }}>▲</span>
                                    <span style={{ 
                                      color: sortField === 'end' && sortDirection === 'desc' ? '#14b8a6' : '#cbd5e1'
                                    }}>▼</span>
                                  </div>
                                </div>
                              </th>
                            </>
                          )}
                        </tr>
                      </thead>
                      <tbody>
                  {sortedLeases.map((lease, index) => (
                    <tr 
                      key={lease.id} 
                      onClick={() => setSelectedLeaseDetail(lease)}
                      style={{
                        borderBottom: index < sortedLeases.length - 1 ? '1px solid #ccfbf1' : 'none',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s ease',
                        background: selectedLeaseDetail?.id === lease.id ? '#f0fdfa' : 'white',
                        borderLeft: selectedLeaseDetail?.id === lease.id ? '3px solid #14b8a6' : '3px solid transparent'
                      }}
                      onMouseEnter={(e) => {
                        if (selectedLeaseDetail?.id !== lease.id) {
                          e.currentTarget.style.background = '#f9fafb';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedLeaseDetail?.id !== lease.id) {
                          e.currentTarget.style.background = 'white';
                        }
                      }}
                    >
                      {/* Status */}
                      <td style={{ padding: '16px 20px' }}>
                        <span style={{
                          background: lease.status === 'Active' ? '#ccfbf1' : (lease.status === 'Pending' ? '#dbeafe' : '#fee2e2'),
                          color: lease.status === 'Active' ? '#0f766e' : (lease.status === 'Pending' ? '#1e40af' : '#dc2626'),
                          fontSize: '11px',
                          padding: '6px 12px',
                          borderRadius: '16px',
                          fontWeight: '700',
                          display: 'inline-block'
                        }}>
                          {lease.status}
                        </span>
                      </td>
                      
                      {/* Property */}
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{
                          color: '#0f766e',
                          fontWeight: '600',
                          fontSize: '14px'
                        }}>
                          {lease.property}
                        </div>
                      </td>
                      
                      {/* Unit */}
                      <td style={{
                        padding: '16px 20px',
                        color: '#0f766e',
                        fontSize: '14px',
                        fontWeight: '600'
                      }}>
                        {lease.unit}
                      </td>
                      
                      {/* Address - Only show when panel is closed */}
                      {!selectedLeaseDetail && (
                        <td style={{ padding: '16px 20px' }}>
                          <div style={{
                            color: '#0f766e',
                            fontSize: '13px',
                            fontWeight: '500'
                          }}>
                            {lease.address || '3336 Jefferson Ave, Cincinnati, Ohio 45220'}
                          </div>
                        </td>
                      )}

                      {/* Tenants - Only show when panel is closed */}
                      {!selectedLeaseDetail && (
                        <td style={{
                          padding: '16px 20px',
                          color: '#0f766e',
                          fontSize: '13px',
                          fontWeight: '500'
                        }}>
                          {lease.tenantsDetails?.[0]?.firstName || 'John'} {lease.tenantsDetails?.[0]?.lastName || 'Smith'}
                        </td>
                      )}
                      
                      {/* Start Date - Only show when panel is closed */}
                      {!selectedLeaseDetail && (
                        <td style={{ padding: '16px 20px' }}>
                          <div style={{
                            color: '#0f766e',
                            fontSize: '13px',
                            fontWeight: '500'
                          }}>
                            {lease.start}
                          </div>
                        </td>
                      )}

                      {/* End Date - Only show when panel is closed */}
                      {!selectedLeaseDetail && (
                        <td style={{
                          padding: '16px 20px',
                          color: '#0f766e',
                          fontSize: '13px',
                          fontWeight: '500'
                        }}>
                          {lease.end}
                        </td>
                      )}
                    </tr>
                  ))}
                  </tbody>
                  </table>
                  )}
                </div>
                )}
              </div>

            {/* Right side - Summary Cards - Minimal Style */}
            {!isMobile && (
              <div style={{
                flex: '0 0 22%',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                minWidth: '200px'
              }}>
                {/* Active Leases Card - Minimal */}
                <div style={{
                  background: 'white',
                  borderRadius: '6px',
                  border: '1.5px solid #22c55e',
                  padding: '20px 16px',
                  textAlign: 'center',
                  boxShadow: 'none',
                  transition: 'all 0.2s ease'
                }}>
                  <div style={{
                    fontSize: '36px',
                    fontWeight: '300',
                    color: '#22c55e',
                    marginBottom: '2px',
                    lineHeight: 1
                  }}>
                    {createdLeases.filter(l => l.status === 'active').length}
                  </div>
                  <div style={{
                    fontSize: '9px',
                    fontWeight: '600',
                    color: '#94a3b8',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em'
                  }}>
                    ACTIVE LEASES
                  </div>
                </div>

                {/* In Process Card - Minimal */}
                <div style={{
                  background: 'white',
                  borderRadius: '6px',
                  border: '1.5px solid #3b82f6',
                  padding: '20px 16px',
                  textAlign: 'center',
                  boxShadow: 'none',
                  transition: 'all 0.2s ease'
                }}>
                  <div style={{
                    fontSize: '36px',
                    fontWeight: '300',
                    color: '#3b82f6',
                    marginBottom: '2px',
                    lineHeight: 1
                  }}>
                    {createdLeases.filter(l => l.status === 'pending').length}
                  </div>
                  <div style={{
                    fontSize: '9px',
                    fontWeight: '600',
                    color: '#94a3b8',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em'
                  }}>
                    IN PROCESS LEASES
                  </div>
                </div>

                {/* Future Leases Card - Minimal */}
                <div style={{
                  background: 'white',
                  borderRadius: '6px',
                  border: '1.5px solid #94a3b8',
                  padding: '20px 16px',
                  textAlign: 'center',
                  boxShadow: 'none',
                  transition: 'all 0.2s ease'
                }}>
                  <div style={{
                    fontSize: '36px',
                    fontWeight: '300',
                    color: '#94a3b8',
                    marginBottom: '2px',
                    lineHeight: 1
                  }}>
                    {createdLeases.filter(l => {
                      const startDate = new Date(l.start);
                      const today = new Date();
                      return startDate > today;
                    }).length}
                  </div>
                  <div style={{
                    fontSize: '9px',
                    fontWeight: '600',
                    color: '#94a3b8',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em'
                  }}>
                    FUTURE LEASES
                  </div>
                </div>

                {/* Expiring Soon Card - Minimal */}
                <div style={{
                  background: 'white',
                  borderRadius: '6px',
                  border: '1.5px solid #ef4444',
                  padding: '20px 16px',
                  textAlign: 'center',
                  boxShadow: 'none',
                  transition: 'all 0.2s ease'
                }}>
                  <div style={{
                    fontSize: '36px',
                    fontWeight: '300',
                    color: '#ef4444',
                    marginBottom: '2px',
                    lineHeight: 1
                  }}>
                    {createdLeases.filter(l => {
                      const endDate = new Date(l.end);
                      const today = new Date();
                      const daysUntilExpiry = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
                      return daysUntilExpiry > 0 && daysUntilExpiry <= 90;
                    }).length}
                  </div>
                  <div style={{
                    fontSize: '9px',
                    fontWeight: '600',
                    color: '#94a3b8',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    lineHeight: 1.3
                  }}>
                    LEASES EXPIRING IN NEXT 90 DAYS
                  </div>
                </div>

                {/* Expired Leases Card - Minimal */}
                <div style={{
                  background: 'white',
                  borderRadius: '6px',
                  border: '1.5px solid #71717a',
                  padding: '20px 16px',
                  textAlign: 'center',
                  boxShadow: 'none',
                  transition: 'all 0.2s ease'
                }}>
                  <div style={{
                    fontSize: '36px',
                    fontWeight: '300',
                    color: '#71717a',
                    marginBottom: '2px',
                    lineHeight: 1
                  }}>
                    {createdLeases.filter(l => {
                      const endDate = new Date(l.end);
                      const today = new Date();
                      return endDate < today;
                    }).length}
                  </div>
                  <div style={{
                    fontSize: '9px',
                    fontWeight: '600',
                    color: '#94a3b8',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em'
                  }}>
                    EXPIRED LEASES
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      </div>
        ) : (
          <div>
            {/* Templates Filters and Actions */}
            <div style={{
              background: 'white',
              borderRadius: '16px',
              border: '1px solid #99f6e4',
              boxShadow: '0 4px 16px rgba(20,184,166,0.1)',
              padding: isMobile ? '16px' : '20px',
              marginBottom: '16px'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '16px'
              }}>
                <input
                  type="text"
                  placeholder="Search templates..."
                  style={{
                    background: '#f0fdfa',
                    border: '1px solid #99f6e4',
                    borderRadius: '8px',
                    padding: '10px 16px',
                    fontSize: '14px',
                    color: '#134e4a',
                    outline: 'none',
                    minWidth: '250px',
                    flex: 1,
                    maxWidth: '400px'
                  }}
                />
                
                <button style={{
                  padding: '12px 24px',
                  background: 'linear-gradient(135deg, #14b8a6 0%, #2dd4bf 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(20,184,166,0.3)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 4px 12px rgba(20,184,166,0.4)';
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 2px 8px rgba(20,184,166,0.3)';
                }}
                >
                  + New Template
                </button>
              </div>
            </div>
            
            <div style={{
              fontSize: '13px',
              color: '#14b8a6',
              marginBottom: '12px',
              fontWeight: '500'
            }}>
              Showing 1 template
            </div>
            
            <div style={{
              background: 'white',
              borderRadius: '16px',
              border: '1px solid #99f6e4',
              boxShadow: '0 4px 16px rgba(20,184,166,0.1)',
              overflow: 'hidden'
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 150px 200px 150px 200px',
                gap: '20px',
                padding: '20px 24px',
                background: 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%)',
                borderBottom: '2px solid #99f6e4',
                fontSize: '12px',
                fontWeight: '700',
                color: '#134e4a',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                <div>Template Name</div>
                <div>Tenants</div>
                <div>Description</div>
                <div>Type</div>
                <div>Actions</div>
              </div>
              
              {templateData.map((template, index) => (
                <div key={template.id} style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 150px 200px 150px 200px',
                  gap: '20px',
                  padding: '20px 24px',
                  borderBottom: index < templateData.length - 1 ? '1px solid #ccfbf1' : 'none',
                  alignItems: 'center',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease',
                  background: 'white'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f0fdfa'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                >
                  <div style={{
                    color: '#134e4a',
                    fontWeight: '600',
                    fontSize: '14px'
                  }}>
                    {template.name}
                  </div>
                  
                  <div style={{
                    color: '#134e4a',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}>
                    {template.tenants}
                  </div>
                  
                  <div style={{
                    color: '#14b8a6',
                    fontSize: '13px',
                    fontWeight: '500'
                  }}>
                    {template.description}
                  </div>
                  
                  <div style={{
                    color: '#14b8a6',
                    fontSize: '13px',
                    fontWeight: '500'
                  }}>
                    {template.type}
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    gap: '8px'
                  }}>
                    <button 
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        background: '#f0fdfa',
                        border: '1px solid #99f6e4',
                        borderRadius: '6px',
                        padding: '8px 16px',
                        fontSize: '13px',
                        cursor: 'pointer',
                        color: '#134e4a',
                        fontWeight: '600',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.background = '#ccfbf1';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.background = '#f0fdfa';
                      }}
                    >
                      Edit
                    </button>
                    <button 
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        background: 'white',
                        border: '1px solid #99f6e4',
                        borderRadius: '6px',
                        padding: '8px 16px',
                        fontSize: '13px',
                        cursor: 'pointer',
                        color: '#14b8a6',
                        fontWeight: '600',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.background = '#f0fdfa';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.background = 'white';
                      }}
                    >
                      Duplicate
                    </button>
                    <button 
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        background: 'white',
                        border: '1px solid #fecaca',
                        borderRadius: '6px',
                        padding: '8px 16px',
                        fontSize: '13px',
                        cursor: 'pointer',
                        color: '#dc2626',
                        fontWeight: '600',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.background = '#fee2e2';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.background = 'white';
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
