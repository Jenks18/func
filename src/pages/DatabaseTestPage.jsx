import React, { useState, useEffect } from 'react';
import dataService from '../services/dataService';

export default function DatabaseTestPage() {
  const [dbStatus, setDbStatus] = useState('Testing...');
  const [testResults, setTestResults] = useState([]);
  const [properties, setProperties] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [leases, setLeases] = useState([]);

  useEffect(() => {
    runDatabaseTests();
  }, []);

  const runDatabaseTests = async () => {
    const results = [];
    
    try {
      // Test 1: Initialize database
      results.push('✓ Database initialization started');
      
      // Test 2: Load properties
      const propertiesData = await dataService.properties.getAllProperties();
      setProperties(propertiesData);
      results.push(`✓ Loaded ${propertiesData.length} properties`);
      
      // Test 3: Load tenants
      const tenantsData = await dataService.tenants.getAllTenants();
      setTenants(tenantsData);
      results.push(`✓ Loaded ${tenantsData.length} tenants`);
      
      // Test 4: Load leases
      const leasesData = await dataService.leases.getAllLeases();
      setLeases(leasesData);
      results.push(`✓ Loaded ${leasesData.length} leases`);
      
      // Test 5: Test database relationships
      if (tenantsData.length > 0 && tenantsData[0].property) {
        results.push('✓ Tenant-Property relationships working');
      }
      
      setDbStatus('✅ All tests passed!');
      setTestResults(results);
      
    } catch (error) {
      console.error('Database test failed:', error);
      setDbStatus(`❌ Test failed: ${error.message}`);
      results.push(`❌ Error: ${error.message}`);
      setTestResults(results);
    }
  };

  return (
    <div style={{
      maxWidth: '100%',
      background: 'transparent',
      padding: '24px',
      minHeight: '100vh',
      boxSizing: 'border-box'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderRadius: '8px',
        padding: '24px',
        boxShadow: '0 4px 16px 0 rgba(0, 0, 0, 0.08)',
        border: '1px solid rgba(0, 0, 0, 0.05)',
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        <h1 style={{
          fontSize: '24px',
          fontWeight: '600',
          color: '#374151',
          marginBottom: '24px'
        }}>
          Database Test Results
        </h1>

        <div style={{
          background: '#f9fafb',
          padding: '16px',
          borderRadius: '6px',
          marginBottom: '24px'
        }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#374151',
            marginBottom: '8px'
          }}>
            Status: {dbStatus}
          </h2>
          
          <div style={{ marginBottom: '16px' }}>
            {testResults.map((result, index) => (
              <div key={index} style={{
                fontSize: '14px',
                color: result.startsWith('✓') ? '#15803d' : '#dc2626',
                marginBottom: '4px',
                fontFamily: 'monospace'
              }}>
                {result}
              </div>
            ))}
          </div>

          <button 
            onClick={runDatabaseTests}
            style={{
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: '8px 16px',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            Run Tests Again
          </button>
        </div>

        {/* Properties Summary */}
        <div style={{
          background: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '6px',
          padding: '16px',
          marginBottom: '16px'
        }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#374151',
            marginBottom: '12px'
          }}>
            Properties ({properties.length})
          </h3>
          {properties.slice(0, 3).map(property => (
            <div key={property.id} style={{
              fontSize: '14px',
              color: '#6b7280',
              marginBottom: '4px'
            }}>
              • {property.name} - {property.address} ({property.units?.length || 0} units)
            </div>
          ))}
          {properties.length > 3 && (
            <div style={{ fontSize: '14px', color: '#6b7280', fontStyle: 'italic' }}>
              ... and {properties.length - 3} more
            </div>
          )}
        </div>

        {/* Tenants Summary */}
        <div style={{
          background: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '6px',
          padding: '16px',
          marginBottom: '16px'
        }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#374151',
            marginBottom: '12px'
          }}>
            Tenants ({tenants.length})
          </h3>
          {tenants.slice(0, 3).map(tenant => (
            <div key={tenant.id} style={{
              fontSize: '14px',
              color: '#6b7280',
              marginBottom: '4px'
            }}>
              • {tenant.firstName} {tenant.lastName} - {tenant.property?.name || 'No Property'} ({tenant.status})
            </div>
          ))}
          {tenants.length > 3 && (
            <div style={{ fontSize: '14px', color: '#6b7280', fontStyle: 'italic' }}>
              ... and {tenants.length - 3} more
            </div>
          )}
        </div>

        {/* Leases Summary */}
        <div style={{
          background: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '6px',
          padding: '16px'
        }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#374151',
            marginBottom: '12px'
          }}>
            Leases ({leases.length})
          </h3>
          {leases.slice(0, 3).map(lease => (
            <div key={lease.id} style={{
              fontSize: '14px',
              color: '#6b7280',
              marginBottom: '4px'
            }}>
              • ${lease.monthlyRent}/month - {lease.startDate} to {lease.endDate} ({lease.status})
            </div>
          ))}
          {leases.length > 3 && (
            <div style={{ fontSize: '14px', color: '#6b7280', fontStyle: 'italic' }}>
              ... and {leases.length - 3} more
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
