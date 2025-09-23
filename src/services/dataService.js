import db from './database.js';
import propertyService from './propertyService.js';
import tenantService from './tenantService.js';
import leaseService from './leaseService.js';
import expenseService from './expenseService.js';

class DataService {
  constructor() {
    this.db = db;
    this.properties = propertyService;
    this.tenants = tenantService;
    this.leases = leaseService;
    this.expenses = expenseService;
    this.isInitialized = false;
  }

  async initialize() {
    if (this.isInitialized) return;

    try {
      // Initialize the database
      await this.db.init();
      
      // Seed initial data if needed
      await this.db.seedInitialData();
      
      // Create some sample tenants and leases if database is empty
      await this.seedSampleData();
      
      this.isInitialized = true;
      console.log('DataService initialized successfully');
    } catch (error) {
      console.error('Error initializing DataService:', error);
      throw error;
    }
  }

  async seedSampleData() {
    try {
      // Check if we already have tenants
      const existingTenants = await this.tenants.getAllTenants();
      if (existingTenants.length > 0) {
        console.log('Sample data already exists');
        return;
      }

      // Get properties to associate with tenants
      const properties = await this.properties.getAllProperties();
      if (properties.length === 0) {
        console.log('No properties found, cannot create sample tenants');
        return;
      }

      // Create sample tenants
      const sampleTenants = [
        {
          firstName: 'Andy',
          lastName: 'Bernard',
          email: 'andy.bernard@email.com',
          phone: '(555) 123-4567',
          propertyId: properties[0]?.id,
          status: 'Active',
          accountStatus: 'Unverified',
          tenantSince: '2023-03-01',
          emergencyContact: {
            name: 'Michael Scott',
            phone: '(555) 987-6543',
            relationship: 'Manager'
          }
        },
        {
          firstName: 'Dwight',
          lastName: 'Schrute',
          email: 'dwight.schrute@email.com',
          phone: '(555) 234-5678',
          propertyId: properties[1]?.id,
          status: 'Active',
          accountStatus: 'Unverified',
          tenantSince: '2023-01-15'
        },
        {
          firstName: 'Kevin',
          lastName: 'Malone',
          email: 'kevin.malone@email.com',
          phone: '(555) 345-6789',
          propertyId: properties[2]?.id,
          status: 'Active',
          accountStatus: 'Verified',
          tenantSince: '2022-12-01'
        },
        {
          firstName: 'Michael',
          lastName: 'Scott',
          email: 'michael.scott@email.com',
          phone: '(555) 456-7890',
          propertyId: properties[1]?.id,
          status: 'Active',
          accountStatus: 'Unverified',
          tenantSince: '2023-02-01'
        },
        {
          firstName: 'Oscar',
          lastName: 'Martinez',
          email: 'oscar.martinez@email.com',
          phone: '(555) 567-8901',
          propertyId: properties[2]?.id,
          status: 'Active',
          accountStatus: 'Unverified',
          tenantSince: '2023-04-15'
        }
      ];

      const createdTenants = [];
      for (const tenantData of sampleTenants) {
        const tenant = await this.tenants.createTenant(tenantData);
        createdTenants.push(tenant);
      }

      // Create sample leases for the tenants
      const sampleLeases = [
        {
          tenantId: createdTenants[0]?.id,
          propertyId: properties[0]?.id,
          startDate: '2023-03-01',
          endDate: '2024-02-29',
          monthlyRent: 2500,
          securityDeposit: 2500,
          status: 'Active',
          leaseType: 'Fixed Term'
        },
        {
          tenantId: createdTenants[1]?.id,
          propertyId: properties[1]?.id,
          startDate: '2023-01-15',
          endDate: '2024-01-14',
          monthlyRent: 1200,
          securityDeposit: 1200,
          status: 'Active',
          leaseType: 'Fixed Term'
        },
        {
          tenantId: createdTenants[2]?.id,
          propertyId: properties[2]?.id,
          startDate: '2022-12-01',
          endDate: '2023-11-30',
          monthlyRent: 1200,
          securityDeposit: 1200,
          status: 'Active',
          leaseType: 'Fixed Term'
        }
      ];

      for (const leaseData of sampleLeases) {
        if (leaseData.tenantId && leaseData.propertyId) {
          await this.leases.createLease(leaseData);
        }
      }

      // Create some sample payment transactions
      for (let i = 0; i < createdTenants.length; i++) {
        const tenant = createdTenants[i];
        if (tenant && sampleLeases[i]) {
          // Add a few months of payments
          for (let month = 0; month < 3; month++) {
            const paymentDate = new Date();
            paymentDate.setMonth(paymentDate.getMonth() - month);
            
            await this.tenants.addTenantPayment(tenant.id, {
              amount: sampleLeases[i].monthlyRent,
              date: paymentDate.toISOString().split('T')[0],
              description: `Rent payment - ${paymentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}`,
              paymentMethod: 'Bank Transfer',
              status: 'Completed',
              propertyId: tenant.propertyId
            });
          }
        }
      }

      console.log('Sample data seeded successfully');
    } catch (error) {
      console.error('Error seeding sample data:', error);
    }
  }

  async getDashboardStats() {
    try {
      const [propertyStats, tenantStats, leaseStats] = await Promise.all([
        this.properties.getPropertyStats(),
        this.tenants.getTenantStats(),
        this.leases.getLeaseStats()
      ]);

      return {
        properties: propertyStats,
        tenants: tenantStats,
        leases: leaseStats,
        summary: {
          totalRevenue: tenantStats.totalRentCollected,
          totalOutstanding: tenantStats.totalOutstanding,
          occupancyRate: propertyStats.occupancyRate,
          activeLeases: leaseStats.activeLeases,
          expiringSoon: leaseStats.expiringSoon
        }
      };
    } catch (error) {
      console.error('Error getting dashboard stats:', error);
      throw error;
    }
  }

  async exportData() {
    try {
      const [properties, tenants, leases] = await Promise.all([
        this.properties.getAllProperties(),
        this.tenants.getAllTenants(),
        this.leases.getAllLeases()
      ]);

      const exportData = {
        timestamp: new Date().toISOString(),
        properties,
        tenants,
        leases
      };

      return exportData;
    } catch (error) {
      console.error('Error exporting data:', error);
      throw error;
    }
  }

  async clearAllData() {
    try {
      const stores = ['properties', 'tenants', 'leases', 'units', 'transactions', 'expenses'];
      
      for (const storeName of stores) {
        const items = await this.db.getAll(storeName);
        for (const item of items) {
          await this.db.delete(storeName, item.id);
        }
      }
      
      console.log('All data cleared successfully');
    } catch (error) {
      console.error('Error clearing data:', error);
      throw error;
    }
  }

  // Utility method to check if data exists
  async hasData() {
    try {
      const [properties, tenants, leases] = await Promise.all([
        this.properties.getAllProperties(),
        this.tenants.getAllTenants(),
        this.leases.getAllLeases()
      ]);

      return {
        hasProperties: properties.length > 0,
        hasTenants: tenants.length > 0,
        hasLeases: leases.length > 0,
        totalRecords: properties.length + tenants.length + leases.length
      };
    } catch (error) {
      console.error('Error checking data:', error);
      return {
        hasProperties: false,
        hasTenants: false,
        hasLeases: false,
        totalRecords: 0
      };
    }
  }
}

export default new DataService();
