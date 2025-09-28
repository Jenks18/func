import React, { useState, useEffect } from 'react';

const TransactionHistory = ({ tenantId = null, limit = null }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTransactions = () => {
    setLoading(true);
    try {
      // Get transactions from localStorage
      const allTransactions = JSON.parse(localStorage.getItem('transactions') || '[]');
      
      let filteredTransactions = tenantId 
        ? allTransactions.filter(t => t.tenantId === tenantId)
        : allTransactions;
      
      // Sort by date (newest first)
      filteredTransactions.sort((a, b) => new Date(b.paymentDate || b.createdAt) - new Date(a.paymentDate || a.createdAt));
      
      // Apply limit if specified
      if (limit) {
        filteredTransactions = filteredTransactions.slice(0, limit);
      }
      
      setTransactions(filteredTransactions);
    } catch (error) {
      console.error('Failed to load transactions:', error);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };
  
  loadTransactions();
  }, [tenantId, limit]);

  const formatPaymentMethod = (method) => {
    const methods = {
      'check': 'Check',
      'cash': 'Cash',
      'bank_transfer': 'Bank Transfer',
      'credit_card': 'Credit Card',
      'money_order': 'Money Order',
      'online': 'Online Payment'
    };
    return methods[method] || method;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div style={{ color: '#64748b' }}>
        Loading transactions...
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '32px' }}>
        <p style={{ color: '#64748b' }}>No transactions found</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {transactions.map((transaction) => (
        <div key={transaction.id} style={{
          background: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '16px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{ fontWeight: '500', color: '#111827' }}>
                  {transaction.tenantName || 'Unknown Tenant'}
                </span>
                <span style={{
                  padding: '2px 8px',
                  fontSize: '12px',
                  borderRadius: '9999px',
                  background: transaction.status === 'completed' ? '#d1fae5' : '#fef3c7',
                  color: transaction.status === 'completed' ? '#065f46' : '#92400e'
                }}>
                  {transaction.status || 'completed'}
                </span>
              </div>
              
              <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '4px' }}>
                {transaction.description || 'Payment'}
              </p>
              
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '16px', 
                fontSize: '12px', 
                color: '#9ca3af' 
              }}>
                <span>{formatDate(transaction.paymentDate || transaction.createdAt)}</span>
                <span>{formatPaymentMethod(transaction.paymentMethod)}</span>
                {transaction.reference && (
                  <span>Ref: {transaction.reference}</span>
                )}
              </div>
            </div>
            
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontWeight: '600', color: '#059669' }}>
                +${transaction.amount.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TransactionHistory;