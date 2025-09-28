import React, { useState, useEffect } from 'react';
// import dataService from '../services/dataService'; // Unused import
import NewPropertyPage from './NewPropertyPage';

export default function PropertiesPage() {
  // const [statusFilter, setStatusFilter] = useState('All Properties'); // Unused state
  const [propertiesData, setPropertiesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showNewProperty, setShowNewProperty] = useState(false);

  // Load properties data on component mount
  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      setLoading(true);
      
      // Use simple mock data for now
      const mockProperties = [
        {
          id: 1,
          name: "Sample Property",
          address: "123 Main St, City, State 12345",
          units: 4,
          totalMonthlyRent: 3200,
          availability: 2,
          tenants: 3,
          openMaintenance: 1,
          status: "Occupied"
        },
        {
          id: 2,
          name: "Another Property",
          address: "456 Oak Ave, City, State 67890",
          units: 6,
          totalMonthlyRent: 4800,
          availability: 1,
          tenants: 5,
          openMaintenance: 0,
          status: "Occupied"
        }
      ];
      
      setPropertiesData(mockProperties);
      setError(null);
    } catch (err) {
      console.error('Error loading properties:', err);
      setError('Failed to load properties data');
    } finally {
      setLoading(false);
    }
  };

  const handleNewProperty = () => {
    setShowNewProperty(true);
  };

  const handleBackFromNew = () => {
    setShowNewProperty(false);
  };

  const handlePropertyCreated = (newProperty) => {
    setPropertiesData(prev => [...prev, newProperty]);
    setShowNewProperty(false);
  };

  // Show New Property page if requested
  if (showNewProperty) {
    return (
      <NewPropertyPage 
        onBack={handleBackFromNew}
        onPropertyCreated={handlePropertyCreated}
      />
    );
  }

  if (loading) {
    return (
      <div style={{
        padding: '48px',
        textAlign: 'center',
        color: '#374151',
        backgroundColor: 'white',
        minHeight: '100vh'
      }}>
        <h2>Loading Properties...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        padding: '48px',
        textAlign: 'center',
        color: '#dc2626',
        backgroundColor: 'white',
        minHeight: '100vh'
      }}>
        <h2>Error: {error}</h2>
        <button 
          onClick={loadProperties}
          style={{
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            padding: '12px 24px',
            fontSize: '14px',
            cursor: 'pointer',
            marginTop: '16px'
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div style={{
      padding: '24px',
      backgroundColor: 'white',
      minHeight: '100vh',
      color: '#374151'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
        borderBottom: '1px solid #e5e7eb',
        paddingBottom: '16px'
      }}>
        <h1 style={{ 
          fontSize: '24px', 
          fontWeight: '600',
          margin: 0,
          color: '#1f2937'
        }}>
          Properties ({propertiesData.length})
        </h1>
        
        <button 
          onClick={handleNewProperty}
          style={{
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            padding: '10px 20px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          ➕ New Property
        </button>
      </div>

      <div style={{
        backgroundColor: '#f9fafb',
        borderRadius: '8px',
        padding: '20px'
      }}>
        {propertiesData.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ color: '#6b7280', fontSize: '16px' }}>
              No properties found. Click "New Property" to add one.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {propertiesData.map((property) => (
              <div key={property.id} style={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                padding: '16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <h3 style={{ 
                    margin: '0 0 4px 0',
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#1f2937'
                  }}>
                    {property.name}
                  </h3>
                  <p style={{ 
                    margin: '0 0 4px 0',
                    fontSize: '14px',
                    color: '#6b7280'
                  }}>
                    {property.address}
                  </p>
                  <p style={{ 
                    margin: 0,
                    fontSize: '12px',
                    color: '#9ca3af'
                  }}>
                    {property.units} units • ${property.totalMonthlyRent}/month
                  </p>
                </div>
                
                <div style={{ textAlign: 'right' }}>
                  <div style={{
                    backgroundColor: property.tenants > 0 ? '#dcfce7' : '#fee2e2',
                    color: property.tenants > 0 ? '#166534' : '#dc2626',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: '500',
                    marginBottom: '4px'
                  }}>
                    {property.tenants}/{property.units} Occupied
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>
                    {property.openMaintenance} maintenance requests
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
