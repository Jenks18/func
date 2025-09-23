
import React, { useState, useEffect } from 'react';
import NewPropertyPage from './NewPropertyPage';
import PropertiesTable from '../components/properties/PropertiesTable';
import SidebarStats from '../components/SidebarStats';

export default function PropertiesPage() {
  const [propertiesData, setPropertiesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showNewProperty, setShowNewProperty] = useState(false);
  const [sortColumn, setSortColumn] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      setLoading(true);
      
      const mockProperties = [
        {
          id: 1,
          name: "605 Race Street",
          units: 2,
          address: "605 Race Street, Cincinnati, OH",
          rent: 2400.00,
          amountOverdue: 1200.00,
          leaseExpiration: "1",
          occupied: 100,
          openMaintenance: 1,
          status: "occupied"
        },
        {
          id: 2,
          name: "Jefferson Ave Apartments",
          units: 4,
          address: "3336 Jefferson Ave, Cincinnati, OH",
          rent: 2700.00,
          amountOverdue: 0.00,
          leaseExpiration: "2",
          occupied: 50,
          openMaintenance: 0,
          status: "occupied"
        },
        {
          id: 3,
          name: "Jefferson House",
          units: 1,
          address: "3280 Jefferson Ave, Cincinnati, OH",
          rent: 2500.00,
          amountOverdue: 0.00,
          leaseExpiration: "Expiring",
          occupied: 100,
          openMaintenance: 1,
          status: "expiring"
        },
        {
          id: 4,
          name: "Shiloh House",
          units: 1,
          address: "339 Shiloh St, Cincinnati, OH",
          rent: 0,
          amountOverdue: 0,
          leaseExpiration: "-",
          occupied: 0,
          openMaintenance: 0,
          status: "vacant"
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

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortOrder('asc');
    }
  };



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

  return (
    <div style={{
      backgroundColor: '#f8fafc',
      minHeight: '100vh',
      padding: '20px',
      display: 'flex',
      gap: '20px'
    }}>
      {/* Main Content Area */}
      <div style={{ flex: 1, maxWidth: 'calc(100% - 260px)' }}>
        {/* Header Section */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '20px'
        }}>
          <div style={{ flex: 1 }}>
            <h1 style={{ 
              fontSize: '24px', 
              fontWeight: '600',
              margin: '0 0 20px 0',
              color: '#1f2937'
            }}>
              Properties
            </h1>
          </div>
          <button 
            onClick={handleNewProperty}
            style={{
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: '10px 16px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            ⊕ New Property
          </button>
        </div>
        {/* Filters and Stats Row */}
        <div style={{
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
          marginBottom: '16px',
          gap: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '13px', color: '#6b7280' }}>🔽 Filters</span>
          </div>
          <span style={{ fontSize: '13px', color: '#6b7280' }}>
            Showing {propertiesData.length} of {propertiesData.length}
          </span>
          <span style={{ fontSize: '13px', color: '#6b7280' }}>
            Last updated: one min ago
          </span>
          <span style={{ fontSize: '13px', color: '#3b82f6', cursor: 'pointer' }}>🔄 Refresh</span>
          <span style={{ fontSize: '13px', color: '#3b82f6', cursor: 'pointer' }}>📤 Export</span>
        </div>
        {/* Properties Table (modular) */}
        <PropertiesTable
          propertiesData={propertiesData}
          handleSort={handleSort}
          sortColumn={sortColumn}
          sortOrder={sortOrder}
        />
      </div>
      {/* Right Sidebar (modular) */}
      <SidebarStats />
    </div>
  );
}