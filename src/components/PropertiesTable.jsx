import React from 'react';
import PropertiesTableHeader from './properties/PropertiesTableHeader';
import PropertiesTableRow from './properties/PropertiesTableRow';

const PropertiesTable = ({ propertiesData, handleSort }) => (
  <div style={{
    background: 'white',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
    overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  }}>
    <PropertiesTableHeader handleSort={handleSort} />
    {propertiesData.map((property, index) => (
      <PropertiesTableRow key={property.id} property={property} index={index} />
    ))}
  </div>
);

export default PropertiesTable;
