import React, { useState } from 'react';

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

const steps = [
  { id: 0, title: "Property Details", icon: "⚙️", completed: false },
  { id: 1, title: "Lease Term", icon: "📄", completed: false },
  { id: 2, title: "Lease Dates", icon: "📅", completed: false },
  { id: 3, title: "Security Deposit", icon: "💰", completed: false },
  { id: 4, title: "Rent/Additional Fee", icon: "💵", completed: false },
  { id: 5, title: "Add Tenants", icon: "👥", completed: false },
  { id: 6, title: "Rent/Deposit Sharing", icon: "🤝", completed: false },
  { id: 7, title: "Renter's Insurance", icon: "🛡️", completed: false },
  { id: 8, title: "Lease/Documents", icon: "📑", completed: false },
];

const templateData = [
  {
    id: 1,
    name: "Lease Agreement",
    tenants: 1,
    description: "Leases",
    type: "Lease"
  }
];

const propertiesData = [
  {
    id: 1,
    name: "Main Street Lofts",
    type: "101 Residential",
    address: "101 Main St, Milford Oaks 45140",
    rent: "$0.00",
    bedrooms: 2,
    bathrooms: 1,
    sqft: "1200 sq ft"
  },
  {
    id: 2,
    name: "Main Street Lofts",
    type: "101 Residential", 
    address: "101 Main St, Milford Oaks 45140",
    rent: "$1,500.00",
    bedrooms: 1,
    bathrooms: 1,
    sqft: "1000 sq ft"
  },
  {
    id: 3,
    name: "Main Street Lofts",
    type: "201 Residential",
    address: "101 Main St, Milford Oaks 45140", 
    rent: "$0.00",
    bedrooms: 2,
    bathrooms: 1,
    sqft: "1200 sq ft"
  },
  {
    id: 4,
    name: "Main Street Lofts",
    type: "201 Residential",
    address: "101 Main St, Milford Oaks 45140",
    rent: "$2,000.00", 
    bedrooms: 1,
    bathrooms: 1,
    sqft: "1000 sq ft"
  }
];

