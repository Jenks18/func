import React, { useState, useEffect } from 'react';

const RecordPaymentModal = ({ isOpen, onClose, tenant, onPaymentRecorded }) => {
  const [paymentData, setPaymentData] = useState({
    amount: '',
    paymentMethod: 'check',
    paymentDate: new Date().toISOString().split('T')[0],
    description: '',
    reference: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen && tenant) {
      setPaymentData(prev => ({
        ...prev,
        description: `Rent payment - ${tenant.firstName} ${tenant.lastName}`,
        amount: tenant.overdueAmount || tenant.monthlyRent || ''
      }));
    }
  }, [isOpen, tenant]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!paymentData.amount || parseFloat(paymentData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }
    
    if (!paymentData.paymentDate) {
      newErrors.paymentDate = 'Please select a payment date';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      const payment = {
        tenantId: tenant?.id,
        tenantName: `${tenant?.firstName} ${tenant?.lastName}`,
        amount: parseFloat(paymentData.amount),
        paymentMethod: paymentData.paymentMethod,
        paymentDate: paymentData.paymentDate,
        description: paymentData.description,
        reference: paymentData.reference,
        type: 'payment',
        status: 'completed',
        propertyId: tenant?.propertyId,
        leaseId: tenant?.leaseId
      };
      
      await onPaymentRecorded(payment);
      handleClose();
    } catch (error) {
      console.error('Failed to record payment:', error);
      setErrors({ submit: 'Failed to record payment. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setPaymentData({
      amount: '',
      paymentMethod: 'check',
      paymentDate: new Date().toISOString().split('T')[0],
      description: '',
      reference: ''
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 50
    }}>
      <div style={{
        background: 'white',
        borderRadius: '8px',
        padding: '24px',
        width: '100%',
        maxWidth: '480px',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>
          Record Payment
        </h2>
        
        {tenant && (
          <div style={{
            marginBottom: '16px',
            padding: '12px',
            background: '#f9fafb',
            borderRadius: '8px'
          }}>
            <p style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
              Tenant: {tenant.firstName} {tenant.lastName}
            </p>
            <p style={{ fontSize: '14px', color: '#64748b' }}>
              Unit: {tenant.unit || 'N/A'}
            </p>
            {tenant.overdueAmount && (
              <p style={{ fontSize: '14px', color: '#dc2626' }}>
                Overdue: ${tenant.overdueAmount}
              </p>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '14px', 
              fontWeight: '500', 
              color: '#374151', 
              marginBottom: '4px' 
            }}>
              Payment Amount *
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute',
                left: '12px',
                top: '8px',
                color: '#64748b'
              }}>
                $
              </span>
              <input
                type="number"
                step="0.01"
                value={paymentData.amount}
                onChange={(e) => setPaymentData(prev => ({ ...prev, amount: e.target.value }))}
                style={{
                  width: '100%',
                  paddingLeft: '32px',
                  paddingRight: '12px',
                  paddingTop: '8px',
                  paddingBottom: '8px',
                  border: `1px solid ${errors.amount ? '#fca5a5' : '#d1d5db'}`,
                  borderRadius: '6px'
                }}
                placeholder="0.00"
              />
            </div>
            {errors.amount && (
              <p style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>
                {errors.amount}
              </p>
            )}
          </div>

          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '14px', 
              fontWeight: '500', 
              color: '#374151', 
              marginBottom: '4px' 
            }}>
              Payment Method *
            </label>
            <select
              value={paymentData.paymentMethod}
              onChange={(e) => setPaymentData(prev => ({ ...prev, paymentMethod: e.target.value }))}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #d1d5db',
                borderRadius: '6px'
              }}
            >
              <option value="check">Check</option>
              <option value="cash">Cash</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="credit_card">Credit Card</option>
              <option value="money_order">Money Order</option>
              <option value="online">Online Payment</option>
            </select>
          </div>

          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '14px', 
              fontWeight: '500', 
              color: '#374151', 
              marginBottom: '4px' 
            }}>
              Payment Date *
            </label>
            <input
              type="date"
              value={paymentData.paymentDate}
              onChange={(e) => setPaymentData(prev => ({ ...prev, paymentDate: e.target.value }))}
              style={{
                width: '100%',
                padding: '8px',
                border: `1px solid ${errors.paymentDate ? '#fca5a5' : '#d1d5db'}`,
                borderRadius: '6px'
              }}
            />
            {errors.paymentDate && (
              <p style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>
                {errors.paymentDate}
              </p>
            )}
          </div>

          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '14px', 
              fontWeight: '500', 
              color: '#374151', 
              marginBottom: '4px' 
            }}>
              Reference/Check Number
            </label>
            <input
              type="text"
              value={paymentData.reference}
              onChange={(e) => setPaymentData(prev => ({ ...prev, reference: e.target.value }))}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #d1d5db',
                borderRadius: '6px'
              }}
              placeholder="Check #, Transaction ID, etc."
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
              Description
            </label>
            <textarea
              value={paymentData.description}
              onChange={(e) => setPaymentData(prev => ({ ...prev, description: e.target.value }))}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                height: '80px',
                resize: 'none'
              }}
              placeholder="Payment description..."
            />
          </div>

          {errors.submit && (
            <div style={{
              padding: '12px',
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '6px'
            }}>
              <p style={{ color: '#dc2626', fontSize: '14px' }}>
                {errors.submit}
              </p>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', paddingTop: '16px' }}>
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              style={{
                padding: '8px 16px',
                color: '#64748b',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                background: 'white',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              style={{
                padding: '8px 16px',
                background: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                opacity: isLoading ? 0.5 : 1
              }}
            >
              {isLoading ? 'Recording...' : 'Record Payment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecordPaymentModal;
