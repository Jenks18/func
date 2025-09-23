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

const templateData = [
  {
    id: 1,
    name: "Lease Agreement",
    tenants: 1,
    description: "Leases",
    type: "Lease"
  }
];

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
              <div 
                key={property.id} 
                onClick={() => handlePropertySelect(property)}
                style={{
                display: 'grid',
                gridTemplateColumns: '300px 400px 150px 120px',
                gap: '16px',
                padding: '16px',
                borderBottom: '1px solid #f3f4f6',
                alignItems: 'center',
                cursor: 'pointer',
                backgroundColor: selectedProperty?.id === property.id ? '#f0f9ff' : 'white',
                border: selectedProperty?.id === property.id ? '2px solid #3b82f6' : '1px solid transparent',
                borderRadius: '8px',
                margin: '4px 0',
                transition: 'all 0.2s ease'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    background: selectedProperty?.id === property.id ? '#3b82f6' : '#6b7280',
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
                      color: selectedProperty?.id === property.id ? '#1e40af' : '#374151',
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
            gap: '32px'
          }}>
            <div 
              onClick={() => handleLeaseTermSelect('fixed')}
              style={{
                background: leaseFormData.leaseType === 'fixed' ? '#f0f9ff' : 'white',
                border: leaseFormData.leaseType === 'fixed' ? '2px solid #3b82f6' : '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '24px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}>
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
            
            <div 
              onClick={() => handleLeaseTermSelect('month-to-month')}
              style={{
                background: leaseFormData.leaseType === 'month-to-month' ? '#f0f9ff' : 'white',
                border: leaseFormData.leaseType === 'month-to-month' ? '2px solid #3b82f6' : '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '24px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}>
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
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Lease Begin Date *
              </label>
              <input
                type="date"
                value={leaseFormData.startDate}
                onChange={(e) => handleLeaseFormUpdate('startDate', e.target.value)}
                style={{
                  width: '100%',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  padding: '10px 12px',
                  fontSize: '14px',
                  background: 'white'
                }}
              />
            </div>
            <div style={{
              fontSize: '14px',
              color: '#6b7280',
              padding: '12px',
              background: '#f9fafb',
              borderRadius: '6px',
              border: '1px solid #e5e7eb'
            }}>
              💡 The lease will begin on the selected date. For month-to-month leases, this becomes the recurring monthly start date.
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
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Security Deposit Amount *
              </label>
              <div style={{ position: 'relative' }}>
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
                  value={leaseFormData.securityDepositAmount}
                  onChange={(e) => handleLeaseFormUpdate('securityDepositAmount', e.target.value)}
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
            </div>
            
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Due Date *
              </label>
              <select
                value={leaseFormData.securityDepositDue}
                onChange={(e) => handleLeaseFormUpdate('securityDepositDue', e.target.value)}
                style={{
                  width: '100%',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  padding: '10px 12px',
                  fontSize: '14px',
                  background: 'white'
                }}
              >
                <option value="Before Move-in">Before Move-in</option>
                <option value="On Move-in">On Move-in</option>
                <option value="Within 30 days">Within 30 days</option>
                <option value="Other">Other</option>
              </select>
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
                  height: '16px'
                }}
              />
              <label
                htmlFor="depositCollected"
                style={{
                  fontSize: '14px',
                  color: '#374151',
                  cursor: 'pointer'
                }}
              >
                I have already collected the Security Deposit
              </label>
            </div>
            
            <div style={{
              fontSize: '14px',
              color: '#6b7280',
              padding: '12px',
              background: '#f9fafb',
              borderRadius: '6px',
              border: '1px solid #e5e7eb'
            }}>
              💡 Security deposits are typically 1-2 months rent and are refundable at the end of the lease term, minus any damages or unpaid rent.
            </div>
          </div>
        </div>
      );
    case 4:
      return (
        <div style={{ padding: '24px', display: 'flex', gap: '24px' }}>
          {/* Left side - Progressive form */}
          <div style={{ flex: 1 }}>
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
              maxWidth: '500px'
            }}>
              {/* Step 1: Payment Frequency */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Payment Frequency *
                </label>
                <select
                  value={leaseFormData.paymentFrequency}
                  onChange={(e) => handleLeaseFormUpdate('paymentFrequency', e.target.value)}
                  style={{
                    width: '100%',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    padding: '10px 12px',
                    fontSize: '14px',
                    background: 'white'
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
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '8px'
                  }}>
                    Rent Amount *
                  </label>
                  <div style={{ position: 'relative' }}>
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
                      value={leaseFormData.rentAmount}
                      onChange={(e) => handleLeaseFormUpdate('rentAmount', e.target.value)}
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
                </div>
              )}

              {/* Step 3: Due Date - Shows after rent amount is entered */}
              {leaseFormData.paymentFrequency && leaseFormData.rentAmount && (
                <div style={{ marginBottom: '24px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '8px'
                  }}>
                    Due on the *
                  </label>
                  <select
                    value={leaseFormData.rentDueDay}
                    onChange={(e) => handleLeaseFormUpdate('rentDueDay', e.target.value)}
                    style={{
                      width: '100%',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      padding: '10px 12px',
                      fontSize: '14px',
                      background: 'white'
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
                        fontWeight: '500',
                        color: '#6b7280',
                        marginBottom: '4px'
                      }}>
                        Day of month (1-31)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="31"
                        value={leaseFormData.customDueDay || ''}
                        onChange={(e) => handleLeaseFormUpdate('customDueDay', e.target.value)}
                        placeholder="Enter day"
                        style={{
                          width: '100%',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          padding: '8px 12px',
                          fontSize: '14px',
                          background: 'white'
                        }}
                      />
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
                    fontWeight: '600',
                    color: '#374151',
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
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      padding: '10px 12px',
                      fontSize: '14px',
                      background: 'white'
                    }}
                  />
                  <div style={{
                    fontSize: '12px',
                    color: '#6b7280',
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
                fontWeight: '600',
                color: '#374151',
                marginBottom: '16px'
              }}>
                Scheduled Invoices
              </h3>
              
              <div style={{
                background: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                maxHeight: '500px',
                overflowY: 'auto'
              }}>
                {/* Generate scheduled invoices based on form data */}
                {generateScheduledInvoices(leaseFormData, customInvoices).map((invoice, index) => (
                  <div key={invoice.id} style={{
                    padding: '16px',
                    borderBottom: index === generateScheduledInvoices(leaseFormData, customInvoices).length - 1 ? 'none' : '1px solid #f3f4f6',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    {editingInvoice === index ? (
                      /* Edit mode */
                      <div style={{ flex: 1, display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <input
                          type="date"
                          defaultValue={invoice.rawDate.toISOString().split('T')[0]}
                          onChange={(e) => handleUpdateInvoice(index, 'date', e.target.value)}
                          style={{
                            border: '1px solid #d1d5db',
                            borderRadius: '4px',
                            padding: '4px 8px',
                            fontSize: '12px',
                            width: '120px'
                          }}
                        />
                        <input
                          type="number"
                          defaultValue={invoice.amount}
                          onChange={(e) => handleUpdateInvoice(index, 'amount', e.target.value)}
                          style={{
                            border: '1px solid #d1d5db',
                            borderRadius: '4px',
                            padding: '4px 8px',
                            fontSize: '12px',
                            width: '80px'
                          }}
                        />
                        <button
                          onClick={() => setEditingInvoice(null)}
                          style={{
                            background: '#10b981',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '4px 8px',
                            fontSize: '12px',
                            cursor: 'pointer'
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
                            fontWeight: '500',
                            color: '#374151',
                            marginBottom: '4px'
                          }}>
                            {invoice.date}
                          </div>
                          <div style={{
                            fontSize: '16px',
                            fontWeight: '600',
                            color: '#1f2937'
                          }}>
                            ${invoice.amount}
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button 
                            onClick={() => handleEditInvoice(index)}
                            style={{
                              background: '#f3f4f6',
                              border: '1px solid #d1d5db',
                              borderRadius: '4px',
                              padding: '4px 8px',
                              fontSize: '12px',
                              cursor: 'pointer',
                              color: '#374151'
                            }}
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDeleteInvoice(index)}
                            style={{
                              background: '#f3f4f6',
                              border: '1px solid #d1d5db',
                              borderRadius: '4px',
                              padding: '4px 8px',
                              fontSize: '12px',
                              cursor: 'pointer',
                              color: '#ef4444'
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
            fontWeight: '600',
            color: '#374151',
            marginBottom: '24px'
          }}>
            Add Tenants
          </h2>
          
          <div style={{
            background: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '24px',
            maxWidth: '800px'
          }}>
            {/* Tenant List */}
            {leaseFormData.tenants && leaseFormData.tenants.length > 0 && (
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '16px'
                }}>
                  Added Tenants ({leaseFormData.tenants.length})
                </h3>
                
                <div style={{
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  overflow: 'hidden'
                }}>
                  {/* Header */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '150px 150px 200px 150px 120px 120px 100px',
                    gap: '16px',
                    padding: '12px 16px',
                    background: '#f9fafb',
                    borderBottom: '1px solid #e5e7eb',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#6b7280'
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
                      borderBottom: index === leaseFormData.tenants.length - 1 ? 'none' : '1px solid #f3f4f6',
                      alignItems: 'center'
                    }}>
                      <div style={{ fontSize: '14px', color: '#374151' }}>{tenant.firstName}</div>
                      <div style={{ fontSize: '14px', color: '#374151' }}>{tenant.lastName}</div>
                      <div style={{ fontSize: '14px', color: '#374151' }}>{tenant.email}</div>
                      <div style={{ fontSize: '14px', color: '#374151' }}>{tenant.phoneNumber}</div>
                      <div>
                        <select
                          value={tenant.screening}
                          onChange={(e) => handleLeaseFormUpdate('tenants', leaseFormData.tenants.map((t, i) => 
                            i === index ? { ...t, screening: e.target.value } : t
                          ))}
                          style={{
                            width: '100%',
                            border: '1px solid #d1d5db',
                            borderRadius: '4px',
                            padding: '4px 8px',
                            fontSize: '12px',
                            background: 'white'
                          }}
                        >
                          <option value="">Not Required</option>
                          <option value="Basic">Basic Package</option>
                        </select>
                      </div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>
                        {tenant.applicationStatus || 'No Applied Yet'}
                      </div>
                      <div>
                        <button
                          onClick={() => {
                            const updatedTenants = leaseFormData.tenants.filter((_, i) => i !== index);
                            handleLeaseFormUpdate('tenants', updatedTenants);
                          }}
                          style={{
                            background: '#fee2e2',
                            color: '#dc2626',
                            border: '1px solid #fecaca',
                            borderRadius: '4px',
                            padding: '4px 8px',
                            fontSize: '12px',
                            cursor: 'pointer'
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
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '20px',
              background: '#f9fafb'
            }}>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                👥 Add Another Tenant
              </h3>
              
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
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '4px'
                  }}>
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={leaseFormData.newTenant?.firstName || ''}
                    onChange={(e) => handleLeaseFormUpdate('newTenant', {
                      ...leaseFormData.newTenant,
                      firstName: e.target.value
                    })}
                    placeholder="First Name"
                    style={{
                      width: '100%',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      padding: '8px 12px',
                      fontSize: '14px',
                      background: 'white'
                    }}
                  />
                </div>
                
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '4px'
                  }}>
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={leaseFormData.newTenant?.lastName || ''}
                    onChange={(e) => handleLeaseFormUpdate('newTenant', {
                      ...leaseFormData.newTenant,
                      lastName: e.target.value
                    })}
                    placeholder="Last Name"
                    style={{
                      width: '100%',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      padding: '8px 12px',
                      fontSize: '14px',
                      background: 'white'
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
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '4px'
                  }}>
                    Email *
                  </label>
                  <input
                    type="email"
                    value={leaseFormData.newTenant?.email || ''}
                    onChange={(e) => handleLeaseFormUpdate('newTenant', {
                      ...leaseFormData.newTenant,
                      email: e.target.value
                    })}
                    placeholder="Email"
                    style={{
                      width: '100%',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      padding: '8px 12px',
                      fontSize: '14px',
                      background: 'white'
                    }}
                  />
                </div>
                
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '4px'
                  }}>
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={leaseFormData.newTenant?.phoneNumber || ''}
                    onChange={(e) => handleLeaseFormUpdate('newTenant', {
                      ...leaseFormData.newTenant,
                      phoneNumber: e.target.value
                    })}
                    placeholder="Phone Number"
                    style={{
                      width: '100%',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      padding: '8px 12px',
                      fontSize: '14px',
                      background: 'white'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
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
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    padding: '8px 12px',
                    fontSize: '14px',
                    background: 'white'
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
                  color: '#6b7280',
                  background: '#fff',
                  padding: '8px 12px',
                  borderRadius: '4px',
                  border: '1px solid #e5e7eb'
                }}>
                  💡 You can add multiple tenants to this lease
                </div>
                
                <button
                  onClick={() => {
                    const newTenant = leaseFormData.newTenant;
                    if (newTenant?.firstName && newTenant?.lastName && newTenant?.email && newTenant?.phoneNumber) {
                      const updatedTenants = [...(leaseFormData.tenants || []), {
                        ...newTenant,
                        applicationStatus: 'No Applied Yet'
                      }];
                      handleLeaseFormUpdate('tenants', updatedTenants);
                      handleLeaseFormUpdate('newTenant', {}); // Clear form
                    }
                  }}
                  disabled={!leaseFormData.newTenant?.firstName || !leaseFormData.newTenant?.lastName || !leaseFormData.newTenant?.email || !leaseFormData.newTenant?.phoneNumber}
                  style={{
                    background: (!leaseFormData.newTenant?.firstName || !leaseFormData.newTenant?.lastName || !leaseFormData.newTenant?.email || !leaseFormData.newTenant?.phoneNumber) ? '#e5e7eb' : '#3b82f6',
                    color: (!leaseFormData.newTenant?.firstName || !leaseFormData.newTenant?.lastName || !leaseFormData.newTenant?.email || !leaseFormData.newTenant?.phoneNumber) ? '#9ca3af' : 'white',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '10px 20px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: (!leaseFormData.newTenant?.firstName || !leaseFormData.newTenant?.lastName || !leaseFormData.newTenant?.email || !leaseFormData.newTenant?.phoneNumber) ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
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
            fontWeight: '600',
            color: '#374151',
            marginBottom: '24px'
          }}>
            Rent/Deposit Sharing
          </h2>
          
          <div style={{
            background: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '24px',
            maxWidth: '800px'
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
                    style={{ width: '16px', height: '16px' }}
                  />
                  <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                    All tenants are equally responsible
                  </span>
                  <span style={{
                    background: '#e0f2fe',
                    color: '#0891b2',
                    fontSize: '12px',
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
                    style={{ width: '16px', height: '16px' }}
                  />
                  <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                    Each tenant is only responsible for his/her portion
                  </span>
                  <span style={{
                    background: '#e0f2fe',
                    color: '#0891b2',
                    fontSize: '12px',
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
                      <div style={{ position: 'relative' }}>
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
                          value={leaseFormData.equalRentAmount || leaseFormData.rentAmount || ''}
                          onChange={(e) => handleLeaseFormUpdate('equalRentAmount', e.target.value)}
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
                      <div style={{ position: 'relative' }}>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={leaseFormData.depositPercentage || '100'}
                          onChange={(e) => handleLeaseFormUpdate('depositPercentage', e.target.value)}
                          placeholder="100"
                          style={{
                            width: '100%',
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
                          fontSize: '14px'
                        }}>
                          %
                        </span>
                      </div>
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
                      <div style={{ position: 'relative' }}>
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
                          value={tenant.rentPortion || ''}
                          onChange={(e) => handleLeaseFormUpdate('tenants', leaseFormData.tenants.map((t, i) => 
                            i === index ? { ...t, rentPortion: e.target.value } : t
                          ))}
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
                      <div style={{ position: 'relative' }}>
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
                          value={tenant.depositPortion || ''}
                          onChange={(e) => handleLeaseFormUpdate('tenants', leaseFormData.tenants.map((t, i) => 
                            i === index ? { ...t, depositPortion: e.target.value } : t
                          ))}
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

export default function LeasesFilesPage() {
  const [activeMainTab, setActiveMainTab] = useState('leases'); // leases or templates
  const [showNewLeaseWizard, setShowNewLeaseWizard] = useState(false);
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
                  <div style={{ fontWeight: '600', marginBottom: '4px' }}>Security Deposit</div>
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
