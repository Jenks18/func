import React, { useState, useEffect } from 'react';
import { UIIcons } from '../config/icons';

const ReportsPage = () => {
  const [activeTab, setActiveTab] = useState('pl-report');
  const [dateRange, setDateRange] = useState('2024');
  const [incomeData, setIncomeData] = useState({ total: 25600, count: 12 });
  const [expenseData, setExpenseData] = useState({ total: 0, count: 0 });
  const [loading, setLoading] = useState(false);

  // Calculate net profit/loss
  const netProfit = incomeData.total - expenseData.total;

  // Fetch data when date range changes
  useEffect(() => {
    fetchReportData();
  }, [dateRange]);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual Supabase queries
      // Query transactions table for income and expenses
      // SELECT SUM(amount) FROM transactions 
      // WHERE organization_id = current_organization_id()
      // AND type = 'income' 
      // AND date >= startDate AND date <= endDate
      
      // For now, using mock data
      // The actual implementation should query the transactions table
      setIncomeData({ total: 25600, count: 12 });
      setExpenseData({ total: 0, count: 0 });
    } catch (error) {
      console.error('Error fetching report data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const tabs = [
    { id: 'rent', label: 'Rent', icon: UIIcons.Home },
    { id: 'expenses', label: 'Expenses', icon: UIIcons.CreditCard },
    { id: 'rent-roll', label: 'Rent Roll', icon: UIIcons.FileText },
    { id: 'deposits-held', label: 'Deposits Held', icon: UIIcons.Shield },
    { id: 'pl-report', label: 'P/L Report', icon: UIIcons.TrendingUp }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'rent':
        return <RentTab 
          dateRange={dateRange}
          setDateRange={setDateRange}
          formatCurrency={formatCurrency}
        />;
      case 'expenses':
        return <ExpensesTab 
          dateRange={dateRange}
          setDateRange={setDateRange}
          formatCurrency={formatCurrency}
        />;
      case 'pl-report':
        return <PLReportTab 
          incomeData={incomeData}
          expenseData={expenseData}
          netProfit={netProfit}
          dateRange={dateRange}
          setDateRange={setDateRange}
          formatCurrency={formatCurrency}
          loading={loading}
        />;
      case 'rent-roll':
        return <ComingSoonTab tabName="Rent Roll" />;
      case 'deposits-held':
        return <ComingSoonTab tabName="Deposits Held" />;
      default:
        return <ComingSoonTab tabName="Report" />;
    }
  };

  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 50%, #99f6e4 100%)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        padding: '24px 32px',
        borderBottom: '1px solid #99f6e4',
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(20px)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <UIIcons.BarChart3 size={20} style={{ color: 'white' }} />
            </div>
            <div>
              <h1 style={{
                margin: 0,
                fontSize: '24px',
                fontWeight: '700',
                color: '#0f766e'
              }}>
                Financial Reports
              </h1>
              <p style={{
                margin: '4px 0 0 0',
                fontSize: '14px',
                color: '#14b8a6'
              }}>
                Analyze your property financials
              </p>
            </div>
          </div>

          {/* Export Button */}
          <button style={{
            padding: '10px 20px',
            background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 8px rgba(20, 184, 166, 0.3)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(20, 184, 166, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(20, 184, 166, 0.3)';
          }}
          onClick={() => {
            // TODO: Implement export functionality
            console.log('Exporting report...');
          }}
          >
            <UIIcons.Download size={16} />
            Export Report
          </button>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: '8px',
          borderBottom: '2px solid #99f6e4',
          paddingBottom: '0'
        }}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '12px 20px',
                  background: isActive ? 'white' : 'transparent',
                  border: 'none',
                  borderBottom: isActive ? '3px solid #14b8a6' : '3px solid transparent',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: isActive ? '600' : '500',
                  color: isActive ? '#0f766e' : '#5eead4',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s ease',
                  borderRadius: '8px 8px 0 0',
                  marginBottom: '-2px'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.5)';
                    e.currentTarget.style.color = '#14b8a6';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#5eead4';
                  }
                }}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div style={{
        flex: 1,
        padding: '32px',
        overflowY: 'auto'
      }}>
        {renderTabContent()}
      </div>
    </div>
  );
};

