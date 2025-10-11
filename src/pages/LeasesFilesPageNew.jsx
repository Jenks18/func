import React, { useState } from 'react';

/* Duplicate stub component removed to fix syntax and navigation issues.
export default function LeasesFilesPageNew() { }
*/

// Begin actual implementation below
export default function LeasesFilesPage() {
  const [activeMainTab, setActiveMainTab] = useState('leases'); // leases or templates
  const [showNewLeaseWizard, setShowNewLeaseWizard] = useState(false);
  // Check sessionStorage for navigation param to start new lease
  React.useEffect(() => {
    try {
      const raw = sessionStorage.getItem('LeasesFiles_params');
      if (raw) {
        const params = JSON.parse(raw);
        if (params.startNewLease) {
          setShowNewLeaseWizard(true);
          // one-shot
          const cleaned = { ...params };
          delete cleaned.startNewLease;
          sessionStorage.setItem('LeasesFiles_params', JSON.stringify(cleaned));
        }
      }
    } catch (e) {
      console.warn('Failed to parse LeasesFiles params', e);
    }
  }, []);
  const [showReviewPage, setShowReviewPage] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showAdditionalFeeModal, setShowAdditionalFeeModal] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [customInvoices, setCustomInvoices] = useState({}); // Track manually edited invoices
  const [createdLeases, setCreatedLeases] = useState([
    {
      id: 1,
      property: "Main Street Lofts",
      unit: "201",
      status: "Active",
      start: "Jan 1, 2024",
      end: "Jun 30, 2024",
      tenants: 1,
      rent: "$1,200.00",
      deposit: "$2,500.00",
      createdDate: "Dec 15, 2023",
      leaseType: "fixed",
      paymentFrequency: "Monthly",
      address: "101 Main St, Milford Oaks 45140",
      tenantsDetails: [
        {
          id: 1,
          firstName: "John",
          lastName: "Smith",
          email: "john.smith@email.com",
          phone: "+1 (555) 123-4567"
        }
      ],
      documents: [
        {
          id: 1,
          name: "Lease Document",
          type: "Lease Agreement",
          status: "Sent",
          lastActivity: "May 15, 2023 | 1:37 PM",
          insuranceStatus: "Not Purchased",
          actionRequired: "Signature"
        }
      ],
      leaseHistory: [
        {
          id: 1,
          action: "Lease Created",
          date: "May 15, 2023",
          time: "1:37 PM",
          user: "System"
        }
      ]
    }
  ]); // Store created leases
  const [selectedLeaseDetail, setSelectedLeaseDetail] = useState(null); // For detailed lease view
  const [steps, setSteps] = useState([
    { id: 0, title: "Property Details", icon: "⚙️", completed: false },
    { id: 1, title: "Lease Term", icon: "📄", completed: false },
    { id: 2, title: "Lease Dates", icon: "📅", completed: false },
    { id: 3, title: "Security Deposit", icon: "💰", completed: false },
    { id: 4, title: "Rent/Additional Fee", icon: "💵", completed: false },
    { id: 5, title: "Add Tenants", icon: "👥", completed: false },
    { id: 6, title: "Rent/Deposit Sharing", icon: "🤝", completed: false },
    // { id: 7, title: "Renter's Insurance", icon: "🛡️", completed: false }, // Disabled
    { id: 7, title: "Lease/Documents", icon: "📑", completed: false },
  ]);
  const [leaseFormData, setLeaseFormData] = useState({
    selectedUnit: '',
    leaseTermType: 'New Term',
    leaseType: '', // 'fixed' or 'month-to-month'
    startDate: '',
    securityDepositAmount: '',
    securityDepositDue: 'Before Move-in',
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
    // rentersInsurance: '', // Disabled for now
    scheduledInvoices: []
  });

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
    console.log('Delete invoice at index:', invoiceIndex);
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

  // Function to handle lease creation
  const handleCreateLease = () => {
    const startDate = leaseFormData.startDate ? new Date(leaseFormData.startDate) : new Date();
    
    // Calculate end date based on lease type
    let endDate;
    let endDateString;
    
    if (leaseFormData.leaseType === 'month-to-month') {
      endDateString = 'M to M';
    } else {
      // Default to 1 year lease
      endDate = new Date(startDate);
      endDate.setFullYear(startDate.getFullYear() + 1);
      endDateString = endDate.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
    }

    const newLease = {
      id: Date.now(), // Simple ID generation
      property: selectedProperty?.name || 'Main Street Lofts',
      unit: selectedProperty?.type?.match(/\d+/)?.[0] || '201', // Extract unit number
      status: 'Active',
      start: startDate.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      }),
      end: endDateString,
      tenants: leaseFormData.tenants?.length || 1,
      rent: leaseFormData.rentAmount ? `$${parseFloat(leaseFormData.rentAmount).toLocaleString()}` : '$0.00',
      deposit: leaseFormData.securityDepositAmount ? `$${parseFloat(leaseFormData.securityDepositAmount).toLocaleString()}` : '$0.00',
      createdDate: new Date().toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      }),
      leaseType: leaseFormData.leaseType || 'fixed',
      paymentFrequency: leaseFormData.paymentFrequency || 'Monthly',
      address: selectedProperty?.address || '101 Main St, Milford Oaks 45140',
      tenantsDetails: leaseFormData.tenants?.length > 0 ? leaseFormData.tenants : [
        {
          id: 1,
          firstName: "John",
          lastName: "Smith",
          email: "john.smith@email.com",
          phone: "+1 (555) 123-4567"
        }
      ],
      documents: [
        {
          id: 1,
          name: "Lease Document",
          type: "Lease Agreement",
          status: "Draft",
          lastActivity: new Date().toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
          }) + " | " + new Date().toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
          }),
          insuranceStatus: "Not Purchased",
          actionRequired: "Send"
        }
      ],
      leaseHistory: [
        {
          id: 1,
          action: "Lease Created",
          date: new Date().toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
          }),
          time: new Date().toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
          }),
          user: "System"
        }
      ]
    };

    setCreatedLeases(prev => [...prev, newLease]);
    
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
      securityDepositDue: 'Before Move-in',
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
  };

  const handleNextStep = () => {
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

  // If showing lease detail view
  if (selectedLeaseDetail) {
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
        height: '100vh',
        background: '#f8fafc',
        display: 'flex'
      }}>
        {/* Header bar with property info */}
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
          padding: '0 24px',
          zIndex: 10,
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          {selectedProperty ? (
            <>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                flex: 1
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: '#3b82f6',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '20px'
                }}>
                  🏠
                </div>
                <div>
                  <div style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#374151'
                  }}>
                    {selectedProperty.name}
                  </div>
                  <div style={{
                    fontSize: '14px',
                    color: '#6b7280'
                  }}>
                    {selectedProperty.address}
                  </div>
                </div>
              </div>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(6, 1fr)',
                gap: '16px',
                fontSize: '12px',
                color: '#6b7280'
              }}>
                <div>
                  <div style={{ fontWeight: '600', marginBottom: '4px' }}>Rental Lease For</div>
                  <div>{leaseFormData.leaseType === 'month-to-month' ? 'Month to Month' : leaseFormData.leaseType === 'fixed' ? 'Fixed Term' : ''}</div>
                </div>
                <div>
                  <div style={{ fontWeight: '600', marginBottom: '4px' }}>Start</div>
                  <div>{leaseFormData.startDate || ''}</div>
                </div>
                <div>
                  <div style={{ fontWeight: '600', marginBottom: '4px' }}>End</div>
                  <div>{leaseFormData.leaseType === 'month-to-month' ? 'M to M' : leaseFormData.leaseType === 'fixed' ? '' : ''}</div>
                </div>
                <div>
                  <div style={{ fontWeight: '600', marginBottom: '4px' }}>Deposit</div>
                  <div>{leaseFormData.securityDepositAmount ? `$${leaseFormData.securityDepositAmount}` : ''}</div>
                </div>
                <div>
                  <div style={{ fontWeight: '600', marginBottom: '4px' }}>Monthly Rent</div>
                  <div>{leaseFormData.rentAmount ? `$${leaseFormData.rentAmount}` : ''}</div>
                </div>
                <div>
                  <div style={{ fontWeight: '600', marginBottom: '4px' }}>Tenants</div>
                  <div>{leaseFormData.tenants?.length || 0}</div>
                </div>
              </div>
            </>
          ) : (
            <div style={{
              width: '100%',
              textAlign: 'center',
              color: '#9ca3af',
              fontSize: '16px'
            }}>
              Select a property to begin creating a lease
            </div>
          )}
        </div>

        {/* Main content area */}
        <div style={{
          display: 'flex',
          width: '100%',
          marginTop: '144px' // Account for fixed header
        }}>
          {/* Left sidebar with steps */}
          <div style={{
            width: '300px',
            background: 'white',
            borderRight: '1px solid #e5e7eb',
            height: 'calc(100vh - 144px)',
            overflowY: 'auto'
          }}>
            <div style={{
              padding: '24px 0'
            }}>
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  onClick={() => setCurrentStep(index)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 24px',
                    cursor: 'pointer',
                    backgroundColor: currentStep === index ? '#f0f9ff' : 'transparent',
                    borderRight: currentStep === index ? '3px solid #3b82f6' : '3px solid transparent',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: currentStep === index ? '#3b82f6' : step.completed ? '#10b981' : '#e5e7eb',
                    color: currentStep === index || step.completed ? 'white' : '#6b7280',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px',
                    fontWeight: '600'
                  }}>
                    {step.completed ? '✓' : index + 1}
                  </div>
                  <div style={{
                    color: currentStep === index ? '#1e40af' : '#374151',
                    fontWeight: currentStep === index ? '600' : '500',
                    fontSize: '14px'
                  }}>
                    {step.title}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right content area */}
          <div style={{
            flex: 1,
            background: '#f8fafc',
            height: 'calc(100vh - 144px)',
            overflowY: 'auto'
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
            
            {/* Bottom navigation */}
            <div style={{
              position: 'fixed',
              bottom: 0,
              left: '540px', // 240px sidebar + 300px step sidebar
              right: 0,
              height: '80px',
              background: 'white',
              borderTop: '1px solid #e5e7eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 24px'
            }}>
              <button
                onClick={() => setShowNewLeaseWizard(false)}
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
                Cancel
              </button>
              
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={handlePrevStep}
                  disabled={currentStep === 0}
                  style={{
                    background: currentStep === 0 ? '#e5e7eb' : '#f3f4f6',
                    color: currentStep === 0 ? '#9ca3af' : '#374151',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    padding: '12px 24px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: currentStep === 0 ? 'not-allowed' : 'pointer'
                  }}
                >
                  Back
                </button>
                <button
                  onClick={handleNextStep}
                  disabled={
                    (currentStep === 0 && !selectedProperty) ||
                    (currentStep === 1 && !leaseFormData.leaseType) ||
                    (currentStep === 2 && !leaseFormData.startDate) ||
                    (currentStep === 3 && !leaseFormData.securityDepositAmount) ||
                    (currentStep === 4 && (!leaseFormData.paymentFrequency || !leaseFormData.rentAmount || !leaseFormData.rentDueDay || (leaseFormData.rentDueDay === 'Custom' && !leaseFormData.customDueDay) || !leaseFormData.firstInvoiceDueDate)) ||
                    (currentStep === 5 && (!leaseFormData.tenants || leaseFormData.tenants.length === 0)) ||
                    (currentStep === 6 && (!leaseFormData.sharingType || (leaseFormData.sharingType === 'equal' && !leaseFormData.equalRentAmount)))
                  }
                  style={{
                    background: (
                      (currentStep === 0 && !selectedProperty) ||
                      (currentStep === 1 && !leaseFormData.leaseType) ||
                      (currentStep === 2 && !leaseFormData.startDate) ||
                      (currentStep === 3 && !leaseFormData.securityDepositAmount) ||
                      (currentStep === 4 && (!leaseFormData.paymentFrequency || !leaseFormData.rentAmount || !leaseFormData.rentDueDay || (leaseFormData.rentDueDay === 'Custom' && !leaseFormData.customDueDay) || !leaseFormData.firstInvoiceDueDate)) ||
                      (currentStep === 5 && (!leaseFormData.tenants || leaseFormData.tenants.length === 0)) ||
                      (currentStep === 6 && (!leaseFormData.sharingType || (leaseFormData.sharingType === 'equal' && !leaseFormData.equalRentAmount)))
                    ) ? '#e5e7eb' : '#3b82f6',
                    color: (
                      (currentStep === 0 && !selectedProperty) ||
                      (currentStep === 1 && !leaseFormData.leaseType) ||
                      (currentStep === 2 && !leaseFormData.startDate) ||
                      (currentStep === 3 && !leaseFormData.securityDepositAmount) ||
                      (currentStep === 4 && (!leaseFormData.paymentFrequency || !leaseFormData.rentAmount || !leaseFormData.rentDueDay || (leaseFormData.rentDueDay === 'Custom' && !leaseFormData.customDueDay) || !leaseFormData.firstInvoiceDueDate)) ||
                      (currentStep === 5 && (!leaseFormData.tenants || leaseFormData.tenants.length === 0)) ||
                      (currentStep === 6 && (!leaseFormData.sharingType || (leaseFormData.sharingType === 'equal' && !leaseFormData.equalRentAmount)))
                    ) ? '#9ca3af' : 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '12px 24px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: (
                      (currentStep === 0 && !selectedProperty) ||
                      (currentStep === 1 && !leaseFormData.leaseType) ||
                      (currentStep === 2 && !leaseFormData.startDate) ||
                      (currentStep === 3 && !leaseFormData.securityDepositAmount) ||
                      (currentStep === 4 && (!leaseFormData.paymentFrequency || !leaseFormData.rentAmount || !leaseFormData.rentDueDay || (leaseFormData.rentDueDay === 'Custom' && !leaseFormData.customDueDay) || !leaseFormData.firstInvoiceDueDate)) ||
                      (currentStep === 5 && (!leaseFormData.tenants || leaseFormData.tenants.length === 0)) ||
                      (currentStep === 6 && (!leaseFormData.sharingType || (leaseFormData.sharingType === 'equal' && !leaseFormData.equalRentAmount)))
                    ) ? 'not-allowed' : 'pointer'
                  }}
                >
                  {currentStep === steps.length - 1 ? 'Review' : 'Next'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main Leases & Files page
  return (
    <div style={{
      maxWidth: '100%',
      background: 'transparent',
      minHeight: '100vh',
      boxSizing: 'border-box',
      overflowX: 'hidden'
    }}>
      {/* Action Bar */}
      <div style={{
        background: 'white',
        borderBottom: '1px solid #e5e7eb',
        padding: '20px 24px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          marginBottom: '16px'
        }}>
          <div style={{
            fontSize: '24px',
            fontWeight: '600',
            color: '#374151'
          }}>
            📄 Leases & Files
          </div>
        </div>
        
        {/* Tab navigation */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid #e5e7eb'
        }}>
          <button
            onClick={() => setActiveMainTab('leases')}
            style={{
              padding: '12px 24px',
              border: 'none',
              background: 'transparent',
              borderBottom: activeMainTab === 'leases' ? '2px solid #3b82f6' : '2px solid transparent',
              color: activeMainTab === 'leases' ? '#3b82f6' : '#6b7280',
              fontWeight: '500',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Leases
          </button>
          <button
            onClick={() => setActiveMainTab('templates')}
            style={{
              padding: '12px 24px',
              border: 'none',
              background: 'transparent',
              borderBottom: activeMainTab === 'templates' ? '2px solid #3b82f6' : '2px solid transparent',
              color: activeMainTab === 'templates' ? '#3b82f6' : '#6b7280',
              fontWeight: '500',
              cursor: 'pointer',
              fontSize: '14px',
              position: 'relative'
            }}
          >
            Templates
            <span style={{
              background: '#e5e7eb',
              color: '#374151',
              fontSize: '12px',
              padding: '2px 6px',
              borderRadius: '4px',
              marginLeft: '8px'
            }}>
              1
            </span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '24px' }}>
        {activeMainTab === 'leases' ? (
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px'
              }}>
                <button style={{
                  background: 'white',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  🔽 Filters
                </button>
                
                <select style={{
                  background: 'white',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}>
                  <option>Not Grouped</option>
                  <option>Group by Property</option>
                  <option>Group by Status</option>
                </select>
              </div>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px'
              }}>
                {/* Quick Filter */}
                <div style={{
                  background: 'white',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  fontSize: '12px',
                  color: '#6b7280'
                }}>
                  <div style={{ fontWeight: '600', marginBottom: '4px' }}>Quick Filter</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ 
                        background: '#3b82f6', 
                        color: 'white', 
                        borderRadius: '2px', 
                        padding: '2px 6px',
                        fontSize: '10px',
                        fontWeight: '600'
                      }}>
                        {createdLeases.filter(lease => lease.status === 'Active').length}
                      </span>
                      <span>Active</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ 
                        background: '#f59e0b', 
                        color: 'white', 
                        borderRadius: '2px', 
                        padding: '2px 6px',
                        fontSize: '10px',
                        fontWeight: '600'
                      }}>
                        1
                      </span>
                      <span>Pending</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ 
                        background: '#ef4444', 
                        color: 'white', 
                        borderRadius: '2px', 
                        padding: '2px 6px',
                        fontSize: '10px',
                        fontWeight: '600'
                      }}>
                        0
                      </span>
                      <span>Expired</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ 
                        background: '#6b7280', 
                        color: 'white', 
                        borderRadius: '2px', 
                        padding: '2px 6px',
                        fontSize: '10px',
                        fontWeight: '600'
                      }}>
                        0
                      </span>
                      <span>Canceled</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setShowNewLeaseWizard(true)}
                  style={{
                    background: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '12px 20px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  📄 New Lease
                </button>
              </div>
            </div>
            
            {createdLeases.length === 0 ? (
              <div style={{
                background: 'white',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                padding: '24px',
                textAlign: 'center',
                color: '#6b7280'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📄</div>
                <div style={{ fontSize: '16px' }}>No leases found</div>
                <div style={{ fontSize: '14px', marginTop: '8px' }}>
                  Create your first lease to get started
                </div>
              </div>
            ) : (
              <div>
                <div style={{
                  fontSize: '14px',
                  color: '#6b7280',
                  marginBottom: '16px'
                }}>
                  Showing {createdLeases.length} of {createdLeases.length}
                </div>
                
                <div style={{
                  background: 'white',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  overflow: 'hidden'
                }}>
                  {/* Table Header */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '200px 100px 120px 120px 120px 100px 120px',
                    gap: '16px',
                    padding: '16px',
                    background: '#f9fafb',
                    borderBottom: '1px solid #e5e7eb',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#374151',
                    textTransform: 'uppercase',
                    letterSpacing: '0.025em'
                  }}>
                    <div>Property</div>
                    <div>Unit</div>
                    <div>Status</div>
                    <div>Start</div>
                    <div>End</div>
                    <div>Tenants</div>
                    <div>Actions</div>
                  </div>
                  
                  {/* Table Rows */}
                  {createdLeases.map((lease) => (
                    <div 
                      key={lease.id} 
                      onClick={() => setSelectedLeaseDetail(lease)}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '200px 100px 120px 120px 120px 100px 120px',
                        gap: '16px',
                        padding: '16px',
                        borderBottom: '1px solid #f3f4f6',
                        alignItems: 'center',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s ease',
                        ':hover': {
                          background: '#f9fafb'
                        }
                      }}
                      onMouseEnter={(e) => e.target.style.background = '#f9fafb'}
                      onMouseLeave={(e) => e.target.style.background = 'transparent'}
                    >
                      <div>
                        <div style={{
                          color: '#374151',
                          fontWeight: '500',
                          fontSize: '14px',
                          marginBottom: '2px'
                        }}>
                          {lease.property}
                        </div>
                        <div style={{
                          color: '#6b7280',
                          fontSize: '12px'
                        }}>
                          {lease.address?.split(',')[0] || '101 Main St'}
                        </div>
                      </div>
                      
                      <div style={{
                        color: '#374151',
                        fontSize: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        🏠 {lease.unit}
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
                          {lease.status}
                        </span>
                      </div>
                      
                      <div style={{
                        color: '#374151',
                        fontSize: '14px'
                      }}>
                        {lease.start}
                      </div>
                      
                      <div style={{
                        color: '#374151',
                        fontSize: '14px'
                      }}>
                        {lease.end}
                      </div>
                      
                      <div style={{
                        color: '#374151',
                        fontSize: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        👥 {lease.tenants}
                      </div>
                      
                      <div style={{
                        display: 'flex',
                        gap: '8px'
                      }}>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedLeaseDetail(lease);
                          }}
                          style={{
                            background: '#f3f4f6',
                            border: '1px solid #d1d5db',
                            borderRadius: '4px',
                            padding: '6px 12px',
                            fontSize: '12px',
                            cursor: 'pointer',
                            color: '#374151'
                          }}
                        >
                          View
                        </button>
                        <button 
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            background: '#f3f4f6',
                            border: '1px solid #d1d5db',
                            borderRadius: '4px',
                            padding: '6px 12px',
                            fontSize: '12px',
                            cursor: 'pointer',
                            color: '#374151'
                          }}
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px'
              }}>
                <button style={{
                  background: 'white',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  🔽 Filters
                </button>
              </div>
              
              <button style={{
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 20px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                📄 New Template
              </button>
            </div>
            
            <div style={{
              fontSize: '14px',
              color: '#6b7280',
              marginBottom: '16px'
            }}>
              Showing 1 of 1
            </div>
            
            <div style={{
              background: 'white',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              overflow: 'hidden'
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '300px 150px 200px 150px 200px',
                gap: '16px',
                padding: '16px',
                background: '#f9fafb',
                borderBottom: '1px solid #e5e7eb',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                textTransform: 'uppercase',
                letterSpacing: '0.025em'
              }}>
                <div>Template Name</div>
                <div># of Tenants</div>
                <div>Description</div>
                <div>Type</div>
                <div></div>
              </div>
              
              {templateData.map((template) => (
                <div key={template.id} style={{
                  display: 'grid',
                  gridTemplateColumns: '300px 150px 200px 150px 200px',
                  gap: '16px',
                  padding: '16px',
                  borderBottom: '1px solid #f3f4f6',
                  alignItems: 'center'
                }}>
                  <div style={{
                    color: '#374151',
                    fontWeight: '500',
                    fontSize: '14px'
                  }}>
                    {template.name}
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    color: '#374151',
                    fontSize: '14px'
                  }}>
                    👥 {template.tenants}
                  </div>
                  
                  <div style={{
                    color: '#374151',
                    fontSize: '14px'
                  }}>
                    {template.description}
                  </div>
                  
                  <div style={{
                    color: '#374151',
                    fontSize: '14px'
                  }}>
                    {template.type}
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    gap: '8px'
                  }}>
                    <button style={{
                      background: '#f3f4f6',
                      border: '1px solid #d1d5db',
                      borderRadius: '4px',
                      padding: '6px 12px',
                      fontSize: '12px',
                      cursor: 'pointer',
                      color: '#374151'
                    }}>
                      Edit
                    </button>
                    <button style={{
                      background: '#f3f4f6',
                      border: '1px solid #d1d5db',
                      borderRadius: '4px',
                      padding: '6px 12px',
                      fontSize: '12px',
                      cursor: 'pointer',
                      color: '#374151'
                    }}>
                      Duplicate
                    </button>
                    <button style={{
                      background: '#f3f4f6',
                      border: '1px solid #d1d5db',
                      borderRadius: '4px',
                      padding: '6px 12px',
                      fontSize: '12px',
                      cursor: 'pointer',
                      color: '#ef4444'
                    }}>
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
