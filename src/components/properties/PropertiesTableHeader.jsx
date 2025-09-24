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
  background: 'white',
  color: '#222',
  fontSize: '12px',
  padding: '12px 16px',
  borderRadius: '8px',
  whiteSpace: 'pre-line',
  zIndex: 9999,
  boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
  pointerEvents: 'none',
  opacity: 0,
  transition: 'opacity 0.15s',
  maxWidth: '320px',
  left: 0,
  top: 0,
  border: '1px solid #e5e7eb',
  fontFamily: 'Inter, Helvetica Neue, Arial, sans-serif',
  lineHeight: 1.6
};

function SortableHeader({ label, onSort, tooltip, width, children, sortState }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ left: 0, top: 0 });
  const iconRef = React.useRef();

  // Custom tooltip for 90-Day Lease Expiration with colored indicators (all 4 colors)
  const customTooltip = label === "90-Day Lease Expiration" ? (
    <div style={{
      ...tooltipStyle,
      opacity: 1,
      left: tooltipPos.left,
      top: tooltipPos.top,
      pointerEvents: 'none',
      position: 'fixed',
    }}>
      <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:4}}>
        <span style={{display:'inline-block',width:12,height:12,borderRadius:'50%',background:'#10b981',marginRight:8,border:'1.5px solid #e5e7eb'}}></span>
        Lease not expiring in the next 90 Days
      </div>
      <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:4}}>
        <span style={{display:'inline-block',width:12,height:12,borderRadius:'50%',background:'#f59e0b',marginRight:8,border:'1.5px solid #e5e7eb'}}></span>
        Expiring lease in next 90 days with future lease starting.
      </div>
      <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:4}}>
        <span style={{display:'inline-block',width:12,height:12,borderRadius:'50%',background:'#ef4444',marginRight:8,border:'1.5px solid #e5e7eb'}}></span>
        Expiring lease with no lease within 30 days of expiration.
      </div>
      <div style={{display:'flex',alignItems:'center',gap:8}}>
        <span style={{display:'inline-block',width:12,height:12,borderRadius:'50%',background:'#6b7280',marginRight:8,border:'1.5px solid #e5e7eb'}}></span>
        Month to Month Lease
      </div>
    </div>
  ) : tooltip && (
    <span style={{ ...tooltipStyle, opacity: 1, left: tooltipPos.left, top: tooltipPos.top, pointerEvents: 'none', position: 'fixed' }}>{tooltip}</span>
  );

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
            {showTooltip && customTooltip}
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
        tooltip={
          `Lease not expiring in the next 90 Days\nExpiring lease in next 90 days with future lease starting.\nExpiring lease with no lease within 30 days of expiration.\nMonth to Month Lease`
        }
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
