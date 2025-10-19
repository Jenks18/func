import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { supabase } from '../../services/supabaseClient';

const RecordPaymentModalEnhanced = ({ isOpen, onClose, tenant, onPaymentRecorded }) => {
  const { user } = useUser();
  const [tenantsWithLeases, setTenantsWithLeases] = useState([]);
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [paymentData, setPaymentData] = useState({
    amount: '',
    paymentMethod: 'check',
    paymentDate: new Date().toISOString().split('T')[0],
    description: '',
    reference: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [organizationId, setOrganizationId] = useState(null);

  // Get organization ID
  useEffect(() => {
    async function getOrgId() {
      if (!user?.id) return;
      
      const { data } = await supabase
        .from('users')
        .select('organization_id')
        .eq('clerk_id', user.id)
        .single();
      
      if (data) {
        setOrganizationId(data.organization_id);
      }
    }
    getOrgId();
  }, [user]);

  // Fetch tenants with active leases when modal opens
  useEffect(() => {
    if (isOpen && organizationId) {
      fetchTenantsWithLeases();
    }
  }, [isOpen, organizationId]);

  // Pre-populate if tenant provided
  useEffect(() => {
    if (isOpen && tenant) {
      setSelectedTenant(tenant);
      setPaymentData(prev => ({
        ...prev,
        description: `Rent payment - ${tenant.first_name} ${tenant.last_name}`,
        amount: tenant.balance || tenant.rent_amount || ''
      }));
    }
  }, [isOpen, tenant]);

  const fetchTenantsWithLeases = async () => {
    try {
      // Get all active leases with tenant, property, and unit info
      const { data, error } = await supabase
        .from('leases')
        .select(`
          id,
          rent_amount,
          lease_start_date,
          tenants (
            id,
            first_name,
            last_name,
            email
          ),
          properties (
            id,
            name
          ),
          units (
            id,
            unit_number
          )
        `)
        .eq('organization_id', organizationId)
        .eq('status', 'active');

      if (error) throw error;

      // Get transactions to calculate balances
      const { data: transactions, error: transError } = await supabase
        .from('transactions')
        .select('lease_id, amount, status')
        .eq('organization_id', organizationId)
        .eq('type', 'income');

      if (transError) throw transError;

      // Calculate balance for each lease
      const tenantsWithBalance = await Promise.all(data.map(async (lease) => {
        // Calculate expected payments (simplified - monthly from start date to now)
        const startDate = new Date(lease.lease_start_date);
        const today = new Date();
        const monthsPassed = Math.max(1, 
          (today.getFullYear() - startDate.getFullYear()) * 12 +
          (today.getMonth() - startDate.getMonth()) + 1
        );
        const expectedTotal = parseFloat(lease.rent_amount) * monthsPassed;

        // Calculate actual payments
        const paid = transactions
          ?.filter(t => t.lease_id === lease.id && t.status === 'completed')
          .reduce((sum, t) => sum + parseFloat(t.amount), 0) || 0;

        const balance = expectedTotal - paid;

        return {
          ...lease.tenants,
          leaseId: lease.id,
          propertyId: lease.properties?.id,
          propertyName: lease.properties?.name,
          unitId: lease.units?.id,
          unitNumber: lease.units?.unit_number,
          rentAmount: parseFloat(lease.rent_amount),
          balance: Math.max(0, balance),
          displayName: `${lease.tenants?.first_name} ${lease.tenants?.last_name} - ${lease.properties?.name || ''} ${lease.units?.unit_number || ''}`
        };
      }));

      // Filter to only show tenants with balance > 0 or all tenants
      setTenantsWithLeases(tenantsWithBalance);

    } catch (error) {
      console.error('Error fetching tenants:', error);
    }
  };

  const handleTenantSelect = (e) => {
    const tenantId = e.target.value;
    const tenant = tenantsWithLeases.find(t => t.id === tenantId);
    
    if (tenant) {
      setSelectedTenant(tenant);
      setPaymentData(prev => ({
        ...prev,
        amount: tenant.balance > 0 ? tenant.balance.toFixed(2) : tenant.rentAmount.toFixed(2),
        description: `Rent payment - ${tenant.first_name} ${tenant.last_name}`
      }));
    } else {
      setSelectedTenant(null);
      setPaymentData(prev => ({
        ...prev,
        amount: '',
        description: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!selectedTenant) {
      newErrors.tenant = 'Please select a tenant';
    }
    
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
        tenantId: selectedTenant.id,
        leaseId: selectedTenant.leaseId,
        propertyId: selectedTenant.propertyId,
        unitId: selectedTenant.unitId,
        amount: parseFloat(paymentData.amount),
        paymentMethod: paymentData.paymentMethod,
        paymentDate: paymentData.paymentDate,
        description: paymentData.description,
        reference: paymentData.reference
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
    setSelectedTenant(null);
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
        maxWidth: '520px',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>
          Record Payment
        </h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Tenant Selector */}
          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '14px', 
              fontWeight: '500', 
              color: '#374151', 
              marginBottom: '4px' 
            }}>
              Select Tenant *
            </label>
            <select
              value={selectedTenant?.id || ''}
              onChange={handleTenantSelect}
              disabled={!!tenant}
              style={{
                width: '100%',
                padding: '8px',
                border: `1px solid ${errors.tenant ? '#fca5a5' : '#d1d5db'}`,
                borderRadius: '6px',
                background: tenant ? '#f9fafb' : 'white'
              }}
            >
              <option value="">-- Select a tenant --</option>
              {tenantsWithLeases.map(t => (
                <option key={t.id} value={t.id}>
                  {t.displayName} {t.balance > 0 ? `(Balance: $${t.balance.toFixed(2)})` : ''}
                </option>
              ))}
            </select>
            {errors.tenant && (
              <p style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>
                {errors.tenant}
              </p>
            )}
          </div>

          {/* Tenant Info Display */}
          {selectedTenant && (
            <div style={{
              padding: '12px',
              background: '#f9fafb',
              borderRadius: '8px',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '13px' }}>
                <div>
                  <span style={{ color: '#64748b', fontWeight: 500 }}>Property:</span>
                  <div style={{ color: '#374151', fontWeight: 600 }}>{selectedTenant.propertyName}</div>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontWeight: 500 }}>Unit:</span>
                  <div style={{ color: '#374151', fontWeight: 600 }}>{selectedTenant.unitNumber || 'N/A'}</div>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontWeight: 500 }}>Monthly Rent:</span>
                  <div style={{ color: '#10b981', fontWeight: 600 }}>${selectedTenant.rentAmount.toFixed(2)}</div>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontWeight: 500 }}>Current Balance:</span>
                  <div style={{ color: selectedTenant.balance > 0 ? '#ef4444' : '#10b981', fontWeight: 600 }}>
                    ${selectedTenant.balance.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Payment Amount */}
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
                color: '#64748b',
                fontSize: '14px'
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

          {/* Payment Method */}
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
              <option value="ach">ACH Transfer</option>
              <option value="wire">Wire Transfer</option>
            </select>
          </div>

          {/* Payment Date */}
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

          {/* Reference Number */}
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

          {/* Description */}
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
                resize: 'none',
                fontFamily: 'inherit'
              }}
              placeholder="Payment description or notes..."
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

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', paddingTop: '16px', borderTop: '1px solid #e5e7eb' }}>
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
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 500
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
                opacity: isLoading ? 0.5 : 1,
                fontSize: '14px',
                fontWeight: 500
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

export default RecordPaymentModalEnhanced;
