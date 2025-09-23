import React from 'react';

const InfoTooltip = ({ text, children }) => {
  const [showTooltip, setShowTooltip] = React.useState(false);
  return (
    <div style={{ position: 'relative', display: 'inline-block', verticalAlign: 'middle' }}>
      <span
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        style={{ cursor: 'help', display: 'inline-flex', alignItems: 'center' }}
      >
        {children}
      </span>
      {showTooltip && (
        <div style={{
          position: 'fixed',
          zIndex: 9999,
          background: 'white',
          color: '#1f2937',
          borderRadius: '8px',
          fontSize: '13px',
          minWidth: '220px',
          maxWidth: '320px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
          padding: 0,
          marginTop: '8px',
          pointerEvents: 'auto',
          left: `${window.event?.clientX || 0}px`,
          top: `${window.event?.clientY ? window.event.clientY + 16 : 0}px`,
          transform: 'translate(-50%, 0)',
          transition: 'opacity 0.15s',
          opacity: 1
        }}>
          {typeof text === 'string' ? (
            <div style={{ padding: '12px 16px', wordBreak: 'break-word' }}>{text}</div>
          ) : (
            text
          )}
          <div style={{
            position: 'absolute',
            top: '-6px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 0,
            height: 0,
            borderLeft: '6px solid transparent',
            borderRight: '6px solid transparent',
            borderBottom: '6px solid white',
            zIndex: 10001
          }} />
        </div>
      )}
    </div>
  );
};

export default InfoTooltip;
