import React, { useState, useEffect } from 'react';
import { useAuthenticatedSupabase } from '../hooks/useAuthenticatedSupabase';
import { UIIcons } from '../config/icons';

export default function PropertiesPageRedesigned() {
  // Supabase integration
  const { supabase, isReady } = useAuthenticatedSupabase();
  
  // Mobile detection
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // State management
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');

  // Load navigation params from sessionStorage (from Dashboard clicks)
  useEffect(() => {
    const paramsStr = sessionStorage.getItem('Properties_params');
    if (paramsStr) {
      try {
        const params = JSON.parse(paramsStr);
        if (params.filterStatus) {
          setFilterStatus(params.filterStatus);
        }
        // Clear params after reading
        sessionStorage.removeItem('Properties_params');
      } catch (error) {
        console.error('Failed to parse navigation params:', error);
      }
    }
  }, []);

  // Fetch properties from Supabase
  useEffect(() => {
    const fetchProperties = async () => {
      if (!isReady || !supabase) return;

      try {
        setIsLoading(true);
        setError(null);

        // Fetch properties with related data
        // Note: Using left joins (no !inner) to allow properties without related data
        // Note: rent_amount is in leases table, not units table
        const { data: propertiesData, error: propertiesError } = await supabase
          .from('properties')
          .select(`
            *,
            units (
              id,
              unit_number,
              status,
              bedrooms,
              bathrooms,
              square_feet
            ),
            leases (
              id,
              status,
              end_date,
              rent_amount,
              unit_id
            ),
            maintenance_requests (
              id,
              status
            )
          `)
          .order('created_at', { ascending: false });

        if (propertiesError) {
          console.error('Supabase error details:', propertiesError);
          throw propertiesError;
        }

        console.log('Properties data fetched:', propertiesData?.length || 0, 'properties');

        // Process properties to calculate stats
        const processedProperties = propertiesData?.map(property => {
          const totalUnits = property.units?.length || 0;
          const occupiedUnits = property.units?.filter(u => u.status === 'occupied').length || 0;
          const vacantUnits = property.units?.filter(u => u.status === 'vacant').length || 0;
          const maintenanceUnits = property.units?.filter(u => u.status === 'maintenance').length || 0;
          const activeLeases = property.leases?.filter(l => l.status === 'active').length || 0;
          const expiringLeases = property.leases?.filter(l => {
            if (!l.end_date) return false;
            const endDate = new Date(l.end_date);
            const now = new Date();
            const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
            return endDate >= now && endDate <= thirtyDaysFromNow;
          }).length || 0;
          const openMaintenance = property.maintenance_requests?.filter(m => m.status === 'open' || m.status === 'in_progress').length || 0;
          const totalRent = property.units?.reduce((sum, unit) => sum + (parseFloat(unit.rent_amount) || 0), 0) || 0;
          const occupancyRate = totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0;

          return {
            id: property.id,
            name: property.name,
            address: `${property.address}${property.city ? ', ' + property.city : ''}${property.state ? ', ' + property.state : ''}`,
            type: property.property_type,
            totalUnits,
            occupiedUnits,
            vacantUnits,
            maintenanceUnits,
            totalRent,
            occupancyRate,
            activeLeases,
            expiringLeases,
            openMaintenance,
            yearBuilt: property.year_built,
            squareFootage: property.square_footage,
            notes: property.notes,
            _raw: property
          };
        }) || [];

        setProperties(processedProperties);
      } catch (err) {
        console.error('Error fetching properties:', err);
        console.error('Error details:', {
          message: err.message,
          hint: err.hint,
          details: err.details,
          code: err.code
        });
        setError(err.message);
        
        // Set empty array - show blank table for clean multi-tenant experience
        setProperties([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperties();
  }, [isReady, supabase]);

  // Calculate summary stats
  const summaryStats = React.useMemo(() => {
    const totalUnits = properties.reduce((sum, p) => sum + p.totalUnits, 0);
    const occupiedUnits = properties.reduce((sum, p) => sum + p.occupiedUnits, 0);
    const vacantUnits = properties.reduce((sum, p) => sum + p.vacantUnits, 0);
    const maintenanceUnits = properties.reduce((sum, p) => sum + p.maintenanceUnits, 0);
    const totalOccupancy = totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0;
    
    // Calculate units behind in rent payments
    // In a real app, this would come from transactions/payments data
    // For now, we'll use a placeholder calculation
    const behindInPayments = 0; // TODO: Calculate from transactions table
    
    // Calculate units with overdue balances
    // In a real app, this would come from lease balance/payment data
    // For now, we'll use a placeholder calculation
    const overdueBalances = 0; // TODO: Calculate from lease balances and payment history

    return {
      totalUnits,
      occupiedUnits,
      vacantUnits,
      maintenanceUnits,
      totalOccupancy,
      behindInPayments,
      overdueBalances
    };
  }, [properties]);

  // Filter properties
  const filteredProperties = React.useMemo(() => {
    if (filterStatus === 'all') return properties;
    
    return properties.filter(property => {
      if (filterStatus === 'occupied') return property.occupancyRate === 100;
      if (filterStatus === 'vacant') return property.occupancyRate === 0;
      if (filterStatus === 'partial') return property.occupancyRate > 0 && property.occupancyRate < 100;
      return true;
    });
  }, [properties, filterStatus]);

  // Sort properties
  const sortedProperties = React.useMemo(() => {
    if (!sortField) return filteredProperties;

    return [...filteredProperties].sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (sortDirection === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });
  }, [filteredProperties, sortField, sortDirection]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getPropertyTypeLabel = (type) => {
    const labels = {
      'single_family': 'Single Family',
      'multi_family': 'Multi Family',
      'apartment': 'Apartment',
      'condo': 'Condo',
      'commercial': 'Commercial'
    };
    return labels[type] || type;
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 50%, #99f6e4 100%)',
      padding: isMobile ? '16px' : '24px'
    }}>
      {/* Header with Filters */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        border: '1px solid #99f6e4',
        boxShadow: '0 4px 12px rgba(20,184,166,0.15)',
        padding: '16px 20px',
        marginBottom: '16px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px',
          flexWrap: isMobile ? 'wrap' : 'nowrap'
        }}>
          {/* Left side - Filter and Count */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            flex: isMobile ? '1 1 100%' : '1'
          }}>
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{
                background: '#f0fdfa',
                border: '1px solid #99f6e4',
                borderRadius: '8px',
                padding: '8px 12px',
                fontSize: '13px',
                cursor: 'pointer',
                color: '#0f766e',
                fontWeight: '600',
                outline: 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <option value="all">All Properties</option>
              <option value="occupied">Fully Occupied</option>
              <option value="vacant">Vacant</option>
              <option value="partial">Partially Occupied</option>
            </select>

            {!isLoading && (
              <div style={{
                fontSize: '13px',
                color: '#14b8a6',
                fontWeight: '600'
              }}>
                Showing {filteredProperties.length} of {properties.length}
              </div>
            )}
          </div>
        
          {/* Right side - Actions */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            flex: isMobile ? '1 1 100%' : 'none',
            justifyContent: isMobile ? 'flex-end' : 'flex-start'
          }}>
            <button
              style={{
                padding: '8px 16px',
                background: 'white',
                color: '#0f766e',
                border: '1px solid #99f6e4',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
              onMouseOver={(e) => {
                e.target.style.background = '#f0fdfa';
                e.target.style.borderColor = '#14b8a6';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'white';
                e.target.style.borderColor = '#99f6e4';
              }}
            >
              <UIIcons.Download size={14} />
              Export
            </button>

            <button
              onClick={() => console.log('New Property')}
              style={{
                padding: '8px 20px',
                background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 8px rgba(20,184,166,0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
              onMouseOver={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)';
                e.target.style.boxShadow = '0 4px 12px rgba(20,184,166,0.4)';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)';
                e.target.style.boxShadow = '0 2px 8px rgba(20,184,166,0.3)';
              }}
            >
              <UIIcons.Plus size={14} />
              New Property
            </button>
          </div>
        </div>
      </div>

      {/* Main Content - Table + Summary Cards */}
      <div style={{
        display: 'flex',
        gap: '16px',
        alignItems: 'flex-start',
        flexDirection: isMobile ? 'column' : 'row'
      }}>
        {/* Properties Table */}
        <div style={{
          flex: 1,
          background: 'white',
          borderRadius: '12px',
          border: '1px solid #99f6e4',
          boxShadow: '0 4px 12px rgba(20,184,166,0.15)',
          overflow: 'hidden'
        }}>
          {isLoading ? (
            <div style={{
              padding: '48px',
              textAlign: 'center',
              color: '#64748b'
            }}>
              <div style={{
                fontSize: '16px',
                fontWeight: '600',
                marginBottom: '8px'
              }}>
                Loading properties...
              </div>
            </div>
          ) : error ? (
            <div style={{
              padding: '48px',
              textAlign: 'center',
              color: '#ef4444'
            }}>
              <div style={{
                fontSize: '16px',
                fontWeight: '600',
                marginBottom: '8px'
              }}>
                Error loading properties
              </div>
              <div style={{ fontSize: '14px' }}>{error}</div>
            </div>
          ) : sortedProperties.length === 0 ? (
            <div style={{
              padding: '48px',
              textAlign: 'center',
              color: '#64748b'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏠</div>
              <div style={{
                fontSize: '16px',
                fontWeight: '600',
                marginBottom: '8px'
              }}>
                No properties found
              </div>
              <div style={{ fontSize: '14px', marginBottom: '16px' }}>
                {filterStatus !== 'all' ? 'Try changing your filter' : 'Get started by adding your first property'}
              </div>
              <button
                onClick={() => console.log('New Property')}
                style={{
                  padding: '10px 24px',
                  background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                + New Property
              </button>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse'
              }}>
                <thead>
                  <tr style={{
                    background: '#f9fafb',
                    borderBottom: '2px solid #e5e7eb'
                  }}>
                    <th 
                      onClick={() => handleSort('name')}
                      style={{
                        padding: '12px 16px',
                        textAlign: 'left',
                        fontSize: '11px',
                        fontWeight: '700',
                        color: '#64748b',
                        textTransform: 'uppercase',
                        cursor: 'pointer',
                        userSelect: 'none'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        Property
                        {sortField === 'name' && (
                          <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </div>
                    </th>
                    <th 
                      onClick={() => handleSort('address')}
                      style={{
                        padding: '12px 16px',
                        textAlign: 'left',
                        fontSize: '11px',
                        fontWeight: '700',
                        color: '#64748b',
                        textTransform: 'uppercase',
                        cursor: 'pointer',
                        userSelect: 'none'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        Address
                        {sortField === 'address' && (
                          <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </div>
                    </th>
                    <th 
                      onClick={() => handleSort('totalUnits')}
                      style={{
                        padding: '12px 16px',
                        textAlign: 'center',
                        fontSize: '11px',
                        fontWeight: '700',
                        color: '#64748b',
                        textTransform: 'uppercase',
                        cursor: 'pointer',
                        userSelect: 'none'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                        Total Units
                        {sortField === 'totalUnits' && (
                          <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </div>
                    </th>
                    <th 
                      onClick={() => handleSort('totalRent')}
                      style={{
                        padding: '12px 16px',
                        textAlign: 'right',
                        fontSize: '11px',
                        fontWeight: '700',
                        color: '#64748b',
                        textTransform: 'uppercase',
                        cursor: 'pointer',
                        userSelect: 'none'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
                        Total Monthly Rent
                        {sortField === 'totalRent' && (
                          <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </div>
                    </th>
                    <th 
                      onClick={() => handleSort('occupancyRate')}
                      style={{
                        padding: '12px 16px',
                        textAlign: 'center',
                        fontSize: '11px',
                        fontWeight: '700',
                        color: '#64748b',
                        textTransform: 'uppercase',
                        cursor: 'pointer',
                        userSelect: 'none'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                        Occupancy
                        {sortField === 'occupancyRate' && (
                          <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </div>
                    </th>
                    <th 
                      onClick={() => handleSort('expiringLeases')}
                      style={{
                        padding: '12px 16px',
                        textAlign: 'center',
                        fontSize: '11px',
                        fontWeight: '700',
                        color: '#64748b',
                        textTransform: 'uppercase',
                        cursor: 'pointer',
                        userSelect: 'none'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                        Expiring
                        {sortField === 'expiringLeases' && (
                          <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </div>
                    </th>
                    <th 
                      onClick={() => handleSort('openMaintenance')}
                      style={{
                        padding: '12px 16px',
                        textAlign: 'center',
                        fontSize: '11px',
                        fontWeight: '700',
                        color: '#64748b',
                        textTransform: 'uppercase',
                        cursor: 'pointer',
                        userSelect: 'none'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                        Open Maintenance
                        {sortField === 'openMaintenance' && (
                          <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedProperties.map((property, index) => (
                    <tr
                      key={property.id}
                      onClick={() => console.log('View property', property.id)}
                      style={{
                        borderBottom: '1px solid #e5e7eb',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        background: index % 2 === 0 ? 'white' : '#f9fafb'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#f0fdfa';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = index % 2 === 0 ? 'white' : '#f9fafb';
                      }}
                    >
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px'
                        }}>
                          <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '8px',
                            background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '18px',
                            flexShrink: 0
                          }}>
                            🏠
                          </div>
                          <div>
                            <div style={{
                              fontSize: '14px',
                              fontWeight: '600',
                              color: '#1e293b',
                              marginBottom: '2px'
                            }}>
                              {property.name}
                            </div>
                            <div style={{
                              fontSize: '12px',
                              color: '#64748b'
                            }}>
                              {getPropertyTypeLabel(property.type)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td style={{
                        padding: '14px 16px',
                        fontSize: '13px',
                        color: '#64748b'
                      }}>
                        {property.address}
                      </td>
                      <td style={{
                        padding: '14px 16px',
                        textAlign: 'center'
                      }}>
                        <span style={{
                          padding: '4px 12px',
                          background: '#f0fdfa',
                          color: '#0f766e',
                          borderRadius: '12px',
                          fontSize: '13px',
                          fontWeight: '600'
                        }}>
                          {property.totalUnits}
                        </span>
                      </td>
                      <td style={{
                        padding: '14px 16px',
                        textAlign: 'right',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#1e293b'
                      }}>
                        ${property.totalRent.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td style={{
                        padding: '14px 16px',
                        textAlign: 'center'
                      }}>
                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '4px 12px',
                          background: property.occupancyRate === 100 ? '#d1fae5' : property.occupancyRate === 0 ? '#fee2e2' : '#fef3c7',
                          borderRadius: '12px'
                        }}>
                          <span style={{
                            fontSize: '13px',
                            fontWeight: '600',
                            color: property.occupancyRate === 100 ? '#065f46' : property.occupancyRate === 0 ? '#991b1b' : '#92400e'
                          }}>
                            {property.occupancyRate}%
                          </span>
                        </div>
                      </td>
                      <td style={{
                        padding: '14px 16px',
                        textAlign: 'center'
                      }}>
                        {property.expiringLeases > 0 ? (
                          <span style={{
                            padding: '4px 12px',
                            background: '#fef3c7',
                            color: '#92400e',
                            borderRadius: '12px',
                            fontSize: '13px',
                            fontWeight: '600'
                          }}>
                            {property.expiringLeases}
                          </span>
                        ) : (
                          <span style={{
                            fontSize: '13px',
                            color: '#94a3b8'
                          }}>
                            -
                          </span>
                        )}
                      </td>
                      <td style={{
                        padding: '14px 16px',
                        textAlign: 'center'
                      }}>
                        {property.openMaintenance > 0 ? (
                          <span style={{
                            padding: '4px 12px',
                            background: '#fee2e2',
                            color: '#991b1b',
                            borderRadius: '12px',
                            fontSize: '13px',
                            fontWeight: '600'
                          }}>
                            {property.openMaintenance}
                          </span>
                        ) : (
                          <span style={{
                            fontSize: '13px',
                            color: '#94a3b8'
                          }}>
                            -
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Summary Cards - Right Side */}
        {!isMobile && (
          <div style={{
            width: '280px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            {/* Total Units Card */}
            <div style={{
              background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
              borderRadius: '12px',
              padding: '20px',
              color: 'white',
              boxShadow: '0 4px 12px rgba(59,130,246,0.3)'
            }}>
              <div style={{
                fontSize: '36px',
                fontWeight: '700',
                marginBottom: '8px'
              }}>
                {summaryStats.totalUnits}
              </div>
              <div style={{
                fontSize: '13px',
                fontWeight: '600',
                opacity: 0.9,
                marginBottom: '16px'
              }}>
                UNITS
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                paddingTop: '12px',
                borderTop: '1px solid rgba(255,255,255,0.2)'
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: '11px',
                    opacity: 0.8,
                    marginBottom: '4px'
                  }}>
                    Total Occupancy
                  </div>
                  <div style={{
                    fontSize: '20px',
                    fontWeight: '700'
                  }}>
                    {summaryStats.totalOccupancy}%
                  </div>
                </div>
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: 'rgba(255,255,255,0.2)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px'
                }}>
                  {summaryStats.totalOccupancy >= 90 ? '✓' : summaryStats.totalOccupancy >= 50 ? '◐' : '○'}
                </div>
              </div>
            </div>

            {/* Behind in Rent Payments */}
            <div style={{
              background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
              borderRadius: '12px',
              padding: '16px',
              color: 'white',
              boxShadow: '0 4px 12px rgba(220,38,38,0.3)'
            }}>
              <div style={{
                fontSize: '24px',
                fontWeight: '700',
                marginBottom: '4px'
              }}>
                {summaryStats.behindInPayments}
              </div>
              <div style={{
                fontSize: '12px',
                fontWeight: '600',
                opacity: 0.9
              }}>
                BEHIND IN RENT PAYMENTS
              </div>
            </div>

            {/* Units with Overdue Balances */}
            <div style={{
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              borderRadius: '12px',
              padding: '16px',
              color: 'white',
              boxShadow: '0 4px 12px rgba(245,158,11,0.3)'
            }}>
              <div style={{
                fontSize: '24px',
                fontWeight: '700',
                marginBottom: '4px'
              }}>
                {summaryStats.overdueBalances}
              </div>
              <div style={{
                fontSize: '12px',
                fontWeight: '600',
                opacity: 0.9
              }}>
                UNITS WITH OVERDUE BALANCES
              </div>
            </div>

            {/* Units with Vacancy */}
            <div style={{
              background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
              borderRadius: '12px',
              padding: '16px',
              color: 'white',
              boxShadow: '0 4px 12px rgba(20,184,166,0.3)'
            }}>
              <div style={{
                fontSize: '24px',
                fontWeight: '700',
                marginBottom: '4px'
              }}>
                {summaryStats.vacantUnits}
              </div>
              <div style={{
                fontSize: '12px',
                fontWeight: '600',
                opacity: 0.9
              }}>
                UNITS WITH VACANCY
              </div>
            </div>

            {/* Open Maintenance Requests */}
            <div style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              borderRadius: '12px',
              padding: '16px',
              color: 'white',
              boxShadow: '0 4px 12px rgba(59,130,246,0.3)'
            }}>
              <div style={{
                fontSize: '24px',
                fontWeight: '700',
                marginBottom: '4px'
              }}>
                {properties.reduce((sum, p) => sum + p.openMaintenance, 0)}
              </div>
              <div style={{
                fontSize: '12px',
                fontWeight: '600',
                opacity: 0.9
              }}>
                OPEN MAINTENANCE REQUESTS
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
