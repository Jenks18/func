// Database service using IndexedDB for local storage
// With backup sync capability to Supabase

import { v4 as uuidv4 } from 'uuid';

class DatabaseService {
  constructor() {
    this.db = null;
    this.dbName = 'JumbaJotDB';
    this.version = 1;
    this.isInitialized = false;
  }

  async init() {
    if (this.isInitialized) return this.db;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => {
        reject(new Error('Failed to open database'));
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;
        this.isInitialized = true;
        console.log('Database initialized successfully');
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        this.createSchema(db);
      };
    });
  }

  createSchema(db) {
    // Properties table
    if (!db.objectStoreNames.contains('properties')) {
      const propertiesStore = db.createObjectStore('properties', { keyPath: 'id' });
      propertiesStore.createIndex('name', 'name', { unique: false });
      propertiesStore.createIndex('address', 'address', { unique: false });
      propertiesStore.createIndex('type', 'type', { unique: false });
      propertiesStore.createIndex('status', 'status', { unique: false });
    }

    // Tenants table
    if (!db.objectStoreNames.contains('tenants')) {
      const tenantsStore = db.createObjectStore('tenants', { keyPath: 'id' });
      tenantsStore.createIndex('name', 'name', { unique: false });
      tenantsStore.createIndex('email', 'email', { unique: true });
      tenantsStore.createIndex('phone', 'phone', { unique: false });
      tenantsStore.createIndex('status', 'status', { unique: false });
      tenantsStore.createIndex('propertyId', 'propertyId', { unique: false });
    }

    // Leases table
    if (!db.objectStoreNames.contains('leases')) {
      const leasesStore = db.createObjectStore('leases', { keyPath: 'id' });
      leasesStore.createIndex('tenantId', 'tenantId', { unique: false });
      leasesStore.createIndex('propertyId', 'propertyId', { unique: false });
      leasesStore.createIndex('status', 'status', { unique: false });
      leasesStore.createIndex('startDate', 'startDate', { unique: false });
      leasesStore.createIndex('endDate', 'endDate', { unique: false });
    }

    // Units table (for multi-unit properties)
    if (!db.objectStoreNames.contains('units')) {
      const unitsStore = db.createObjectStore('units', { keyPath: 'id' });
      unitsStore.createIndex('propertyId', 'propertyId', { unique: false });
      unitsStore.createIndex('unitNumber', 'unitNumber', { unique: false });
      unitsStore.createIndex('status', 'status', { unique: false });
    }

    // Income/Transactions table
    if (!db.objectStoreNames.contains('transactions')) {
      const transactionsStore = db.createObjectStore('transactions', { keyPath: 'id' });
      transactionsStore.createIndex('tenantId', 'tenantId', { unique: false });
      transactionsStore.createIndex('propertyId', 'propertyId', { unique: false });
      transactionsStore.createIndex('leaseId', 'leaseId', { unique: false });
      transactionsStore.createIndex('type', 'type', { unique: false });
      transactionsStore.createIndex('date', 'date', { unique: false });
      transactionsStore.createIndex('status', 'status', { unique: false });
    }

    // Expenses table
    if (!db.objectStoreNames.contains('expenses')) {
      const expensesStore = db.createObjectStore('expenses', { keyPath: 'id' });
      expensesStore.createIndex('propertyId', 'propertyId', { unique: false });
      expensesStore.createIndex('category', 'category', { unique: false });
      expensesStore.createIndex('date', 'date', { unique: false });
      expensesStore.createIndex('vendor', 'vendor', { unique: false });
    }

    console.log('Database schema created successfully');
  }

  // Generic CRUD operations
  async add(storeName, data) {
    await this.init();
    const id = data.id || uuidv4();
    const timestamp = new Date().toISOString();
    
    const record = {
      ...data,
      id,
      createdAt: timestamp,
      updatedAt: timestamp
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.add(record);

      request.onsuccess = () => {
        console.log(`Added to ${storeName}:`, record);
        resolve(record);
      };

      request.onerror = () => {
        reject(new Error(`Failed to add to ${storeName}`));
      };
    });
  }

  async update(storeName, id, data) {
    await this.init();
    const existing = await this.getById(storeName, id);
    if (!existing) {
      throw new Error(`Record with id ${id} not found in ${storeName}`);
    }

    const updated = {
      ...existing,
      ...data,
      id,
      updatedAt: new Date().toISOString()
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(updated);

      request.onsuccess = () => {
        console.log(`Updated in ${storeName}:`, updated);
        resolve(updated);
      };

      request.onerror = () => {
        reject(new Error(`Failed to update ${storeName}`));
      };
    });
  }

  async getById(storeName, id) {
    await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(id);

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(new Error(`Failed to get from ${storeName}`));
      };
    });
  }

  async getAll(storeName) {
    await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(new Error(`Failed to get all from ${storeName}`));
      };
    });
  }

  async delete(storeName, id) {
    await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(id);

      request.onsuccess = () => {
        console.log(`Deleted from ${storeName}:`, id);
        resolve(true);
      };

      request.onerror = () => {
        reject(new Error(`Failed to delete from ${storeName}`));
      };
    });
  }

  async query(storeName, indexName, value) {
    await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const index = store.index(indexName);
      const request = index.getAll(value);

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(new Error(`Failed to query ${storeName} by ${indexName}`));
      };
    });
  }

  // Seed initial data
  async seedInitialData() {
    console.log('Seeding initial data...');
    
    // Check if data already exists
    const existingProperties = await this.getAll('properties');
    if (existingProperties.length > 0) {
      console.log('Data already exists, skipping seed');
      return;
    }

    // Seed properties
    const properties = [
      {
        name: '9600 Universal Boulevard',
        address: '9600 Universal Boulevard, Orlando, Florida 32819',
        type: 'Single Family',
        units: 1,
        totalMonthlyRent: 2500.00,
        status: 'Occupied',
        purchasePrice: 350000,
        purchaseDate: '2020-01-15',
        description: 'Beautiful single-family home near Universal Studios'
      },
      {
        name: '605 Race Street',
        address: '605 Race Street, Cincinnati, Ohio 45202',
        type: 'Apartment Building',
        units: 4,
        totalMonthlyRent: 4800.00,
        status: 'Partially Occupied',
        purchasePrice: 280000,
        purchaseDate: '2019-06-20',
        description: 'Multi-unit apartment building in downtown Cincinnati'
      },
      {
        name: 'Jefferson Ave Apartments',
        address: '3336 Jefferson Ave, Cincinnati, Ohio 45220',
        type: 'Apartment Building',
        units: 6,
        totalMonthlyRent: 7200.00,
        status: 'Occupied',
        purchasePrice: 420000,
        purchaseDate: '2021-03-10',
        description: 'Modern apartment complex with amenities'
      }
    ];

    for (const property of properties) {
      await this.add('properties', property);
    }

    console.log('Initial data seeded successfully');
  }
}

// Create singleton instance
const db = new DatabaseService();

export default db;
