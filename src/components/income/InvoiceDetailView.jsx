import React, { useState, useEffect } from 'react';
import RecordPaymentModal from './RecordPaymentModal';

export default function InvoiceDetailView({ 
  selectedInvoice, 
  allInvoices, 
  onInvoiceSelect, 
  onClose,
  isMobile 
}) {
  const [openActionMenu, setOpenActionMenu] = useState(null);
  const [isAddingNewItem, setIsAddingNewItem] = useState(false);
  const [showRecordPayment, setShowRecordPayment] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  
  // Editable invoice data (for edit mode)
  const [editableInvoice, setEditableInvoice] = useState(selectedInvoice);

  // Update editable invoice when selected invoice changes
  useEffect(() => {
    setEditableInvoice(selectedInvoice);
    setIsEditMode(false); // Reset edit mode when switching invoices
  }, [selectedInvoice]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openActionMenu !== null) {
        setOpenActionMenu(null);
      }
    };

    if (openActionMenu !== null) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [openActionMenu]);

  // Handle save invoice changes
  const handleSaveInvoice = async () => {
    try {
      // TODO: Database Integration - Update Invoice
      // API Endpoint: PUT /api/invoices/:invoiceId
      // Request Body: {
      //   subject: editableInvoice.subject,
      //   dueDate: editableInvoice.dueOn,  // Updated due date from date picker
      //   items: editableInvoice.items.map(item => ({
      //     id: item.id,
      //     name: item.name,
      //     description: item.description,
      //     amount: item.amount
      //   })),
      //   notes: editableInvoice.notes
      // }
      // Expected Response: { success: true, invoice: {...}, message: 'Invoice updated' }
      // Error Handling: Display specific error messages for validation failures
      // Side Effects: Recalculate overdue status if due date changed
      
      // const response = await fetch(`/api/invoices/${editableInvoice.id}`, {
      //   method: 'PUT',
      //   headers: { 
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${authToken}` // Add auth token
      //   },
      //   body: JSON.stringify({
      //     subject: editableInvoice.subject,
      //     dueDate: editableInvoice.dueOn,
      //     items: editableInvoice.invoiceItems,
      //     notes: editableInvoice.notes
      //   })
      // });
      // const data = await response.json();
      // if (!response.ok) throw new Error(data.message);
      
      console.log('Saving invoice:', editableInvoice);
      alert('Invoice saved successfully!');
      setIsEditMode(false);
      // TODO: Refresh invoice data after save
      // onInvoiceUpdated(data.invoice);
    } catch (error) {
      console.error('Error saving invoice:', error);
      alert('Error saving invoice: ' + error.message);
    }
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditableInvoice(selectedInvoice); // Reset to original
    setIsEditMode(false);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString || dateString === 'N/A') return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div style={{
      display: 'flex',
      gap: '0',
      height: 'calc(100vh - 280px)',
      maxHeight: 'calc(100vh - 280px)',
      overflow: 'hidden',
      borderRadius: '16px',
      border: '1px solid #99f6e4',
      boxShadow: '0 4px 16px rgba(20,184,166,0.1)',
      width: '100%'
    }}>
      {/* Left side - Compressed invoice list (280px fixed) */}
      <div style={{
        width: '280px',
        minWidth: '280px',
        maxWidth: '280px',
        borderRight: '2px solid #e5e7eb',
        background: 'white',
        overflowY: 'auto',
        overflowX: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        height: '100%'
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
            INVOICES
          </div>
          <div style={{
            fontSize: '13px',
            color: '#134e4a',
            fontWeight: '600'
          }}>
            Showing {allInvoices.length} invoices
          </div>
        </div>

        {/* Compressed Table */}
        <div style={{ 
          flex: 1, 
          overflowY: 'auto',
          overflowX: 'hidden'
        }}>
          <table style={{
            width: '100%',
            borderCollapse: 'separate',
            borderSpacing: '0 6px',
            padding: '12px'
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
                  TENANT
                </th>
                <th style={{
                  padding: '8px 10px',
                  textAlign: 'right',
                  fontSize: '9px',
                  fontWeight: '700',
                  color: '#0f766e',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  width: '70px',
                  background: '#f0fdfa',
                  position: 'sticky',
                  top: 0
                }}>
                  BALANCE
                </th>
              </tr>
            </thead>
            <tbody>
              {allInvoices.map((invoice) => (
                <tr 
                  key={invoice.id}
                  onClick={() => onInvoiceSelect(invoice)}
                  style={{
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <td style={{
                    padding: '8px 10px',
                    fontSize: '11px',
                    background: selectedInvoice?.id === invoice.id 
                      ? 'linear-gradient(135deg, #ccfbf1 0%, #99f6e4 100%)'
                      : '#f9fafb',
                    borderTopLeftRadius: '6px',
                    borderBottomLeftRadius: '6px',
                    fontWeight: selectedInvoice?.id === invoice.id ? '700' : '500'
                  }}>
                    <span style={{
                      padding: '3px 8px',
                      borderRadius: '4px',
                      fontSize: '10px',
                      fontWeight: '600',
                      background: invoice.status === 'Fully Paid' 
                        ? 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)'
                        : invoice.status === 'Overdue'
                        ? 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)'
                        : 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                      color: invoice.status === 'Fully Paid' 
                        ? '#065f46'
                        : invoice.status === 'Overdue'
                        ? '#991b1b'
                        : '#92400e'
                    }}>
                      {invoice.status === 'Fully Paid' ? 'Paid' : 
                       invoice.status === 'Overdue' ? 'Late' : invoice.status}
                    </span>
                  </td>
                  <td style={{
                    padding: '8px 10px',
                    fontSize: '12px',
                    fontWeight: '500',
                    color: '#115e59',
                    background: selectedInvoice?.id === invoice.id 
                      ? 'linear-gradient(135deg, #ccfbf1 0%, #99f6e4 100%)'
                      : '#f9fafb'
                  }}>
                    {invoice.tenant}
                  </td>
                  <td style={{
                    padding: '8px 10px',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: invoice.balance > 0 ? '#dc2626' : '#059669',
                    textAlign: 'right',
                    background: selectedInvoice?.id === invoice.id 
                      ? 'linear-gradient(135deg, #ccfbf1 0%, #99f6e4 100%)'
                      : '#f9fafb',
                    borderTopRightRadius: '6px',
                    borderBottomRightRadius: '6px'
                  }}>
                    {formatCurrency(invoice.balance)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Right side - Invoice detail */}
      <div style={{
        flex: 1,
        background: 'white',
        overflowY: 'auto',
        overflowX: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        position: 'relative'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            zIndex: 10,
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = '#fee2e2';
            e.currentTarget.style.borderColor = '#fca5a5';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'white';
            e.currentTarget.style.borderColor = '#e5e7eb';
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M12 4L4 12M4 4L12 12" stroke="#374151" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>

        {/* Invoice Header */}
        <div style={{
          padding: '32px',
          borderBottom: '2px solid #e5e7eb',
          background: 'linear-gradient(135deg, #f0fdfa 0%, #ffffff 100%)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '20px'
          }}>
            <div>
              <div style={{
                fontSize: '28px',
                fontWeight: '700',
                color: '#115e59',
                marginBottom: '4px'
              }}>
                INVOICE
              </div>
              <div style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#0f766e'
              }}>
                {selectedInvoice.id}
              </div>
              <div style={{
                fontSize: '14px',
                color: '#6b7280',
                marginTop: '8px'
              }}>
                {selectedInvoice.property}
              </div>
            </div>
            <div style={{
              display: 'flex',
              gap: '12px',
              alignItems: 'flex-start'
            }}>
              <div style={{
                padding: '8px 16px',
                borderRadius: '8px',
                background: selectedInvoice.status === 'Fully Paid' 
                  ? 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)'
                  : 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
                border: selectedInvoice.status === 'Fully Paid'
                  ? '2px solid #6ee7b7'
                  : '2px solid #fca5a5'
              }}>
                <div style={{
                  fontSize: '16px',
                  fontWeight: '700',
                  color: selectedInvoice.status === 'Fully Paid' ? '#065f46' : '#991b1b'
                }}>
                  {selectedInvoice.status}
                </div>
                {selectedInvoice.daysLate > 0 && (
                  <div style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#991b1b',
                    marginTop: '2px'
                  }}>
                    {selectedInvoice.daysLate} days late
                  </div>
                )}
              </div>

              {/* Add Note Button - Only show in edit mode */}
              {isEditMode && (
                <button style={{
                  padding: '8px 14px',
                  background: 'white',
                  color: '#14b8a6',
                  border: '1px solid #99f6e4',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  height: 'fit-content'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%)';
                  e.currentTarget.style.borderColor = '#14b8a6';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'white';
                  e.currentTarget.style.borderColor = '#99f6e4';
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#14b8a6" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 8v8M8 12h8"/>
                  </svg>
                  Add Note
                </button>
              )}
            </div>
          </div>

          {/* Invoice Meta Info */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '20px',
            marginTop: '24px'
          }}>
            <div>
              <div style={{
                fontSize: '10px',
                fontWeight: '700',
                color: '#6b7280',
                marginBottom: '4px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Invoice Generated On
              </div>
              <div style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#115e59'
              }}>
                {formatDate(selectedInvoice.dueOn)}
              </div>
            </div>
            <div>
              <div style={{
                fontSize: '10px',
                fontWeight: '700',
                color: '#6b7280',
                marginBottom: '4px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Due
              </div>
              {isEditMode ? (
                <input
                  type="date"
                  value={editableInvoice.dueOn ? new Date(editableInvoice.dueOn).toISOString().split('T')[0] : ''}
                  onChange={(e) => setEditableInvoice({ ...editableInvoice, dueOn: e.target.value })}
                  style={{
                    padding: '6px 10px',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#dc2626',
                    border: '2px solid #14b8a6',
                    borderRadius: '6px',
                    background: '#f0fdfa',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                />
              ) : (
                <div style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#dc2626'
                }}>
                  {formatDate(selectedInvoice.dueOn)}
                </div>
              )}
            </div>
            <div>
              <div style={{
                fontSize: '10px',
                fontWeight: '700',
                color: '#6b7280',
                marginBottom: '4px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Sent To
              </div>
              <div style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#115e59'
              }}>
                {selectedInvoice.tenant}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{
          padding: '20px 32px',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          gap: '12px',
          flexWrap: 'wrap'
        }}>
          <button style={{
            padding: '10px 20px',
            borderRadius: '8px',
            border: '1px solid #14b8a6',
            background: 'white',
            color: '#0f766e',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'white';
          }}>
            Download
          </button>
          {selectedInvoice.status === 'Overdue' && (
            <button style={{
              padding: '10px 20px',
              borderRadius: '8px',
              border: '1px solid #14b8a6',
              background: 'white',
              color: '#0f766e',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'white';
            }}>
              Remind
            </button>
          )}
          {selectedInvoice.status === 'Overdue' && (
            <button style={{
              padding: '10px 20px',
              borderRadius: '8px',
              border: '1px solid #fbbf24',
              background: 'white',
              color: '#92400e',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'white';
            }}>
              Waive Late Fee $20.00
            </button>
          )}
          <button 
            onClick={() => setShowRecordPayment(true)}
            disabled={isEditMode}
            style={{
            padding: '10px 20px',
            borderRadius: '8px',
            border: '1px solid #14b8a6',
            background: isEditMode ? '#f3f4f6' : 'white',
            color: isEditMode ? '#9ca3af' : '#0f766e',
            fontSize: '14px',
            fontWeight: '600',
            cursor: isEditMode ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
            opacity: isEditMode ? 0.5 : 1
          }}
          onMouseOver={(e) => {
            if (!isEditMode) {
              e.currentTarget.style.background = 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%)';
            }
          }}
          onMouseOut={(e) => {
            if (!isEditMode) {
              e.currentTarget.style.background = 'white';
            }
          }}>
            Record Payment
          </button>
          
          {/* Conditional buttons based on edit mode */}
          {!isEditMode ? (
            <>
              <button 
                onClick={() => setIsEditMode(true)}
                style={{
                  padding: '10px 20px',
                  borderRadius: '8px',
                  border: '1px solid #14b8a6',
                  background: 'white',
                  color: '#0f766e',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'white';
                }}
              >
                Edit Invoice
              </button>
              <button 
                onClick={() => {
                  if (confirm('Are you sure you want to delete this invoice?')) {
                    // TODO: Database Integration - Delete Invoice
                    // API Endpoint: DELETE /api/invoices/:invoiceId
                    // Expected Response: { success: true, message: 'Invoice deleted' }
                    // Note: Should also delete related invoice_items and update tenant balance
                    
                    // async deleteInvoice() {
                    //   const response = await fetch(`/api/invoices/${selectedInvoice.id}`, {
                    //     method: 'DELETE',
                    //     headers: { 'Authorization': `Bearer ${authToken}` }
                    //   });
                    //   const data = await response.json();
                    //   if (response.ok) {
                    //     onInvoiceDeleted(selectedInvoice.id); // Refresh parent list
                    //     onClose();
                    //   }
                    // }
                    
                    alert('Invoice deleted!');
                    onClose();
                  }
                }}
                style={{
                  padding: '10px 20px',
                  borderRadius: '8px',
                  border: '1px solid #fca5a5',
                  background: 'white',
                  color: '#dc2626',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)';
                  e.currentTarget.style.borderColor = '#dc2626';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'white';
                  e.currentTarget.style.borderColor = '#fca5a5';
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5">
                  <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                  <line x1="10" y1="11" x2="10" y2="17"/>
                  <line x1="14" y1="11" x2="14" y2="17"/>
                </svg>
                Delete
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={handleCancelEdit}
                style={{
                  padding: '10px 20px',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  background: 'white',
                  color: '#6b7280',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = '#f3f4f6';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'white';
                }}
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveInvoice}
                style={{
                  padding: '10px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 12px rgba(20,184,166,0.3)'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(20,184,166,0.4)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(20,184,166,0.3)';
                }}
              >
                Save
              </button>
            </>
          )}
        </div>

        {/* Invoice Details */}
        <div style={{
          padding: '32px',
          flex: 1,
          overflowY: 'auto'
        }}>
          {/* Contact Info */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '32px',
            marginBottom: '32px'
          }}>
            <div>
              <div style={{
                fontSize: '12px',
                fontWeight: '700',
                color: '#6b7280',
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Subject
              </div>
              {isEditMode ? (
                <input
                  type="text"
                  value={editableInvoice.subject || `Rent due on ${editableInvoice.dueOn}`}
                  onChange={(e) => setEditableInvoice({ ...editableInvoice, subject: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    fontSize: '14px',
                    color: '#115e59',
                    fontWeight: '500',
                    border: '2px solid #14b8a6',
                    borderRadius: '6px',
                    background: '#f0fdfa',
                    outline: 'none'
                  }}
                />
              ) : (
                <div style={{
                  fontSize: '14px',
                  color: '#115e59',
                  fontWeight: '500'
                }}>
                  Rent due on January 1, 2025
                </div>
              )}
            </div>
            <div>
              <div style={{
                fontSize: '12px',
                fontWeight: '700',
                color: '#6b7280',
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Contact Address
              </div>
              <div style={{
                fontSize: '14px',
                color: '#115e59',
                fontWeight: '500'
              }}>
                {selectedInvoice.property}, Unit {selectedInvoice.unit}
              </div>
            </div>
          </div>

          {/* Invoice Items */}
          <div style={{
            marginBottom: '32px'
          }}>
            <div style={{
              fontSize: '14px',
              fontWeight: '700',
              color: '#115e59',
              marginBottom: '16px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Invoice Items
            </div>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              overflow: 'hidden'
            }}>
              <thead>
                <tr style={{
                  background: 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%)'
                }}>
                  <th style={{
                    padding: '12px',
                    textAlign: 'left',
                    fontSize: '11px',
                    fontWeight: '700',
                    color: '#0f766e',
                    textTransform: 'uppercase',
                    borderBottom: '1px solid #e5e7eb'
                  }}>
                    Item
                  </th>
                  <th style={{
                    padding: '12px',
                    textAlign: 'left',
                    fontSize: '11px',
                    fontWeight: '700',
                    color: '#0f766e',
                    textTransform: 'uppercase',
                    borderBottom: '1px solid #e5e7eb'
                  }}>
                    Description
                  </th>
                  <th style={{
                    padding: '12px',
                    textAlign: 'center',
                    fontSize: '11px',
                    fontWeight: '700',
                    color: '#0f766e',
                    textTransform: 'uppercase',
                    borderBottom: '1px solid #e5e7eb',
                    width: '80px'
                  }}>
                    Quantity
                  </th>
                  <th style={{
                    padding: '12px',
                    textAlign: 'right',
                    fontSize: '11px',
                    fontWeight: '700',
                    color: '#0f766e',
                    textTransform: 'uppercase',
                    borderBottom: '1px solid #e5e7eb',
                    width: '100px'
                  }}>
                    Rate
                  </th>
                  <th style={{
                    padding: '12px',
                    textAlign: 'right',
                    fontSize: '11px',
                    fontWeight: '700',
                    color: '#0f766e',
                    textTransform: 'uppercase',
                    borderBottom: '1px solid #e5e7eb',
                    width: '120px'
                  }}>
                    Amount
                  </th>
                  <th style={{
                    padding: '12px',
                    textAlign: 'center',
                    fontSize: '11px',
                    fontWeight: '700',
                    color: '#0f766e',
                    textTransform: 'uppercase',
                    borderBottom: '1px solid #e5e7eb',
                    width: '100px'
                  }}>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {selectedInvoice.invoiceItems.map((item, idx) => (
                  <tr key={idx} style={{
                    background: idx % 2 === 0 ? 'white' : '#f9fafb'
                  }}>
                    <td style={{
                      padding: '12px',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#115e59',
                      borderBottom: idx === selectedInvoice.invoiceItems.length - 1 ? 'none' : '1px solid #e5e7eb'
                    }}>
                      {item.name}
                    </td>
                    <td style={{
                      padding: '12px',
                      fontSize: '13px',
                      color: '#6b7280',
                      borderBottom: idx === selectedInvoice.invoiceItems.length - 1 ? 'none' : '1px solid #e5e7eb'
                    }}>
                      {item.name === 'Rent' ? `Rent due on ${selectedInvoice.dueOn}` : `$20 Paid on the 5th`}
                    </td>
                    <td style={{
                      padding: '12px',
                      fontSize: '13px',
                      color: '#115e59',
                      textAlign: 'center',
                      borderBottom: idx === selectedInvoice.invoiceItems.length - 1 ? 'none' : '1px solid #e5e7eb'
                    }}>
                      1
                    </td>
                    <td style={{
                      padding: '12px',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#115e59',
                      textAlign: 'right',
                      borderBottom: idx === selectedInvoice.invoiceItems.length - 1 ? 'none' : '1px solid #e5e7eb'
                    }}>
                      {formatCurrency(item.amount)}
                    </td>
                    <td style={{
                      padding: '12px',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#115e59',
                      textAlign: 'right',
                      borderBottom: idx === selectedInvoice.invoiceItems.length - 1 ? 'none' : '1px solid #e5e7eb'
                    }}>
                      {formatCurrency(item.amount)}
                    </td>
                    <td style={{
                      padding: '12px',
                      textAlign: 'center',
                      borderBottom: idx === selectedInvoice.invoiceItems.length - 1 ? 'none' : '1px solid #e5e7eb',
                      position: 'relative'
                    }}>
                      {item.name === 'Rent' ? (
                        <span style={{
                          fontSize: '13px',
                          color: '#9ca3af',
                          fontWeight: '500'
                        }}>
                          No Action
                        </span>
                      ) : isEditMode ? (
                        <div style={{ position: 'relative' }}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenActionMenu(openActionMenu === idx ? null : idx);
                            }}
                            style={{
                              padding: '4px 12px',
                              background: 'white',
                              border: '1px solid #e5e7eb',
                              borderRadius: '6px',
                              fontSize: '12px',
                              fontWeight: '600',
                              color: '#dc2626',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                            onMouseOver={(e) => {
                              e.currentTarget.style.background = '#fee2e2';
                              e.currentTarget.style.borderColor = '#fca5a5';
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.background = 'white';
                              e.currentTarget.style.borderColor = '#e5e7eb';
                            }}
                          >
                            Remove
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="3">
                              <polyline points="6 9 12 15 18 9" />
                            </svg>
                          </button>
                          
                          {openActionMenu === idx && (
                            <div style={{
                              position: 'absolute',
                              top: '32px',
                              right: '0',
                              background: 'white',
                              border: '2px solid #e5e7eb',
                              borderRadius: '8px',
                              boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                              zIndex: 100,
                              minWidth: '160px',
                              overflow: 'hidden'
                            }}>
                              <button
                                onClick={() => {
                                  // TODO: Database Integration - Remove Invoice Item
                                  // API Endpoint: DELETE /api/invoices/:invoiceId/items/:itemId
                                  // Request: itemId from item.id
                                  // Expected Response: { success: true, updatedInvoice: {...} }
                                  // Note: Should recalculate invoice total and update balance
                                  
                                  // async removeItem(itemId) {
                                  //   const response = await fetch(
                                  //     `/api/invoices/${selectedInvoice.id}/items/${itemId}`,
                                  //     {
                                  //       method: 'DELETE',
                                  //       headers: { 'Authorization': `Bearer ${authToken}` }
                                  //     }
                                  //   );
                                  //   const data = await response.json();
                                  //   if (response.ok) {
                                  //     setEditableInvoice(data.updatedInvoice);
                                  //     onInvoiceUpdated(data.updatedInvoice);
                                  //   }
                                  // }
                                  
                                  alert('Remove item functionality');
                                  setOpenActionMenu(null);
                                }}
                                style={{
                                  width: '100%',
                                  padding: '10px 16px',
                                  background: 'white',
                                  border: 'none',
                                  textAlign: 'left',
                                  fontSize: '13px',
                                  fontWeight: '600',
                                  color: '#dc2626',
                                  cursor: 'pointer',
                                  transition: 'background 0.15s ease',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '8px'
                                }}
                                onMouseOver={(e) => {
                                  e.currentTarget.style.background = '#fee2e2';
                                }}
                                onMouseOut={(e) => {
                                  e.currentTarget.style.background = 'white';
                                }}
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5">
                                  <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                                  <line x1="10" y1="11" x2="10" y2="17"/>
                                  <line x1="14" y1="11" x2="14" y2="17"/>
                                </svg>
                                Remove Item
                              </button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <span style={{
                          fontSize: '13px',
                          color: '#9ca3af',
                          fontWeight: '500'
                        }}>
                          —
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Add New Item Button - Only show in edit mode */}
            {isEditMode && (
              <button
                onClick={() => setIsAddingNewItem(true)}
                style={{
                  marginTop: '12px',
                  padding: '8px 16px',
                  background: 'white',
                  border: '1px solid #14b8a6',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#0f766e',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                gap: '6px'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%)';
                e.currentTarget.style.borderColor = '#14b8a6';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'white';
                e.currentTarget.style.borderColor = '#14b8a6';
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0f766e" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 8v8M8 12h8"/>
              </svg>
              Add New Item
              </button>
            )}
          </div>

          {/* Payments Received */}
          <div style={{
            marginBottom: '32px'
          }}>
            <div style={{
              fontSize: '14px',
              fontWeight: '700',
              color: '#115e59',
              marginBottom: '16px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Payments Received
            </div>
            {selectedInvoice.paymentsSubmitted.length > 0 ? (
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                overflow: 'hidden'
              }}>
                <thead>
                  <tr style={{
                    background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)'
                  }}>
                    <th style={{
                      padding: '12px',
                      textAlign: 'left',
                      fontSize: '11px',
                      fontWeight: '700',
                      color: '#065f46',
                      textTransform: 'uppercase',
                      borderBottom: '1px solid #e5e7eb'
                    }}>
                      Payer
                    </th>
                    <th style={{
                      padding: '12px',
                      textAlign: 'left',
                      fontSize: '11px',
                      fontWeight: '700',
                      color: '#065f46',
                      textTransform: 'uppercase',
                      borderBottom: '1px solid #e5e7eb'
                    }}>
                      Submitted On
                    </th>
                    <th style={{
                      padding: '12px',
                      textAlign: 'left',
                      fontSize: '11px',
                      fontWeight: '700',
                      color: '#065f46',
                      textTransform: 'uppercase',
                      borderBottom: '1px solid #e5e7eb'
                    }}>
                      Deposited On
                    </th>
                    <th style={{
                      padding: '12px',
                      textAlign: 'left',
                      fontSize: '11px',
                      fontWeight: '700',
                      color: '#065f46',
                      textTransform: 'uppercase',
                      borderBottom: '1px solid #e5e7eb'
                    }}>
                      Method
                    </th>
                    <th style={{
                      padding: '12px',
                      textAlign: 'right',
                      fontSize: '11px',
                      fontWeight: '700',
                      color: '#065f46',
                      textTransform: 'uppercase',
                      borderBottom: '1px solid #e5e7eb',
                      width: '120px'
                    }}>
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {selectedInvoice.paymentsSubmitted.map((payment, idx) => (
                    <tr key={idx} style={{
                      background: 'white'
                    }}>
                      <td style={{
                        padding: '12px',
                        fontSize: '13px',
                        fontWeight: '600',
                        color: '#115e59'
                      }}>
                        {payment.name}
                      </td>
                      <td style={{
                        padding: '12px',
                        fontSize: '13px',
                        color: '#6b7280'
                      }}>
                        N/A
                      </td>
                      <td style={{
                        padding: '12px',
                        fontSize: '13px',
                        color: '#6b7280'
                      }}>
                        N/A
                      </td>
                      <td style={{
                        padding: '12px',
                        fontSize: '13px',
                        color: '#6b7280'
                      }}>
                        {payment.bankAccount}
                      </td>
                      <td style={{
                        padding: '12px',
                        fontSize: '13px',
                        fontWeight: '600',
                        color: '#059669',
                        textAlign: 'right'
                      }}>
                        {formatCurrency(payment.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={{
                padding: '32px',
                background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
                borderRadius: '8px',
                textAlign: 'center',
                border: '1px solid #fca5a5'
              }}>
                <div style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#991b1b'
                }}>
                  No Payments Received
                </div>
              </div>
            )}
          </div>

          {/* Total Summary */}
          <div style={{
            borderTop: '2px solid #e5e7eb',
            paddingTop: '24px',
            display: 'flex',
            justifyContent: 'flex-end'
          }}>
            <div style={{
              width: '300px'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '12px'
              }}>
                <div style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#6b7280'
                }}>
                  Total Due:
                </div>
                <div style={{
                  fontSize: '14px',
                  fontWeight: '700',
                  color: '#115e59'
                }}>
                  {formatCurrency(selectedInvoice.amount)}
                </div>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '12px'
              }}>
                <div style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#6b7280'
                }}>
                  Total Paid:
                </div>
                <div style={{
                  fontSize: '14px',
                  fontWeight: '700',
                  color: '#059669'
                }}>
                  {formatCurrency(selectedInvoice.paid)}
                </div>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingTop: '12px',
                borderTop: '2px solid #e5e7eb'
              }}>
                <div style={{
                  fontSize: '16px',
                  fontWeight: '700',
                  color: '#115e59'
                }}>
                  Remaining Balance:
                </div>
                <div style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  color: selectedInvoice.balance > 0 ? '#dc2626' : '#059669'
                }}>
                  {formatCurrency(selectedInvoice.balance)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Record Payment Modal */}
      {showRecordPayment && (
        <>
          {/* Backdrop */}
          <div 
            onClick={() => setShowRecordPayment(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.5)',
              zIndex: 999
            }}
          />
          <RecordPaymentModal
            invoice={selectedInvoice}
            onClose={() => setShowRecordPayment(false)}
            onSubmit={(paymentData) => {
              // Handle payment submission
              console.log('Payment data:', paymentData);
              setShowRecordPayment(false);
            }}
          />
        </>
      )}
    </div>
  );
}
