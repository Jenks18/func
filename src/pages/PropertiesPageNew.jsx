import React, { useState, useEffect } from 'react';
import dataService from '../services/dataService';
import NewPropertyPage from './NewPropertyPage';

export default function PropertiesPage() {
  const [statusFilter, setStatusFilter] = useState('All Properties');
  const [propertiesData, setPropertiesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showNewProperty, setShowNewProperty] = useState(false);

  // Load properties data on component mount
  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      setLoading(true);
      const properties = await dataService.properties.getAllProperties();
      setPropertiesData(properties);
      setError(null);
    } catch (err) {
      console.error('Error loading properties:', err);
      setError('Failed to load properties data');
      // Fallback to empty array
      setPropertiesData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleNewProperty = () => {
    setShowNewProperty(true);
  };

  const handleBackFromNew = () => {
    setShowNewProperty(false);
  };

  const handlePropertyCreated = (newProperty) => {
    setPropertiesData(prev => [...prev, newProperty]);
    setShowNewProperty(false);
  };

  // Show New Property page if requested
  if (showNewProperty) {
    return (
      <NewPropertyPage 
        onBack={handleBackFromNew}
        onPropertyCreated={handlePropertyCreated}
      />
    );
  }

  const filteredProperties = propertiesData.filter(property => {
    if (statusFilter === 'All Properties') return true;
    return property.status === statusFilter;
  });

  const stats = {
    totalUnits: propertiesData.reduce((sum, property) => sum + (property.units?.length || 0), 0),
    totalOccupancy: 0, // Calculate based on occupied units
    behindInRentPayments: 0, // Calculate based on tenant payment status
    unitsWithVacancy: propertiesData.reduce((sum, property) => {
      const vacantUnits = (property.units || []).filter(unit => unit.status === 'Vacant').length;
      return sum + vacantUnits;
    }, 0),
    unitsWithOverdueBalances: 0, // Calculate based on tenant payment status
    unitsWithOpenMaintenanceRequests: 0 // Calculate based on maintenance requests
  };

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
          Loading properties...
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
            onClick={loadProperties}
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
      {/* Header with Filters and Actions */}
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
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
              background: 'white'
            }}
          >
            <option value="All Properties">All Properties</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Under Construction">Under Construction</option>
          </select>
          
          <div style={{
            fontSize: '14px',
            color: '#6b7280'
          }}>
            Showing {filteredProperties.length} of {propertiesData.length} • Last updated: one min ago • 🔄 Refresh • 📤 Export
          </div>
        </div>
          
        <button 
          onClick={handleNewProperty}
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
          ⊕ New Property
        </button>
      </div>

      {/* Main Content */}
      <div style={{
        display: 'flex',
        gap: '20px',
        height: 'calc(100vh - 140px)'
      }}>
        
        {/* Left Sidebar - Stats */}
        <div style={{
          width: '280px',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: '8px',
          padding: '20px',
          boxShadow: '0 4px 16px 0 rgba(0, 0, 0, 0.08)',
          border: '1px solid rgba(0, 0, 0, 0.05)',
          height: 'fit-content'
        }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#374151',
            margin: '0 0 16px 0'
          }}>
            Portfolio Overview
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
                {stats.totalUnits}
              </div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>
                Total Units
              </div>
            </div>
            
            <div style={{
              padding: '12px',
              background: '#f9fafb',
              borderRadius: '6px'
            }}>
              <div style={{ fontSize: '24px', fontWeight: '600', color: '#374151' }}>
                {propertiesData.length}
              </div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>
                Properties
              </div>
            </div>
            
            <div style={{
              padding: '12px',
              background: '#f9fafb',
              borderRadius: '6px'
            }}>
              <div style={{ fontSize: '24px', fontWeight: '600', color: '#dc2626' }}>
                {stats.unitsWithVacancy}
              </div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>
                Vacant Units
              </div>
            </div>
          </div>
        </div>

        {/* Right Main Content - Properties List */}
        <div style={{
          flex: 1,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: '8px',
          boxShadow: '0 4px 16px 0 rgba(0, 0, 0, 0.08)',
          border: '1px solid rgba(0, 0, 0, 0.05)',
          overflow: 'hidden'
        }}>
          {/* Properties List Header */}
          <div style={{
            padding: '16px 20px',
            borderBottom: '1px solid #e5e7eb',
            background: '#f9fafb'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '60px 1fr 100px 120px 100px 80px',
              gap: '16px',
              fontSize: '12px',
              fontWeight: '600',
              color: '#6b7280',
              textTransform: 'uppercase'
            }}>
              <div></div>
              <div>Property</div>
              <div>Units</div>
              <div>Monthly Rent</div>
              <div>Status</div>
              <div>Actions</div>
            </div>
          </div>

          {/* Properties List */}
          <div style={{ 
            maxHeight: 'calc(100vh - 280px)', 
            overflow: 'auto' 
          }}>
            {filteredProperties.length === 0 ? (
              <div style={{
                padding: '40px',
                textAlign: 'center',
                color: '#6b7280'
              }}>
                {propertiesData.length === 0 ? 'No properties found. Create your first property!' : 'No properties match your filter.'}
              </div>
            ) : (
              filteredProperties.map((property) => (
                <div 
                  key={property.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '60px 1fr 100px 120px 100px 80px',
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
                  {/* Property Image/Icon */}
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '6px',
                    background: '#e5e7eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px'
                  }}>
                    🏢
                  </div>
                  
                  {/* Property Details */}
                  <div>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '4px'
                    }}>
                      {property.name}
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: '#6b7280'
                    }}>
                      {property.address}
                    </div>
                  </div>
                  
                  {/* Units */}
                  <div style={{
                    fontSize: '14px',
                    color: '#374151',
                    textAlign: 'center'
                  }}>
                    {property.units?.length || 0}
                  </div>
                  
                  {/* Monthly Rent */}
                  <div style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    textAlign: 'center'
                  }}>
                    ${property.units?.reduce((sum, unit) => sum + (unit.rentAmount || 0), 0).toLocaleString()}
                  </div>
                  
                  {/* Status */}
                  <div style={{ textAlign: 'center' }}>
                    <span style={{
                      fontSize: '12px',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      background: property.status === 'Active' ? '#dcfce7' : '#fee2e2',
                      color: property.status === 'Active' ? '#15803d' : '#dc2626',
                      fontWeight: '500'
                    }}>
                      {property.status}
                    </span>
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
