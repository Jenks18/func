import React, { useState } from 'react';

export default function IncomePage() {
  const [filterDate, setFilterDate] = useState('Month (Include: Due On )');
  const [groupBy, setGroupBy] = useState('Property');
  
  const incomeData = [
    {
      id: 1,
      property: 'Main Street Lofts',
      dates: 'May 15, 2023 → M to M',
      unit: '101',
      amount: '$2,250.00',
      processing: '$0.00',
      paid: '$2,250.00',
      balance: '$0.00',
      dueOn: '',
      paidOn: '',
      status: 'Paid'
    },
    {
      id: 2,
      property: 'Main Street Lofts',
      dates: 'Apr 30, 2023 → Jun 30, 2024',
      unit: '201',
      amount: '$2,050.00',
      processing: '$0.00',
      paid: '$1,000.00',
      balance: '$1,050.00',
      dueOn: '',
      paidOn: '',
      status: 'Partially Paid'
    }
  ];

  const summaryData = {
    totalInvoiceAmount: 4300.00,
    totalOpenInvoice: 0.00,
    overdue: 1050.00,
    processing: 0.00,
    partiallyPaid: 1000.00,
    fullyPaid: 2250.00,
    totalYearToDate: 3250.00
  };

  return (
    <div style={{
      maxWidth: '100%',
      background: 'transparent',
      padding: '24px',
      boxSizing: 'border-box',
      overflowX: 'hidden'
    }}>
      {/* Action Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginBottom: '24px'
      }}>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(0, 0, 0, 0.1)',
            borderRadius: '6px',
            padding: '8px 16px',
            fontSize: '14px',
            cursor: 'pointer',
            color: '#374151'
          }}>
            Export
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
            New Invoice
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        width: '100%',
        display: 'flex',
        gap: '20px'
      }}>
        {/* Left Side - Table */}
        <div style={{ flex: 1 }}>
          {/* Filters */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '24px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                fontSize: '14px',
                color: '#6b7280',
                fontWeight: '500'
              }}>
                🔽 Filter:
              </span>
              <select 
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(0, 0, 0, 0.1)',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  minWidth: '200px',
                  color: '#374151'
                }}
              >
                <option>Month (Include: Due On )</option>
                <option>Week (Include: Due On )</option>
                <option>Year (Include: Due On )</option>
                <option>Custom Range</option>
              </select>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                fontSize: '14px',
                color: '#6b7280',
                fontWeight: '500'
              }}>
                Grouped by:
              </span>
              <select 
                value={groupBy}
                onChange={(e) => setGroupBy(e.target.value)}
                style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(0, 0, 0, 0.1)',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  minWidth: '120px',
                  color: '#374151'
                }}
              >
                <option>Property</option>
                <option>Tenant</option>
                <option>Unit</option>
                <option>Status</option>
              </select>
            </div>
          </div>

          {/* Results Count and Date Range */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px'
          }}>
            <div style={{
              fontSize: '14px',
              color: '#6b7280'
            }}>
              SHOWING <strong>2 of 2</strong>
            </div>
            <div style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#374151'
            }}>
              MAY 1, 23 – MAY 31, 23
            </div>
          </div>

          {/* Table */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '8px',
            border: '1px solid rgba(0, 0, 0, 0.05)',
            overflow: 'hidden',
            boxShadow: '0 4px 16px 0 rgba(0, 0, 0, 0.08)'
          }}>
            {/* Table Header */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '200px 120px 120px 80px 120px 100px 100px 100px',
              gap: '12px',
              padding: '16px',
              background: '#f9fafb',
              borderBottom: '1px solid #e5e7eb',
              fontSize: '12px',
              fontWeight: '600',
              color: '#374151',
              textTransform: 'uppercase'
            }}>
              <div>PROPERTY/OWNED BY</div>
              <div>DUE ON</div>
              <div>PAID ON</div>
              <div>ID</div>
              <div>STATUS</div>
              <div>UNIT</div>
              <div>AMOUNT</div>
              <div>PROCESSING</div>
              <div>PAID</div>
              <div>BALANCE</div>
            </div>
            
            {/* Table Rows */}
            {incomeData.map((item) => (
              <div key={item.id} style={{
                display: 'grid',
                gridTemplateColumns: '200px 120px 120px 80px 120px 100px 100px 100px',
                gap: '12px',
                padding: '16px',
                borderBottom: '1px solid #f3f4f6',
                alignItems: 'center',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <div>
                  <div style={{
                    color: '#374151',
                    fontWeight: '500',
                    fontSize: '14px',
                    marginBottom: '2px'
                  }}>
                    {item.property}
                  </div>
                  <div style={{
                    color: '#6b7280',
                    fontSize: '12px'
                  }}>
                    {item.dates}
                  </div>
                </div>
                
                <div style={{
                  color: '#374151',
                  fontSize: '14px'
                }}>
                  {item.dueOn}
                </div>
                
                <div style={{
                  color: '#374151',
                  fontSize: '14px'
                }}>
                  {item.paidOn}
                </div>
                
                <div style={{
                  color: '#374151',
                  fontSize: '14px'
                }}>
                  {item.id}
                </div>
                
                <div>
                  <span style={{
                    background: item.status === 'Paid' ? '#dcfce7' : '#fef3c7',
                    color: item.status === 'Paid' ? '#16a34a' : '#d97706',
                    fontSize: '12px',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontWeight: '500'
                  }}>
                    {item.status}
                  </span>
                </div>
                
                <div style={{
                  color: '#374151',
                  fontSize: '14px'
                }}>
                  {item.unit}
                </div>
                
                <div style={{
                  color: '#374151',
                  fontSize: '14px',
                  fontWeight: '600'
                }}>
                  {item.amount}
                </div>
                
                <div style={{
                  color: '#374151',
                  fontSize: '14px'
                }}>
                  {item.processing}
                </div>
                
                <div style={{
                  color: '#374151',
                  fontSize: '14px'
                }}>
                  {item.paid}
                </div>
                
                <div style={{
                  color: '#374151',
                  fontSize: '14px'
                }}>
                  {item.balance}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Summary */}
        <div style={{
          width: '320px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }}>
          {/* Total Invoice Amount */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '8px',
            border: '1px solid rgba(0, 0, 0, 0.05)',
            padding: '24px',
            textAlign: 'center',
            boxShadow: '0 4px 16px 0 rgba(0, 0, 0, 0.08)'
          }}>
            <div style={{
              fontSize: '32px',
              fontWeight: '700',
              color: '#374151',
              marginBottom: '8px'
            }}>
              ${summaryData.totalInvoiceAmount.toLocaleString()}
            </div>
            <div style={{
              fontSize: '14px',
              color: '#6b7280',
              fontWeight: '500'
            }}>
              TOTAL INVOICE AMOUNT
            </div>
          </div>

          {/* Pie Chart */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '8px',
            border: '1px solid rgba(0, 0, 0, 0.05)',
            padding: '24px',
            boxShadow: '0 4px 16px 0 rgba(0, 0, 0, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            {/* Simple Pie Chart Representation */}
            <div style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              background: `conic-gradient(
                #16a34a 0deg ${(summaryData.fullyPaid / summaryData.totalInvoiceAmount) * 360}deg,
                #d97706 ${(summaryData.fullyPaid / summaryData.totalInvoiceAmount) * 360}deg ${((summaryData.fullyPaid + summaryData.partiallyPaid) / summaryData.totalInvoiceAmount) * 360}deg,
                #ef4444 ${((summaryData.fullyPaid + summaryData.partiallyPaid) / summaryData.totalInvoiceAmount) * 360}deg 360deg
              )`,
              marginBottom: '16px'
            }}></div>
            
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              width: '100%'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <div style={{
                    width: '12px',
                    height: '12px',
                    background: '#16a34a',
                    borderRadius: '2px'
                  }}></div>
                  <span style={{
                    fontSize: '14px',
                    color: '#374151'
                  }}>
                    Fully Paid
                  </span>
                </div>
                <span style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151'
                }}>
                  ${summaryData.fullyPaid.toLocaleString()}
                </span>
              </div>
              
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <div style={{
                    width: '12px',
                    height: '12px',
                    background: '#d97706',
                    borderRadius: '2px'
                  }}></div>
                  <span style={{
                    fontSize: '14px',
                    color: '#374151'
                  }}>
                    Partially Paid
                  </span>
                </div>
                <span style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151'
                }}>
                  ${summaryData.partiallyPaid.toLocaleString()}
                </span>
              </div>
              
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <div style={{
                    width: '12px',
                    height: '12px',
                    background: '#ef4444',
                    borderRadius: '2px'
                  }}></div>
                  <span style={{
                    fontSize: '14px',
                    color: '#374151'
                  }}>
                    Overdue
                  </span>
                </div>
                <span style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151'
                }}>
                  ${summaryData.overdue.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Summary Stats */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '8px',
            border: '1px solid rgba(0, 0, 0, 0.05)',
            padding: '24px',
            boxShadow: '0 4px 16px 0 rgba(0, 0, 0, 0.08)'
          }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              <div>
                <div style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#374151',
                  marginBottom: '4px'
                }}>
                  ${summaryData.totalOpenInvoice.toFixed(2)}
                </div>
                <div style={{
                  fontSize: '12px',
                  color: '#6b7280',
                  fontWeight: '500'
                }}>
                  TOTAL OPEN INVOICE
                </div>
              </div>
              
              <div>
                <div style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#374151',
                  marginBottom: '4px'
                }}>
                  ${summaryData.overdue.toLocaleString()}
                </div>
                <div style={{
                  fontSize: '12px',
                  color: '#6b7280',
                  fontWeight: '500'
                }}>
                  OVERDUE
                </div>
              </div>
              
              <div>
                <div style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#374151',
                  marginBottom: '4px'
                }}>
                  ${summaryData.processing.toFixed(2)}
                </div>
                <div style={{
                  fontSize: '12px',
                  color: '#6b7280',
                  fontWeight: '500'
                }}>
                  PROCESSING
                </div>
              </div>
              
              <div>
                <div style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#374151',
                  marginBottom: '4px'
                }}>
                  ${summaryData.partiallyPaid.toLocaleString()}
                </div>
                <div style={{
                  fontSize: '12px',
                  color: '#6b7280',
                  fontWeight: '500'
                }}>
                  PARTIALLY PAID
                </div>
              </div>
              
              <div>
                <div style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#374151',
                  marginBottom: '4px'
                }}>
                  ${summaryData.fullyPaid.toLocaleString()}
                </div>
                <div style={{
                  fontSize: '12px',
                  color: '#6b7280',
                  fontWeight: '500'
                }}>
                  FULLY PAID
                </div>
              </div>
              
              <div style={{
                borderTop: '1px solid #e5e7eb',
                paddingTop: '16px'
              }}>
                <div style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#374151',
                  marginBottom: '4px'
                }}>
                  ${summaryData.totalYearToDate.toLocaleString()}
                </div>
                <div style={{
                  fontSize: '12px',
                  color: '#6b7280',
                  fontWeight: '500'
                }}>
                  TOTAL YEAR TO DATE
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
