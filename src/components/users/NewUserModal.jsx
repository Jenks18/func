/**
 * New User Modal - Innago-style with Access Levels Table
 * Blue gradient theme
 */

import { useState } from 'react';
import { useAuthenticatedSupabase } from '../../hooks/useAuthenticatedSupabase';
import { ROLES } from '../../config/clerk';

export default function NewUserModal({ onClose, onSuccess }) {
  const { supabase } = useAuthenticatedSupabase();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: '',
    properties: []
  });

  const [accessLevels, setAccessLevels] = useState({
    property: { property_manager: 'All', lease_manager: 'View', maintenance_staff: 'None', property_owner: 'View' },
    invoice: { property_manager: 'All', lease_manager: 'None', maintenance_staff: 'None', property_owner: 'View' },
    lease: { property_manager: 'All', lease_manager: 'All', maintenance_staff: 'None', property_owner: 'View' },
    tenant: { property_manager: 'All', lease_manager: 'All', maintenance_staff: 'None', property_owner: 'View' },
    application: { property_manager: 'All', lease_manager: 'All', maintenance_staff: 'None', property_owner: 'View' },
    maintenance: { property_manager: 'All', lease_manager: 'None', maintenance_staff: 'All', property_owner: 'View' },
    reports: { property_manager: 'All', lease_manager: 'None', maintenance_staff: 'None', property_owner: 'All' },
    settings: { property_manager: 'All', lease_manager: 'None', maintenance_staff: 'None', property_owner: 'None' },
    messaging: { property_manager: 'All', lease_manager: 'None', maintenance_staff: 'None', property_owner: 'None' },
    expense: { property_manager: 'All', lease_manager: 'None', maintenance_staff: 'None', property_owner: 'View' },
    bank: { property_manager: 'All', lease_manager: 'None', maintenance_staff: 'None', property_owner: 'None' },
    listings: { property_manager: 'All', lease_manager: 'All', maintenance_staff: 'None', property_owner: 'View' },
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAccessChange = (feature, role, value) => {
    setAccessLevels(prev => ({
      ...prev,
      [feature]: {
        ...prev[feature],
        [role]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Create user in database
      const { data, error: insertError } = await supabase
        .from('users')
        .insert([{
          email: formData.email,
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone: formData.phone,
          role: formData.role,
          access_levels: accessLevels,
          status: 'active'
        }])
        .select()
        .single();

      if (insertError) throw insertError;

      // TODO: Send invitation email via Clerk
      
      onSuccess();
    } catch (err) {
      console.error('Error creating user:', err);
      setError(err.message || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = [
    { value: '', label: 'Select Role' },
    { value: ROLES.PROPERTY_OWNER, label: 'Property Owner' },
    { value: ROLES.PROPERTY_MANAGER, label: 'Property Manager' },
    { value: ROLES.MAINTENANCE, label: 'Maintenance Staff' },
    { value: 'lease_manager', label: 'Lease Manager' },
    { value: 'custom', label: 'Custom' }
  ];

  const features = [
    { key: 'property', label: 'Property' },
    { key: 'invoice', label: 'Invoice' },
    { key: 'lease', label: 'Lease/Term' },
    { key: 'tenant', label: 'Tenant/Owner' },
    { key: 'application', label: 'Application' },
    { key: 'maintenance', label: 'Maintenance' },
    { key: 'reports', label: 'Reports' },
    { key: 'settings', label: 'Settings' },
    { key: 'messaging', label: 'Messaging' },
    { key: 'expense', label: 'Expense' },
    { key: 'bank', label: 'Bank' },
    { key: 'listings', label: 'Listings' }
  ];

  const accessOptions = ['All', 'View', 'None'];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        border: '1px solid #bfdbfe',
        boxShadow: '0 8px 32px rgba(59,130,246,0.2)',
        maxWidth: '1200px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          padding: '24px',
          borderBottom: '2px solid #e0f2fe',
          background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)'
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#1e40af',
            margin: 0
          }}>
            NEW USER
          </h2>
        </div>

        {/* Content */}
        <div style={{
          flex: 1,
          overflow: 'auto',
          padding: '24px',
          display: 'grid',
          gridTemplateColumns: '350px 1fr',
          gap: '24px'
        }}>
          {/* Left Column - User Info */}
          <div>
            {/* Profile Picture Placeholder */}
            <div style={{
              textAlign: 'center',
              marginBottom: '24px'
            }}>
              <div style={{
                width: '120px',
                height: '120px',
                margin: '0 auto',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #cbd5e1 0%, #94a3b8 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '12px'
              }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: '#64748b',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    background: '#475569',
                    position: 'absolute',
                    top: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)'
                  }} />
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    background: '#475569',
                    position: 'absolute',
                    bottom: '-10px',
                    left: '50%',
                    transform: 'translateX(-50%)'
                  }} />
                </div>
              </div>
              <button style={{
                padding: '8px 16px',
                background: 'transparent',
                border: 'none',
                color: '#3b82f6',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer'
              }}>
                Upload Picture
              </button>
            </div>

            {error && (
              <div style={{
                padding: '12px',
                background: '#fee2e2',
                border: '1px solid #fecaca',
                borderRadius: '8px',
                color: '#dc2626',
                fontSize: '14px',
                marginBottom: '16px'
              }}>
                {error}
              </div>
            )}

            {/* Form Fields */}
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#1e40af',
                  marginBottom: '8px'
                }}>
                  First Name*
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #bfdbfe',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#1e40af',
                  marginBottom: '8px'
                }}>
                  Last Name*
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #bfdbfe',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#1e40af',
                  marginBottom: '8px'
                }}>
                  Email*
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #bfdbfe',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#1e40af',
                  marginBottom: '8px'
                }}>
                  Phone*
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="("
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #bfdbfe',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#1e40af',
                  marginBottom: '8px'
                }}>
                  Role*
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => handleChange('role', e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #bfdbfe',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    cursor: 'pointer',
                    color: formData.role ? '#1e40af' : '#94a3b8'
                  }}
                >
                  {roleOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#1e40af',
                  marginBottom: '8px'
                }}>
                  Assign Properties
                </label>
                <select
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #bfdbfe',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    cursor: 'pointer',
                    color: '#94a3b8'
                  }}
                >
                  <option>Select Properties</option>
                </select>
              </div>
            </form>
          </div>

          {/* Right Column - Access Levels Table */}
          <div>
            <div style={{
              background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
              padding: '16px',
              borderRadius: '12px',
              marginBottom: '16px'
            }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '700',
                color: '#1e40af',
                margin: 0
              }}>
                Access Levels
              </h3>
            </div>

            <div style={{
              background: '#f0f9ff',
              border: '1px solid #bfdbfe',
              borderRadius: '12px',
              overflow: 'hidden'
            }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse'
              }}>
                <thead>
                  <tr style={{
                    background: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
                    color: 'white'
                  }}>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: '600' }}>
                      Features
                    </th>
                    <th style={{ padding: '12px', textAlign: 'center', fontSize: '13px', fontWeight: '600' }}>
                      Property<br/>Manager
                    </th>
                    <th style={{ padding: '12px', textAlign: 'center', fontSize: '13px', fontWeight: '600' }}>
                      Lease<br/>Manager
                    </th>
                    <th style={{ padding: '12px', textAlign: 'center', fontSize: '13px', fontWeight: '600' }}>
                      Maintenance<br/>Staff
                    </th>
                    <th style={{ padding: '12px', textAlign: 'center', fontSize: '13px', fontWeight: '600' }}>
                      Property<br/>Owner
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {features.map((feature, index) => (
                    <tr 
                      key={feature.key}
                      style={{
                        background: index % 2 === 0 ? 'white' : '#f0f9ff',
                        borderBottom: '1px solid #e0f2fe'
                      }}
                    >
                      <td style={{ padding: '12px', fontSize: '13px', color: '#1e40af', fontWeight: '500' }}>
                        {feature.label}
                      </td>
                      {['property_manager', 'lease_manager', 'maintenance_staff', 'property_owner'].map(role => (
                        <td key={role} style={{ padding: '8px', textAlign: 'center' }}>
                          <select
                            value={accessLevels[feature.key][role]}
                            onChange={(e) => handleAccessChange(feature.key, role, e.target.value)}
                            style={{
                              padding: '6px 12px',
                              border: '1px solid #bfdbfe',
                              borderRadius: '6px',
                              fontSize: '12px',
                              color: '#1e40af',
                              cursor: 'pointer',
                              outline: 'none',
                              fontWeight: '600',
                              background: 
                                accessLevels[feature.key][role] === 'All' ? '#dbeafe' :
                                accessLevels[feature.key][role] === 'View' ? '#fef3c7' :
                                '#fee2e2'
                            }}
                          >
                            {accessOptions.map(opt => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Legend */}
            <div style={{
              marginTop: '16px',
              padding: '12px',
              background: '#f0f9ff',
              border: '1px solid #bfdbfe',
              borderRadius: '8px',
              fontSize: '12px',
              color: '#60a5fa'
            }}>
              <div style={{ marginBottom: '4px' }}>
                <strong style={{ color: '#1e40af' }}>*View</strong> - User can view data, but cannot take any action.
              </div>
              <div style={{ marginBottom: '4px' }}>
                <strong style={{ color: '#1e40af' }}>*None</strong> - User has no access to features or data within this module
              </div>
              <div>
                <strong style={{ color: '#1e40af' }}>*All</strong> - User has full access to all features associated with this module including view, edit, and delete
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '24px',
          borderTop: '2px solid #e0f2fe',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '12px'
        }}>
          <button
            onClick={onClose}
            type="button"
            style={{
              padding: '10px 24px',
              background: 'white',
              border: '1px solid #bfdbfe',
              borderRadius: '8px',
              color: '#60a5fa',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              padding: '10px 24px',
              background: loading ? '#cbd5e1' : 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              fontSize: '14px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 2px 8px rgba(59,130,246,0.3)'
            }}
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}
