/**
 * Organization Management Component
 * Manage organization members, roles, and invitations
 * Can be embedded in Settings page
 */

import { useState, useEffect } from 'react';
import { useOrganization, useOrganizationList, useUser } from '@clerk/clerk-react';
import { hasPermission, ROLES, PERMISSIONS } from '../../config/clerk';

export default function OrganizationManagement() {
  const { organization, membership, memberships, invitations } = useOrganization({
    memberships: { 
      infinite: true,
      keepPreviousData: true 
    },
    invitations: {
      infinite: true,
      keepPreviousData: true
    }
  });
  
  const { user } = useUser();
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('basic_member');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Get current user's role from metadata
  const userRole = user?.publicMetadata?.role || 'tenant';
  
  // Check if user can manage organization
  const canManageOrg = hasPermission(userRole, 'canManageOrganization');
  const canInviteUsers = hasPermission(userRole, 'canInviteUsers');

  const handleInviteMember = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await organization.inviteMember({
        emailAddress: inviteEmail,
        role: inviteRole
      });
      
      setSuccess(`Invitation sent to ${inviteEmail}`);
      setInviteEmail('');
      setInviteRole('basic_member');
    } catch (err) {
      setError(err.message || 'Failed to send invitation');
    } finally {
      setLoading(false);
    }
  };

  const handleRevokeMembership = async (membershipId) => {
    if (!confirm('Are you sure you want to remove this member?')) return;
    
    setLoading(true);
    try {
      await organization.removeMember(membershipId);
      setSuccess('Member removed successfully');
    } catch (err) {
      setError('Failed to remove member');
    } finally {
      setLoading(false);
    }
  };

  const handleRevokeInvitation = async (invitationId) => {
    setLoading(true);
    try {
      await organization.revokeInvitation(invitationId);
      setSuccess('Invitation revoked');
    } catch (err) {
      setError('Failed to revoke invitation');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRole = async (membershipId, newRole) => {
    setLoading(true);
    try {
      await organization.updateMember({
        userId: membershipId,
        role: newRole
      });
      setSuccess('Role updated successfully');
    } catch (err) {
      setError('Failed to update role');
    } finally {
      setLoading(false);
    }
  };

  if (!organization) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <p style={{ color: '#60a5fa' }}>Loading organization...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '0' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{
          fontSize: '24px',
          fontWeight: '700',
          color: '#1e40af',
          margin: '0 0 8px 0'
        }}>
          Organization Members
        </h2>
        <p style={{ color: '#60a5fa', margin: 0 }}>
          Manage who has access to {organization.name}
        </p>
      </div>

      {/* Success/Error Messages */}
      {error && (
        <div style={{
          padding: '12px 16px',
          background: '#fee2e2',
          border: '1px solid #fca5a5',
          borderRadius: '8px',
          color: '#991b1b',
          marginBottom: '16px'
        }}>
          {error}
        </div>
      )}
      
      {success && (
        <div style={{
          padding: '12px 16px',
          background: '#d1fae5',
          border: '1px solid #6ee7b7',
          borderRadius: '8px',
          color: '#065f46',
          marginBottom: '16px'
        }}>
          {success}
        </div>
      )}

      {/* Invite New Member */}
      {canInviteUsers && (
        <div style={{
          background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
          border: '1px solid #bfdbfe',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '24px'
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#1e40af',
            margin: '0 0 16px 0'
          }}>
            Invite New Member
          </h3>
          
          <form onSubmit={handleInviteMember}>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <input
                type="email"
                placeholder="Email address"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                required
                style={{
                  flex: '1',
                  minWidth: '250px',
                  padding: '10px 14px',
                  border: '1px solid #bfdbfe',
                  borderRadius: '8px',
                  fontSize: '14px',
                  background: 'white',
                  color: '#1e40af'
                }}
              />
              
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value)}
                style={{
                  padding: '10px 14px',
                  border: '1px solid #bfdbfe',
                  borderRadius: '8px',
                  fontSize: '14px',
                  background: 'white',
                  color: '#1e40af',
                  minWidth: '150px'
                }}
              >
                <option value="basic_member">Member</option>
                <option value="admin">Admin</option>
              </select>
              
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '10px 24px',
                  background: loading ? '#93c5fd' : 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                {loading ? 'Sending...' : 'Send Invite'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Current Members */}
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{
          fontSize: '18px',
          fontWeight: '600',
          color: '#1e40af',
          margin: '0 0 16px 0'
        }}>
          Current Members ({memberships?.data?.length || 0})
        </h3>
        
        <div style={{
          background: 'white',
          border: '1px solid #bfdbfe',
          borderRadius: '12px',
          overflow: 'hidden'
        }}>
          {memberships?.data?.map((membership) => (
            <div
              key={membership.id}
              style={{
                padding: '16px 20px',
                borderBottom: '1px solid #e0f2fe',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '16px'
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontWeight: '600',
                  color: '#1e40af',
                  marginBottom: '4px'
                }}>
                  {membership.publicUserData?.firstName} {membership.publicUserData?.lastName}
                  {membership.publicUserData?.identifier === user?.primaryEmailAddress?.emailAddress && (
                    <span style={{
                      marginLeft: '8px',
                      fontSize: '12px',
                      color: '#60a5fa',
                      fontWeight: '400'
                    }}>
                      (You)
                    </span>
                  )}
                </div>
                <div style={{
                  fontSize: '14px',
                  color: '#60a5fa'
                }}>
                  {membership.publicUserData?.identifier}
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{
                  padding: '4px 12px',
                  background: membership.role === 'admin' ? '#dbeafe' : '#f0f9ff',
                  color: '#1e40af',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: '600'
                }}>
                  {membership.role === 'admin' ? 'Admin' : 'Member'}
                </span>
                
                {canManageOrg && membership.publicUserData?.identifier !== user?.primaryEmailAddress?.emailAddress && (
                  <button
                    onClick={() => handleRevokeMembership(membership.id)}
                    style={{
                      padding: '6px 12px',
                      background: 'transparent',
                      color: '#dc2626',
                      border: '1px solid #fca5a5',
                      borderRadius: '6px',
                      fontSize: '12px',
                      cursor: 'pointer',
                      fontWeight: '600'
                    }}
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pending Invitations */}
      {invitations?.data?.length > 0 && (
        <div>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#1e40af',
            margin: '0 0 16px 0'
          }}>
            Pending Invitations ({invitations.data.length})
          </h3>
          
          <div style={{
            background: 'white',
            border: '1px solid #bfdbfe',
            borderRadius: '12px',
            overflow: 'hidden'
          }}>
            {invitations.data.map((invitation) => (
              <div
                key={invitation.id}
                style={{
                  padding: '16px 20px',
                  borderBottom: '1px solid #e0f2fe',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px'
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontWeight: '600',
                    color: '#1e40af',
                    marginBottom: '4px'
                  }}>
                    {invitation.emailAddress}
                  </div>
                  <div style={{
                    fontSize: '14px',
                    color: '#60a5fa'
                  }}>
                    Invited {new Date(invitation.createdAt).toLocaleDateString()}
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{
                    padding: '4px 12px',
                    background: '#fef3c7',
                    color: '#92400e',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    Pending
                  </span>
                  
                  {canManageOrg && (
                    <button
                      onClick={() => handleRevokeInvitation(invitation.id)}
                      style={{
                        padding: '6px 12px',
                        background: 'transparent',
                        color: '#dc2626',
                        border: '1px solid #fca5a5',
                        borderRadius: '6px',
                        fontSize: '12px',
                        cursor: 'pointer',
                        fontWeight: '600'
                      }}
                    >
                      Revoke
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Permission Info */}
      {!canManageOrg && !canInviteUsers && (
        <div style={{
          padding: '16px',
          background: '#fef3c7',
          border: '1px solid #fbbf24',
          borderRadius: '8px',
          color: '#92400e',
          fontSize: '14px',
          marginTop: '24px'
        }}>
          ℹ️ You don't have permission to manage organization members. Contact an admin for access.
        </div>
      )}
    </div>
  );
}
