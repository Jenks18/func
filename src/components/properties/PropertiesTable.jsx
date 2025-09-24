import React from 'react';
import PropertiesTableHeader from './PropertiesTableHeader';
import PropertiesTableRow from './PropertiesTableRow';


const tableStyle = {
  width: '100%',
  background: 'white',
  borderRadius: '8px',
  border: '1px solid #e5e7eb',
  overflow: 'hidden',
  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  borderCollapse: 'separate',
  borderSpacing: 0,
  tableLayout: 'fixed',
};

import { useState } from 'react';

const PropertiesTable = ({ propertiesData, handleSort, sortColumn, sortOrder, onUnitClick }) => {
  const [expandedId, setExpandedId] = useState(null);
  const handleToggle = (id) => setExpandedId(expandedId === id ? null : id);
  return (
    <div style={{overflow: 'auto', borderRadius: '8px', background: 'white', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.1)'}}>
      <table style={tableStyle}>
        <PropertiesTableHeader handleSort={handleSort} sortColumn={sortColumn} sortOrder={sortOrder} />
        <tbody>
          {propertiesData.map((property, index) => (
            <>
              <PropertiesTableRow
                key={property.id}
                property={property}
                index={index}
                expanded={expandedId === property.id}
                onToggle={() => handleToggle(property.id)}
              />
              {expandedId === property.id && property.unitsList && property.unitsList.map((unit) => (
                <tr key={property.id + '-unit-' + unit.unit} style={{ background: 'white', height: 44, cursor: 'pointer' }} onClick={() => typeof onUnitClick === 'function' && onUnitClick(property, unit)}>
                  {/* Unit Name with icon, left-aligned, no underline */}
                  <td style={{ padding: '8px 8px', borderBottom: '1px solid #f3f4f6', fontSize: '14px', color: '#1f2937', fontWeight: 500, textAlign: 'left', verticalAlign: 'middle', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 18, height: 18, background: '#f3f4f6', borderRadius: 4, marginRight: 6, fontSize: 13, color: '#6b7280' }}>🏠</span>
                    {unit.unit}
                  </td>
                  {/* Address: blank for units */}
                  <td style={{ padding: '8px 8px', borderBottom: '1px solid #f3f4f6', fontSize: '14px', verticalAlign: 'middle' }}></td>
                  {/* Rent */}
                  <td style={{ padding: '8px 8px', borderBottom: '1px solid #f3f4f6', fontSize: '14px', color: '#1f2937', fontWeight: 500, verticalAlign: 'middle' }}>
                    ${unit.rent?.toLocaleString?.() ?? '-'}
                  </td>
                  {/* Amount Overdue */}
                  <td style={{ padding: '8px 8px', borderBottom: '1px solid #f3f4f6', fontSize: '14px', color: unit.overdue > 0 ? '#dc2626' : '#6b7280', fontWeight: unit.overdue > 0 ? '500' : 'normal', verticalAlign: 'middle' }}>
                    {unit.overdue > 0 ? (
                      <>
                        <span style={{ marginRight: 4 }}>$</span>{unit.overdue?.toLocaleString?.() ?? '-'}
                      </>
                    ) : (
                      <span style={{ color: '#6b7280' }}>-</span>
                    )}
                  </td>
                  {/* 90-Day Lease Expiration */}
                  <td style={{ padding: '8px 8px', borderBottom: '1px solid #f3f4f6', fontSize: '14px', verticalAlign: 'middle' }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      {unit.lease === 'Month to Month' && (
                        <span style={{ background: '#e0e7ff', color: '#2563eb', borderRadius: 4, padding: '2px 10px', fontWeight: 500, fontSize: 13, minWidth: 0 }}>Month to Month</span>
                      )}
                      {unit.lease === 'Not Expiring' && (
                        <span style={{ background: '#dcfce7', color: '#22c55e', borderRadius: 4, padding: '2px 10px', fontWeight: 500, fontSize: 13, minWidth: 0 }}>Not Expiring</span>
                      )}
                      {unit.lease === 'Expiring' && (
                        <span style={{ background: '#fee2e2', color: '#ef4444', borderRadius: 4, padding: '2px 10px', fontWeight: 500, fontSize: 13, minWidth: 0 }}>Expiring</span>
                      )}
                    </div>
                  </td>
                  {/* Occupied */}
                  <td style={{ padding: '8px 8px', borderBottom: '1px solid #f3f4f6', fontSize: '14px', verticalAlign: 'middle' }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      {unit.status === 'Occupied' && (
                        <span style={{ background: '#dcfce7', color: '#22c55e', borderRadius: 4, padding: '2px 10px', fontWeight: 500, fontSize: 13, minWidth: 0 }}>Occupied</span>
                      )}
                      {unit.status === 'Vacant' && (
                        <span style={{ background: '#fee2e2', color: '#ef4444', borderRadius: 4, padding: '2px 10px', fontWeight: 500, fontSize: 13, minWidth: 0 }}>Vacant</span>
                      )}
                    </div>
                  </td>
                  {/* Open Maintenance */}
                  <td style={{ padding: '8px 8px', borderBottom: '1px solid #f3f4f6', fontSize: '14px', verticalAlign: 'middle' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      {unit.maintenance > 0 ? (
                        <>
                          <span style={{ color: '#ef4444', fontWeight: 500, fontSize: 15 }}>🔧</span>
                          <span style={{ color: '#ef4444', fontWeight: 500, fontSize: 14 }}>- {unit.maintenance}</span>
                        </>
                      ) : (
                        <span style={{ color: '#6b7280' }}>-</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </>
          ))}
        </tbody>
      </table>
    </div>

  );
};

export default PropertiesTable;
