import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { supabase } from '../services/supabaseClient';
import InvoiceDetailView from '../components/income/InvoiceDetailView';

export default function IncomePageNew() {
  const { user } = useUser();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [groupBy, setGroupBy] = useState('Property');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [expandedInvoices, setExpandedInvoices] = useState({});
  const [hoveredStatus, setHoveredStatus] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [activeStatusFilter, setActiveStatusFilter] = useState('all');
  const [expandedProperties, setExpandedProperties] = useState({});
  const [loading, setLoading] = useState(true);
  const [incomeData, setIncomeData] = useState({});
  const [organizationId, setOrganizationId] = useState(null);

  // Load navigation params from sessionStorage (from Dashboard clicks)
  useEffect(() => {
    const paramsStr = sessionStorage.getItem('Income_params');
    if (paramsStr) {
      try {
        const params = JSON.parse(paramsStr);
        if (params.statusFilter) {
          setActiveStatusFilter(params.statusFilter);
          // Auto-expand all properties when filter is applied
          setExpandedProperties({
            '605 Race Street': true,
            'Jefferson Ave Apartments': true,
            'Jefferson House': true
          });
        }
        // Clear params after reading
        sessionStorage.removeItem('Income_params');
      } catch (error) {
        console.error('Failed to parse navigation params:', error);
      }
    }
  }, []);

  // TODO: Database Integration - Fetch Invoices on Component Mount
  // API Endpoint: GET /api/invoices?groupBy=property&status=all
  // Expected Response: {
  //   success: true,
  //   invoices: [
  //     {
  //       id: number,
  //       tenant: { id, name, email },
  //       property: { id, name, address },
  //       unit: string,
  //       dueDate: ISO date,
  //       paidDate: ISO date or null,
  //       amount: number,
  //       paidAmount: number,
  //       balance: number,
  //       status: 'Overdue' | 'Fully Paid' | 'Partial' | 'Pending',
  //       items: [{ id, name, description, amount }],
  //       payments: [{ id, amount, method, date, notes }],
  //       notes: string
  //     }
  //   ],
  //   summary: { totalDue, totalPaid, totalOverdue }
  // }
  // useEffect(() => {
  //   async function fetchInvoices() {
  //     try {
  //       const response = await fetch('/api/invoices?groupBy=property', {
  //         headers: { 'Authorization': `Bearer ${authToken}` }
  //       });
  //       const data = await response.json();
  //       if (response.ok) {
  //         // Group invoices by property
  //         const grouped = data.invoices.reduce((acc, invoice) => {
  //           const propName = invoice.property.name;
  //           if (!acc[propName]) acc[propName] = { invoices: [], details: invoice.property.leaseDetails };
  //           acc[propName].invoices.push(invoice);
  //           return acc;
  //         }, {});
  //         setIncomeData(grouped);
  //       }
  //     } catch (error) {
  //       console.error('Failed to fetch invoices:', error);
  //     }
  //   }
  //   fetchInvoices();
  // }, []);

  // Get organization ID and fetch data
  useEffect(() => {
    async function setupAndFetch() {
      if (!user?.id) return;
      
      try {
        // Get organization ID
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('organization_id')
          .eq('clerk_id', user.id)
          .single();

        if (userError) {
          console.error('User error:', userError);
          setLoading(false);
          return;
        }
        
        const orgId = userData.organization_id;
        setOrganizationId(orgId);

        // Fetch transactions and related data
        await fetchIncomeData(orgId);
        
      } catch (error) {
        console.error('Setup error:', error);
      } finally {
        setLoading(false);
      }
    }

    setupAndFetch();
  }, [user?.id]);

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch income data from database
  const fetchIncomeData = async (orgId) => {
    try {
      // Fetch all active leases with related data
      const { data: leases, error: leasesError } = await supabase
        .from('leases')
        .select(`
          id,
          rent_amount,
          payment_due_day,
          lease_start_date,
          lease_end_date,
          status,
          property:properties(id, name, address),
          unit:units(id, unit_number),
          tenant:tenants(id, first_name, last_name, email)
        `)
        .eq('organization_id', orgId)
        .eq('status', 'active');

      if (leasesError) {
        console.error('Leases error:', leasesError);
        return;
      }

      // Fetch all transactions
      const { data: transactions, error: transError } = await supabase
        .from('transactions')
        .select('*')
        .eq('organization_id', orgId)
        .eq('type', 'income')
        .order('date', { ascending: false });

      if (transError) {
        console.error('Transactions error:', transError);
      }

      // Group by property and create invoice structure
      const grouped = {};
      
      leases?.forEach(lease => {
        const propertyName = lease.property?.name || 'Unknown Property';
        
        if (!grouped[propertyName]) {
          grouped[propertyName] = {
            invoices: [],
            details: `(${new Date(lease.lease_start_date).toLocaleDateString()} - ${new Date(lease.lease_end_date).toLocaleDateString()})`
          };
        }

        // Calculate payments for this lease
        const leasePayments = transactions?.filter(t => t.lease_id === lease.id) || [];
        const totalPaid = leasePayments.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);
        const rentAmount = parseFloat(lease.rent_amount || 0);
        const balance = rentAmount - totalPaid;

        // Determine status
        let status = 'Pending';
        const today = new Date();
        const dueDate = new Date(today.getFullYear(), today.getMonth(), lease.payment_due_day || 1);
        
        if (totalPaid >= rentAmount) {
          status = 'Fully Paid';
        } else if (totalPaid > 0) {
          status = 'Partial';
        } else if (today > dueDate) {
          status = 'Overdue';
        }

        // Create invoice object
        const invoice = {
          id: lease.id,
          tenant: `${lease.tenant?.first_name || ''} ${lease.tenant?.last_name || ''}`.trim() || 'Unknown Tenant',
          tenantEmail: lease.tenant?.email || '',
          sharedBy: 1,
          dueOn: dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          paidOn: leasePayments.length > 0 ? new Date(leasePayments[0].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '-',
          invoiceId: lease.id.substring(0, 8),
          status,
          unit: lease.unit?.unit_number || 'N/A',
          amount: rentAmount,
          processing: 0,
          paid: totalPaid,
          balance,
          remindersSent: 0,
          invoiceItems: [
            {
              name: 'Monthly Rent',
              amount: rentAmount
            }
          ],
          paymentsSubmitted: leasePayments.map(p => ({
            name: `Payment by ${lease.tenant?.first_name || 'Tenant'}`,
            amount: parseFloat(p.amount || 0),
            bankAccount: p.payment_method || 'Unknown Method'
          }))
        };

        grouped[propertyName].invoices.push(invoice);
      });

      setIncomeData(grouped);
      
    } catch (error) {
      console.error('Error fetching income data:', error);
    }
  };

  const toggleProperty = (property) => {
    setExpandedProperties(prev => ({ ...prev, [property]: !prev[property] }));
  };

  const toggleInvoice = (invoiceId) => {
    setExpandedInvoices(prev => ({ ...prev, [invoiceId]: !prev[invoiceId] }));
  };

  const handleStatusHover = (e, invoice) => {
    setHoveredStatus(invoice);
    const rect = e.target.getBoundingClientRect();
    setTooltipPosition({ x: rect.left, y: rect.bottom + 8 });
  };

  // Filter invoices based on status
  const filterInvoicesByStatus = (invoices) => {
    if (activeStatusFilter === 'all') return invoices;
    
    const statusMap = {
      'collected': 'Fully Paid',
      'overdue': 'Overdue',
      'processing': 'Processing',
      'coming-due': 'Pending'
    };
    
    const targetStatus = statusMap[activeStatusFilter];
    return invoices.filter(inv => inv.status === targetStatus);
  };

  // Handle filter change and expand properties with matching invoices
  const handleFilterChange = (filterId) => {
    setActiveStatusFilter(filterId);
    
    // If a specific filter is applied, expand all properties
    // If "all" is selected, collapse all properties
    if (filterId !== 'all') {
      setExpandedProperties({
        '605 Race Street': true,
        'Jefferson Ave Apartments': true,
        'Jefferson House': true
      });
    } else {
      setExpandedProperties({});
    }
  };

  // Calculate totals
  const calculateTotals = () => {
    let totalInvoiceAmount = 0;
    let totalOpenInvoice = 0;
    let totalDueAmount = 0;
    let processing = 0;
    let partiallyPaid = 0;
    let fullyPaid = 0;
    let totalPaidAmount = 0;
    let overdueUnpaid = 0; // Red - unpaid overdue balance
    let overduePaid = 0; // Green - paid portion of overdue invoices
    let overdueProcessing = 0; // Yellow - processing portion

    Object.values(incomeData).forEach(({ invoices }) => {
      invoices.forEach(inv => {
        totalInvoiceAmount += inv.amount;
        totalPaidAmount += inv.paid;
        
        if (inv.status === 'Overdue') {
          totalOpenInvoice += inv.balance;
          totalDueAmount += inv.balance;
          // Break down overdue into paid vs unpaid
          overdueUnpaid += inv.balance; // Red - what's still owed
          overduePaid += inv.paid; // Green - what's been paid
          if (inv.processing && inv.processing > 0) {
            overdueProcessing += inv.processing; // Yellow - what's processing
          }
        }
        else if (inv.status === 'Fully Paid') {
          fullyPaid += inv.paid; // Green - fully paid invoices
        }
        else if (inv.status === 'Partial') {
          partiallyPaid += inv.paid; // Partially paid
          if (inv.processing && inv.processing > 0) {
            processing += inv.processing; // Any processing amounts
          }
        }
      });
    });

    return { 
      totalInvoiceAmount, 
      totalOpenInvoice, 
      totalDueAmount, 
      processing, 
      partiallyPaid, 
      fullyPaid, 
      totalPaidAmount,
      overdueUnpaid, // Red segment
      overduePaid, // Green segment
      overdueProcessing // Yellow segment
    };
  };

  const totals = calculateTotals();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    const styles = {
      'Fully Paid': {
        background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
        color: '#065f46',
        border: '1px solid #6ee7b7'
      },
      'Overdue': {
        background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
        color: '#991b1b',
        border: '1px solid #fca5a5'
      },
      'Partially Paid': {
        background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
        color: '#92400e',
        border: '1px solid #fcd34d'
      }
    };

    return (
      <div style={{
        display: 'inline-block',
        padding: '4px 10px',
        borderRadius: '6px',
        fontSize: '11px',
        fontWeight: '600',
        ...styles[status]
      }}>
        {status}
      </div>
    );
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 50%, #99f6e4 100%)',
      padding: isMobile ? '16px' : '24px'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h1 style={{
          fontSize: '28px',
          fontWeight: '700',
          color: '#115e59',
          margin: 0
        }}>
          Income
        </h1>
        <div style={{
          display: 'flex',
          gap: '12px'
        }}>
          <button style={{
            padding: '10px 20px',
            background: 'white',
            color: '#0f766e',
            border: '1px solid #99f6e4',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 4px rgba(20,184,166,0.1)'
          }}
          onMouseOver={(e) => {
            e.target.style.background = '#f0fdfa';
            e.target.style.borderColor = '#14b8a6';
          }}
          onMouseOut={(e) => {
            e.target.style.background = 'white';
            e.target.style.borderColor = '#99f6e4';
          }}>
            Export
          </button>
          <button style={{
            padding: '10px 24px',
            background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '700',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 12px rgba(20,184,166,0.3)'
          }}
          onMouseOver={(e) => {
            e.target.style.background = 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)';
            e.target.style.boxShadow = '0 6px 16px rgba(20,184,166,0.4)';
          }}
          onMouseOut={(e) => {
            e.target.style.background = 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)';
            e.target.style.boxShadow = '0 4px 12px rgba(20,184,166,0.3)';
          }}>
            New Invoice
          </button>
        </div>
      </div>

      {/* Show detail view if invoice is selected */}
      {selectedInvoice ? (
        <InvoiceDetailView
          selectedInvoice={selectedInvoice}
          allInvoices={Object.values(incomeData).flatMap(prop => prop.invoices)}
          onInvoiceSelect={setSelectedInvoice}
          onClose={() => setSelectedInvoice(null)}
          isMobile={isMobile}
        />
      ) : (
        <div style={{
          display: 'flex',
          gap: '20px',
          flexWrap: isMobile ? 'wrap' : 'nowrap'
        }}>
        {/* Main Table */}
        <div style={{
          flex: 1,
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 4px 16px rgba(20,184,166,0.12)',
          border: '1px solid #99f6e4',
          overflow: 'hidden'
        }}>
          {/* Filter Bar */}
          <div style={{
            padding: '16px 24px',
            borderBottom: '2px solid #e5e7eb',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'linear-gradient(135deg, #ffffff 0%, #f0fdfa 100%)',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div style={{
              display: 'flex',
              gap: '20px',
              alignItems: 'center',
              flexWrap: 'wrap'
            }}>
              {/* Status Filter Pills */}
              <div style={{
                display: 'flex',
                gap: '8px',
                alignItems: 'center',
                padding: '4px',
                background: '#f0fdfa',
                borderRadius: '8px',
                border: '1px solid #99f6e4'
              }}>
                {[
                  { id: 'all', label: 'All', color: '#0f766e' },
                  { id: 'collected', label: 'Collected', color: '#10b981' },
                  { id: 'overdue', label: 'Overdue', color: '#dc2626' },
                  { id: 'processing', label: 'Processing', color: '#f59e0b' },
                  { id: 'coming-due', label: 'Coming Due', color: '#0f766e' }
                ].map(filter => (
                  <button
                    key={filter.id}
                    onClick={() => handleFilterChange(filter.id)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '6px',
                      border: 'none',
                      background: activeStatusFilter === filter.id 
                        ? 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)'
                        : 'transparent',
                      color: activeStatusFilter === filter.id ? 'white' : '#6b7280',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: activeStatusFilter === filter.id ? '0 2px 8px rgba(20,184,166,0.3)' : 'none'
                    }}
                    onMouseOver={(e) => {
                      if (activeStatusFilter !== filter.id) {
                        e.target.style.background = '#ccfbf1';
                        e.target.style.color = '#0f766e';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (activeStatusFilter !== filter.id) {
                        e.target.style.background = 'transparent';
                        e.target.style.color = '#6b7280';
                      }
                    }}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>

              {/* Search Icon */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#6b7280',
                fontSize: '13px',
                fontWeight: '600'
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
                Search
              </div>

              {/* Filter Icon */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#6b7280',
                fontSize: '13px',
                fontWeight: '600'
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                </svg>
                Grouped by
                <select 
                  value={groupBy}
                  onChange={(e) => setGroupBy(e.target.value)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: '1px solid #99f6e4',
                    background: '#f0fdfa',
                    color: '#0f766e',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    outline: 'none'
                  }}
                >
                  <option>Property</option>
                  <option>Tenant</option>
                  <option>Status</option>
                </select>
              </div>
            </div>

            <div style={{
              fontSize: '11px',
              fontWeight: '700',
              color: '#6b7280',
              letterSpacing: '0.5px'
            }}>
              SHOWING 3 OF 3{' '}
              <span style={{ 
                color: '#14b8a6',
                fontSize: '10px'
              }}>
                (This data is 5 minutes old)
              </span>{' '}
              <a href="#" style={{
                color: '#14b8a6',
                textDecoration: 'none',
                fontWeight: '700'
              }}>
                Refresh Now
              </a>
            </div>
          </div>

          {/* Table Header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '40px 2fr 110px 90px 100px 100px 90px 100px',
            gap: '12px',
            padding: '12px 24px',
            background: 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%)',
            borderBottom: '2px solid #99f6e4',
            fontSize: '11px',
            fontWeight: '700',
            color: '#115e59',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            <div></div>
            <div>Property/Shared By</div>
            <div>Due On</div>
            <div>Paid On</div>
            <div>ID</div>
            <div>Status</div>
            <div>Unit</div>
            <div style={{ textAlign: 'right' }}>Balance</div>
          </div>

          {/* Table Body */}
          <div style={{
            maxHeight: '600px',
            overflowY: 'auto'
          }}>
            {loading ? (
              <div style={{
                padding: '80px 40px',
                textAlign: 'center',
                color: '#14b8a6',
                fontSize: '14px'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
                <div style={{ fontWeight: '600', marginBottom: '8px', color: '#0f766e', fontSize: '18px' }}>
                  Loading income data...
                </div>
              </div>
            ) : Object.entries(incomeData).length === 0 ? (
              <div style={{
                padding: '80px 40px',
                textAlign: 'center',
                color: '#94a3b8',
                fontSize: '14px'
              }}>
                <div style={{ fontSize: '64px', marginBottom: '16px' }}>💰</div>
                <div style={{ fontWeight: '600', marginBottom: '8px', color: '#64748b', fontSize: '18px' }}>
                  No income records
                </div>
                <div style={{ fontSize: '14px' }}>
                  Income and invoices will appear here when you create leases and record payments
                </div>
              </div>
            ) : (
              Object.entries(incomeData).map(([property, data]) => (
              <div key={property}>
                {/* Property Header */}
                <div
                  onClick={() => toggleProperty(property)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '14px 24px',
                    background: 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)',
                    borderBottom: '1px solid #e5e7eb',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #f0fdfa 0%, #e5f7f5 100%)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)';
                  }}
                >
                  <svg 
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="#14b8a6" 
                    strokeWidth="2.5"
                    style={{
                      transition: 'transform 0.2s ease',
                      transform: expandedProperties[property] ? 'rotate(180deg)' : 'rotate(0deg)'
                    }}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                  <span style={{
                    marginLeft: '12px',
                    fontSize: '15px',
                    fontWeight: '700',
                    color: '#115e59'
                  }}>
                    {property}
                  </span>
                  <span style={{
                    marginLeft: '8px',
                    fontSize: '13px',
                    fontWeight: '400',
                    color: '#6b7280'
                  }}>
                    {data.details}
                  </span>
                </div>

                {/* Invoices */}
                {expandedProperties[property] && filterInvoicesByStatus(data.invoices).map((invoice) => (
                  <React.Fragment key={invoice.id}>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '40px 2fr 110px 90px 100px 100px 90px 100px',
                        gap: '12px',
                        padding: '16px 24px',
                        borderBottom: expandedInvoices[invoice.id] ? 'none' : '1px solid #f3f4f6',
                        fontSize: '13px',
                        color: '#374151',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        background: selectedInvoice?.id === invoice.id ? 'linear-gradient(135deg, #f0fdfa 0%, #e0f7f4 100%)' : 'white',
                        alignItems: 'center'
                      }}
                      onClick={() => setSelectedInvoice(invoice)}
                      onMouseOver={(e) => {
                        if (selectedInvoice?.id !== invoice.id) {
                          e.currentTarget.style.background = 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)';
                        }
                      }}
                      onMouseOut={(e) => {
                        if (selectedInvoice?.id !== invoice.id) {
                          e.currentTarget.style.background = 'white';
                        }
                      }}
                    >
                      <div 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleInvoice(invoice.id);
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer'
                        }}
                      >
                        <svg 
                          width="16" 
                          height="16" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="#6b7280" 
                          strokeWidth="2"
                          style={{
                            transition: 'transform 0.2s ease',
                            transform: expandedInvoices[invoice.id] ? 'rotate(90deg)' : 'rotate(0deg)'
                          }}
                        >
                          <polyline points="9 18 15 12 9 6" />
                        </svg>
                      </div>
                      <div 
                        style={{ 
                          fontWeight: '600', 
                          color: '#0f766e',
                          cursor: 'pointer',
                          textDecoration: 'underline',
                          textDecorationColor: 'transparent',
                          transition: 'all 0.2s ease'
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedInvoice(invoice);
                        }}
                        onMouseOver={(e) => {
                          e.target.style.textDecorationColor = '#0f766e';
                          e.target.style.color = '#14b8a6';
                        }}
                        onMouseOut={(e) => {
                          e.target.style.textDecorationColor = 'transparent';
                          e.target.style.color = '#0f766e';
                        }}
                      >
                        {invoice.tenant}
                      </div>
                      <div>{invoice.dueOn}</div>
                      <div>{invoice.paidOn}</div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>{invoice.id}</div>
                      <div 
                        onMouseEnter={(e) => handleStatusHover(e, invoice)}
                        onMouseLeave={() => setHoveredStatus(null)}
                      >
                        {getStatusBadge(invoice.status)}
                      </div>
                      <div>{invoice.unit}</div>
                      <div style={{ 
                        textAlign: 'right', 
                        fontWeight: '600',
                        color: invoice.balance > 0 ? '#dc2626' : '#059669'
                      }}>
                        {formatCurrency(invoice.balance)}
                        {invoice.status === 'Overdue' && invoice.daysLate > 0 && (
                          <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            background: '#fee2e2',
                            border: '2px solid #dc2626',
                            marginLeft: '8px',
                            fontSize: '11px',
                            fontWeight: '700',
                            color: '#dc2626'
                          }}>
                            !
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Expanded Invoice Details */}
                    {expandedInvoices[invoice.id] && (
                      <div style={{
                        background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
                        padding: '20px 24px 20px 80px',
                        borderBottom: '1px solid #e5e7eb',
                        borderTop: '1px solid #e5e7eb'
                      }}>
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr 1fr',
                          gap: '24px'
                        }}>
                          {/* Left Column */}
                          <div>
                            <div style={{ marginBottom: '16px' }}>
                              <div style={{
                                fontSize: '11px',
                                fontWeight: '700',
                                color: '#6b7280',
                                letterSpacing: '0.5px',
                                marginBottom: '4px'
                              }}>
                                DUE DATE
                              </div>
                              <div style={{
                                fontSize: '14px',
                                fontWeight: '600',
                                color: '#115e59'
                              }}>
                                {invoice.dueDate}
                              </div>
                            </div>
                            <div>
                              <div style={{
                                fontSize: '11px',
                                fontWeight: '700',
                                color: '#6b7280',
                                letterSpacing: '0.5px',
                                marginBottom: '4px'
                              }}>
                                TOTAL DUE
                              </div>
                              <div style={{
                                fontSize: '20px',
                                fontWeight: '700',
                                color: invoice.totalDue > 0 ? '#dc2626' : '#115e59'
                              }}>
                                {formatCurrency(invoice.totalDue)}
                              </div>
                            </div>
                            {invoice.status === 'Overdue' && (
                              <div style={{
                                marginTop: '12px',
                                padding: '8px 12px',
                                background: '#fee2e2',
                                borderRadius: '8px',
                                border: '1px solid #fca5a5'
                              }}>
                                <div style={{
                                  fontSize: '11px',
                                  fontWeight: '700',
                                  color: '#991b1b',
                                  marginBottom: '2px'
                                }}>
                                  Late by
                                </div>
                                <div style={{
                                  fontSize: '16px',
                                  fontWeight: '700',
                                  color: '#dc2626'
                                }}>
                                  {invoice.daysLate} days
                                </div>
                              </div>
                            )}
                            <div style={{
                              marginTop: '12px',
                              fontSize: '11px',
                              color: '#6b7280'
                            }}>
                              Reminders Sent: {invoice.remindersSent}
                            </div>
                          </div>

                          {/* Middle Column - Invoice Items */}
                          <div>
                            <div style={{
                              fontSize: '11px',
                              fontWeight: '700',
                              color: '#115e59',
                              letterSpacing: '0.5px',
                              marginBottom: '12px',
                              textTransform: 'uppercase'
                            }}>
                              Invoice Items
                            </div>
                            {invoice.invoiceItems.map((item, idx) => (
                              <div key={idx} style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                padding: '8px 0',
                                borderBottom: idx < invoice.invoiceItems.length - 1 ? '1px solid #e5e7eb' : 'none',
                                fontSize: '13px'
                              }}>
                                <span style={{ fontWeight: '500', color: '#374151' }}>{item.name}</span>
                                <span style={{ fontWeight: '600', color: '#115e59' }}>{formatCurrency(item.amount)}</span>
                              </div>
                            ))}
                          </div>

                          {/* Right Column - Payments Submitted */}
                          <div>
                            <div style={{
                              fontSize: '11px',
                              fontWeight: '700',
                              color: '#115e59',
                              letterSpacing: '0.5px',
                              marginBottom: '12px',
                              textTransform: 'uppercase'
                            }}>
                              Payments Submitted
                            </div>
                            {invoice.paymentsSubmitted.length > 0 ? (
                              invoice.paymentsSubmitted.map((payment, idx) => (
                                <div key={idx} style={{ marginBottom: '12px' }}>
                                  <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    marginBottom: '4px',
                                    fontSize: '13px'
                                  }}>
                                    <span style={{ fontWeight: '500', color: '#374151' }}>{payment.name}</span>
                                    <span style={{ fontWeight: '600', color: '#059669' }}>{formatCurrency(payment.amount)}</span>
                                  </div>
                                  <div style={{
                                    fontSize: '11px',
                                    color: '#6b7280'
                                  }}>
                                    Bank Account
                                  </div>
                                  <div style={{
                                    fontSize: '12px',
                                    fontWeight: '600',
                                    color: '#115e59'
                                  }}>
                                    {payment.bankAccount}
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div style={{
                                fontSize: '12px',
                                color: '#6b7280',
                                fontStyle: 'italic'
                              }}>
                                No Payments Received
                              </div>
                            )}
                            {invoice.paymentsSubmitted.length > 0 && (
                              <>
                                <button style={{
                                  marginTop: '12px',
                                  padding: '6px 12px',
                                  background: 'white',
                                  border: '1px solid #14b8a6',
                                  borderRadius: '6px',
                                  color: '#14b8a6',
                                  fontSize: '12px',
                                  fontWeight: '600',
                                  cursor: 'pointer',
                                  transition: 'all 0.2s ease',
                                  width: '100%'
                                }}
                                onMouseOver={(e) => {
                                  e.target.style.background = '#f0fdfa';
                                }}
                                onMouseOut={(e) => {
                                  e.target.style.background = 'white';
                                }}>
                                  Record payment
                                </button>
                                <button style={{
                                  marginTop: '8px',
                                  padding: '6px 12px',
                                  background: 'white',
                                  border: '1px solid #14b8a6',
                                  borderRadius: '6px',
                                  color: '#14b8a6',
                                  fontSize: '12px',
                                  fontWeight: '600',
                                  cursor: 'pointer',
                                  transition: 'all 0.2s ease',
                                  width: '100%'
                                }}
                                onMouseOver={(e) => {
                                  e.target.style.background = '#f0fdfa';
                                }}
                                onMouseOut={(e) => {
                                  e.target.style.background = 'white';
                                }}>
                                  Edit invoice
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            ))
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <div style={{
          width: isMobile ? '100%' : '320px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          {/* Total Invoice Amount Card */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 4px 16px rgba(20,184,166,0.12)',
            border: '1px solid #99f6e4'
          }}>
            <div style={{
              fontSize: '11px',
              fontWeight: '700',
              color: '#6b7280',
              letterSpacing: '0.5px',
              marginBottom: '12px'
            }}>
              JAN 1, 25 - JAN 31, 25
            </div>

            {/* Circular Progress */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '24px',
              position: 'relative'
            }}>
              <svg width="200" height="200" viewBox="0 0 200 200" style={{ transform: 'rotate(-90deg)' }}>
                {/* Background circle */}
                <circle
                  cx="100"
                  cy="100"
                  r="75"
                  fill="none"
                  stroke="#fee2e2"
                  strokeWidth="16"
                />
                
                {/* Collected/Paid (Green) - starts at top */}
                {(totals.fullyPaid + totals.overduePaid + totals.partiallyPaid) > 0 && (
                  <circle
                    cx="100"
                    cy="100"
                    r="75"
                    fill="none"
                    stroke="url(#greenGradient)"
                    strokeWidth="16"
                    strokeDasharray={`${((totals.fullyPaid + totals.overduePaid + totals.partiallyPaid) / totals.totalInvoiceAmount) * 471.2} 471.2`}
                    strokeLinecap="round"
                    style={{
                      filter: 'drop-shadow(0 2px 8px rgba(16,185,129,0.3))'
                    }}
                  />
                )}
                
                {/* Processing (Yellow) - continues after green */}
                {(totals.processing + totals.overdueProcessing) > 0 && (
                  <circle
                    cx="100"
                    cy="100"
                    r="75"
                    fill="none"
                    stroke="url(#yellowGradient)"
                    strokeWidth="16"
                    strokeDasharray={`${((totals.processing + totals.overdueProcessing) / totals.totalInvoiceAmount) * 471.2} 471.2`}
                    strokeDashoffset={`-${((totals.fullyPaid + totals.overduePaid + totals.partiallyPaid) / totals.totalInvoiceAmount) * 471.2}`}
                    strokeLinecap="round"
                    style={{
                      filter: 'drop-shadow(0 2px 8px rgba(245,158,11,0.3))'
                    }}
                  />
                )}
                
                {/* Unpaid/Overdue Balance (Red) - continues after yellow */}
                {totals.overdueUnpaid > 0 && (
                  <circle
                    cx="100"
                    cy="100"
                    r="75"
                    fill="none"
                    stroke="url(#redGradient)"
                    strokeWidth="16"
                    strokeDasharray={`${(totals.overdueUnpaid / totals.totalInvoiceAmount) * 471.2} 471.2`}
                    strokeDashoffset={`-${((totals.fullyPaid + totals.overduePaid + totals.partiallyPaid + totals.processing + totals.overdueProcessing) / totals.totalInvoiceAmount) * 471.2}`}
                    strokeLinecap="round"
                    style={{
                      filter: 'drop-shadow(0 2px 8px rgba(239,68,68,0.3))'
                    }}
                  />
                )}
                
                {/* Gradients */}
                <defs>
                  <linearGradient id="greenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                  <linearGradient id="yellowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fbbf24" />
                    <stop offset="100%" stopColor="#f59e0b" />
                  </linearGradient>
                  <linearGradient id="redGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ef4444" />
                    <stop offset="100%" stopColor="#dc2626" />
                  </linearGradient>
                </defs>
              </svg>
              <div style={{
                position: 'absolute',
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '32px',
                  fontWeight: '700',
                  color: '#115e59',
                  lineHeight: '1',
                  marginBottom: '4px'
                }}>
                  {formatCurrency(totals.totalInvoiceAmount)}
                </div>
                <div style={{
                  fontSize: '10px',
                  fontWeight: '700',
                  color: '#6b7280',
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase'
                }}>
                  TOTAL INVOICE AMOUNT
                </div>
              </div>
            </div>

            {/* Legend */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              marginBottom: '20px'
            }}>
              {(totals.fullyPaid + totals.overduePaid + totals.partiallyPaid) > 0 && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      boxShadow: '0 2px 6px rgba(16,185,129,0.3)'
                    }} />
                    <span style={{
                      fontSize: '11px',
                      fontWeight: '600',
                      color: '#059669'
                    }}>
                      Collected
                    </span>
                  </div>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: '700',
                    color: '#059669'
                  }}>
                    {formatCurrency(totals.fullyPaid + totals.overduePaid + totals.partiallyPaid)}
                  </span>
                </div>
              )}
              
              {(totals.processing + totals.overdueProcessing) > 0 && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                      boxShadow: '0 2px 6px rgba(251,191,36,0.3)'
                    }} />
                    <span style={{
                      fontSize: '11px',
                      fontWeight: '600',
                      color: '#f59e0b'
                    }}>
                      Processing
                    </span>
                  </div>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: '700',
                    color: '#f59e0b'
                  }}>
                    {formatCurrency(totals.processing + totals.overdueProcessing)}
                  </span>
                </div>
              )}
              
              {totals.overdueUnpaid > 0 && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                      boxShadow: '0 2px 6px rgba(239,68,68,0.3)'
                    }} />
                    <span style={{
                      fontSize: '11px',
                      fontWeight: '600',
                      color: '#dc2626'
                    }}>
                      Overdue Balance
                    </span>
                  </div>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: '700',
                    color: '#dc2626'
                  }}>
                    {formatCurrency(totals.overdueUnpaid)}
                  </span>
                </div>
              )}
            </div>

            {/* Mini Stats */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>
              <div style={{
                background: totals.totalOpenInvoice > 0 
                  ? 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)' 
                  : 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
                borderRadius: '10px',
                padding: '14px',
                border: totals.totalOpenInvoice > 0 ? '2px solid #fca5a5' : '2px solid #6ee7b7',
                boxShadow: totals.totalOpenInvoice > 0 
                  ? '0 4px 12px rgba(239,68,68,0.15)' 
                  : '0 4px 12px rgba(16,185,129,0.15)'
              }}>
                <div style={{
                  fontSize: '10px',
                  fontWeight: '700',
                  color: totals.totalOpenInvoice > 0 ? '#991b1b' : '#065f46',
                  letterSpacing: '0.5px',
                  marginBottom: '4px',
                  textTransform: 'uppercase'
                }}>
                  TOTAL OPEN INVOICE
                </div>
                <div style={{
                  fontSize: '22px',
                  fontWeight: '700',
                  color: totals.totalOpenInvoice > 0 ? '#dc2626' : '#059669'
                }}>
                  {formatCurrency(totals.totalOpenInvoice)}
                </div>
                {totals.totalOpenInvoice > 0 && (
                  <div style={{
                    fontSize: '10px',
                    fontWeight: '600',
                    color: '#991b1b',
                    marginTop: '4px'
                  }}>
                    ⚠️ Late by 29 days
                  </div>
                )}
              </div>

              <div style={{
                background: 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%)',
                borderRadius: '10px',
                padding: '12px',
                border: '1px solid #99f6e4'
              }}>
                <div style={{
                  fontSize: '10px',
                  fontWeight: '700',
                  color: '#0f766e',
                  letterSpacing: '0.5px',
                  marginBottom: '4px',
                  textTransform: 'uppercase'
                }}>
                  TOTAL DUE AMOUNT
                </div>
                <div style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  color: '#115e59'
                }}>
                  {formatCurrency(totals.totalDueAmount)}
                </div>
              </div>

              <div style={{
                background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
                borderRadius: '10px',
                padding: '12px',
                border: '1px solid #fde68a'
              }}>
                <div style={{
                  fontSize: '10px',
                  fontWeight: '700',
                  color: '#92400e',
                  letterSpacing: '0.5px',
                  marginBottom: '4px',
                  textTransform: 'uppercase'
                }}>
                  PROCESSING
                </div>
                <div style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  color: '#f59e0b'
                }}>
                  {formatCurrency(totals.processing)}
                </div>
              </div>

              <div style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)',
                borderRadius: '10px',
                padding: '12px',
                border: '1px solid #e5e7eb'
              }}>
                <div style={{
                  fontSize: '10px',
                  fontWeight: '700',
                  color: '#6b7280',
                  letterSpacing: '0.5px',
                  marginBottom: '4px',
                  textTransform: 'uppercase'
                }}>
                  PARTIALLY PAID
                </div>
                <div style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  color: '#115e59'
                }}>
                  {formatCurrency(totals.partiallyPaid)}
                </div>
              </div>

              <div style={{
                background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
                borderRadius: '10px',
                padding: '12px',
                border: '2px solid #6ee7b7',
                boxShadow: '0 4px 12px rgba(16,185,129,0.15)'
              }}>
                <div style={{
                  fontSize: '10px',
                  fontWeight: '700',
                  color: '#065f46',
                  letterSpacing: '0.5px',
                  marginBottom: '4px',
                  textTransform: 'uppercase'
                }}>
                  FULLY PAID
                </div>
                <div style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  color: '#059669'
                }}>
                  {formatCurrency(totals.fullyPaid)}
                </div>
              </div>

              <div style={{
                background: 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%)',
                borderRadius: '10px',
                padding: '14px',
                border: '2px solid #14b8a6',
                boxShadow: '0 4px 12px rgba(20,184,166,0.2)'
              }}>
                <div style={{
                  fontSize: '10px',
                  fontWeight: '700',
                  color: '#0f766e',
                  letterSpacing: '0.5px',
                  marginBottom: '4px',
                  textTransform: 'uppercase'
                }}>
                  TOTAL PAID AMOUNT
                </div>
                <div style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#115e59'
                }}>
                  {formatCurrency(totals.totalPaidAmount)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Status Tooltip */}
      {hoveredStatus && (
        <div 
          onMouseEnter={() => {
            // Keep tooltip visible when hovering over it
          }}
          onMouseLeave={() => setHoveredStatus(null)}
          style={{
          position: 'fixed',
          left: `${tooltipPosition.x - 125}px`,
          top: `${tooltipPosition.y}px`,
          background: 'white',
          borderRadius: '16px',
          padding: '20px',
          boxShadow: '0 12px 32px rgba(17,94,89,0.25), 0 0 0 1px rgba(153,246,228,0.3)',
          border: '2px solid #99f6e4',
          zIndex: 1000,
          width: '280px'
        }}>
          {/* Header with checkmark */}
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            marginBottom: '16px'
          }}>
            <div style={{ flex: 1 }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '8px'
              }}>
                {hoveredStatus.status === 'Fully Paid' && (
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(16,185,129,0.4)'
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                )}
                {hoveredStatus.status === 'Overdue' && (
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(239,68,68,0.4)'
                  }}>
                    <span style={{
                      color: 'white',
                      fontSize: '16px',
                      fontWeight: '700'
                    }}>!</span>
                  </div>
                )}
                <div>
                  <div style={{
                    fontSize: '11px',
                    fontWeight: '700',
                    color: '#6b7280',
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase'
                  }}>
                    Due Date
                  </div>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#115e59'
                  }}>
                    {hoveredStatus.dueDate}
                  </div>
                </div>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{
                fontSize: '11px',
                fontWeight: '700',
                color: '#6b7280',
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                marginBottom: '2px'
              }}>
                Total Due
              </div>
              <div style={{
                fontSize: '18px',
                fontWeight: '700',
                color: hoveredStatus.totalDue > 0 ? '#dc2626' : '#115e59'
              }}>
                {formatCurrency(hoveredStatus.totalDue)}
              </div>
            </div>
          </div>

          {/* Late indicator */}
          {hoveredStatus.status === 'Overdue' && hoveredStatus.daysLate > 0 && (
            <div style={{
              background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
              borderRadius: '8px',
              padding: '8px 12px',
              marginBottom: '16px',
              border: '1px solid #fca5a5'
            }}>
              <div style={{
                fontSize: '11px',
                fontWeight: '700',
                color: '#991b1b',
                marginBottom: '2px'
              }}>
                Late by
              </div>
              <div style={{
                fontSize: '16px',
                fontWeight: '700',
                color: '#dc2626'
              }}>
                {hoveredStatus.daysLate} days
              </div>
            </div>
          )}

          {/* Reminders Sent */}
          <div style={{
            fontSize: '11px',
            color: '#6b7280',
            marginBottom: '16px'
          }}>
            Reminders Sent: <span style={{ fontWeight: '600', color: '#115e59' }}>{hoveredStatus.remindersSent}</span>
          </div>

          {/* Invoice Items */}
          <div style={{
            borderTop: '1px solid #e5e7eb',
            paddingTop: '12px',
            marginBottom: '12px'
          }}>
            <div style={{
              fontSize: '11px',
              fontWeight: '700',
              color: '#115e59',
              letterSpacing: '0.5px',
              marginBottom: '8px',
              textTransform: 'uppercase'
            }}>
              Invoice Items
            </div>
            {hoveredStatus.invoiceItems.map((item, idx) => (
              <div key={idx} style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '6px',
                padding: '4px 0'
              }}>
                <span style={{ fontSize: '12px', fontWeight: '500', color: '#374151' }}>{item.name}</span>
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#115e59' }}>
                  {formatCurrency(item.amount)}
                </span>
              </div>
            ))}
          </div>

          {/* Payments Submitted */}
          {hoveredStatus.paymentsSubmitted.length > 0 && (
            <div style={{
              borderTop: '1px solid #e5e7eb',
              paddingTop: '12px',
              marginBottom: '12px'
            }}>
              <div style={{
                fontSize: '11px',
                fontWeight: '700',
                color: '#115e59',
                letterSpacing: '0.5px',
                marginBottom: '8px',
                textTransform: 'uppercase'
              }}>
                Payments Submitted
              </div>
              {hoveredStatus.paymentsSubmitted.map((payment, idx) => (
                <div key={idx} style={{ marginBottom: '8px' }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '2px'
                  }}>
                    <span style={{ fontSize: '12px', fontWeight: '500', color: '#374151' }}>
                      {payment.name.split(' By ')[0]}
                    </span>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: '#059669' }}>
                      {formatCurrency(payment.amount)}
                    </span>
                  </div>
                  <div style={{ fontSize: '10px', color: '#6b7280' }}>
                    Bank Account
                  </div>
                  <div style={{ fontSize: '11px', fontWeight: '600', color: '#115e59' }}>
                    {payment.bankAccount}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div style={{
            borderTop: '1px solid #e5e7eb',
            paddingTop: '12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            {hoveredStatus.status === 'Overdue' && (
              <button style={{
                padding: '8px 16px',
                background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 8px rgba(20,184,166,0.3)',
                width: '100%'
              }}
              onMouseOver={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)';
                e.target.style.transform = 'translateY(-1px)';
                e.target.style.boxShadow = '0 4px 12px rgba(20,184,166,0.4)';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 2px 8px rgba(20,184,166,0.3)';
              }}>
                Remind
              </button>
            )}
            <button style={{
              padding: '8px 16px',
              background: 'white',
              color: '#0f766e',
              border: '1px solid #99f6e4',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              width: '100%'
            }}
            onMouseOver={(e) => {
              e.target.style.background = '#f0fdfa';
              e.target.style.borderColor = '#14b8a6';
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'white';
              e.target.style.borderColor = '#99f6e4';
            }}>
              Record payment
            </button>
            <button style={{
              padding: '8px 16px',
              background: 'white',
              color: '#0f766e',
              border: '1px solid #99f6e4',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              width: '100%'
            }}
            onMouseOver={(e) => {
              e.target.style.background = '#f0fdfa';
              e.target.style.borderColor = '#14b8a6';
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'white';
              e.target.style.borderColor = '#99f6e4';
            }}>
              Edit invoice
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
