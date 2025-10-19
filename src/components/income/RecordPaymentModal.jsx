import React, { useState } from 'react';

export default function RecordPaymentModal({ invoice, onClose, onSubmit }) {
  const [selectedTenant, setSelectedTenant] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const [notes, setNotes] = useState('');

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const handleSubmit = () => {
    // TODO: Database Integration - Record Payment
    // API Endpoint: POST /api/invoices/:invoiceId/payments
    // Request Body: {
    //   tenantId: selectedTenant,
    //   amount: parseFloat(paymentAmount),
    //   paymentMethod: paymentMethod, // e.g., 'Check', 'Cash', 'Credit Card', 'Bank Transfer'
    //   paymentDate: paymentDate,
    //   notes: notes,
    //   invoiceId: invoice.id
    // }
    // Expected Response: {
    //   success: true,
    //   payment: { id, amount, date, method, ... },
    //   updatedInvoice: { ...invoice, paidAmount, balance, status }
    // }
    // Side Effects:
    //   - Update invoice.paidAmount
    //   - Update invoice.balance
    //   - Change invoice.status to 'Partial' or 'Paid' if fully paid
    //   - Create payment record in payments table
    //   - Update tenant's balance
    
    // async recordPayment() {
    //   try {
    //     const response = await fetch(`/api/invoices/${invoice.id}/payments`, {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': `Bearer ${authToken}`
    //       },
    //       body: JSON.stringify({
    //         tenantId: selectedTenant,
    //         amount: parseFloat(paymentAmount),
    //         paymentMethod,
    //         paymentDate,
    //         notes
    //       })
    //     });
    //     const data = await response.json();
    //     if (response.ok) {
    //       onSubmit(data.updatedInvoice); // Update parent component
    //       onClose();
    //     } else {
    //       alert('Error: ' + data.message);
    //     }
    //   } catch (error) {
    //     console.error('Payment error:', error);
    //     alert('Failed to record payment');
    //   }
    // }
    
    alert('Payment recorded!');
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      right: 0,
      width: '450px',
      height: '100vh',
      background: 'white',
      boxShadow: '-4px 0 24px rgba(0,0,0,0.15)',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      animation: 'slideInRight 0.3s ease-out'
    }}>
      {/* Header */}
      <div style={{
        padding: '24px',
        borderBottom: '2px solid #e5e7eb',
        background: 'linear-gradient(135deg, #f0fdfa 0%, #ffffff 100%)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h2 style={{
          fontSize: '20px',
          fontWeight: '700',
          color: '#115e59',
          margin: 0,
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          Record Payment
        </h2>
        <button
          onClick={onClose}
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>

      {/* Content */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '24px'
      }}>
        {/* Invoice Summary */}
        <div style={{
          background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '24px',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{
            fontSize: '11px',
            fontWeight: '700',
            color: '#6b7280',
            marginBottom: '12px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Invoice Summary
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '12px',
            marginBottom: '8px'
          }}>
            <div>
              <div style={{
                fontSize: '10px',
                fontWeight: '600',
                color: '#9ca3af',
                marginBottom: '4px',
                textTransform: 'uppercase'
              }}>
                ID
              </div>
              <div style={{
                fontSize: '13px',
                fontWeight: '700',
                color: '#115e59'
              }}>
                {invoice.id}
              </div>
            </div>
            <div>
              <div style={{
                fontSize: '10px',
                fontWeight: '600',
                color: '#9ca3af',
                marginBottom: '4px',
                textTransform: 'uppercase'
              }}>
                Subject
              </div>
              <div style={{
                fontSize: '13px',
                fontWeight: '600',
                color: '#115e59'
              }}>
                Rent due on January 1, 2025
              </div>
            </div>
            <div>
              <div style={{
                fontSize: '10px',
                fontWeight: '600',
                color: '#9ca3af',
                marginBottom: '4px',
                textTransform: 'uppercase'
              }}>
                Due
              </div>
              <div style={{
                fontSize: '13px',
                fontWeight: '600',
                color: '#115e59'
              }}>
                {invoice.dueOn}
              </div>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '12px'
          }}>
            <div>
              <div style={{
                fontSize: '10px',
                fontWeight: '600',
                color: '#9ca3af',
                marginBottom: '4px',
                textTransform: 'uppercase'
              }}>
                Paid
              </div>
              <div style={{
                fontSize: '13px',
                fontWeight: '700',
                color: '#059669'
              }}>
                {formatCurrency(invoice.paid)}
              </div>
            </div>
            <div>
              <div style={{
                fontSize: '10px',
                fontWeight: '600',
                color: '#9ca3af',
                marginBottom: '4px',
                textTransform: 'uppercase'
              }}>
                Balance
              </div>
              <div style={{
                fontSize: '13px',
                fontWeight: '700',
                color: invoice.balance > 0 ? '#dc2626' : '#059669'
              }}>
                {formatCurrency(invoice.balance)}
              </div>
            </div>
          </div>
        </div>

        {/* Tenant Selection */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            fontSize: '13px',
            fontWeight: '600',
            color: '#374151',
            marginBottom: '8px'
          }}>
            Tenant
          </label>
          <select
            value={selectedTenant}
            onChange={(e) => setSelectedTenant(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px',
              color: '#374151',
              background: 'white',
              cursor: 'pointer',
              outline: 'none',
              transition: 'all 0.2s ease'
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
            <option value="">Select Tenant</option>
            <option value={invoice.tenant}>{invoice.tenant}</option>
          </select>
        </div>

        {/* Add Additional Payment Button */}
        <button style={{
          width: '100%',
          padding: '12px',
          background: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)',
          border: '1px solid #7dd3fc',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: '600',
          color: '#0369a1',
          cursor: 'pointer',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          transition: 'all 0.2s ease'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.background = 'linear-gradient(135deg, #bae6fd 0%, #7dd3fc 100%)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.background = 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)';
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0369a1" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 8v8M8 12h8"/>
          </svg>
          Add Additional Payment
        </button>

        {/* Payment Form Fields (would be rendered for each payment) */}
        <div style={{
          background: 'white',
          border: '2px solid #e5e7eb',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '20px'
        }}>
          {/* Amount */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Amount
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '14px',
                fontWeight: '600',
                color: '#6b7280'
              }}>
                $
              </span>
              <input
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                placeholder="0.00"
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 28px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  color: '#374151',
                  outline: 'none',
                  transition: 'all 0.2s ease'
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
          </div>

          {/* Payment Method */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Payment Method
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                color: '#374151',
                background: 'white',
                cursor: 'pointer',
                outline: 'none',
                transition: 'all 0.2s ease'
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
              <option value="">Select Method</option>
              <option value="cash">Cash</option>
              <option value="check">Check</option>
              <option value="credit">Credit Card</option>
              <option value="bank">Bank Transfer</option>
              <option value="online">Online Payment</option>
            </select>
          </div>

          {/* Payment Date */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Payment Date
            </label>
            <input
              type="date"
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                color: '#374151',
                outline: 'none',
                transition: 'all 0.2s ease'
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

          {/* Notes */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any additional notes..."
              rows={3}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                color: '#374151',
                outline: 'none',
                resize: 'vertical',
                fontFamily: 'inherit',
                transition: 'all 0.2s ease'
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
        </div>
      </div>

      {/* Footer Actions */}
      <div style={{
        padding: '20px 24px',
        borderTop: '2px solid #e5e7eb',
        background: '#f9fafb',
        display: 'flex',
        gap: '12px',
        justifyContent: 'flex-end'
      }}>
        <button
          onClick={onClose}
          style={{
            padding: '10px 24px',
            background: 'white',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            color: '#6b7280',
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
          onClick={handleSubmit}
          style={{
            padding: '10px 24px',
            background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '700',
            color: 'white',
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
          Submit
        </button>
      </div>

      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
