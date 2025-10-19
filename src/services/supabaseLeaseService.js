/**
 * Supabase Lease Service
 * Handles all lease-related database operations with Supabase
 */

import { TABLES } from '../config/supabase';

export class SupabaseLeaseService {
  constructor(supabaseClient) {
    this.supabase = supabaseClient;
  }

  /**
   * Fetch all leases with related data (properties, units, tenants)
   */
  async getAllLeases() {
    try {
      const { data, error } = await this.supabase
        .from(TABLES.LEASES)
        .select(`
          *,
          property:properties (
            id,
            name,
            address,
            city,
            state,
            zip_code
          ),
          unit:units (
            id,
            unit_number,
            unit_name
          ),
          tenant:tenants (
            id,
            first_name,
            last_name,
            email,
            phone
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform data to match component format
      return data.map(lease => this.transformLeaseData(lease));
    } catch (error) {
      console.error('Error fetching leases:', error);
      throw error;
    }
  }

  /**
   * Fetch a single lease by ID with all related data
   */
  async getLeaseById(leaseId) {
    try {
      const { data, error } = await this.supabase
        .from(TABLES.LEASES)
        .select(`
          *,
          property:properties (
            id,
            name,
            address,
            city,
            state,
            zip_code
          ),
          unit:units (
            id,
            unit_number,
            unit_name
          ),
          tenant:tenants (
            id,
            first_name,
            last_name,
            email,
            phone
          )
        `)
        .eq('id', leaseId)
        .single();

      if (error) throw error;

      return this.transformLeaseData(data);
    } catch (error) {
      console.error('Error fetching lease:', error);
      throw error;
    }
  }

  /**
   * Create a new lease
   */
  async createLease(leaseData) {
    try {
      const { data, error } = await this.supabase
        .from(TABLES.LEASES)
        .insert([{
          property_id: leaseData.property_id,
          unit_id: leaseData.unit_id,
          tenant_id: leaseData.tenant_id,
          lease_start_date: leaseData.lease_start_date,
          lease_end_date: leaseData.lease_end_date,
          rent_amount: leaseData.rent_amount,
          deposit_amount: leaseData.deposit_amount,
          payment_due_day: leaseData.payment_due_day || 1,
          status: leaseData.status || 'draft',
          lease_terms: leaseData.lease_terms || null
        }])
        .select(`
          *,
          property:properties (
            id,
            name,
            address,
            city,
            state,
            zip_code
          ),
          unit:units (
            id,
            unit_number,
            unit_name
          ),
          tenant:tenants (
            id,
            first_name,
            last_name,
            email,
            phone
          )
        `)
        .single();

      if (error) throw error;

      // Update unit status to occupied if lease is active
      if (leaseData.status === 'active' && leaseData.unit_id) {
        await this.updateUnitStatus(leaseData.unit_id, 'occupied');
      }

      return this.transformLeaseData(data);
    } catch (error) {
      console.error('Error creating lease:', error);
      throw error;
    }
  }

  /**
   * Update an existing lease
   */
  async updateLease(leaseId, updates) {
    try {
      const { data, error } = await this.supabase
        .from(TABLES.LEASES)
        .update({
          property_id: updates.property_id,
          unit_id: updates.unit_id,
          tenant_id: updates.tenant_id,
          lease_start_date: updates.lease_start_date,
          lease_end_date: updates.lease_end_date,
          rent_amount: updates.rent_amount,
          deposit_amount: updates.deposit_amount,
          payment_due_day: updates.payment_due_day,
          status: updates.status,
          lease_terms: updates.lease_terms,
          updated_at: new Date().toISOString()
        })
        .eq('id', leaseId)
        .select(`
          *,
          property:properties (
            id,
            name,
            address,
            city,
            state,
            zip_code
          ),
          unit:units (
            id,
            unit_number,
            unit_name
          ),
          tenant:tenants (
            id,
            first_name,
            last_name,
            email,
            phone
          )
        `)
        .single();

      if (error) throw error;

      return this.transformLeaseData(data);
    } catch (error) {
      console.error('Error updating lease:', error);
      throw error;
    }
  }

  /**
   * Delete a lease
   */
  async deleteLease(leaseId) {
    try {
      const { error } = await this.supabase
        .from(TABLES.LEASES)
        .delete()
        .eq('id', leaseId);

      if (error) throw error;

      return true;
    } catch (error) {
      console.error('Error deleting lease:', error);
      throw error;
    }
  }

  /**
   * Update unit status
   */
  async updateUnitStatus(unitId, status) {
    try {
      const { error } = await this.supabase
        .from(TABLES.UNITS)
        .update({ status })
        .eq('id', unitId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating unit status:', error);
    }
  }

  /**
   * Fetch documents for a lease
   */
  async getLeaseDocuments(leaseId) {
    try {
      const { data, error } = await this.supabase
        .from(TABLES.FILES)
        .select('*')
        .eq('lease_id', leaseId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching lease documents:', error);
      return [];
    }
  }

  /**
   * Transform lease data from Supabase format to component format
   */
  transformLeaseData(lease) {
    if (!lease) return null;

    const property = lease.property || {};
    const unit = lease.unit || {};
    const tenant = lease.tenant || {};

    return {
      id: lease.id,
      property: property.name || 'Unknown Property',
      unit: unit.unit_number || unit.unit_name || 'N/A',
      status: this.capitalizeStatus(lease.status),
      start: this.formatDate(lease.lease_start_date),
      end: this.formatDate(lease.lease_end_date),
      tenants: 1, // TODO: support multiple tenants
      rent: this.formatCurrency(lease.rent_amount),
      deposit: this.formatCurrency(lease.deposit_amount),
      address: this.formatAddress(property),
      createdDate: this.formatDate(lease.created_at),
      leaseType: this.getLeaseType(lease.lease_start_date, lease.lease_end_date),
      paymentFrequency: 'Monthly',
      paymentDueDay: lease.payment_due_day || 1,
      
      // Detailed tenant information
      tenantsDetails: tenant.first_name ? [{
        id: tenant.id,
        firstName: tenant.first_name,
        lastName: tenant.last_name,
        email: tenant.email,
        phone: tenant.phone
      }] : [],
      
      // Placeholder for documents (to be fetched separately if needed)
      documents: [],
      
      // Lease history
      leaseHistory: [
        {
          id: 1,
          action: 'Lease Created',
          date: this.formatDate(lease.created_at),
          time: this.formatTime(lease.created_at),
          user: 'System'
        }
      ],

      // Original database fields
      _raw: {
        id: lease.id,
        property_id: lease.property_id,
        unit_id: lease.unit_id,
        tenant_id: lease.tenant_id,
        lease_start_date: lease.lease_start_date,
        lease_end_date: lease.lease_end_date,
        rent_amount: lease.rent_amount,
        deposit_amount: lease.deposit_amount,
        payment_due_day: lease.payment_due_day,
        status: lease.status,
        lease_terms: lease.lease_terms
      }
    };
  }

  /**
   * Helper: Format date
   */
  formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  }

  /**
   * Helper: Format time
   */
  formatTime(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  }

  /**
   * Helper: Format currency
   */
  formatCurrency(amount) {
    if (amount === null || amount === undefined) return '$0.00';
    return `$${parseFloat(amount).toLocaleString('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })}`;
  }

  /**
   * Helper: Format address
   */
  formatAddress(property) {
    if (!property) return 'N/A';
    const parts = [
      property.address,
      property.city,
      property.state,
      property.zip_code
    ].filter(Boolean);
    return parts.join(', ') || 'N/A';
  }

  /**
   * Helper: Capitalize status
   */
  capitalizeStatus(status) {
    if (!status) return 'Draft';
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  }

  /**
   * Helper: Determine lease type
   */
  getLeaseType(startDate, endDate) {
    if (!startDate || !endDate) return 'N/A';
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffMonths = (end.getFullYear() - start.getFullYear()) * 12 + 
                       (end.getMonth() - start.getMonth());
    
    if (diffMonths <= 1) return 'month-to-month';
    return 'fixed';
  }
}
