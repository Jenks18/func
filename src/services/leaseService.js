import db from './database.js';

class LeaseService {
  constructor() {
    this.storeName = 'leases';
  }

  async createLease(leaseData) {
    try {
      const lease = await db.add(this.storeName, {
        ...leaseData,
        status: leaseData.status || 'Active',
        leaseType: leaseData.leaseType || 'Standard',
        securityDeposit: leaseData.securityDeposit || 0,
        petDeposit: leaseData.petDeposit || 0,
        monthlyRent: leaseData.monthlyRent || 0,
        lateFeesPolicy: leaseData.lateFeesPolicy || {},
        renewalOptions: leaseData.renewalOptions || {},
        specialTerms: leaseData.specialTerms || [],
        documents: leaseData.documents || [],
        signatures: leaseData.signatures || {}
      });
      
      // Update property and unit status
      if (lease.propertyId && lease.unitId) {
        await this.updateUnitStatus(lease.unitId, 'Occupied');
      }
      
      // Update tenant's property association
      if (lease.tenantId && lease.propertyId) {
        await db.update('tenants', lease.tenantId, { 
          propertyId: lease.propertyId,
          unitId: lease.unitId 
        });
      }
      
      return lease;
    } catch (error) {
      console.error('Error creating lease:', error);
      throw error;
    }
  }

  async updateUnitStatus(unitId, status) {
    try {
      await db.update('units', unitId, { status });
    } catch (error) {
      console.error('Error updating unit status:', error);
    }
  }

  async getAllLeases() {
    try {
      const leases = await db.getAll(this.storeName);
      
      // Get additional information for each lease
      const leasesWithDetails = await Promise.all(
        leases.map(async (lease) => {
          const tenant = await this.getLeaseTenant(lease.tenantId);
          const property = await this.getLeaseProperty(lease.propertyId);
          const unit = await this.getLeaseUnit(lease.unitId);
          const payments = await this.getLeasePayments(lease.id);
          
          return {
            ...lease,
            tenant,
            property,
            unit,
            payments,
            totalPayments: payments.reduce((sum, p) => sum + p.amount, 0),
            lastPaymentDate: payments.length > 0 ? payments[0].date : null,
            isExpiringSoon: this.isLeaseExpiringSoon(lease.endDate),
            daysUntilExpiry: this.getDaysUntilExpiry(lease.endDate)
          };
        })
      );
      
      return leasesWithDetails;
    } catch (error) {
      console.error('Error getting leases:', error);
      throw error;
    }
  }

  async getLeaseById(id) {
    try {
      const lease = await db.getById(this.storeName, id);
      if (lease) {
        const tenant = await this.getLeaseTenant(lease.tenantId);
        const property = await this.getLeaseProperty(lease.propertyId);
        const unit = await this.getLeaseUnit(lease.unitId);
        const payments = await this.getLeasePayments(id);
        const expenses = await this.getLeaseExpenses(lease.propertyId);
        
        return {
          ...lease,
          tenant,
          property,
          unit,
          payments,
          expenses,
          totalPayments: payments.reduce((sum, p) => sum + p.amount, 0),
          totalExpenses: expenses.reduce((sum, e) => sum + e.amount, 0),
          netIncome: payments.reduce((sum, p) => sum + p.amount, 0) - expenses.reduce((sum, e) => sum + e.amount, 0),
          isExpiringSoon: this.isLeaseExpiringSoon(lease.endDate),
          daysUntilExpiry: this.getDaysUntilExpiry(lease.endDate)
        };
      }
      return null;
    } catch (error) {
      console.error('Error getting lease:', error);
      throw error;
    }
  }

  async getLeaseTenant(tenantId) {
    if (!tenantId) return null;
    try {
      return await db.getById('tenants', tenantId);
    } catch (error) {
      console.error('Error getting lease tenant:', error);
      return null;
    }
  }

  async getLeaseProperty(propertyId) {
    if (!propertyId) return null;
    try {
      return await db.getById('properties', propertyId);
    } catch (error) {
      console.error('Error getting lease property:', error);
      return null;
    }
  }

  async getLeaseUnit(unitId) {
    if (!unitId) return null;
    try {
      return await db.getById('units', unitId);
    } catch (error) {
      console.error('Error getting lease unit:', error);
      return null;
    }
  }

  async getLeasePayments(leaseId) {
    try {
      const payments = await db.query('transactions', 'leaseId', leaseId);
      return payments
        .filter(transaction => transaction.type === 'payment')
        .sort((a, b) => new Date(b.date) - new Date(a.date));
    } catch (error) {
      console.error('Error getting lease payments:', error);
      return [];
    }
  }

  async getLeaseExpenses(propertyId) {
    try {
      return await db.query('expenses', 'propertyId', propertyId);
    } catch (error) {
      console.error('Error getting lease expenses:', error);
      return [];
    }
  }

