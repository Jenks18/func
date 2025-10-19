import React, { useState, useEffect } from 'react';
import dataService from '../services/dataService';
import NewExpensePage from './NewExpensePage';

export default function ExpensesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewExpense, setShowNewExpense] = useState(false);
  const [expensesData, setExpensesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load expenses data on component mount
  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    try {
      setLoading(true);
      const expenses = await dataService.expenses?.getAllExpenses ? 
        await dataService.expenses.getAllExpenses() : [];
      setExpensesData(expenses);
      setError(null);
    } catch (err) {
      console.error('Error loading expenses:', err);
      setError('Failed to load expenses data');
      setExpensesData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleNewExpense = () => {
    setShowNewExpense(true);
  };

  const handleBackFromNew = () => {
    setShowNewExpense(false);
  };

  const handleExpenseCreated = (newExpense) => {
    setExpensesData(prev => [...prev, newExpense]);
    setShowNewExpense(false);
  };

  // Show New Expense page if requested
  if (showNewExpense) {
    return (
      <NewExpensePage 
        onBack={handleBackFromNew}
        onExpenseCreated={handleExpenseCreated}
      />
    );
  }

  const dateRange = 'DEC 30, 24 - JAN 30, 25';
  const totalExpenses = expensesData.reduce((sum, expense) => sum + (expense.amount || 0), 0);
  
  const filteredExpenses = expensesData.filter(expense =>
    expense.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expense.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expense.payee?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div style={{
        maxWidth: '100%',
        background: 'transparent',
        padding: '24px',
        minHeight: '100vh',
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: '8px',
          padding: '40px',
          textAlign: 'center'
        }}>
          Loading expenses...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        maxWidth: '100%',
        background: 'transparent',
        padding: '24px',
        minHeight: '100vh',
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: '8px',
          padding: '40px',
          textAlign: 'center'
        }}>
          <div style={{ color: '#dc2626', marginBottom: '16px' }}>
            Error: {error}
          </div>
          <button 
            onClick={loadExpenses}
            style={{
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: '8px 16px',
              cursor: 'pointer'
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 50%, #99f6e4 100%)',
      padding: '24px',
      boxSizing: 'border-box',
      overflowX: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '24px'
      }}>
        <h1 style={{
          fontSize: '28px',
          fontWeight: '700',
          color: '#115e59',
          margin: 0
        }}>
          Expenses
        </h1>
        
        <div style={{
          display: 'flex',
          gap: '12px',
          alignItems: 'center'
        }}>
          <button 
            onClick={loadExpenses}
            style={{
              padding: '10px 20px',
              background: 'white',
              color: '#0f766e',
              border: '1px solid #99f6e4',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 4px rgba(20,184,166,0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#f0fdfa';
              e.currentTarget.style.borderColor = '#14b8a6';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'white';
              e.currentTarget.style.borderColor = '#99f6e4';
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
            </svg>
            Refresh
          </button>
          <button 
            style={{
              padding: '10px 20px',
              background: 'white',
              color: '#0f766e',
              border: '1px solid #99f6e4',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 4px rgba(20,184,166,0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#f0fdfa';
              e.currentTarget.style.borderColor = '#14b8a6';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'white';
              e.currentTarget.style.borderColor = '#99f6e4';
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Export
          </button>
          <button 
            onClick={handleNewExpense}
            style={{
              padding: '10px 24px',
              background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 12px rgba(20,184,166,0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
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
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 8v8M8 12h8"/>
            </svg>
            New Expense
          </button>
        </div>
      </div>

      {/* Date Range Bar */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '16px 24px',
        marginBottom: '20px',
        boxShadow: '0 4px 16px rgba(20,184,166,0.12)',
        border: '1px solid #99f6e4',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{
          fontSize: '14px',
          color: '#115e59',
          fontWeight: '600'
        }}>
          {dateRange} • Showing {filteredExpenses.length} of {expensesData.length}
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        display: 'flex',
        gap: '20px'
      }}>
        
        {/* Left Sidebar - Stats and Search */}
        <div style={{
          width: '320px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          {/* Search */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 4px 16px rgba(20,184,166,0.12)',
            border: '1px solid #99f6e4'
          }}>
            <div style={{
              position: 'relative'
            }}>
              <svg 
                width="18" 
                height="18" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="#6b7280" 
                strokeWidth="2"
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none'
                }}
              >
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                type="text"
                placeholder="Search expenses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 40px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'all 0.2s ease',
                  fontWeight: '500',
                  color: '#115e59',
                  background: '#f9fafb'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#14b8a6';
                  e.target.style.background = 'white';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.background = '#f9fafb';
                }}
              />
            </div>
          </div>

          {/* Stats Card */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 4px 16px rgba(20,184,166,0.12)',
            border: '1px solid #99f6e4'
          }}>
            <div style={{
              fontSize: '11px',
              fontWeight: '700',
              color: '#6b7280',
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
              marginBottom: '12px'
            }}>
              {dateRange}
            </div>
            
            <div style={{
              padding: '20px',
              background: 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%)',
              borderRadius: '12px',
              border: '2px solid #99f6e4',
              textAlign: 'center',
              marginBottom: '16px'
            }}>
              <div style={{ 
                fontSize: '32px', 
                fontWeight: '700', 
                color: '#115e59',
                marginBottom: '4px'
              }}>
                ${totalExpenses.toLocaleString()}
              </div>
              <div style={{ 
                fontSize: '13px', 
                color: '#0f766e',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Total Expenses
              </div>
            </div>
            
            <div style={{
              padding: '16px',
              background: '#f0fdfa',
              borderRadius: '8px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              border: '1px solid #ccfbf1'
            }}>
              <div>
                <div style={{ fontSize: '11px', color: '#6b7280', fontWeight: '600', marginBottom: '4px' }}>
                  Total Records
                </div>
                <div style={{ fontSize: '20px', fontWeight: '700', color: '#115e59' }}>
                  {expensesData.length}
                </div>
              </div>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#14b8a6" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <line x1="9" y1="9" x2="15" y2="9"/>
                <line x1="9" y1="15" x2="15" y2="15"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Right Main Content - Expenses List */}
        <div style={{
          flex: 1,
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 16px rgba(20,184,166,0.12)',
          border: '1px solid #99f6e4',
          overflow: 'hidden'
        }}>
          {/* Expenses List Header */}
          <div style={{
            padding: '16px 24px',
            borderBottom: '2px solid #e5e7eb',
            background: 'linear-gradient(135deg, #ffffff 0%, #f0fdfa 100%)'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 140px 120px 120px 140px',
              gap: '16px',
              fontSize: '11px',
              fontWeight: '700',
              color: '#0f766e',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              <div>Description</div>
              <div>Category</div>
              <div>Amount</div>
              <div>Date</div>
              <div>Payee</div>
            </div>
          </div>

          {/* Expenses List */}
          <div style={{ 
            maxHeight: 'calc(100vh - 340px)', 
            overflow: 'auto' 
          }}>
            {filteredExpenses.length === 0 ? (
              <div style={{
                padding: '80px 40px',
                textAlign: 'center',
                color: '#6b7280'
              }}>
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#ccfbf1" strokeWidth="1.5" style={{ margin: '0 auto 20px' }}>
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 6v6l4 2"/>
                </svg>
                <div style={{ fontSize: '16px', fontWeight: '600', color: '#115e59', marginBottom: '8px' }}>
                  {expensesData.length === 0 ? 'No expenses yet' : 'No results found'}
                </div>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>
                  {expensesData.length === 0 ? 'Click "New Expense" to create your first expense' : 'Try adjusting your search'}
                </div>
              </div>
            ) : (
              filteredExpenses.map((expense) => (
                <div 
                  key={expense.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 140px 120px 120px 140px',
                    gap: '16px',
                    padding: '16px 24px',
                    borderBottom: '1px solid #f3f4f6',
                    alignItems: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f0fdfa';
                    e.currentTarget.style.borderLeftColor = '#14b8a6';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.borderLeftColor = 'transparent';
                  }}
                >
                  {/* Description */}
                  <div>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#115e59',
                      marginBottom: '4px'
                    }}>
                      {expense.description || 'Untitled Expense'}
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: '#6b7280',
                      fontWeight: '500'
                    }}>
                      {expense.property || 'No property assigned'}
                    </div>
                  </div>
                  
                  {/* Category */}
                  <div>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '600',
                      background: '#f0fdfa',
                      color: '#0f766e',
                      border: '1px solid #ccfbf1'
                    }}>
                      {expense.category || 'Other'}
                    </span>
                  </div>
                  
                  {/* Amount */}
                  <div style={{
                    fontSize: '16px',
                    fontWeight: '700',
                    color: '#dc2626'
                  }}>
                    ${(expense.amount || 0).toLocaleString()}
                  </div>
                  
                  {/* Date */}
                  <div style={{
                    fontSize: '13px',
                    color: '#6b7280',
                    fontWeight: '500'
                  }}>
                    {expense.date ? new Date(expense.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'No date'}
                  </div>
                  
                  {/* Payee */}
                  <div style={{
                    fontSize: '13px',
                    color: '#115e59',
                    fontWeight: '600'
                  }}>
                    {expense.payee || 'Unknown'}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