// P/L Report Tab Component
const PLReportTab = ({ incomeData, expenseData, netProfit, dateRange, setDateRange, formatCurrency, loading }) => {
  const profitColor = netProfit >= 0 ? '#14b8a6' : '#ef4444';
  const profitIcon = netProfit >= 0 ? UIIcons.TrendingUp : UIIcons.TrendingDown;
  const ProfitIcon = profitIcon;

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      {/* Date Range Selector */}
      <div style={{
        marginBottom: '32px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        flexWrap: 'wrap'
      }}>
        <label style={{
          fontSize: '14px',
          fontWeight: '600',
          color: '#0f766e'
        }}>
          Time Period:
        </label>
        {['2024', '2025', 'Q1 2025', 'Q2 2025', 'This Month', 'Last Month', 'YTD', 'Custom'].map((period) => (
          <button
            key={period}
            onClick={() => setDateRange(period)}
            style={{
              padding: '8px 16px',
              background: dateRange === period 
                ? 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)'
                : 'white',
              color: dateRange === period ? 'white' : '#14b8a6',
              border: dateRange === period ? 'none' : '2px solid #99f6e4',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              if (dateRange !== period) {
                e.currentTarget.style.borderColor = '#14b8a6';
                e.currentTarget.style.background = '#f0fdfa';
              }
            }}
            onMouseLeave={(e) => {
              if (dateRange !== period) {
                e.currentTarget.style.borderColor = '#99f6e4';
                e.currentTarget.style.background = 'white';
              }
            }}
          >
            {period}
          </button>
        ))}
      </div>

      {/* Summary Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '24px',
        marginBottom: '32px'
      }}>
        {/* Income Card */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '24px',
          border: '2px solid #99f6e4',
          boxShadow: '0 4px 12px rgba(20, 184, 166, 0.1)',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 8px 20px rgba(20, 184, 166, 0.2)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(20, 184, 166, 0.1)';
        }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <UIIcons.TrendingUp size={24} style={{ color: 'white' }} />
            </div>
            <div>
              <div style={{ fontSize: '13px', color: '#14b8a6', fontWeight: '600' }}>Total Income</div>
              <div style={{ fontSize: '11px', color: '#5eead4' }}>{incomeData.count} transactions</div>
            </div>
          </div>
          <div style={{
            fontSize: '32px',
            fontWeight: '700',
            color: '#0f766e',
            marginBottom: '8px'
          }}>
            {formatCurrency(incomeData.total)}
          </div>
          <div style={{
            fontSize: '12px',
            color: '#14b8a6',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <UIIcons.ArrowUp size={14} />
            From rent payments, fees, and deposits
          </div>
        </div>

        {/* Expenses Card */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '24px',
          border: '2px solid #99f6e4',
          boxShadow: '0 4px 12px rgba(20, 184, 166, 0.1)',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 8px 20px rgba(20, 184, 166, 0.2)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(20, 184, 166, 0.1)';
        }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <UIIcons.TrendingDown size={24} style={{ color: 'white' }} />
            </div>
            <div>
              <div style={{ fontSize: '13px', color: '#f97316', fontWeight: '600' }}>Total Expenses</div>
              <div style={{ fontSize: '11px', color: '#fb923c' }}>{expenseData.count} transactions</div>
            </div>
          </div>
          <div style={{
            fontSize: '32px',
            fontWeight: '700',
            color: '#ea580c',
            marginBottom: '8px'
          }}>
            {formatCurrency(expenseData.total)}
          </div>
          <div style={{
            fontSize: '12px',
            color: '#f97316',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <UIIcons.ArrowDown size={14} />
            Maintenance, utilities, and fees
          </div>
        </div>

        {/* Net Profit Card */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '24px',
          border: `2px solid ${netProfit >= 0 ? '#99f6e4' : '#fecaca'}`,
          boxShadow: `0 4px 12px ${netProfit >= 0 ? 'rgba(20, 184, 166, 0.1)' : 'rgba(239, 68, 68, 0.1)'}`,
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = `0 8px 20px ${netProfit >= 0 ? 'rgba(20, 184, 166, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = `0 4px 12px ${netProfit >= 0 ? 'rgba(20, 184, 166, 0.1)' : 'rgba(239, 68, 68, 0.1)'}`;
        }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '10px',
              background: netProfit >= 0 
                ? 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)'
                : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <ProfitIcon size={24} style={{ color: 'white' }} />
            </div>
            <div>
              <div style={{ fontSize: '13px', color: profitColor, fontWeight: '600' }}>
                Net {netProfit >= 0 ? 'Profit' : 'Loss'}
              </div>
              <div style={{ fontSize: '11px', color: netProfit >= 0 ? '#5eead4' : '#fca5a5' }}>
                For {dateRange}
              </div>
            </div>
          </div>
          <div style={{
            fontSize: '32px',
            fontWeight: '700',
            color: profitColor,
            marginBottom: '8px'
          }}>
            {formatCurrency(Math.abs(netProfit))}
          </div>
          <div style={{
            fontSize: '12px',
            color: profitColor,
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <ProfitIcon size={14} />
            {netProfit >= 0 ? 'Positive cash flow' : 'Negative cash flow'}
          </div>
        </div>
      </div>

      {/* Overview Section */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '32px',
        border: '2px solid #99f6e4',
        boxShadow: '0 4px 12px rgba(20, 184, 166, 0.1)'
      }}>
        <h2 style={{
          margin: '0 0 24px 0',
          fontSize: '20px',
          fontWeight: '700',
          color: '#0f766e',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <UIIcons.BarChart3 size={24} />
          Overview
        </h2>

        {/* Year-over-Year Comparison Chart Placeholder */}
        <div style={{
          background: 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%)',
          borderRadius: '8px',
          padding: '48px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '300px',
          border: '2px dashed #99f6e4'
        }}>
          <UIIcons.BarChart3 size={64} style={{ color: '#5eead4', marginBottom: '16px' }} />
          <div style={{ fontSize: '18px', fontWeight: '600', color: '#14b8a6', marginBottom: '8px' }}>
            Year-over-Year Comparison Chart
          </div>
          <div style={{ fontSize: '14px', color: '#5eead4', textAlign: 'center', maxWidth: '400px' }}>
            Visual chart showing income vs expenses comparison between 2024 and 2025 will appear here
          </div>
          <div style={{
            marginTop: '24px',
            fontSize: '12px',
            color: '#14b8a6',
            background: 'white',
            padding: '8px 16px',
            borderRadius: '6px',
            border: '1px solid #99f6e4'
          }}>
            TODO: Integrate chart library (Chart.js or Recharts)
          </div>
        </div>

        {/* Detailed Breakdown */}
        <div style={{ marginTop: '32px' }}>
          <h3 style={{
            margin: '0 0 16px 0',
            fontSize: '16px',
            fontWeight: '600',
            color: '#0f766e'
          }}>
            Breakdown
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '16px'
          }}>
            {/* Income Categories */}
            <div style={{
              padding: '16px',
              background: '#f0fdfa',
              borderRadius: '8px',
              border: '1px solid #99f6e4'
            }}>
              <div style={{ fontSize: '13px', fontWeight: '600', color: '#14b8a6', marginBottom: '12px' }}>
                Income Sources
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                  <span style={{ color: '#5eead4' }}>Rent Payments</span>
                  <span style={{ fontWeight: '600', color: '#0f766e' }}>{formatCurrency(24000)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                  <span style={{ color: '#5eead4' }}>Late Fees</span>
                  <span style={{ fontWeight: '600', color: '#0f766e' }}>{formatCurrency(1200)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                  <span style={{ color: '#5eead4' }}>Other Income</span>
                  <span style={{ fontWeight: '600', color: '#0f766e' }}>{formatCurrency(400)}</span>
                </div>
              </div>
            </div>

            {/* Expense Categories */}
            <div style={{
              padding: '16px',
              background: '#fff7ed',
              borderRadius: '8px',
              border: '1px solid #fed7aa'
            }}>
              <div style={{ fontSize: '13px', fontWeight: '600', color: '#f97316', marginBottom: '12px' }}>
                Expense Categories
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                  <span style={{ color: '#fb923c' }}>Maintenance</span>
                  <span style={{ fontWeight: '600', color: '#ea580c' }}>{formatCurrency(0)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                  <span style={{ color: '#fb923c' }}>Utilities</span>
                  <span style={{ fontWeight: '600', color: '#ea580c' }}>{formatCurrency(0)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                  <span style={{ color: '#fb923c' }}>Other</span>
                  <span style={{ fontWeight: '600', color: '#ea580c' }}>{formatCurrency(0)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Database Integration Note */}
      <div style={{
        marginTop: '24px',
        padding: '16px 20px',
        background: 'white',
        borderRadius: '8px',
        border: '2px solid #99f6e4',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <UIIcons.AlertCircle size={20} style={{ color: '#14b8a6', flexShrink: 0 }} />
        <div style={{ fontSize: '13px', color: '#0f766e' }}>
          <strong>Database Integration:</strong> Connect to Supabase <code style={{
            background: '#f0fdfa',
            padding: '2px 6px',
            borderRadius: '4px',
            fontSize: '12px',
            color: '#14b8a6',
            border: '1px solid #99f6e4'
          }}>transactions</code> table to fetch real-time income and expense data filtered by organization and date range.
        </div>
      </div>
    </div>
  );
};

// Coming Soon Component
const ComingSoonTab = ({ tabName }) => {
  return (
    <div style={{
      maxWidth: '600px',
      margin: '100px auto',
      textAlign: 'center'
    }}>
      <div style={{
        width: '80px',
        height: '80px',
        margin: '0 auto 24px',
        borderRadius: '16px',
        background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <UIIcons.Wrench size={40} style={{ color: 'white' }} />
      </div>
      <h2 style={{
        fontSize: '28px',
        fontWeight: '700',
        color: '#0f766e',
        marginBottom: '12px'
      }}>
        {tabName} - Coming Soon
      </h2>
      <p style={{
        fontSize: '16px',
        color: '#14b8a6',
        marginBottom: '32px'
      }}>
        We're working on bringing you comprehensive {tabName.toLowerCase()} reporting.
      </p>
      <div style={{
        background: 'white',
        padding: '24px',
        borderRadius: '12px',
        border: '2px solid #99f6e4',
        boxShadow: '0 4px 12px rgba(20, 184, 166, 0.1)'
      }}>
        <div style={{
          fontSize: '14px',
          fontWeight: '600',
          color: '#0f766e',
          marginBottom: '12px'
        }}>
          What's Coming:
        </div>
        <ul style={{
          textAlign: 'left',
          color: '#14b8a6',
          fontSize: '14px',
          lineHeight: '1.8',
          paddingLeft: '20px'
        }}>
          {tabName === 'Bank Deposit' && (
            <>
              <li>Detailed deposit tracking by account</li>
              <li>Automatic reconciliation with transactions</li>
              <li>Export to QuickBooks or Xero</li>
            </>
          )}
          {tabName === 'Rent Roll' && (
            <>
              <li>Complete property occupancy overview</li>
              <li>Tenant rent amounts and payment status</li>
              <li>Lease expiration tracking</li>
            </>
          )}
          {tabName === 'Deposits Held' && (
            <>
              <li>Security deposit tracking per tenant</li>
              <li>Interest calculation (where applicable)</li>
              <li>Refund status and history</li>
            </>
          )}
          {tabName === 'Transactions' && (
            <>
              <li>Complete transaction history</li>
              <li>Advanced filtering and search</li>
              <li>Export to CSV or Excel</li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

// Rent Tab Component
const RentTab = ({ dateRange, setDateRange, formatCurrency }) => {
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  
  // Mock data - replace with Supabase query
  const rentTransactions = [
    { id: 1, date: 'Jan 09, 2025', invoice: '7158779', method: 'Cash', tenant: 'Kevin Hart', amount: 50.00 },
    { id: 2, date: 'Jan 09, 2025', invoice: '2258914', method: 'Cash', tenant: 'Stephanie Gage', amount: 50.00 },
    { id: 3, date: 'Jan 09, 2025', invoice: '7158763', method: 'Check', tenant: 'Michael Scott', amount: 1200.00 },
    { id: 4, date: 'Jan 09, 2025', invoice: '7158764', method: 'Cash', tenant: 'Michael Scott', amount: 1200.00 },
    { id: 5, date: 'Jan 09, 2025', invoice: '7158765', method: 'Cash', tenant: 'Michael Scott', amount: 1200.00 },
    { id: 6, date: 'Jan 09, 2025', invoice: '7158780', method: 'Cash', tenant: 'Dwight Schrute', amount: 1200.00 },
    { id: 7, date: 'Jan 09, 2025', invoice: '7158781', method: 'Cash', tenant: 'Dwight Schrute', amount: 1200.00 },
    { id: 8, date: 'Jan 09, 2025', invoice: '7158780', method: 'Cash', tenant: 'Dwight Schrute', amount: 1200.00 },
    { id: 9, date: 'Jan 09, 2025', invoice: '7158789', method: 'Cash', tenant: 'Andy Bernard', amount: 2500.00 },
    { id: 10, date: 'Jan 09, 2025', invoice: '7158800', method: 'Cash', tenant: 'Andy Bernard', amount: 2500.00 },
    { id: 11, date: 'Jan 09, 2025', invoice: '7158801', method: 'Cash', tenant: 'Andy Bernard', amount: 2500.00 },
    { id: 12, date: 'Jan 09, 2025', invoice: '7158808', method: 'Cash', tenant: 'Oscar Martinez', amount: 1500.00 },
    { id: 13, date: 'Jan 09, 2025', invoice: '7158809', method: 'Cash', tenant: 'Oscar Martinez', amount: 1500.00 },
    { id: 14, date: 'Jan 09, 2025', invoice: '7158810', method: 'Cash', tenant: 'Oscar Martinez', amount: 1500.00 },
    { id: 15, date: 'Jan 09, 2025', invoice: '7158839', method: 'Cash', tenant: 'Kevin Malone', amount: 1200.00 },
    { id: 16, date: 'Jan 09, 2025', invoice: '7158840', method: 'Cash', tenant: 'Kevin Malone', amount: 1200.00 },
  ];

  const totalAmount = rentTransactions.reduce((sum, t) => sum + t.amount, 0);

  const handleExport = (type) => {
    console.log(`Exporting rent data as ${type}...`);
    // TODO: Implement export functionality
    setExportMenuOpen(false);
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '24px'
      }}>
        <div>
          <h2 style={{
            margin: 0,
            fontSize: '20px',
            fontWeight: '700',
            color: '#0f766e'
          }}>
            Rent Payments
          </h2>
          <p style={{
            margin: '4px 0 0 0',
            fontSize: '14px',
            color: '#14b8a6'
          }}>
            {dateRange} • {rentTransactions.length} transactions
          </p>
        </div>

        {/* Export Button */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setExportMenuOpen(!exportMenuOpen)}
            style={{
              padding: '10px 20px',
              background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 8px rgba(20, 184, 166, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(20, 184, 166, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(20, 184, 166, 0.3)';
            }}
          >
            <UIIcons.Download size={16} />
            Export
            <UIIcons.ChevronDown size={14} />
          </button>

          {/* Export Menu */}
          {exportMenuOpen && (
            <div style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: '8px',
              background: 'white',
              borderRadius: '8px',
              border: '2px solid #99f6e4',
              boxShadow: '0 4px 12px rgba(20, 184, 166, 0.2)',
              minWidth: '200px',
              zIndex: 1000
            }}>
              <div style={{ padding: '8px' }}>
                <button
                  onClick={() => handleExport('default')}
                  style={{
                    width: '100%',
                    padding: '10px 16px',
                    background: 'none',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    borderRadius: '6px',
                    fontSize: '13px',
                    color: '#0f766e',
                    transition: 'background 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f0fdfa'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                >
                  Export by default view
                </button>
                <button
                  onClick={() => handleExport('year')}
                  style={{
                    width: '100%',
                    padding: '10px 16px',
                    background: 'none',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    borderRadius: '6px',
                    fontSize: '13px',
                    color: '#0f766e',
                    transition: 'background 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f0fdfa'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                >
                  Export by year view
                </button>
                <button
                  onClick={() => handleExport('detail')}
                  style={{
                    width: '100%',
                    padding: '10px 16px',
                    background: 'none',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    borderRadius: '6px',
                    fontSize: '13px',
                    color: '#0f766e',
                    transition: 'background 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f0fdfa'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                >
                  Export by detail view
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Date Range Filter */}
      <div style={{
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '16px',
        background: 'white',
        borderRadius: '8px',
        border: '2px solid #99f6e4'
      }}>
        <UIIcons.Filter size={18} style={{ color: '#14b8a6' }} />
        <span style={{ fontSize: '14px', fontWeight: '600', color: '#0f766e' }}>
          Filter:
        </span>
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          style={{
            padding: '8px 12px',
            borderRadius: '6px',
            border: '2px solid #99f6e4',
            fontSize: '13px',
            color: '#0f766e',
            background: 'white',
            cursor: 'pointer'
          }}
        >
          <option value="2024">January 1, 2025 - December 31, 2025</option>
          <option value="Q1 2025">Q1 2025</option>
          <option value="Q2 2025">Q2 2025</option>
          <option value="This Month">This Month</option>
          <option value="Last Month">Last Month</option>
        </select>
      </div>

      {/* Transactions Table */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        border: '2px solid #99f6e4',
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(20, 184, 166, 0.1)'
      }}>
        {/* Table Header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '120px 120px 140px 1fr 120px',
          gap: '16px',
          padding: '16px 24px',
          background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
          color: 'white',
          fontSize: '13px',
          fontWeight: '600'
        }}>
          <div>DATE</div>
          <div>INVOICE #</div>
          <div>PAYMENT METHOD</div>
          <div>TENANT</div>
          <div style={{ textAlign: 'right' }}>AMOUNT</div>
        </div>

        {/* Table Body */}
        <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
          {rentTransactions.map((transaction, index) => (
            <div
              key={transaction.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '120px 120px 140px 1fr 120px',
                gap: '16px',
                padding: '16px 24px',
                borderBottom: index < rentTransactions.length - 1 ? '1px solid #e5e7eb' : 'none',
                transition: 'background 0.2s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#f0fdfa'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
            >
              <div style={{ fontSize: '13px', color: '#64748b' }}>
                {transaction.date}
              </div>
              <div style={{ fontSize: '13px', color: '#0f766e', fontWeight: '600' }}>
                {transaction.invoice}
              </div>
              <div style={{ fontSize: '13px', color: '#64748b' }}>
                {transaction.method}
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '13px',
                color: '#1e293b'
              }}>
                <UIIcons.User size={16} style={{ color: '#14b8a6' }} />
                {transaction.tenant}
              </div>
              <div style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#0f766e',
                textAlign: 'right'
              }}>
                {formatCurrency(transaction.amount)}
              </div>
            </div>
          ))}
        </div>

        {/* Table Footer */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '120px 120px 140px 1fr 120px',
          gap: '16px',
          padding: '16px 24px',
          background: '#f0fdfa',
          borderTop: '2px solid #99f6e4'
        }}>
          <div></div>
          <div></div>
          <div></div>
          <div style={{
            fontSize: '14px',
            fontWeight: '600',
            color: '#0f766e',
            textAlign: 'right'
          }}>
            TOTAL:
          </div>
          <div style={{
            fontSize: '16px',
            fontWeight: '700',
            color: '#0f766e',
            textAlign: 'right'
          }}>
            {formatCurrency(totalAmount)}
          </div>
        </div>
      </div>
    </div>
  );
};

// Expenses Tab Component
const ExpensesTab = ({ dateRange, setDateRange, formatCurrency }) => {
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  
  // Mock data - replace with Supabase query
  const expenseTransactions = [
    { id: 1, date: 'Jan 15, 2025', category: 'Maintenance', description: 'Plumbing repair - Unit 205', property: '605 Race Street', amount: 350.00 },
    { id: 2, date: 'Jan 12, 2025', category: 'Utilities', description: 'Electric bill - January', property: 'Jefferson House', amount: 245.00 },
    { id: 3, date: 'Jan 10, 2025', category: 'Insurance', description: 'Property insurance premium', property: 'All Properties', amount: 1200.00 },
    { id: 4, date: 'Jan 08, 2025', category: 'Maintenance', description: 'HVAC service', property: 'Jefferson Ave Apartments', amount: 450.00 },
    { id: 5, date: 'Jan 05, 2025', category: 'Landscaping', description: 'Monthly lawn care', property: '605 Race Street', amount: 150.00 },
  ];

  const totalAmount = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);

  const handleExport = (type) => {
    console.log(`Exporting expense data as ${type}...`);
    setExportMenuOpen(false);
  };

  const categoryColors = {
    'Maintenance': '#f97316',
    'Utilities': '#3b82f6',
    'Insurance': '#8b5cf6',
    'Landscaping': '#10b981',
    'Other': '#6b7280'
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '24px'
      }}>
        <div>
          <h2 style={{
            margin: 0,
            fontSize: '20px',
            fontWeight: '700',
            color: '#0f766e'
          }}>
            Expenses
          </h2>
          <p style={{
            margin: '4px 0 0 0',
            fontSize: '14px',
            color: '#14b8a6'
          }}>
            {dateRange} • {expenseTransactions.length} transactions
          </p>
        </div>

        {/* Export Button */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setExportMenuOpen(!exportMenuOpen)}
            style={{
              padding: '10px 20px',
              background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 8px rgba(249, 115, 22, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(249, 115, 22, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(249, 115, 22, 0.3)';
            }}
          >
            <UIIcons.Download size={16} />
            Export
            <UIIcons.ChevronDown size={14} />
          </button>

          {/* Export Menu */}
          {exportMenuOpen && (
            <div style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: '8px',
              background: 'white',
              borderRadius: '8px',
              border: '2px solid #fed7aa',
              boxShadow: '0 4px 12px rgba(249, 115, 22, 0.2)',
              minWidth: '200px',
              zIndex: 1000
            }}>
              <div style={{ padding: '8px' }}>
                <button
                  onClick={() => handleExport('default')}
                  style={{
                    width: '100%',
                    padding: '10px 16px',
                    background: 'none',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    borderRadius: '6px',
                    fontSize: '13px',
                    color: '#ea580c',
                    transition: 'background 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#fff7ed'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                >
                  Export by default view
                </button>
                <button
                  onClick={() => handleExport('year')}
                  style={{
                    width: '100%',
                    padding: '10px 16px',
                    background: 'none',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    borderRadius: '6px',
                    fontSize: '13px',
                    color: '#ea580c',
                    transition: 'background 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#fff7ed'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                >
                  Export by year view
                </button>
                <button
                  onClick={() => handleExport('detail')}
                  style={{
                    width: '100%',
                    padding: '10px 16px',
                    background: 'none',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    borderRadius: '6px',
                    fontSize: '13px',
                    color: '#ea580c',
                    transition: 'background 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#fff7ed'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                >
                  Export by detail view
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Date Range Filter */}
      <div style={{
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '16px',
        background: 'white',
        borderRadius: '8px',
        border: '2px solid #fed7aa'
      }}>
        <UIIcons.Filter size={18} style={{ color: '#f97316' }} />
        <span style={{ fontSize: '14px', fontWeight: '600', color: '#ea580c' }}>
          Filter:
        </span>
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          style={{
            padding: '8px 12px',
            borderRadius: '6px',
            border: '2px solid #fed7aa',
            fontSize: '13px',
            color: '#ea580c',
            background: 'white',
            cursor: 'pointer'
          }}
        >
          <option value="2024">January 1, 2025 - December 31, 2025</option>
          <option value="Q1 2025">Q1 2025</option>
          <option value="Q2 2025">Q2 2025</option>
          <option value="This Month">This Month</option>
          <option value="Last Month">Last Month</option>
        </select>
      </div>

      {/* Transactions Table */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        border: '2px solid #fed7aa',
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(249, 115, 22, 0.1)'
      }}>
        {/* Table Header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '120px 140px 1fr 200px 120px',
          gap: '16px',
          padding: '16px 24px',
          background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
          color: 'white',
          fontSize: '13px',
          fontWeight: '600'
        }}>
          <div>DATE</div>
          <div>CATEGORY</div>
          <div>DESCRIPTION</div>
          <div>PROPERTY</div>
          <div style={{ textAlign: 'right' }}>AMOUNT</div>
        </div>

        {/* Table Body */}
        <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
          {expenseTransactions.map((transaction, index) => (
            <div
              key={transaction.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '120px 140px 1fr 200px 120px',
                gap: '16px',
                padding: '16px 24px',
                borderBottom: index < expenseTransactions.length - 1 ? '1px solid #e5e7eb' : 'none',
                transition: 'background 0.2s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#fff7ed'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
            >
              <div style={{ fontSize: '13px', color: '#64748b' }}>
                {transaction.date}
              </div>
              <div>
                <span style={{
                  padding: '4px 12px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '600',
                  background: `${categoryColors[transaction.category]}15`,
                  color: categoryColors[transaction.category]
                }}>
                  {transaction.category}
                </span>
              </div>
              <div style={{ fontSize: '13px', color: '#1e293b' }}>
                {transaction.description}
              </div>
              <div style={{ fontSize: '13px', color: '#64748b' }}>
                {transaction.property}
              </div>
              <div style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#ea580c',
                textAlign: 'right'
              }}>
                {formatCurrency(transaction.amount)}
              </div>
            </div>
          ))}
        </div>

        {/* Table Footer */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '120px 140px 1fr 200px 120px',
          gap: '16px',
          padding: '16px 24px',
          background: '#fff7ed',
          borderTop: '2px solid #fed7aa'
        }}>
          <div></div>
          <div></div>
          <div></div>
          <div style={{
            fontSize: '14px',
            fontWeight: '600',
            color: '#ea580c',
            textAlign: 'right'
          }}>
            TOTAL:
          </div>
          <div style={{
            fontSize: '16px',
            fontWeight: '700',
            color: '#ea580c',
            textAlign: 'right'
          }}>
            {formatCurrency(totalAmount)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
