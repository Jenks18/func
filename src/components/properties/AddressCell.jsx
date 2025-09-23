import React from 'react';

// Only for address ellipsis + tooltip if truncated
const AddressCell = ({ address }) => {
  const [showTooltip, setShowTooltip] = React.useState(false);
  const spanRef = React.useRef(null);

  const handleMouseEnter = () => {
    if (spanRef.current && spanRef.current.scrollWidth > spanRef.current.offsetWidth) {
      setShowTooltip(true);
    }
  };
  const handleMouseLeave = () => setShowTooltip(false);

  return (
    <div style={{ position: 'relative', width: '210px' }}>
      <span
        ref={spanRef}
        style={{
          display: 'inline-block',
          maxWidth: '210px',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          color: '#374151',
          fontSize: '12px',
          cursor: 'default',
          verticalAlign: 'middle',
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {address}
      </span>
      {showTooltip && (
        <div style={{
          position: 'absolute',
          left: 0,
          top: '110%',
          background: 'white',
          color: '#1f2937',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          fontSize: '13px',
          padding: '8px 16px',
          zIndex: 9999,
          boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
          minWidth: '220px',
          maxWidth: '320px',
          whiteSpace: 'normal',
        }}>
          {address}
        </div>
      )}
    </div>
  );
};

export default AddressCell;