  async updateLease(id, updates) {
    try {
      return await db.update(this.storeName, id, updates);
    } catch (error) {
      console.error('Error updating lease:', error);
      throw error;
    }
  }

  async terminateLease(id, terminationDate, reason) {
    try {
      const lease = await this.getLeaseById(id);
      if (!lease) throw new Error('Lease not found');

      const updatedLease = await this.updateLease(id, {
        status: 'Terminated',
        terminationDate,
        terminationReason: reason,
        actualEndDate: terminationDate
      });

      // Update unit status back to available
      if (lease.unitId) {
        await this.updateUnitStatus(lease.unitId, 'Available');
      }

      // Optionally update tenant status
      if (lease.tenantId) {
        await db.update('tenants', lease.tenantId, { 
          status: 'Former',
          propertyId: null,
          unitId: null 
        });
      }

      return updatedLease;
    } catch (error) {
      console.error('Error terminating lease:', error);
      throw error;
    }
  }

  async renewLease(id, renewalData) {
    try {
      const currentLease = await this.getLeaseById(id);
      if (!currentLease) throw new Error('Lease not found');

      // Create new lease for renewal
      const newLease = await this.createLease({
        ...currentLease,
        id: undefined, // Let it generate a new ID
        startDate: renewalData.startDate,
        endDate: renewalData.endDate,
        monthlyRent: renewalData.monthlyRent || currentLease.monthlyRent,
        status: 'Active',
        parentLeaseId: id,
        renewalNumber: (currentLease.renewalNumber || 0) + 1
      });

      // Mark old lease as completed
      await this.updateLease(id, {
        status: 'Completed',
        renewalLeaseId: newLease.id
      });

      return newLease;
    } catch (error) {
      console.error('Error renewing lease:', error);
      throw error;
    }
  }

  async getActiveLeases() {
    try {
      const allLeases = await this.getAllLeases();
      return allLeases.filter(lease => lease.status === 'Active');
    } catch (error) {
      console.error('Error getting active leases:', error);
      return [];
    }
  }

  async getExpiringSoonLeases(days = 30) {
    try {
      const allLeases = await this.getAllLeases();
      return allLeases.filter(lease => 
        lease.status === 'Active' && 
        this.getDaysUntilExpiry(lease.endDate) <= days &&
        this.getDaysUntilExpiry(lease.endDate) > 0
      );
    } catch (error) {
      console.error('Error getting expiring leases:', error);
      return [];
    }
  }

  isLeaseExpiringSoon(endDate, days = 30) {
    const expiry = new Date(endDate);
    const today = new Date();
    const daysUntil = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    return daysUntil <= days && daysUntil > 0;
  }

  getDaysUntilExpiry(endDate) {
    const expiry = new Date(endDate);
    const today = new Date();
    return Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
  }

  async getLeaseStats() {
    try {
      const leases = await this.getAllLeases();
      
      const stats = {
        totalLeases: leases.length,
        activeLeases: leases.filter(l => l.status === 'Active').length,
        expiredLeases: leases.filter(l => l.status === 'Expired').length,
        terminatedLeases: leases.filter(l => l.status === 'Terminated').length,
        expiringSoon: leases.filter(l => l.isExpiringSoon).length,
        totalMonthlyRent: leases
          .filter(l => l.status === 'Active')
          .reduce((sum, l) => sum + l.monthlyRent, 0),
        averageLeaseLength: 0,
        totalSecurityDeposits: leases.reduce((sum, l) => sum + (l.securityDeposit || 0), 0)
      };
      
      // Calculate average lease length for active leases
      const activeLeases = leases.filter(l => l.status === 'Active');
      if (activeLeases.length > 0) {
        const totalMonths = activeLeases.reduce((sum, lease) => {
          const start = new Date(lease.startDate);
          const end = new Date(lease.endDate);
          const months = (end.getFullYear() - start.getFullYear()) * 12 + 
                        (end.getMonth() - start.getMonth());
          return sum + months;
        }, 0);
        stats.averageLeaseLength = totalMonths / activeLeases.length;
      }
      
      return stats;
    } catch (error) {
      console.error('Error getting lease stats:', error);
      throw error;
    }
  }

  async searchLeases(searchTerm) {
    try {
      const allLeases = await this.getAllLeases();
      const searchLower = searchTerm.toLowerCase();
      
      return allLeases.filter(lease => 
        lease.tenant?.firstName?.toLowerCase().includes(searchLower) ||
        lease.tenant?.lastName?.toLowerCase().includes(searchLower) ||
        lease.property?.name?.toLowerCase().includes(searchLower) ||
        lease.unit?.unitNumber?.includes(searchTerm) ||
        lease.status?.toLowerCase().includes(searchLower)
      );
    } catch (error) {
      console.error('Error searching leases:', error);
      throw error;
    }
  }
}

export default new LeaseService();
