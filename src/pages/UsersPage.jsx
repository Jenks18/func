/**
 * Users Page - Team Member Management
 * Innago-style interface with blue gradient theme
 */

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useAuthenticatedSupabase } from '../hooks/useAuthenticatedSupabase';
import { hasPermission, ROLES } from '../config/clerk';
import NewUserModal from '../components/users/NewUserModal';

export default function UsersPage() {
  const { user } = useUser();
  const { supabase } = useAuthenticatedSupabase();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewUserModal, setShowNewUserModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);

  const userRole = user?.unsafeMetadata?.role;
  const canManageUsers = hasPermission(userRole, 'canManageUsers');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    try {
      const { error } = await supabase
        .from('users')
        .update({ status: newStatus })
        .eq('id', userId);

      if (error) throw error;
      fetchUsers();
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = 
      u.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || u.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getRoleBadgeColor = (role) => {
    const colors = {
      'property_owner': { bg: '#dbeafe', color: '#1e40af' },
      'property_manager': { bg: '#ddd6fe', color: '#5b21b6' },
      'maintenance': { bg: '#fed7aa', color: '#c2410c' },
      'tenant': { bg: '#d1fae5', color: '#065f46' },
    };
    return colors[role] || { bg: '#e5e7eb', color: '#374151' };
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #bae6fd 100%)',
      padding: '24px'
    }}>
      {/* Header */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        border: '1px solid #bfdbfe',
        boxShadow: '0 4px 16px rgba(59,130,246,0.1)',
        padding: '24px',
        marginBottom: '24px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px'
        }}>
          <div>
            <h1 style={{
              fontSize: '28px',
              fontWeight: '700',
              color: '#1e40af',
              margin: 0,
              marginBottom: '8px'
            }}>
              Users
            </h1>
            <p style={{
              fontSize: '14px',
              color: '#60a5fa',
              margin: 0
            }}>
              Manage team members and access levels
            </p>
          </div>

          {canManageUsers && (
            <button
              onClick={() => setShowNewUserModal(true)}
              style={{
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(59,130,246,0.3)',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 4px 12px rgba(59,130,246,0.4)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 2px 8px rgba(59,130,246,0.3)';
              }}
            >
              + Add New User
            </button>
          )}
        </div>

        {/* Search and Filters */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto auto',
          gap: '12px',
          alignItems: 'center'
        }}>
          {/* Search */}
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Search by user name or email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 16px',
                paddingLeft: '40px',
                border: '1px solid #bfdbfe',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
            />
            <span style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#60a5fa',
              fontSize: '18px'
            }}>
              🔍
            </span>
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: '10px 16px',
              border: '1px solid #bfdbfe',
              borderRadius: '8px',
              fontSize: '14px',
              color: '#1e40af',
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            <option value="all">Select User Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          {/* Count */}
          <div style={{
            padding: '10px 16px',
            background: '#f0f9ff',
            border: '1px solid #bfdbfe',
            borderRadius: '8px',
            color: '#1e40af',
            fontSize: '14px',
            fontWeight: '600'
          }}>
            Showing {filteredUsers.length} of {users.length}
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        border: '1px solid #bfdbfe',
        boxShadow: '0 4px 16px rgba(59,130,246,0.1)',
        overflow: 'hidden'
      }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse'
        }}>
          <thead>
            <tr style={{
              background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
              borderBottom: '2px solid #bfdbfe'
            }}>
              <th style={{ padding: '16px', textAlign: 'left', color: '#1e40af', fontWeight: '600', fontSize: '14px' }}>
                Name
              </th>
              <th style={{ padding: '16px', textAlign: 'left', color: '#1e40af', fontWeight: '600', fontSize: '14px' }}>
                Email Address
              </th>
              <th style={{ padding: '16px', textAlign: 'left', color: '#1e40af', fontWeight: '600', fontSize: '14px' }}>
                Phone
              </th>
              <th style={{ padding: '16px', textAlign: 'left', color: '#1e40af', fontWeight: '600', fontSize: '14px' }}>
                Account Status
              </th>
              <th style={{ padding: '16px', textAlign: 'left', color: '#1e40af', fontWeight: '600', fontSize: '14px' }}>
                Role
              </th>
              <th style={{ padding: '16px', textAlign: 'center', color: '#1e40af', fontWeight: '600', fontSize: '14px' }}>
                Status
              </th>
              <th style={{ padding: '16px', textAlign: 'center', color: '#1e40af', fontWeight: '600', fontSize: '14px' }}>
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" style={{ padding: '40px', textAlign: 'center', color: '#60a5fa' }}>
                  Loading users...
                </td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ padding: '40px', textAlign: 'center', color: '#60a5fa' }}>
                  No Records Found
                </td>
              </tr>
            ) : (
              filteredUsers.map((u, index) => {
                const roleColor = getRoleBadgeColor(u.role);
                return (
                  <tr 
                    key={u.id}
                    style={{
                      borderBottom: index < filteredUsers.length - 1 ? '1px solid #e0f2fe' : 'none',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f0f9ff'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
                  >
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '16px',
                          fontWeight: '600'
                        }}>
                          {u.first_name?.charAt(0) || u.email?.charAt(0) || '?'}
                        </div>
                        <div>
                          <div style={{ color: '#1e40af', fontWeight: '600', fontSize: '14px' }}>
                            {u.first_name} {u.last_name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px', color: '#60a5fa', fontSize: '14px' }}>
                      {u.email}
                    </td>
                    <td style={{ padding: '16px', color: '#60a5fa', fontSize: '14px' }}>
                      {u.phone || '(511) 111-1111'}
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{
                        padding: '4px 12px',
                        background: u.status === 'active' ? '#dbeafe' : '#fee2e2',
                        color: u.status === 'active' ? '#1e40af' : '#991b1b',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}>
                        {u.status === 'active' ? 'Unverified' : 'Verified'}
                      </span>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{
                        padding: '4px 12px',
                        background: roleColor.bg,
                        color: roleColor.color,
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '600',
                        textTransform: 'capitalize'
                      }}>
                        {u.role?.replace('_', ' ')}
                      </span>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      <label style={{
                        position: 'relative',
                        display: 'inline-block',
                        width: '48px',
                        height: '24px',
                        cursor: canManageUsers ? 'pointer' : 'not-allowed'
                      }}>
                        <input
                          type="checkbox"
                          checked={u.status === 'active'}
                          onChange={() => canManageUsers && toggleUserStatus(u.id, u.status)}
                          disabled={!canManageUsers}
                          style={{ opacity: 0, width: 0, height: 0 }}
                        />
                        <span style={{
                          position: 'absolute',
                          cursor: 'pointer',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: u.status === 'active' ? '#3b82f6' : '#cbd5e1',
                          borderRadius: '24px',
                          transition: '0.3s'
                        }}>
                          <span style={{
                            position: 'absolute',
                            content: '',
                            height: '18px',
                            width: '18px',
                            left: u.status === 'active' ? '26px' : '3px',
                            bottom: '3px',
                            background: 'white',
                            borderRadius: '50%',
                            transition: '0.3s'
                          }} />
                        </span>
                      </label>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      <button
                        onClick={() => setSelectedUser(u)}
                        style={{
                          padding: '6px 12px',
                          background: 'transparent',
                          border: 'none',
                          color: '#60a5fa',
                          fontSize: '20px',
                          cursor: 'pointer',
                          transition: 'transform 0.2s'
                        }}
                        onMouseOver={(e) => e.target.style.transform = 'scale(1.2)'}
                        onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                      >
                        ⋮
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* New User Modal */}
      {showNewUserModal && (
        <NewUserModal
          onClose={() => setShowNewUserModal(false)}
          onSuccess={() => {
            setShowNewUserModal(false);
            fetchUsers();
          }}
        />
      )}
    </div>
  );
}
