import db from './database.js';

class PropertyService {
  constructor() {
    this.storeName = 'properties';
  }

  async createProperty(propertyData) {
    try {
      const property = await db.add(this.storeName, {
        ...propertyData,
        status: propertyData.status || 'Available',
        units: propertyData.units || 1,
        totalMonthlyRent: propertyData.totalMonthlyRent || 0
      });
      
      // Create units if it's a multi-unit property
      if (property.units > 1) {
        await this.createUnitsForProperty(property.id, property.units);
      }
      
      return property;
    } catch (error) {
      console.error('Error creating property:', error);
      throw error;
    }
  }

  async createUnitsForProperty(propertyId, numberOfUnits) {
    const unitPromises = [];
    for (let i = 1; i <= numberOfUnits; i++) {
      const unit = {
        propertyId,
        unitNumber: i.toString().padStart(3, '0'), // 001, 002, etc.
        status: 'Available',
        bedrooms: 1,
        bathrooms: 1,
        squareFeet: 800,
        monthlyRent: 0
      };
      unitPromises.push(db.add('units', unit));
    }
    return Promise.all(unitPromises);
  }

  async getAllProperties() {
    try {
      const properties = await db.getAll(this.storeName);
      
      // Get unit information for each property
      const propertiesWithUnits = await Promise.all(
        properties.map(async (property) => {
          const units = await this.getPropertyUnits(property.id);
          return {
            ...property,
            unitDetails: units,
            availableUnits: units.filter(unit => unit.status === 'Available').length,
            occupiedUnits: units.filter(unit => unit.status === 'Occupied').length
          };
        })
      );
      
      return propertiesWithUnits;
    } catch (error) {
      console.error('Error getting properties:', error);
      throw error;
    }
  }

  async getPropertyById(id) {
    try {
      const property = await db.getById(this.storeName, id);
      if (property) {
        const units = await this.getPropertyUnits(id);
        const tenants = await this.getPropertyTenants(id);
        return {
          ...property,
          units,
          tenants,
          availableUnits: units.filter(unit => unit.status === 'Available').length,
          occupiedUnits: units.filter(unit => unit.status === 'Occupied').length
        };
      }
      return null;
    } catch (error) {
      console.error('Error getting property:', error);
      throw error;
    }
  }

  async getPropertyUnits(propertyId) {
    try {
      return await db.query('units', 'propertyId', propertyId);
    } catch (error) {
      console.error('Error getting property units:', error);
      return [];
    }
  }

  async getPropertyTenants(propertyId) {
    try {
      return await db.query('tenants', 'propertyId', propertyId);
    } catch (error) {
      console.error('Error getting property tenants:', error);
      return [];
    }
  }

  async updateProperty(id, updates) {
    try {
      return await db.update(this.storeName, id, updates);
    } catch (error) {
      console.error('Error updating property:', error);
      throw error;
    }
  }

  async deleteProperty(id) {
    try {
      // Also delete associated units
      const units = await this.getPropertyUnits(id);
      for (const unit of units) {
        await db.delete('units', unit.id);
      }
      
      return await db.delete(this.storeName, id);
    } catch (error) {
      console.error('Error deleting property:', error);
      throw error;
    }
  }

  async getPropertyStats() {
    try {
      const properties = await this.getAllProperties();
      
      const stats = {
        totalProperties: properties.length,
        totalUnits: properties.reduce((sum, prop) => sum + prop.units, 0),
        totalAvailableUnits: properties.reduce((sum, prop) => sum + prop.availableUnits, 0),
        totalOccupiedUnits: properties.reduce((sum, prop) => sum + prop.occupiedUnits, 0),
        totalMonthlyRent: properties.reduce((sum, prop) => sum + prop.totalMonthlyRent, 0),
        averageRentPerUnit: 0,
        occupancyRate: 0
      };
      
      if (stats.totalUnits > 0) {
        stats.averageRentPerUnit = stats.totalMonthlyRent / stats.totalUnits;
        stats.occupancyRate = (stats.totalOccupiedUnits / stats.totalUnits) * 100;
      }
      
      return stats;
    } catch (error) {
      console.error('Error getting property stats:', error);
      throw error;
    }
  }

  async searchProperties(searchTerm) {
    try {
      const allProperties = await this.getAllProperties();
      const searchLower = searchTerm.toLowerCase();
      
      return allProperties.filter(property => 
        property.name.toLowerCase().includes(searchLower) ||
        property.address.toLowerCase().includes(searchLower) ||
        property.type.toLowerCase().includes(searchLower)
      );
    } catch (error) {
      console.error('Error searching properties:', error);
      throw error;
    }
  }
}

export default new PropertyService();