function StepContent({ step }) {
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
              fontSize: '24px',
              fontWeight: '600',
              color: '#374151',
              margin: 0
            }}>
              Select a Property
            </h2>
            <button style={{
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '10px 16px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer'
            }}>
              + New Property
            </button>
          </div>
          
          <div style={{
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <select style={{
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              padding: '8px 12px',
              fontSize: '14px',
              background: 'white',
              minWidth: '150px'
            }}>
              <option>All Properties</option>
            </select>
            <div style={{
              position: 'relative',
              flex: 1,
              maxWidth: '300px'
            }}>
              <input
                type="text"
                placeholder="Search"
                style={{
                  width: '100%',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  padding: '8px 12px 8px 36px',
                  fontSize: '14px'
                }}
              />
              <div style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#9ca3af'
              }}>
                🔍
              </div>
            </div>
          </div>
          
          <div style={{
            background: 'white',
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
            overflow: 'hidden'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '300px 400px 150px 120px',
              gap: '16px',
              padding: '16px',
              background: '#f9fafb',
              borderBottom: '1px solid #e5e7eb',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151'
            }}>
              <div>Properties</div>
              <div>Address</div>
              <div>Total Monthly Rent</div>
              <div>Features</div>
            </div>
            
            {propertiesData.map((property) => (
              <div key={property.id} style={{
                display: 'grid',
                gridTemplateColumns: '300px 400px 150px 120px',
                gap: '16px',
                padding: '16px',
                borderBottom: '1px solid #f3f4f6',
                alignItems: 'center',
                cursor: 'pointer'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    background: '#3b82f6',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '16px'
                  }}>
                    🏠
                  </div>
                  <div>
                    <div style={{
                      fontWeight: '600',
                      color: '#374151',
                      fontSize: '14px'
                    }}>
                      {property.name}
                    </div>
                    <div style={{
                      color: '#6b7280',
                      fontSize: '12px'
                    }}>
                      {property.type}
                    </div>
                  </div>
                </div>
                
                <div style={{
                  color: '#374151',
                  fontSize: '14px'
                }}>
                  {property.address}
                </div>
                
                <div style={{
                  fontWeight: '600',
                  color: '#374151',
                  fontSize: '14px'
                }}>
                  {property.rent}
                </div>
                
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '12px',
                  color: '#6b7280'
                }}>
                  <span>🛏️ {property.bedrooms}</span>
                  <span>🚿 {property.bathrooms}</span>
                  <span>📐 {property.sqft}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    case 1:
      return (
        <div style={{ padding: '24px' }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '600',
            color: '#374151',
            marginBottom: '24px'
          }}>
            Lease Term
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '24px',
            marginBottom: '32px'
          }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Select Unit
              </label>
              <select style={{
                width: '100%',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                padding: '10px 12px',
                fontSize: '14px',
                background: 'white'
              }}>
                <option>Main Street Lofts - 201</option>
                <option>Main Street Lofts - 101</option>
                <option>Main Street Lofts - 301</option>
              </select>
            </div>
            
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Select Lease Term
              </label>
              <select style={{
                width: '100%',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                padding: '10px 12px',
                fontSize: '14px',
                background: 'white'
              }}>
                <option>New Term</option>
                <option>Transfer</option>
                <option>Renewal</option>
                <option>Extension</option>
              </select>
            </div>
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '32px'
          }}>
            <div style={{
              background: 'white',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              padding: '24px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            className="lease-option"
            onClick={(e) => {
              document.querySelectorAll('.lease-option').forEach(el => {
                el.style.borderColor = '#e5e7eb';
                el.style.backgroundColor = 'white';
              });
              e.currentTarget.style.borderColor = '#3b82f6';
              e.currentTarget.style.backgroundColor = '#f0f9ff';
            }}
            >
              <h3 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                📄 Fixed Term
              </h3>
              <p style={{
                color: '#6b7280',
                fontSize: '14px',
                margin: 0
              }}>
                Traditional lease with fixed end date offering automatic renewal. A fixed term lease.
              </p>
            </div>
            
            <div style={{
              background: 'white',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              padding: '24px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            className="lease-option"
            onClick={(e) => {
              document.querySelectorAll('.lease-option').forEach(el => {
                el.style.borderColor = '#e5e7eb';
                el.style.backgroundColor = 'white';
              });
              e.currentTarget.style.borderColor = '#3b82f6';
              e.currentTarget.style.backgroundColor = '#f0f9ff';
            }}
            >
              <h3 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
              📅 Month to Month
              </h3>
              <p style={{
                color: '#6b7280',
                fontSize: '14px',
                margin: 0
              }}>
                Continues month to month. May be terminated each month by proper notice from either party.
              </p>
            </div>
          </div>
        </div>
      );
    case 2:
      return (
        <div style={{ padding: '24px' }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '600',
            color: '#374151',
            marginBottom: '24px'
          }}>
            Lease Dates
          </h2>
          <div style={{
            background: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '24px',
            maxWidth: '400px'
          }}>
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Lease Start Date
              </label>
              <input
                type="date"
                defaultValue="2024-05-15"
                style={{
                  width: '100%',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  padding: '10px 12px',
                  fontSize: '14px'
                }}
              />
            </div>
            
            <div style={{
              padding: '16px',
              background: '#f0f9ff',
              borderRadius: '6px',
              border: '1px solid #bfdbfe'
            }}>
              <p style={{
                margin: 0,
                fontSize: '14px',
                color: '#1e40af'
              }}>
                Since you selected Month to Month, the lease will continue indefinitely until proper notice is given by either party.
              </p>
            </div>
          </div>
        </div>
      );
    case 3:
      return (
        <div style={{ padding: '24px' }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '600',
            color: '#374151',
            marginBottom: '24px'
          }}>
            Security Deposit
          </h2>
          <div style={{
            background: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '24px',
            maxWidth: '500px'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px',
              marginBottom: '24px'
            }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Security Deposit Amount
                </label>
                <input
                  type="number"
                  placeholder="0.00"
                  style={{
                    width: '100%',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    padding: '10px 12px',
                    fontSize: '14px'
                  }}
                />
              </div>
              
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Due Date
                </label>
                <select style={{
                  width: '100%',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  padding: '10px 12px',
                  fontSize: '14px',
                  background: 'white'
                }}>
                  <option>Before Move-in</option>
                  <option>On Move-in</option>
                  <option>Within 30 days</option>
                  <option>Custom Date</option>
                </select>
              </div>
            </div>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '16px',
              background: '#f9fafb',
              borderRadius: '6px',
              border: '1px solid #e5e7eb'
            }}>
              <input
                type="checkbox"
                id="depositCollected"
                style={{
                  width: '16px',
                  height: '16px'
                }}
              />
              <label htmlFor="depositCollected" style={{
                fontSize: '14px',
                color: '#374151',
                cursor: 'pointer'
              }}>
                Mark as already collected and create a payment record
              </label>
            </div>
            
            <div style={{
              marginTop: '16px',
              fontSize: '12px',
              color: '#6b7280'
            }}>
              💡 If checked, the system will automatically create a payment record and mark the security deposit as paid.
            </div>
          </div>
        </div>
      );
    case 4:
      return (
        <div style={{ padding: '24px' }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '600',
            color: '#374151',
            marginBottom: '24px'
          }}>
            Rent/Additional Fee
          </h2>
          <div style={{
            background: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '24px',
            maxWidth: '600px'
          }}>
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Payment Frequency
              </label>
              <select style={{
                width: '200px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                padding: '10px 12px',
                fontSize: '14px',
                background: 'white'
              }}>
                <option>Monthly</option>
                <option>Weekly</option>
                <option>Bi-weekly</option>
                <option>Quarterly</option>
                <option>Annually</option>
              </select>
            </div>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: '150px 1fr',
              gap: '16px',
              alignItems: 'end',
              marginBottom: '24px'
            }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Rent
                </label>
                <div style={{
                  position: 'relative'
                }}>
                  <span style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#6b7280',
                    fontSize: '14px'
                  }}>
                    $
                  </span>
                  <input
                    type="number"
                    placeholder="Amount"
                    style={{
                      width: '100%',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      padding: '10px 12px 10px 28px',
                      fontSize: '14px'
                    }}
                  />
                </div>
              </div>
              <div>
                <button style={{
                  background: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '10px 16px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  + Add Additional Fee (Optional)
                </button>
              </div>
            </div>
            
            <div style={{
              padding: '16px',
              background: '#fef3c7',
              borderRadius: '6px',
              border: '1px solid #fbbf24'
            }}>
              <p style={{
                margin: 0,
                fontSize: '14px',
                color: '#92400e'
              }}>
                💡 Additional fees can include pet fees, parking fees, storage fees, etc. You can add multiple fees if needed.
              </p>
            </div>
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

export default function LeasesFilesPage() {
  const [activeMainTab, setActiveMainTab] = useState('leases'); // leases or templates
  const [showNewLeaseWizard, setShowNewLeaseWizard] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

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
                {leaseData.propertyName}
              </div>
              <div style={{
                fontSize: '14px',
                color: '#6b7280'
              }}>
                {leaseData.address}
              </div>
            </div>
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '16px',
            fontSize: '12px',
            color: '#6b7280'
          }}>
            <div>
              <div style={{ fontWeight: '600', marginBottom: '4px' }}>Rental Lease Fee</div>
              <div>{leaseData.rentalLeaseFee}</div>
            </div>
            <div>
              <div style={{ fontWeight: '600', marginBottom: '4px' }}>Start</div>
              <div>{leaseData.start}</div>
            </div>
            <div>
              <div style={{ fontWeight: '600', marginBottom: '4px' }}>End</div>
              <div>{leaseData.end}</div>
            </div>
            <div>
              <div style={{ fontWeight: '600', marginBottom: '4px' }}>Security Deposit</div>
              <div>{leaseData.securityDeposit}</div>
            </div>
            <div>
              <div style={{ fontWeight: '600', marginBottom: '4px' }}>Monthly Rent</div>
              <div>{leaseData.monthlyRent}</div>
            </div>
            <div>
              <div style={{ fontWeight: '600', marginBottom: '4px' }}>Tenants</div>
              <div>{leaseData.tenants}</div>
            </div>
            <div>
              <div style={{ fontWeight: '600', marginBottom: '4px' }}>Renter's Insurance</div>
              <div>{leaseData.rentersInsurance}</div>
            </div>
          </div>
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
            <StepContent step={currentStep} />
            
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
                  onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
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
                  onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
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
                  {currentStep === steps.length - 1 ? 'Complete' : 'Next'}
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
      width: '100%',
      height: '100vh',
      background: '#f8fafc'
    }}>
      {/* Header */}
      <div style={{
        background: 'white',
        borderBottom: '1px solid #e5e7eb',
        padding: '16px 24px'
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
                color: '#374151'
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
