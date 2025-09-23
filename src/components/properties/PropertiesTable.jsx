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

const PropertiesTable = ({ propertiesData, handleSort, sortColumn, sortOrder }) => (
  <div style={{overflow: 'auto', borderRadius: '8px', background: 'white', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.1)'}}>
    <table style={tableStyle}>
      <PropertiesTableHeader handleSort={handleSort} sortColumn={sortColumn} sortOrder={sortOrder} />
      <tbody>
        {propertiesData.map((property, index) => (
          <PropertiesTableRow key={property.id} property={property} index={index} />
        ))}
      </tbody>
    </table>
  </div>
);

export default PropertiesTable;
