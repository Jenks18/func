import React, { useState, useEffect } from 'react';
import dataService from '../services/dataService';
import NewTenantPage from './NewTenantPage';

export default function TenantsPage() {
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [tenantsData, setTenantsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showNewTenant, setShowNewTenant] = useState(false);

  // Load tenants data on component mount
  useEffect(() => {
    loadTenants();
  }, []);

  const loadTenants = async () => {
    try {
      setLoading(true);
      const tenants = await dataService.tenants.getAllTenants();
      setTenantsData(tenants);
      setError(null);
    } catch (err) {
      console.error('Error loading tenants:', err);
      setError('Failed to load tenants data');
    } finally {
      setLoading(false);
    }
  };

  const handleTenantSelect = async (tenant) => {
    try {
      // Load detailed tenant information
      const detailedTenant = await dataService.tenants.getTenantById(tenant.id);
      setSelectedTenant(detailedTenant);
    } catch (err) {
      console.error('Error loading tenant details:', err);
      setSelectedTenant(tenant); // Fallback to basic data
    }
  };

  const handleNewTenant = () => {
    setShowNewTenant(true);
  };

  const handleBackFromNew = () => {
    setShowNewTenant(false);
  };

  const handleTenantCreated = (newTenant) => {
    setTenantsData(prev => [...prev, newTenant]);
    setShowNewTenant(false);
  };

  const filteredTenants = tenantsData.filter(tenant => {
    const searchLower = searchTerm.toLowerCase();
    const fullName = `${tenant.firstName} ${tenant.lastName}`.toLowerCase();
    const propertyName = tenant.property?.name?.toLowerCase() || '';
    
    return fullName.includes(searchLower) || 
           propertyName.includes(searchLower) ||
           tenant.email?.toLowerCase().includes(searchLower);
  });

  // Show New Tenant page if requested
  if (showNewTenant) {
    return (
      <NewTenantPage 
        onBack={handleBackFromNew}
        onTenantCreated={handleTenantCreated}
      />
    );
  }

  if (loading) {
    return (
      <div style={{
        maxWidth: '100%',
        background: 'transparent',
        padding: '24px',
        minHeight: '100vh',
        boxSizing: 'border-box',
        overflowX: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: '8px',
          padding: '40px',
          textAlign: 'center',
          border: '1px solid rgba(0, 0, 0, 0.05)',
          boxShadow: '0 4px 16px 0 rgba(0, 0, 0, 0.08)'
        }}>
          <div style={{ fontSize: '16px', color: '#64748b', marginBottom: '16px' }}>
            Loading tenants...
          </div>
          <div style={{
            width: '24px',
            height: '24px',
            border: '3px solid #e2e8f0',
            borderTop: '3px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto'
          }}></div>
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
        overflowX: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: '8px',
          padding: '40px',
          textAlign: 'center',
          border: '1px solid rgba(0, 0, 0, 0.05)',
          boxShadow: '0 4px 16px 0 rgba(0, 0, 0, 0.08)'
        }}>
          <div style={{ fontSize: '18px', color: '#dc2626', marginBottom: '8px' }}>
            Error Loading Tenants
          </div>
          <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '16px' }}>
            {error}
          </div>
          <button 
            onClick={loadTenants}
            style={{
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: '8px 16px',
              fontSize: '14px',
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
      {/* Action Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '24px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            position: 'relative'
          }}>
            <input
              type="text"
              placeholder="Search tenants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                padding: '8px 12px 8px 36px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                width: '300px'
              }}
            />
            <div style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: '14px',
              color: '#6b7280'
            }}>
              🔍
            </div>
          </div>
        </div>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <button style={{
            background: '#f3f4f6',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            padding: '8px 16px',
            fontSize: '14px',
            cursor: 'pointer',
            color: '#374151'
          }}>
            Export
          </button>
          <button 
            onClick={handleNewTenant}
            style={{
            background: '#06b6d4',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            padding: '8px 16px',
            fontSize: '14px',
            cursor: 'pointer',
            fontWeight: '500'
          }}>
            + New Tenant
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        width: '100%',
        height: 'calc(100vh - 100px)',
        display: 'flex'
      }}>
        
        {!selectedTenant ? (
          // Table View
          <div style={{
            width: '100%',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '8px',
            margin: '24px',
            boxShadow: '0 4px 16px 0 rgba(0, 0, 0, 0.08)',
            border: '1px solid rgba(0, 0, 0, 0.05)',
            overflow: 'hidden'
          }}>
            {/* Search and Filter */}
            <div style={{
              padding: '16px 24px',
              borderBottom: '1px solid #e5e7eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(0, 0, 0, 0.1)',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  fontSize: '14px',
                  width: '300px',
                  color: '#374151'
                }}
              />
              
              <div style={{
                fontSize: '14px',
                color: '#6b7280'
              }}>
                Showing {filteredTenants.length} of {tenantsData.length}
              </div>
            </div>

            {/* Table Header */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '40px 200px 250px 200px 120px 100px 80px 80px',
              gap: '16px',
              padding: '12px 24px',
              background: '#f9fafb',
              borderBottom: '1px solid #e5e7eb',
              fontSize: '12px',
              fontWeight: '600',
              color: '#6b7280',
              textTransform: 'uppercase',
              alignItems: 'center'
            }}>
              <div></div>
              <div>Name ▼</div>
              <div>Property/Unit ▼</div>
              <div>Address ▼</div>
              <div>Account Status ▼</div>
              <div>Status ▼</div>
              <div>Rent ▼</div>
              <div>Roommates ▼</div>
            </div>

            {/* Table Rows */}
            <div style={{ maxHeight: 'calc(100vh - 350px)', overflow: 'auto' }}>
              {filteredTenants.map((tenant) => (
                <div 
                  key={tenant.id}
                  onClick={() => handleTenantSelect(tenant)}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '40px 200px 250px 200px 120px 100px 80px 80px',
                    gap: '16px',
                    padding: '16px 24px',
                    borderBottom: '1px solid #f3f4f6',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s ease',
                    alignItems: 'center'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f9fafb';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  {/* Avatar */}
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: '#e5e7eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px'
                  }}>
                    👤
                  </div>
                  
                  {/* Name */}
                  <div style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151'
                  }}>
                    {`${tenant.firstName} ${tenant.lastName}`}
                  </div>
                  
                  {/* Property/Unit */}
                  <div style={{
                    fontSize: '14px',
                    color: '#374151'
                  }}>
                    {tenant.property ? `${tenant.property.name}${tenant.unit ? ` | ${tenant.unit.unitNumber}` : ''}` : 'No Property Assigned'}
                  </div>
                  
                  {/* Address */}
                  <div style={{
                    fontSize: '14px',
                    color: '#6b7280',
                    whiteSpace: 'pre-line'
                  }}>
                    {tenant.property?.address || 'No Address'}
                  </div>
                  
                  {/* Account Status */}
                  <div>
                    <span style={{
                      fontSize: '12px',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      background: tenant.accountStatus === 'Verified' ? '#dcfce7' : '#fef3c7',
                      color: tenant.accountStatus === 'Verified' ? '#15803d' : '#d97706',
                      fontWeight: '500'
                    }}>
                      {tenant.accountStatus}
                    </span>
                  </div>
                  
                  {/* Status */}
                  <div>
                    <span style={{
                      fontSize: '12px',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      background: tenant.status === 'Active' ? '#dcfce7' : '#fee2e2',
                      color: tenant.status === 'Active' ? '#15803d' : '#dc2626',
                      fontWeight: '500'
                    }}>
                      {tenant.status}
                    </span>
                  </div>
                  
                  {/* Rent */}
                  <div style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151'
                  }}>
                    {tenant.activeLeases && tenant.activeLeases.length > 0 
                      ? `$${tenant.activeLeases[0].monthlyRent.toLocaleString()}` 
                      : 'No Active Lease'}
                  </div>
                  
                  {/* Roommates */}
                  <div style={{
                    fontSize: '14px',
                    color: '#6b7280',
                    textAlign: 'center'
                  }}>
                    0
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          // Detailed View
          <div style={{
            width: '100%',
            display: 'flex'
          }}>
            {/* Left Side - Tenant Info */}
            <div style={{
              width: '400px',
              background: 'white',
              borderRight: '1px solid #e5e7eb',
              padding: '24px'
            }}>
              <button
                onClick={() => setSelectedTenant(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '16px',
                  cursor: 'pointer',
                  marginBottom: '20px',
                  color: '#6b7280',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                ← Back to List
              </button>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                marginBottom: '20px'
              }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: '#d97706',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  color: 'white',
                  fontWeight: '600'
                }}>
                  {selectedTenant.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#374151',
                    margin: 0,
                    marginBottom: '4px'
                  }}>
                    {selectedTenant.name}
                  </h3>
                  <div style={{
                    fontSize: '14px',
                    color: '#6b7280'
                  }}>
                    {selectedTenant.propertyUnit}
                  </div>
                </div>
              </div>
              
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                <div>
                  <span style={{ fontSize: '14px', color: '#6b7280' }}>Status: </span>
                  <span style={{
                    fontSize: '12px',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    background: '#dcfce7',
                    color: '#15803d',
                    fontWeight: '500'
                  }}>
                    {selectedTenant.status}
                  </span>
                </div>
                
                <div>
                  <span style={{ fontSize: '14px', color: '#6b7280' }}>Account: </span>
                  <span style={{
                    fontSize: '12px',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    background: selectedTenant.accountStatus === 'Verified' ? '#dcfce7' : '#fef3c7',
                    color: selectedTenant.accountStatus === 'Verified' ? '#15803d' : '#d97706',
                    fontWeight: '500'
                  }}>
                    {selectedTenant.accountStatus}
                  </span>
                </div>
                
                <div style={{ fontSize: '14px', color: '#6b7280' }}>
                  Rent: <span style={{ color: '#374151', fontWeight: '500' }}>${selectedTenant.rent.toLocaleString()}</span>
                </div>
                
                <div style={{ fontSize: '14px', color: '#6b7280', whiteSpace: 'pre-line' }}>
                  Address: <span style={{ color: '#374151' }}>{selectedTenant.address}</span>
                </div>
              </div>
            </div>

            {/* Right Side - Detailed Information */}
            <div style={{
              flex: 1,
              background: 'white',
              overflow: 'auto',
              padding: '24px'
            }}>
              {/* Tenant Header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '32px'
              }}>
                <button
                  onClick={() => setSelectedTenant(null)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '20px',
                    cursor: 'pointer',
                    padding: '8px',
                    borderRadius: '4px',
                    color: '#6b7280'
                  }}
                >
                  ✕
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
                  Edit Tenant
                </button>
              </div>

              {/* Tenant Info */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                marginBottom: '32px'
              }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: '#d97706',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '32px',
                  color: 'white',
                  fontWeight: '600'
                }}>
                  {selectedTenant.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h2 style={{
                    fontSize: '24px',
                    fontWeight: '600',
                    color: '#374151',
                    margin: 0,
                    marginBottom: '4px'
                  }}>
                    {selectedTenant.name}
                  </h2>
                  <div style={{
                    fontSize: '14px',
                    color: '#6b7280',
                    marginBottom: '2px'
                  }}>
                    📞 (212) 123-4172
                  </div>
                  <div style={{
                    fontSize: '14px',
                    color: '#6b7280',
                    marginBottom: '8px'
                  }}>
                    ✉️ {selectedTenant.name.toLowerCase().replace(' ', '.')}@email.com
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    fontSize: '14px',
                    color: '#6b7280'
                  }}>
                    <span>Tenant Since: Mar 01, 2018</span>
                    <span>📧 Innago Account Status</span>
                  </div>
                </div>
              </div>

              {/* Current Lease */}
              <div style={{
                background: '#f9fafb',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                padding: '20px',
                marginBottom: '24px'
              }}>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#374151',
                  margin: 0,
                  marginBottom: '16px'
                }}>
                  Current Lease
                </h3>
                
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  marginBottom: '16px'
                }}>
                  <div style={{
                    width: '60px',
                    height: '45px',
                    background: '#e5e7eb',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px'
                  }}>
                    🏠
                  </div>
                  <div>
                    <div style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#374151',
                      marginBottom: '4px'
                    }}>
                      {selectedTenant.propertyUnit.split(' | ')[0]}
                    </div>
                    <div style={{
                      fontSize: '14px',
                      color: '#6b7280'
                    }}>
                      {selectedTenant.propertyUnit.split(' | ')[1] || 'Unit'}
                    </div>
                  </div>
                </div>
                
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '16px'
                }}>
                  <div>
                    <div style={{
                      fontSize: '12px',
                      color: '#6b7280',
                      marginBottom: '2px'
                    }}>
                      Start
                    </div>
                    <div style={{
                      fontSize: '14px',
                      color: '#374151',
                      fontWeight: '500'
                    }}>
                      Mar 01, 2018
                    </div>
                  </div>
                  
                  <div>
                    <div style={{
                      fontSize: '12px',
                      color: '#6b7280',
                      marginBottom: '2px'
                    }}>
                      End
                    </div>
                    <div style={{
                      fontSize: '14px',
                      color: '#374151',
                      fontWeight: '500'
                    }}>
                      Apr 10, 2019
                    </div>
                  </div>
                  
                  <div>
                    <div style={{
                      fontSize: '12px',
                      color: '#6b7280',
                      marginBottom: '2px'
                    }}>
                      Shared With
                    </div>
                    <div style={{
                      display: 'flex',
                      gap: '4px'
                    }}>
                      <div style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: '#e5e7eb',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px'
                      }}>
                        👤
                      </div>
                      <div style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: '#e5e7eb',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px'
                      }}>
                        👤
                      </div>
                    </div>
                  </div>
                </div>
                
                <button style={{
                  background: 'none',
                  border: 'none',
                  color: '#3b82f6',
                  fontSize: '14px',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}>
                  View Lease
                </button>
              </div>

              {/* Collection and Message History */}
              <div style={{
                display: 'flex',
                gap: '24px'
              }}>
                {/* Collection */}
                <div style={{ flex: 1 }}>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#374151',
                    margin: 0,
                    marginBottom: '16px'
                  }}>
                    Collection
                  </h3>
                  
                  <div style={{
                    background: '#f9fafb',
                    borderRadius: '8px',
                    padding: '16px',
                    marginBottom: '16px'
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '12px'
                    }}>
                      <span style={{
                        fontSize: '14px',
                        color: '#6b7280'
                      }}>
                        Monthly Rent
                      </span>
                      <span style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        color: '#374151'
                      }}>
                        ${selectedTenant.rent.toFixed(2)}
                      </span>
                    </div>
                    
                    <div style={{
                      fontSize: '12px',
                      color: '#6b7280'
                    }}>
                      of ${selectedTenant.rent.toFixed(2)}
                    </div>
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span style={{
                        fontSize: '14px',
                        color: '#6b7280'
                      }}>
                        Total Rent Collected
                      </span>
                      <span style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#374151'
                      }}>
                        ${selectedTenant.rent.toFixed(2)}
                      </span>
                    </div>
                    
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span style={{
                        fontSize: '14px',
                        color: '#6b7280'
                      }}>
                        Other Collected
                      </span>
                      <span style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#374151'
                      }}>
                        $0.00
                      </span>
                    </div>
                    
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span style={{
                        fontSize: '14px',
                        color: '#6b7280'
                      }}>
                        Paid Due Invoices
                      </span>
                      <span style={{
                        fontSize: '14px',
                        color: '#374151'
                      }}>
                        No Record Found
                      </span>
                    </div>
                    
                    <button style={{
                      background: 'none',
                      border: 'none',
                      color: '#3b82f6',
                      fontSize: '14px',
                      cursor: 'pointer',
                      fontWeight: '500',
                      textAlign: 'left',
                      padding: 0
                    }}>
                      View All Invoices
                    </button>
                    
                    <div style={{
                      borderTop: '1px solid #e5e7eb',
                      paddingTop: '12px',
                      marginTop: '12px'
                    }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <span style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#374151'
                        }}>
                          Total
                        </span>
                        <span style={{
                          fontSize: '16px',
                          fontWeight: '600',
                          color: '#374151'
                        }}>
                          ${selectedTenant.rent.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Message History */}
                <div style={{ flex: 1 }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '16px'
                  }}>
                    <h3 style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#374151',
                      margin: 0
                    }}>
                      Message History
                    </h3>
                    <button style={{
                      background: 'none',
                      border: 'none',
                      color: '#3b82f6',
                      fontSize: '14px',
                      cursor: 'pointer',
                      fontWeight: '500'
                    }}>
                      Show All
                    </button>
                  </div>
                  
                  <div style={{
                    background: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    overflow: 'hidden'
                  }}>
                    {/* Message Header */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '80px 80px 1fr 100px',
                      gap: '8px',
                      padding: '12px',
                      background: '#f9fafb',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#6b7280',
                      textTransform: 'uppercase'
                    }}>
                      <div>To</div>
                      <div>From</div>
                      <div>Subject</div>
                      <div>Date</div>
                    </div>
                    
                    {/* Message Rows */}
                    {selectedTenantDetails.messageHistory.map((message) => (
                      <div key={message.id} style={{
                        display: 'grid',
                        gridTemplateColumns: '80px 80px 1fr 100px',
                        gap: '8px',
                        padding: '12px',
                        borderBottom: '1px solid #f3f4f6',
                        fontSize: '14px'
                      }}>
                        <div style={{ color: '#374151' }}>{message.to}</div>
                        <div style={{ color: '#374151' }}>{message.from}</div>
                        <div style={{ color: '#374151' }}>{message.subject}</div>
                        <div style={{ color: '#6b7280' }}>{message.date}</div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Lease History */}
                  <div style={{
                    marginTop: '24px'
                  }}>
                    <h3 style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#374151',
                      margin: 0,
                      marginBottom: '16px'
                    }}>
                      Lease History
                    </h3>
                    
                    <div style={{
                      background: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      padding: '16px'
                    }}>
                      {selectedTenantDetails.leaseHistory.map((entry) => (
                        <div key={entry.id} style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px'
                        }}>
                          <div style={{
                            width: '8px',
                            height: '8px',
                            background: '#3b82f6',
                            borderRadius: '50%'
                          }}></div>
                          <div>
                            <div style={{
                              fontSize: '14px',
                              fontWeight: '500',
                              color: '#374151',
                              marginBottom: '2px'
                            }}>
                              {entry.action}
                            </div>
                            <div style={{
                              fontSize: '12px',
                              color: '#6b7280'
                            }}>
                              {entry.date}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
