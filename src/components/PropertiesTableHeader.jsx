import React from 'react';
import InfoTooltip from './properties/InfoTooltip';

const PropertiesTableHeader = ({ handleSort }) => (
  <div style={{
    display: 'grid',
    gridTemplateColumns: '220px 200px 100px 120px 160px 100px 140px',
    background: '#f9fafb',
    borderBottom: '1px solid #e5e7eb',
    padding: '0 16px',
    fontSize: '12px',
    fontWeight: 600,
    color: '#222',
    textTransform: 'uppercase',
    fontFamily: 'Inter, Helvetica Neue, Arial, sans-serif',
    letterSpacing: '0.04em',
    alignItems: 'center',
    height: '48px',
    userSelect: 'none',
    tableLayout: 'fixed'
  }}>
    {/* Property/Unit */}
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-start' }}>
      <span>Property/Unit</span>
      <button onClick={() => handleSort('property')} style={{ background: 'none', border: 'none', padding: 0, margin: 0, cursor: 'pointer', display: 'flex', alignItems: 'center' }} aria-label="Sort by Property/Unit">
        <span style={{ fontSize: '15px', color: '#b0b0b0', marginLeft: '2px', fontWeight: 700, lineHeight: 1 }}>↕</span>
      </button>
      <InfoTooltip text="Shows property image and unit information.">
        <span style={{ color: '#b0b0b0', fontSize: '13px', marginLeft: '2px' }}>ⓘ</span>
      </InfoTooltip>
    </div>
    {/* Address */}
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-start' }}>
      <span>Address</span>
      <button onClick={() => handleSort('address')} style={{ background: 'none', border: 'none', padding: 0, margin: 0, cursor: 'pointer', display: 'flex', alignItems: 'center' }} aria-label="Sort by Address">
        <span style={{ fontSize: '15px', color: '#b0b0b0', marginLeft: '2px', fontWeight: 700, lineHeight: 1 }}>↕</span>
      </button>
      <InfoTooltip text="Complete property address including city and state.">
        <span style={{ color: '#b0b0b0', fontSize: '13px', marginLeft: '2px' }}>ⓘ</span>
      </InfoTooltip>
    </div>
    {/* Rent */}
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-start' }}>
      <span>Rent</span>
      <button onClick={() => handleSort('rent')} style={{ background: 'none', border: 'none', padding: 0, margin: 0, cursor: 'pointer', display: 'flex', alignItems: 'center' }} aria-label="Sort by Rent">
        <span style={{ fontSize: '15px', color: '#b0b0b0', marginLeft: '2px', fontWeight: 700, lineHeight: 1 }}>↕</span>
      </button>
      <InfoTooltip text="Monthly rental rate for the property.">
        <span style={{ color: '#b0b0b0', fontSize: '13px', marginLeft: '2px' }}>ⓘ</span>
      </InfoTooltip>
    </div>
    {/* Amount Overdue */}
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-start' }}>
      <span>Amount Overdue</span>
      <button onClick={() => handleSort('overdue')} style={{ background: 'none', border: 'none', padding: 0, margin: 0, cursor: 'pointer', display: 'flex', alignItems: 'center' }} aria-label="Sort by Amount Overdue">
        <span style={{ fontSize: '15px', color: '#b0b0b0', marginLeft: '2px', fontWeight: 700, lineHeight: 1 }}>↕</span>
      </button>
      <InfoTooltip text="Total amount of rent and fees that are past due.">
        <span style={{ color: '#b0b0b0', fontSize: '13px', marginLeft: '2px' }}>ⓘ</span>
      </InfoTooltip>
    </div>
    {/* 90-Day Lease Expiration */}
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-start' }}>
      <span>90-Day Lease Expiration</span>
      <button onClick={() => handleSort('expiration')} style={{ background: 'none', border: 'none', padding: 0, margin: 0, cursor: 'pointer', display: 'flex', alignItems: 'center' }} aria-label="Sort by Lease Expiration">
        <span style={{ fontSize: '15px', color: '#b0b0b0', marginLeft: '2px', fontWeight: 700, lineHeight: 1 }}>↕</span>
      </button>
      <InfoTooltip text={<div style={{ padding: '12px 0' }}>
        <div style={{ padding: '8px 16px', fontWeight: '600', fontSize: '13px', borderBottom: '1px solid #f3f4f6', color: '#1f2937' }}>90-Day Lease Expiration Status</div>
        <div style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #f9fafb' }}>
          <span style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%', flexShrink: 0 }}></span>
          <span style={{ fontSize: '12px', color: '#374151' }}>Lease not expiring in the next 90 days</span>
        </div>
        <div style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #f9fafb' }}>
          <span style={{ width: '8px', height: '8px', background: '#f59e0b', borderRadius: '50%', flexShrink: 0 }}></span>
          <span style={{ fontSize: '12px', color: '#374151' }}>Expiring lease in next 90 days with future lease starting</span>
        </div>
        <div style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #f9fafb' }}>
          <span style={{ width: '8px', height: '8px', background: '#ef4444', borderRadius: '50%', flexShrink: 0 }}></span>
          <span style={{ fontSize: '12px', color: '#374151' }}>Expiring lease with no lease within 30 days of expiration</span>
        </div>
        <div style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '8px', height: '8px', background: '#3b82f6', borderRadius: '50%', flexShrink: 0 }}></span>
          <span style={{ fontSize: '12px', color: '#374151' }}>Month to Month Lease</span>
        </div>
      </div>}>
        <span style={{ color: '#b0b0b0', fontSize: '13px', marginLeft: '2px' }}>ⓘ</span>
      </InfoTooltip>
    </div>
    {/* Occupied */}
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-start' }}>
      <span>Occupied</span>
      <button onClick={() => handleSort('occupied')} style={{ background: 'none', border: 'none', padding: 0, margin: 0, cursor: 'pointer', display: 'flex', alignItems: 'center' }} aria-label="Sort by Occupied">
        <span style={{ fontSize: '15px', color: '#b0b0b0', marginLeft: '2px', fontWeight: 700, lineHeight: 1 }}>↕</span>
      </button>
      <InfoTooltip text="Shows current occupancy with percentage indicator.">
        <span style={{ color: '#b0b0b0', fontSize: '13px', marginLeft: '2px' }}>ⓘ</span>
      </InfoTooltip>
    </div>
    {/* Open Maintenance Tickets */}
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-start' }}>
      <span>Open Maintenance Tickets</span>
      <button onClick={() => handleSort('maintenance')} style={{ background: 'none', border: 'none', padding: 0, margin: 0, cursor: 'pointer', display: 'flex', alignItems: 'center' }} aria-label="Sort by Maintenance">
        <span style={{ fontSize: '15px', color: '#b0b0b0', marginLeft: '2px', fontWeight: 700, lineHeight: 1 }}>↕</span>
      </button>
      <InfoTooltip text="Number of open maintenance requests for this property.">
        <span style={{ color: '#b0b0b0', fontSize: '13px', marginLeft: '2px' }}>ⓘ</span>
      </InfoTooltip>
    </div>
  </div>
);

export default PropertiesTableHeader;
