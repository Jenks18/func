import db from './database.js';

class TenantService {
  constructor() {
    this.storeName = 'tenants';
  }

  async createTenant(tenantData) {
    try {
      const tenant = await db.add(this.storeName, {
        ...tenantData,
        status: tenantData.status || 'Active',
        accountStatus: tenantData.accountStatus || 'Unverified',
        tenantSince: tenantData.tenantSince || new Date().toISOString().split('T')[0],
        totalRentPaid: 0,
        outstandingBalance: 0,
        emergencyContact: tenantData.emergencyContact || {},
        documents: tenantData.documents || []
      });
      
      return tenant;
    } catch (error) {
      console.error('Error creating tenant:', error);
      throw error;
    }
  }

  async getAllTenants() {
    try {
      const tenants = await db.getAll(this.storeName);
      
      // Get additional information for each tenant
      const tenantsWithDetails = await Promise.all(
        tenants.map(async (tenant) => {
          const property = await this.getTenantProperty(tenant.propertyId);
          const activeLeases = await this.getTenantActiveLeases(tenant.id);
          const paymentHistory = await this.getTenantPaymentHistory(tenant.id);
          
          return {
            ...tenant,
            property,
            activeLeases,
            paymentHistory: paymentHistory.slice(0, 5), // Last 5 payments
            totalPayments: paymentHistory.length,
            lastPaymentDate: paymentHistory.length > 0 ? paymentHistory[0].date : null
          };
        })
      );
      
      return tenantsWithDetails;
    } catch (error) {
      console.error('Error getting tenants:', error);
      throw error;
    }
  }

  async getTenantById(id) {
    try {
      const tenant = await db.getById(this.storeName, id);
      if (tenant) {
        const property = await this.getTenantProperty(tenant.propertyId);
        const activeLeases = await this.getTenantActiveLeases(id);
        const paymentHistory = await this.getTenantPaymentHistory(id);
        const expenses = await this.getTenantExpenses(id);
        
        return {
          ...tenant,
          property,
          activeLeases,
          paymentHistory,
          expenses,
          totalPayments: paymentHistory.length,
          totalExpenses: expenses.reduce((sum, exp) => sum + exp.amount, 0)
        };
      }
      return null;
    } catch (error) {
      console.error('Error getting tenant:', error);
      throw error;
    }
  }

  async getTenantProperty(propertyId) {
    if (!propertyId) return null;
    try {
      return await db.getById('properties', propertyId);
    } catch (error) {
      console.error('Error getting tenant property:', error);
      return null;
    }
  }

  async getTenantActiveLeases(tenantId) {
    try {
      const allLeases = await db.query('leases', 'tenantId', tenantId);
      return allLeases.filter(lease => lease.status === 'Active');
    } catch (error) {
      console.error('Error getting tenant leases:', error);
      return [];
    }
  }

  async getTenantPaymentHistory(tenantId) {
    try {
      const payments = await db.query('transactions', 'tenantId', tenantId);
      return payments
        .filter(transaction => transaction.type === 'payment')
        .sort((a, b) => new Date(b.date) - new Date(a.date));
    } catch (error) {
      console.error('Error getting tenant payment history:', error);
      return [];
    }
  }

  async getTenantExpenses(tenantId) {
    try {
      // Get expenses related to this tenant's property
      const tenant = await db.getById(this.storeName, tenantId);
      if (!tenant?.propertyId) return [];
      
      return await db.query('expenses', 'propertyId', tenant.propertyId);
    } catch (error) {
      console.error('Error getting tenant expenses:', error);
      return [];
    }
  }

  async updateTenant(id, updates) {
    try {
      return await db.update(this.storeName, id, updates);
    } catch (error) {
      console.error('Error updating tenant:', error);
      throw error;
    }
  }

  async deleteTenant(id) {
    try {
      // Note: In a real system, you might want to archive rather than delete
      // and handle associated leases and payments
      return await db.delete(this.storeName, id);
    } catch (error) {
      console.error('Error deleting tenant:', error);
      throw error;
    }
  }

  async searchTenants(searchTerm) {
    try {
      const allTenants = await this.getAllTenants();
      const searchLower = searchTerm.toLowerCase();
      
      return allTenants.filter(tenant => 
        tenant.firstName?.toLowerCase().includes(searchLower) ||
        tenant.lastName?.toLowerCase().includes(searchLower) ||
        tenant.email?.toLowerCase().includes(searchLower) ||
        tenant.phone?.includes(searchTerm) ||
        tenant.property?.name.toLowerCase().includes(searchLower)
      );
    } catch (error) {
      console.error('Error searching tenants:', error);
      throw error;
    }
  }

  async getTenantsByProperty(propertyId) {
    try {
      return await db.query(this.storeName, 'propertyId', propertyId);
    } catch (error) {
      console.error('Error getting tenants by property:', error);
      return [];
    }
  }

  async getTenantStats() {
    try {
      const tenants = await this.getAllTenants();
      
      const stats = {
        totalTenants: tenants.length,
        activeTenants: tenants.filter(t => t.status === 'Active').length,
        inactiveTenants: tenants.filter(t => t.status === 'Inactive').length,
        verifiedTenants: tenants.filter(t => t.accountStatus === 'Verified').length,
        unverifiedTenants: tenants.filter(t => t.accountStatus === 'Unverified').length,
        totalRentCollected: tenants.reduce((sum, t) => sum + (t.totalRentPaid || 0), 0),
        totalOutstanding: tenants.reduce((sum, t) => sum + (t.outstandingBalance || 0), 0),
        averageRentPerTenant: 0
      };
      
      if (stats.activeTenants > 0) {
        stats.averageRentPerTenant = stats.totalRentCollected / stats.activeTenants;
      }
      
      return stats;
    } catch (error) {
      console.error('Error getting tenant stats:', error);
      throw error;
    }
  }

  async addTenantPayment(tenantId, paymentData) {
    try {
      const payment = await db.add('transactions', {
        tenantId,
        type: 'payment',
        amount: paymentData.amount,
        date: paymentData.date || new Date().toISOString().split('T')[0],
        description: paymentData.description || 'Rent payment',
        paymentMethod: paymentData.paymentMethod || 'Unknown',
        status: paymentData.status || 'Completed',
        propertyId: paymentData.propertyId,
        leaseId: paymentData.leaseId
      });

      // Update tenant's total rent paid
      const tenant = await this.getTenantById(tenantId);
      if (tenant) {
        await this.updateTenant(tenantId, {
          totalRentPaid: (tenant.totalRentPaid || 0) + paymentData.amount,
          outstandingBalance: Math.max(0, (tenant.outstandingBalance || 0) - paymentData.amount)
        });
      }

      return payment;
    } catch (error) {
      console.error('Error adding tenant payment:', error);
      throw error;
    }
  }
}

export default new TenantService();
