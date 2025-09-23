import React from 'react';
import { useState } from 'react';
import InfoTooltip from './InfoTooltip';



const thStyle = {
  background: 'white',
  borderBottom: '1px solid #e5e7eb',
  fontSize: '13px',
  fontWeight: 400,
  color: '#1f2937',
  fontFamily: 'Inter, Helvetica Neue, Arial, sans-serif',
  height: '44px',
  userSelect: 'none',
  padding: '0 4px',
  textAlign: 'left',
  verticalAlign: 'middle',
  whiteSpace: 'nowrap',
  lineHeight: 1.2,
};

const sortIconStyle = {
  fontSize: '13px',
  color: '#b0b0b0',
  marginLeft: '2px',
  fontWeight: 700,
  lineHeight: 1,
  cursor: 'pointer',
  transition: 'color 0.15s',
  verticalAlign: 'middle',
};

const tooltipContainerStyle = {
  position: 'relative',
  display: 'inline-block',
};

const tooltipStyle = {
  position: 'fixed',
  background: '#222',
  color: 'white',
  fontSize: '12px',
  padding: '7px 12px',
  borderRadius: '6px',
  whiteSpace: 'pre-line',
  zIndex: 9999,
  boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
  pointerEvents: 'none',
  opacity: 0,
  transition: 'opacity 0.15s',
  maxWidth: '260px',
  left: 0,
  top: 0,
};

function SortableHeader({ label, onSort, tooltip, width, children, sortState }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ left: 0, top: 0 });
  const iconRef = React.useRef();

  const handleTooltip = (e) => {
    const rect = e.target.getBoundingClientRect();
    let left = rect.left + rect.width / 2;
    let top = rect.top - 8;
    // Clamp to viewport
    left = Math.max(8, Math.min(left, window.innerWidth - 8));
    top = Math.max(8, top);
    setTooltipPos({ left, top });
    setShowTooltip(true);
  };
  return (
    <th style={{ ...thStyle, width, minWidth: width, maxWidth: width, padding: '0 4px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0, position: 'relative' }}>
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 500 }}>{label}</span>
        <span
          style={{ ...sortIconStyle, color: sortState ? '#3b82f6' : '#b0b0b0' }}
          onClick={onSort}
          tabIndex={0}
          role="button"
          aria-label={`Sort by ${label}`}
        >
          {sortState === 'asc' ? '↑' : sortState === 'desc' ? '↓' : '↕'}
        </span>
        {tooltip && (
          <span
            style={tooltipContainerStyle}
            onMouseEnter={handleTooltip}
            onMouseLeave={() => setShowTooltip(false)}
            tabIndex={0}
            ref={iconRef}
          >
            <span style={{ color: '#b0b0b0', fontSize: '12px', marginLeft: '1px', cursor: 'pointer' }}>ⓘ</span>
            {showTooltip && (
              <span style={{ ...tooltipStyle, opacity: 1, left: tooltipPos.left, top: tooltipPos.top, pointerEvents: 'none', position: 'fixed' }}>{tooltip}</span>
            )}
          </span>
        )}
        {children}
      </div>
    </th>
  );
}


const PropertiesTableHeader = ({ handleSort, sortColumn, sortOrder }) => (
  <thead>
    <tr>
      <SortableHeader
        label="Property/Unit"
        onSort={() => handleSort('property')}
        tooltip="Shows property image and unit information."
        width="180px"
        sortState={sortColumn === 'property' ? sortOrder : null}
      />
      <SortableHeader
        label="Address"
        onSort={() => handleSort('address')}
        tooltip="Complete property address including city and state."
        width="200px"
        sortState={sortColumn === 'address' ? sortOrder : null}
      />
      <SortableHeader
        label="Rent"
        onSort={() => handleSort('rent')}
        tooltip="Monthly rental rate for the property."
        width="100px"
        sortState={sortColumn === 'rent' ? sortOrder : null}
      />
      <SortableHeader
        label={<>Amount<br/>Overdue</>}
        onSort={() => handleSort('overdue')}
        tooltip={"Total amount of rent and fees that are past due."}
        width="90px"
        sortState={sortColumn === 'overdue' ? sortOrder : null}
      />
      <SortableHeader
        label="90-Day Lease Expiration"
        onSort={() => handleSort('expiration')}
        tooltip={"90-Day Lease Expiration Status\n• Green: Not expiring\n• Orange: Expiring with future lease\n• Red: Expiring, no future lease\n• Blue: Month to Month"}
        width="160px"
        sortState={sortColumn === 'expiration' ? sortOrder : null}
      />
      <SortableHeader
        label="Occupied"
        onSort={() => handleSort('occupied')}
        tooltip="Shows current occupancy with percentage indicator."
        width="100px"
        sortState={sortColumn === 'occupied' ? sortOrder : null}
      />
      <SortableHeader
        label="Open Maintenance"
        onSort={() => handleSort('maintenance')}
        tooltip="Number of open maintenance requests for this property."
        width="140px"
        sortState={sortColumn === 'maintenance' ? sortOrder : null}
      />
    </tr>
  </thead>
);

export default PropertiesTableHeader;
