import React, { useState } from 'react';
import dataService from '../services/dataService';

export default function NewPropertyPage({ onBack, onPropertyCreated }) {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    type: 'Apartment',
    status: 'Active',
    purchasePrice: '',
    currentValue: '',
    yearBuilt: '',
    units: []
  });

  const [newUnit, setNewUnit] = useState({
    unitNumber: '',
    bedrooms: 1,
    bathrooms: 1,
    squareFeet: '',
    rentAmount: '',
    status: 'Vacant'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAddUnit, setShowAddUnit] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleUnitChange = (field, value) => {
    setNewUnit(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addUnit = () => {
    if (!newUnit.unitNumber) {
      alert('Please enter a unit number');
      return;
    }

    // Check for duplicate unit numbers
    if (formData.units.some(unit => unit.unitNumber === newUnit.unitNumber)) {
      alert('Unit number already exists');
      return;
    }

    setFormData(prev => ({
      ...prev,
      units: [...prev.units, { ...newUnit, id: Date.now().toString() }]
    }));

    // Reset new unit form
    setNewUnit({
      unitNumber: '',
      bedrooms: 1,
      bathrooms: 1,
      squareFeet: '',
      rentAmount: '',
      status: 'Vacant'
    });

    setShowAddUnit(false);
  };

  const removeUnit = (unitId) => {
    setFormData(prev => ({
      ...prev,
      units: prev.units.filter(unit => unit.id !== unitId)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate required fields
      if (!formData.name || !formData.address || !formData.city || !formData.state) {
        throw new Error('Please fill in all required fields');
      }

      // Convert numeric fields
      const propertyData = {
        ...formData,
        purchasePrice: formData.purchasePrice ? parseFloat(formData.purchasePrice) : 0,
        currentValue: formData.currentValue ? parseFloat(formData.currentValue) : 0,
        yearBuilt: formData.yearBuilt ? parseInt(formData.yearBuilt) : null,
        units: formData.units.map(unit => ({
          ...unit,
          bedrooms: parseInt(unit.bedrooms),
          bathrooms: parseInt(unit.bathrooms),
          squareFeet: unit.squareFeet ? parseInt(unit.squareFeet) : null,
          rentAmount: unit.rentAmount ? parseFloat(unit.rentAmount) : 0
        }))
      };

      const newProperty = await dataService.properties.createProperty(propertyData);
      
      if (onPropertyCreated) {
        onPropertyCreated(newProperty);
      }
      
      // Reset form
      setFormData({
        name: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        type: 'Apartment',
        status: 'Active',
        purchasePrice: '',
        currentValue: '',
        yearBuilt: '',
        units: []
      });

      alert('Property created successfully!');
      
    } catch (err) {
      console.error('Error creating property:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const totalUnits = formData.units.length;
  const totalRentPotential = formData.units.reduce((sum, unit) => sum + (parseFloat(unit.rentAmount) || 0), 0);

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
          gap: '16px'
        }}>
          <button
            onClick={onBack}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '20px',
              cursor: 'pointer',
              color: '#6b7280',
              padding: '8px'
            }}
          >
            ← 
          </button>
          <h1 style={{
            fontSize: '24px',
            fontWeight: '600',
            color: '#374151',
            margin: 0
          }}>
            New Property
          </h1>
        </div>

        <div style={{
          display: 'flex',
          gap: '12px'
        }}>
          <button
            onClick={onBack}
            style={{
              background: '#f3f4f6',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              padding: '8px 16px',
              fontSize: '14px',
              cursor: 'pointer',
              color: '#374151'
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              background: loading ? '#9ca3af' : '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: '8px 16px',
              fontSize: '14px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Creating...' : 'Create Property'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        display: 'flex',
        gap: '24px',
        height: 'calc(100vh - 140px)'
      }}>
        
        {/* Left Panel - Preview */}
        <div style={{
          width: '320px',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: '8px',
          padding: '24px',
          boxShadow: '0 4px 16px 0 rgba(0, 0, 0, 0.08)',
          border: '1px solid rgba(0, 0, 0, 0.05)',
          height: 'fit-content'
        }}>
          {/* Property Icon */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '24px'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '8px',
              background: '#e5e7eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px'
            }}>
              🏢
            </div>
            <div>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#374151',
                margin: 0,
                marginBottom: '4px'
              }}>
                {formData.name || 'New Property'}
              </h3>
              <div style={{
                fontSize: '14px',
                color: '#6b7280'
              }}>
                {formData.type}
              </div>
            </div>
          </div>

          {/* Status */}
          <div style={{
            marginBottom: '16px'
          }}>
            <span style={{
              fontSize: '12px',
              padding: '4px 8px',
              borderRadius: '12px',
              background: formData.status === 'Active' ? '#dcfce7' : '#fee2e2',
              color: formData.status === 'Active' ? '#15803d' : '#dc2626',
              fontWeight: '500'
            }}>
              {formData.status}
            </span>
          </div>

          {/* Address */}
          {(formData.address || formData.city) && (
            <div style={{
              background: '#f9fafb',
              padding: '16px',
              borderRadius: '6px',
              marginBottom: '16px'
            }}>
              <h4 style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                margin: '0 0 8px 0'
              }}>
                Address
              </h4>
              <div style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.4' }}>
                {formData.address && <div>📍 {formData.address}</div>}
                {(formData.city || formData.state || formData.zipCode) && (
                  <div>
                    {[formData.city, formData.state, formData.zipCode].filter(Boolean).join(', ')}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Property Stats */}
          <div style={{
            background: '#f9fafb',
            padding: '16px',
            borderRadius: '6px',
            marginBottom: '16px'
          }}>
            <h4 style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151',
              margin: '0 0 8px 0'
            }}>
              Property Stats
            </h4>
            <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>
              🏠 {totalUnits} Units
            </div>
            <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>
              💰 ${totalRentPotential.toLocaleString()}/month potential
            </div>
            {formData.yearBuilt && (
              <div style={{ fontSize: '14px', color: '#6b7280' }}>
                📅 Built in {formData.yearBuilt}
              </div>
            )}
          </div>

          {/* Units List */}
          {formData.units.length > 0 && (
            <div style={{
              background: '#f9fafb',
              padding: '16px',
              borderRadius: '6px'
            }}>
              <h4 style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                margin: '0 0 8px 0'
              }}>
                Units ({formData.units.length})
              </h4>
              {formData.units.slice(0, 3).map(unit => (
                <div key={unit.id} style={{
                  fontSize: '14px',
                  color: '#6b7280',
                  marginBottom: '4px'
                }}>
                  • Unit {unit.unitNumber} - {unit.bedrooms}bd/{unit.bathrooms}ba - ${unit.rentAmount}/mo
                </div>
              ))}
              {formData.units.length > 3 && (
                <div style={{ fontSize: '14px', color: '#6b7280', fontStyle: 'italic' }}>
                  ... and {formData.units.length - 3} more
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Panel - Form */}
        <div style={{
          flex: 1,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: '8px',
          padding: '24px',
          boxShadow: '0 4px 16px 0 rgba(0, 0, 0, 0.08)',
          border: '1px solid rgba(0, 0, 0, 0.05)',
          overflow: 'auto'
        }}>
          <form onSubmit={handleSubmit}>
            {/* Error Message */}
            {error && (
              <div style={{
                background: '#fee2e2',
                border: '1px solid #fecaca',
                borderRadius: '6px',
                padding: '12px',
                marginBottom: '24px',
                color: '#dc2626',
                fontSize: '14px'
              }}>
                {error}
              </div>
            )}

            {/* Basic Information */}
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#374151',
                margin: '0 0 16px 0'
              }}>
                Basic Information
              </h3>
              
              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '6px'
                }}>
                  Property Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="e.g., Sunset Apartments, Maple Street House"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                  required
                />
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px',
                marginBottom: '16px'
              }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '6px'
                  }}>
                    Property Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="Apartment">Apartment</option>
                    <option value="House">House</option>
                    <option value="Condo">Condo</option>
                    <option value="Townhouse">Townhouse</option>
                    <option value="Commercial">Commercial</option>
                  </select>
                </div>
                
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '6px'
                  }}>
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Under Construction">Under Construction</option>
                    <option value="For Sale">For Sale</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#374151',
                margin: '0 0 16px 0'
              }}>
                Address Information
              </h3>
              
              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '6px'
                }}>
                  Street Address *
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="e.g., 123 Main Street"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                  required
                />
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: '16px'
              }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '6px'
                  }}>
                    City *
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                    required
                  />
                </div>
                
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '6px'
                  }}>
                    State *
                  </label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                    required
                  />
                </div>
                
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '6px'
                  }}>
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    value={formData.zipCode}
                    onChange={(e) => handleInputChange('zipCode', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Financial Information */}
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#374151',
                margin: '0 0 16px 0'
              }}>
                Financial Information
              </h3>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: '16px'
              }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '6px'
                  }}>
                    Purchase Price
                  </label>
                  <input
                    type="number"
                    value={formData.purchasePrice}
                    onChange={(e) => handleInputChange('purchasePrice', e.target.value)}
                    placeholder="0"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '6px'
                  }}>
                    Current Value
                  </label>
                  <input
                    type="number"
                    value={formData.currentValue}
                    onChange={(e) => handleInputChange('currentValue', e.target.value)}
                    placeholder="0"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '6px'
                  }}>
                    Year Built
                  </label>
                  <input
                    type="number"
                    value={formData.yearBuilt}
                    onChange={(e) => handleInputChange('yearBuilt', e.target.value)}
                    placeholder="e.g., 2020"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Units Management */}
            <div style={{ marginBottom: '32px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '16px'
              }}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#374151',
                  margin: 0
                }}>
                  Units ({formData.units.length})
                </h3>
                <button
                  type="button"
                  onClick={() => setShowAddUnit(true)}
                  style={{
                    background: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '6px 12px',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >
                  + Add Unit
                </button>
              </div>

              {/* Units List */}
              {formData.units.length > 0 && (
                <div style={{
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  marginBottom: '16px'
                }}>
                  {formData.units.map(unit => (
                    <div key={unit.id} style={{
                      padding: '12px 16px',
                      borderBottom: '1px solid #f3f4f6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px'
                      }}>
                        <div style={{
                          fontSize: '14px',
                          fontWeight: '500',
                          color: '#374151'
                        }}>
                          Unit {unit.unitNumber}
                        </div>
                        <div style={{
                          fontSize: '14px',
                          color: '#6b7280'
                        }}>
                          {unit.bedrooms}bd/{unit.bathrooms}ba
                        </div>
                        <div style={{
                          fontSize: '14px',
                          color: '#6b7280'
                        }}>
                          ${unit.rentAmount}/month
                        </div>
                        <span style={{
                          fontSize: '12px',
                          padding: '2px 6px',
                          borderRadius: '8px',
                          background: unit.status === 'Vacant' ? '#fef3c7' : '#dcfce7',
                          color: unit.status === 'Vacant' ? '#d97706' : '#15803d'
                        }}>
                          {unit.status}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeUnit(unit.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#dc2626',
                          cursor: 'pointer',
                          fontSize: '16px',
                          padding: '4px'
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Unit Form */}
              {showAddUnit && (
                <div style={{
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  padding: '16px',
                  background: '#f9fafb'
                }}>
                  <h4 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#374151',
                    margin: '0 0 12px 0'
                  }}>
                    Add New Unit
                  </h4>
                  
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr',
                    gap: '12px',
                    marginBottom: '16px'
                  }}>
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '12px',
                        fontWeight: '500',
                        color: '#374151',
                        marginBottom: '4px'
                      }}>
                        Unit #
                      </label>
                      <input
                        type="text"
                        value={newUnit.unitNumber}
                        onChange={(e) => handleUnitChange('unitNumber', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '6px 8px',
                          border: '1px solid #d1d5db',
                          borderRadius: '4px',
                          fontSize: '14px',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                    
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '12px',
                        fontWeight: '500',
                        color: '#374151',
                        marginBottom: '4px'
                      }}>
                        Bedrooms
                      </label>
                      <input
                        type="number"
                        value={newUnit.bedrooms}
                        onChange={(e) => handleUnitChange('bedrooms', e.target.value)}
                        min="0"
                        style={{
                          width: '100%',
                          padding: '6px 8px',
                          border: '1px solid #d1d5db',
                          borderRadius: '4px',
                          fontSize: '14px',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                    
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '12px',
                        fontWeight: '500',
                        color: '#374151',
                        marginBottom: '4px'
                      }}>
                        Bathrooms
                      </label>
                      <input
                        type="number"
                        value={newUnit.bathrooms}
                        onChange={(e) => handleUnitChange('bathrooms', e.target.value)}
                        min="0"
                        step="0.5"
                        style={{
                          width: '100%',
                          padding: '6px 8px',
                          border: '1px solid #d1d5db',
                          borderRadius: '4px',
                          fontSize: '14px',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                    
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '12px',
                        fontWeight: '500',
                        color: '#374151',
                        marginBottom: '4px'
                      }}>
                        Sq Ft
                      </label>
                      <input
                        type="number"
                        value={newUnit.squareFeet}
                        onChange={(e) => handleUnitChange('squareFeet', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '6px 8px',
                          border: '1px solid #d1d5db',
                          borderRadius: '4px',
                          fontSize: '14px',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                    
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '12px',
                        fontWeight: '500',
                        color: '#374151',
                        marginBottom: '4px'
                      }}>
                        Rent
                      </label>
                      <input
                        type="number"
                        value={newUnit.rentAmount}
                        onChange={(e) => handleUnitChange('rentAmount', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '6px 8px',
                          border: '1px solid #d1d5db',
                          borderRadius: '4px',
                          fontSize: '14px',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                    
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '12px',
                        fontWeight: '500',
                        color: '#374151',
                        marginBottom: '4px'
                      }}>
                        Status
                      </label>
                      <select
                        value={newUnit.status}
                        onChange={(e) => handleUnitChange('status', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '6px 8px',
                          border: '1px solid #d1d5db',
                          borderRadius: '4px',
                          fontSize: '14px',
                          boxSizing: 'border-box'
                        }}
                      >
                        <option value="Vacant">Vacant</option>
                        <option value="Occupied">Occupied</option>
                        <option value="Maintenance">Maintenance</option>
                      </select>
                    </div>
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    gap: '8px'
                  }}>
                    <button
                      type="button"
                      onClick={addUnit}
                      style={{
                        background: '#10b981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '6px 12px',
                        fontSize: '14px',
                        cursor: 'pointer'
                      }}
                    >
                      Add Unit
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddUnit(false)}
                      style={{
                        background: '#f3f4f6',
                        color: '#374151',
                        border: '1px solid #d1d5db',
                        borderRadius: '4px',
                        padding: '6px 12px',
                        fontSize: '14px',
                        cursor: 'pointer'
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
