import React from 'react';
import AddressCell from './AddressCell';


const tdStyle = {
  padding: '0 8px',
  borderBottom: '1px solid #f3f4f6',
  verticalAlign: 'middle',
  background: 'white',
  fontSize: '13px',
  height: '56px',
  textAlign: 'left',
  whiteSpace: 'nowrap',
};

const PropertiesTableRow = ({ property, index, expanded, onToggle }) => {
  return (
    <tr style={{ cursor: 'pointer', transition: 'background-color 0.15s ease' }}>
      {/* Property/Unit */}
      <td style={{ ...tdStyle, width: '180px', maxWidth: '180px', minWidth: '120px', padding: '0 4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
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
            fontWeight: '600',
            flexShrink: 0
          }}>
            {property.name.split(' ')[0].charAt(0)}{property.name.split(' ')[1]?.charAt(0) || ''}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{
              color: '#1f2937',
              fontWeight: '500',
              fontSize: '13px',
              marginBottom: '2px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: '120px',
              minWidth: 0
            }} title={property.name}>{property.name}</div>
            <div style={{ fontSize: '11px', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '4px', position: 'relative' }}>
              <button
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#6b7280',
                  fontSize: '11px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '2px',
                  padding: 0
                }}
                onClick={e => {
                  e.stopPropagation();
                  onToggle();
                }}
                aria-label="Show units"
              >
                {property.units} Units <span style={{ fontSize: '10px', marginLeft: '2px' }}>{expanded ? '▲' : '▼'}</span>
              </button>
            </div>
          </div>
        </div>
      </td>
      {/* Address */}
      <td style={{ ...tdStyle, width: '200px', overflow: 'hidden' }}>
        <AddressCell address={property.address} />
      </td>
      {/* Rent */}
      <td style={{ ...tdStyle, width: '100px', color: '#1f2937', fontWeight: '500' }}>
        ${property.rent.toLocaleString()}
      </td>
      {/* Amount Overdue */}
      <td style={{ ...tdStyle, width: '120px', color: property.amountOverdue > 0 ? '#dc2626' : '#6b7280', fontWeight: property.amountOverdue > 0 ? '500' : 'normal' }}>
        ${property.amountOverdue.toLocaleString()}
      </td>
      {/* 90-Day Lease Expiration */}
      <td style={{ ...tdStyle, width: '160px' }}>
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
      </td>
      {/* Occupied */}
      <td style={{ ...tdStyle, width: '100px' }}>
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
      </td>
      {/* Open Maintenance */}
      <td style={{ ...tdStyle, width: '140px' }}>
        <span style={{ color: property.openMaintenance > 0 ? '#dc2626' : '#6b7280', fontWeight: property.openMaintenance > 0 ? '500' : 'normal', display: 'flex', alignItems: 'center', gap: '6px' }}>
          🔧 - {property.openMaintenance}
        </span>
      </td>
    </tr>
  );
};

export default PropertiesTableRow;
