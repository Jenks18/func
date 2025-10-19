/**
 * User Invitation Service
 * Handles inviting new users via Clerk Organizations
 */

/**
 * Invite a new user to the organization
 * This creates a Clerk organization invitation
 * 
 * @param {Object} params
 * @param {string} params.email - User's email
 * @param {string} params.role - User's role (property_owner, property_manager, etc)
 * @param {Object} params.organization - Clerk organization object
 * @param {Object} params.supabase - Supabase client
 * @returns {Promise<Object>} - Created user record
 */
export async function inviteUserToOrganization({ 
  email, 
  firstName,
  lastName,
  phone,
  role, 
  accessLevels,
  organization,
  supabase 
}) {
  try {
    // console.log('Inviting user:', { email, role, organization: organization.name });

    // 1. Send Clerk organization invitation
    // This sends an email to the user with a link to join
    const invitation = await organization.inviteMember({
      emailAddress: email,
      role: 'org:member', // Clerk organization role (not our app role)
    });

    // console.log('Clerk invitation created:', invitation.id);

    // 2. Create user record in Supabase database
    // This stores our app-specific role and permissions
    const { data: user, error: dbError } = await supabase
      .from('users')
      .insert([{
        email: email,
        first_name: firstName,
        last_name: lastName,
        phone: phone,
        role: role, // Our app role: property_owner, property_manager, etc
        organization_id: null, // Will be set when they accept invitation
        access_levels: accessLevels,
        status: 'invited', // Not active until they accept invitation
        clerk_invitation_id: invitation.id,
      }])
      .select()
      .single();

    if (dbError) throw dbError;

    // console.log('Database user record created:', user.id);

    return {
      success: true,
      user: user,
      invitation: invitation,
      message: `Invitation sent to ${email}. They will receive an email to join your organization.`
    };

  } catch (error) {
    console.error('Error inviting user:', error);
    throw error;
  }
}

/**
 * Resend invitation to user
 */
export async function resendInvitation({ invitationId, organization }) {
  try {
    // Clerk doesn't have a built-in resend, so we'd need to revoke and recreate
    // Or you can implement email sending via your own service
    // console.log('Resending invitation:', invitationId);
    
    // For now, just log
    return {
      success: true,
      message: 'Invitation resent (feature coming soon)'
    };
  } catch (error) {
    console.error('Error resending invitation:', error);
    throw error;
  }
}

/**
 * Accept invitation and complete user setup
 * Called when user clicks invitation link and signs up
 */
export async function acceptInvitation({ 
  clerkUserId, 
  invitationId, 
  supabase 
}) {
  try {
    // Update user record with Clerk ID and set status to active
    const { data: user, error } = await supabase
      .from('users')
      .update({
        clerk_id: clerkUserId,
        status: 'active'
      })
      .eq('clerk_invitation_id', invitationId)
      .select()
      .single();

    if (error) throw error;

    // console.log('User invitation accepted:', user.id);
    return user;
  } catch (error) {
    console.error('Error accepting invitation:', error);
    throw error;
  }
}

/**
 * Cancel/revoke invitation
 */
export async function revokeInvitation({ invitationId, organization, supabase }) {
  try {
    // 1. Revoke Clerk invitation
    await organization.revokeInvitation(invitationId);

    // 2. Delete user record from database
    await supabase
      .from('users')
      .delete()
      .eq('clerk_invitation_id', invitationId);

    return {
      success: true,
      message: 'Invitation revoked'
    };
  } catch (error) {
    console.error('Error revoking invitation:', error);
    throw error;
  }
}
