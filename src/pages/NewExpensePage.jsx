import React, { useState, useEffect } from 'react';
import dataService from '../services/dataService';

export default function NewExpensePage({ onBack, onExpenseCreated }) {
  const [formData, setFormData] = useState({
    propertyId: '',
    category: 'Maintenance',
    subcategory: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    vendor: '',
    description: '',
    receipt: '',
    taxDeductible: true,
    recurring: false
  });

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const expenseCategories = {
    'Maintenance': ['Plumbing', 'Electrical', 'HVAC', 'Painting', 'Flooring', 'Appliance Repair', 'General Repairs'],
    'Utilities': ['Water', 'Gas', 'Electric', 'Internet', 'Trash', 'Sewer'],
    'Insurance': ['Property Insurance', 'Liability Insurance', 'Umbrella Policy'],
    'Legal & Professional': ['Legal Fees', 'Accounting', 'Property Management', 'Consulting'],
    'Marketing': ['Advertising', 'Photography', 'Staging', 'Signs'],
    'Taxes': ['Property Taxes', 'Income Tax', 'Transfer Tax'],
    'Administrative': ['Office Supplies', 'Software', 'Bank Fees', 'Travel'],
    'Landscaping': ['Lawn Care', 'Snow Removal', 'Tree Service', 'Gardening'],
    'Capital Improvements': ['Renovations', 'Upgrades', 'New Construction']
  };

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      const propertiesData = await dataService.properties.getAllProperties();
      setProperties(propertiesData);
    } catch (err) {
      console.error('Error loading properties:', err);
      setError('Failed to load properties');
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate required fields
      if (!formData.propertyId || !formData.amount || !formData.description) {
        throw new Error('Please fill in all required fields');
      }

      // Prepare expense data
      const expenseData = {
        ...formData,
        amount: parseFloat(formData.amount)
      };

      const newExpense = await dataService.expenses.createExpense(expenseData);
      
      if (onExpenseCreated) {
        onExpenseCreated(newExpense);
      }
      
      // Reset form
      setFormData({
        propertyId: '',
        category: 'Maintenance',
        subcategory: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        vendor: '',
        description: '',
        receipt: '',
        taxDeductible: true,
        recurring: false
      });

      alert('Expense created successfully!');
      
    } catch (err) {
      console.error('Error creating expense:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const selectedProperty = properties.find(p => p.id === formData.propertyId);
  const subcategories = expenseCategories[formData.category] || [];

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
            New Expense
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
            {loading ? 'Creating...' : 'Create Expense'}
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
          {/* Expense Icon */}
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
              background: '#fee2e2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px'
            }}>
              💳
            </div>
            <div>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#374151',
                margin: 0,
                marginBottom: '4px'
              }}>
                {formData.amount ? `$${parseFloat(formData.amount).toLocaleString()}` : 'New Expense'}
              </h3>
              <div style={{
                fontSize: '14px',
                color: '#6b7280'
              }}>
                {formData.category}
                {formData.subcategory && ` - ${formData.subcategory}`}
              </div>
            </div>
          </div>

          {/* Expense Details */}
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
              Expense Details
            </h4>
            <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>
              📅 {formData.date ? new Date(formData.date).toLocaleDateString() : 'No date set'}
            </div>
            <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>
              🏢 {selectedProperty?.name || 'No property selected'}
            </div>
            {formData.vendor && (
              <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>
                👨‍💼 {formData.vendor}
              </div>
            )}
            {formData.description && (
              <div style={{ fontSize: '14px', color: '#6b7280' }}>
                📝 {formData.description.substring(0, 50)}{formData.description.length > 50 ? '...' : ''}
              </div>
            )}
          </div>

          {/* Flags */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            {formData.taxDeductible && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
                color: '#15803d'
              }}>
                <span style={{
                  fontSize: '12px',
                  padding: '2px 6px',
                  borderRadius: '8px',
                  background: '#dcfce7',
                  color: '#15803d'
                }}>
                  ✓ Tax Deductible
                </span>
              </div>
            )}
            
            {formData.recurring && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
                color: '#d97706'
              }}>
                <span style={{
                  fontSize: '12px',
                  padding: '2px 6px',
                  borderRadius: '8px',
                  background: '#fef3c7',
                  color: '#d97706'
                }}>
                  🔄 Recurring
                </span>
              </div>
            )}

            {formData.receipt && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
                color: '#3b82f6'
              }}>
                <span style={{
                  fontSize: '12px',
                  padding: '2px 6px',
                  borderRadius: '8px',
                  background: '#dbeafe',
                  color: '#3b82f6'
                }}>
                  📎 Receipt Attached
                </span>
              </div>
            )}
          </div>

          {/* Property Info */}
          {selectedProperty && (
            <div style={{
              background: '#f9fafb',
              padding: '16px',
              borderRadius: '6px',
              marginTop: '16px'
            }}>
              <h4 style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                margin: '0 0 8px 0'
              }}>
                Property Information
              </h4>
              <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>
                🏢 {selectedProperty.name}
              </div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>
                📍 {selectedProperty.address}
              </div>
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
                    Property *
                  </label>
                  <select
                    value={formData.propertyId}
                    onChange={(e) => handleInputChange('propertyId', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                    required
                  >
                    <option value="">Select Property</option>
                    {properties.map(property => (
                      <option key={property.id} value={property.id}>
                        {property.name}
                      </option>
                    ))}
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
                    Amount *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => handleInputChange('amount', e.target.value)}
                    placeholder="0.00"
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
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
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
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => {
                      handleInputChange('category', e.target.value);
                      handleInputChange('subcategory', ''); // Reset subcategory
                    }}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  >
                    {Object.keys(expenseCategories).map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
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
                    Subcategory
                  </label>
                  <select
                    value={formData.subcategory}
                    onChange={(e) => handleInputChange('subcategory', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="">Select Subcategory</option>
                    {subcategories.map(subcategory => (
                      <option key={subcategory} value={subcategory}>
                        {subcategory}
                      </option>
                    ))}
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
                    Date *
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
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
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '6px'
                }}>
                  Vendor/Payee
                </label>
                <input
                  type="text"
                  value={formData.vendor}
                  onChange={(e) => handleInputChange('vendor', e.target.value)}
                  placeholder="e.g., ABC Plumbing, Home Depot, John's Handyman Service"
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
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe the expense (e.g., Fixed leaky faucet in unit 2A, Monthly property insurance premium)"
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    resize: 'vertical'
                  }}
                  required
                />
              </div>
            </div>

            {/* Additional Details */}
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#374151',
                margin: '0 0 16px 0'
              }}>
                Additional Details
              </h3>
              
              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '6px'
                }}>
                  Receipt/Document Reference
                </label>
                <input
                  type="text"
                  value={formData.receipt}
                  onChange={(e) => handleInputChange('receipt', e.target.value)}
                  placeholder="e.g., Receipt #12345, Invoice INV-2023-001"
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

              <div style={{
                display: 'flex',
                gap: '24px'
              }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px',
                  color: '#374151',
                  cursor: 'pointer'
                }}>
                  <input
                    type="checkbox"
                    checked={formData.taxDeductible}
                    onChange={(e) => handleInputChange('taxDeductible', e.target.checked)}
                    style={{
                      width: '16px',
                      height: '16px'
                    }}
                  />
                  Tax Deductible
                </label>

                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px',
                  color: '#374151',
                  cursor: 'pointer'
                }}>
                  <input
                    type="checkbox"
                    checked={formData.recurring}
                    onChange={(e) => handleInputChange('recurring', e.target.checked)}
                    style={{
                      width: '16px',
                      height: '16px'
                    }}
                  />
                  Recurring Expense
                </label>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
