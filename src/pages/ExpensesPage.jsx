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
      maxWidth: '100%',
      background: 'transparent',
      padding: '24px',
      minHeight: '100vh',
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
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px'
        }}>
          <div style={{
            fontSize: '14px',
            color: '#6b7280'
          }}>
            {dateRange} • Showing {filteredExpenses.length} of {expensesData.length} • 🔄 Refresh • 📤 Export
          </div>
        </div>
        
        <button 
          onClick={handleNewExpense}
          style={{
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            padding: '8px 16px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          ⊕ New Expense
        </button>
      </div>

      {/* Main Content */}
      <div style={{
        display: 'flex',
        gap: '20px',
        height: 'calc(100vh - 140px)'
      }}>
        
        {/* Left Sidebar - Stats and Search */}
        <div style={{
          width: '280px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          {/* Search */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '8px',
            padding: '20px',
            boxShadow: '0 4px 16px 0 rgba(0, 0, 0, 0.08)',
            border: '1px solid rgba(0, 0, 0, 0.05)'
          }}>
            <input
              type="text"
              placeholder="Search expenses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none'
              }}
            />
          </div>

          {/* Stats */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '8px',
            padding: '20px',
            boxShadow: '0 4px 16px 0 rgba(0, 0, 0, 0.08)',
            border: '1px solid rgba(0, 0, 0, 0.05)'
          }}>
            <h3 style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#374151',
              margin: '0 0 16px 0'
            }}>
              Expense Summary
            </h3>
            
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <div style={{
                padding: '12px',
                background: '#f9fafb',
                borderRadius: '6px'
              }}>
                <div style={{ fontSize: '24px', fontWeight: '600', color: '#374151' }}>
                  ${totalExpenses.toLocaleString()}
                </div>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>
                  Total Expenses
                </div>
              </div>
              
              <div style={{
                padding: '12px',
                background: '#f9fafb',
                borderRadius: '6px'
              }}>
                <div style={{ fontSize: '24px', fontWeight: '600', color: '#374151' }}>
                  {expensesData.length}
                </div>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>
                  Total Records
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Main Content - Expenses List */}
        <div style={{
          flex: 1,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: '8px',
          boxShadow: '0 4px 16px 0 rgba(0, 0, 0, 0.08)',
          border: '1px solid rgba(0, 0, 0, 0.05)',
          overflow: 'hidden'
        }}>
          {/* Expenses List Header */}
          <div style={{
            padding: '16px 20px',
            borderBottom: '1px solid #e5e7eb',
            background: '#f9fafb'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 120px 120px 100px 120px 80px',
              gap: '16px',
              fontSize: '12px',
              fontWeight: '600',
              color: '#6b7280',
              textTransform: 'uppercase'
            }}>
              <div>Description</div>
              <div>Category</div>
              <div>Amount</div>
              <div>Date</div>
              <div>Payee</div>
              <div>Actions</div>
            </div>
          </div>

          {/* Expenses List */}
          <div style={{ 
            maxHeight: 'calc(100vh - 280px)', 
            overflow: 'auto' 
          }}>
            {filteredExpenses.length === 0 ? (
              <div style={{
                padding: '40px',
                textAlign: 'center',
                color: '#6b7280'
              }}>
                {expensesData.length === 0 ? 'No expenses found. Create your first expense!' : 'No expenses match your search.'}
              </div>
            ) : (
              filteredExpenses.map((expense) => (
                <div 
                  key={expense.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 120px 120px 100px 120px 80px',
                    gap: '16px',
                    padding: '16px 20px',
                    borderBottom: '1px solid #f3f4f6',
                    alignItems: 'center',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f9fafb';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  {/* Description */}
                  <div>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '4px'
                    }}>
                      {expense.description || 'Untitled Expense'}
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: '#6b7280'
                    }}>
                      {expense.property || 'No property assigned'}
                    </div>
                  </div>
                  
                  {/* Category */}
                  <div style={{
                    fontSize: '14px',
                    color: '#374151'
                  }}>
                    {expense.category || 'Other'}
                  </div>
                  
                  {/* Amount */}
                  <div style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151'
                  }}>
                    ${(expense.amount || 0).toLocaleString()}
                  </div>
                  
                  {/* Date */}
                  <div style={{
                    fontSize: '14px',
                    color: '#374151'
                  }}>
                    {expense.date ? new Date(expense.date).toLocaleDateString() : 'No date'}
                  </div>
                  
                  {/* Payee */}
                  <div style={{
                    fontSize: '14px',
                    color: '#374151'
                  }}>
                    {expense.payee || 'Unknown'}
                  </div>
                  
                  {/* Actions */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}>
                    <button style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '16px',
                      padding: '4px'
                    }}>
                      👁️
                    </button>
                    <button style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '16px',
                      padding: '4px'
                    }}>
                      ✏️
                    </button>
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
