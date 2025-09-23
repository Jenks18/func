import React from 'react';

const SidebarStats = () => (
  <div style={{
    width: '220px',
    display: 'flex',
    flexDirection: 'column',
    gap: '0',
    paddingTop: '80px'
  }}>
    {/* Stats Card */}
    <div style={{
      background: 'white',
      borderRadius: '8px',
      border: '1px solid #e5e7eb',
      padding: '20px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      marginBottom: '20px'
    }}>
      <div style={{ fontSize: '32px', fontWeight: '700', color: '#1f2937', marginBottom: '8px' }}>
        8 Units
      </div>
      <div style={{ 
        fontSize: '16px', 
        fontWeight: '600', 
        color: '#3b82f6', 
        marginBottom: '4px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <div style={{
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          background: `conic-gradient(#3b82f6 0deg ${62 * 3.6}deg, #e5e7eb ${62 * 3.6}deg 360deg)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            width: '14px',
            height: '14px',
            borderRadius: '50%',
            background: 'white'
          }}></div>
        </div>
        62% Total Occupancy
      </div>
      <div style={{ fontSize: '12px', color: '#6b7280' }}>
        12% Behind in Rent Payments
      </div>
    </div>

    {/* Quick Filter */}
    <div style={{
      background: 'white',
      borderRadius: '8px',
      border: '1px solid #e5e7eb',
      padding: '16px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    }}>
      <div style={{
        fontSize: '14px',
        fontWeight: '600',
        color: '#1f2937',
        marginBottom: '12px'
      }}>
        Quick Filter
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{
          padding: '12px',
          background: '#fef3c7',
          borderRadius: '6px',
          border: '1px solid #f59e0b',
          textAlign: 'center',
          borderLeft: '4px solid #f59e0b'
        }}>
          <div style={{ fontSize: '20px', fontWeight: '700', color: '#92400e' }}>3</div>
          <div style={{ fontSize: '11px', color: '#92400e' }}>Vacant</div>
        </div>
        <div style={{
          padding: '12px',
          background: '#fee2e2',
          borderRadius: '6px',
          border: '1px solid #f87171',
          textAlign: 'center',
          borderLeft: '4px solid #f87171'
        }}>
          <div style={{ fontSize: '20px', fontWeight: '700', color: '#dc2626' }}>1</div>
          <div style={{ fontSize: '11px', color: '#dc2626' }}>Overdue</div>
        </div>
        <div style={{
          padding: '12px',
          background: '#dbeafe',
          borderRadius: '6px',
          border: '1px solid #60a5fa',
          textAlign: 'center',
          borderLeft: '4px solid #60a5fa'
        }}>
          <div style={{ fontSize: '20px', fontWeight: '700', color: '#2563eb' }}>2</div>
          <div style={{ fontSize: '11px', color: '#2563eb' }}>Open Maintenance</div>
        </div>
      </div>
    </div>
  </div>
);

export default SidebarStats;
