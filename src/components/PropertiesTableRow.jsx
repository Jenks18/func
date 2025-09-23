import React from 'react';
import AddressCell from './properties/AddressCell';

const PropertiesTableRow = ({ property, index }) => (
  <div style={{
    display: 'grid',
    gridTemplateColumns: '240px 260px 100px 120px 160px 100px 140px',
    padding: '12px 16px',
    borderBottom: '1px solid #f3f4f6',
    alignItems: 'center',
    cursor: 'pointer',
    transition: 'background-color 0.15s ease'
  }}
    onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
    onMouseLeave={e => e.currentTarget.style.background = 'white'}
  >
    {/* Property/Unit */}
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={{
        width: '32px',
        height: '32px',
        background: index === 0 ? '#10b981' : index === 1 ? '#3b82f6' : index === 2 ? '#f59e0b' : '#6b7280',
        borderRadius: '6px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '12px',
        color: 'white',
        fontWeight: '600'
      }}>
        {property.name.split(' ')[0].charAt(0)}{property.name.split(' ')[1]?.charAt(0) || ''}
      </div>
      <div>
        <div style={{ color: '#1f2937', fontWeight: '500', fontSize: '13px', marginBottom: '2px' }}>{property.name}</div>
        <div style={{ fontSize: '11px', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '4px' }}>
          {property.units} Units <span style={{ fontSize: '8px' }}>▼</span>
        </div>
      </div>
    </div>
    {/* Address */}
    <div style={{ width: '200px', overflow: 'hidden' }}>
      <AddressCell address={property.address} />
    </div>
    {/* Rent */}
    <div style={{ color: '#1f2937', fontSize: '13px', fontWeight: '500' }}>
      ${property.rent.toLocaleString()}
    </div>
    {/* Amount Overdue */}
    <div style={{ color: property.amountOverdue > 0 ? '#dc2626' : '#6b7280', fontSize: '13px', fontWeight: property.amountOverdue > 0 ? '500' : 'normal' }}>
      ${property.amountOverdue.toLocaleString()}
    </div>
    {/* 90-Day Lease Expiration */}
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={{ width: '60px', height: '6px', background: '#f3f4f6', borderRadius: '3px', overflow: 'hidden' }}>
        <div style={{
          width: property.status === 'expiring' ? '80%' : property.status === 'occupied' ? '40%' : '0%',
          height: '100%',
          background: property.status === 'expiring' ? '#ef4444' : '#3b82f6',
          borderRadius: '3px'
        }} />
      </div>
      <span style={{ fontSize: '11px', color: property.status === 'expiring' ? '#dc2626' : '#10b981', fontWeight: '500' }}>
        {property.leaseExpiration === '-' ? 'Occupied' : property.leaseExpiration}
      </span>
    </div>
    {/* Occupied */}
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        background: `conic-gradient(#10b981 0deg ${property.occupied * 3.6}deg, #f3f4f6 ${property.occupied * 3.6}deg 360deg)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }}>
        <div style={{
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          background: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '9px',
          fontWeight: '600',
          color: '#1f2937'
        }}>
          {property.occupied}%
        </div>
      </div>
    </div>
    {/* Open Maintenance */}
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      <span style={{ color: property.openMaintenance > 0 ? '#dc2626' : '#6b7280', fontSize: '13px', fontWeight: property.openMaintenance > 0 ? '500' : 'normal' }}>
        🔧 - {property.openMaintenance}
      </span>
    </div>
  </div>
);

export default PropertiesTableRow;
