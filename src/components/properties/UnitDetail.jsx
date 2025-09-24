




export default function UnitDetail({ property, unit, onBack, allProperties, onUnitSelect }) {
  if (!property || !unit) return null;
  // Dummy values for demo
  const leaseStart = "July 1, 2024";
  const leaseType = unit.lease || "Month to Month";
  const daysLeft = 30;
  const tenant = { name: "Dwight Schrute", avatar: "https://randomuser.me/api/portraits/men/1.jpg", verified: true };
  const beds = unit.beds || 1;
  const baths = unit.baths || 1;
  const washer = 1;
  const fridge = 1;
  const floors = 1;


  // Sidebar: property/unit switcher
  return (
  <div style={{ display: 'flex', minHeight: 600, background: 'transparent', borderRadius: 0, boxShadow: 'none', width: '100%' }}>
      {/* Left Sidebar */}
      <div style={{ width: 240, background: '#f8fafc', borderRight: '1px solid #e5e7eb', borderRadius: '8px 0 0 8px', padding: '0 0 0 0', overflowY: 'auto', minHeight: 600 }}>
        <div style={{ padding: '18px 0 8px 0', borderBottom: '1px solid #e5e7eb', fontWeight: 600, fontSize: 15, color: '#6b7280', textAlign: 'center', letterSpacing: 1 }}>Properties</div>
        <div style={{ maxHeight: 520, overflowY: 'auto' }}>
          {allProperties?.map((prop) => (
            <div key={prop.id} style={{ margin: '0 0 0 0', borderBottom: '1px solid #f3f4f6', background: prop.id === property.id ? '#e0e7ff' : 'transparent' }}>
              <div style={{ fontWeight: 600, fontSize: 14, color: prop.id === property.id ? '#2563eb' : '#1f2937', padding: '10px 18px 2px 18px', cursor: 'pointer' }} onClick={() => prop.id !== property.id && onUnitSelect && onUnitSelect(prop, prop.unitsList[0])}>
                {prop.name}
              </div>
              {prop.id === property.id && prop.unitsList?.map((u) => (
                <div
                  key={u.unit}
                  onClick={() => onUnitSelect && onUnitSelect(prop, u)}
                  style={{
                    cursor: 'pointer',
                    background: u.unit === unit.unit ? '#2563eb' : '#f3f4f6',
                    color: u.unit === unit.unit ? '#fff' : '#374151',
                    fontWeight: u.unit === unit.unit ? 700 : 500,
                    borderRadius: 4,
                    margin: '4px 12px',
                    padding: '6px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    fontSize: 14,
                    border: u.unit === unit.unit ? '1.5px solid #2563eb' : '1px solid #e5e7eb',
                  }}
                >
                  <span style={{ fontSize: 15, marginRight: 4 }}>🏠</span> {u.unit}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      {/* Main Content */}
  <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', width: '100%', maxWidth: 'none', margin: '40px 0 0 0', background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px 0 rgba(0,0,0,0.08)', position: 'relative', padding: 0, minHeight: 700, alignSelf: 'flex-start', boxSizing: 'border-box', borderLeft: 'none', paddingRight: 0, marginRight: 0 }}>
        {/* Top Layer: New Property button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', padding: '24px 0 0 0', marginBottom: 0 }}>
          <button style={{ background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', padding: '10px 22px', fontSize: '15px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 2px 8px 0 rgba(37,99,235,0.08)' }}>New Property</button>
        </div>

        {/* Header: Unit Detail, property, last updated, actions, property image, address, icons */}
        <div style={{ display: 'flex', flexDirection: 'column', borderBottom: '1px solid #e5e7eb', marginBottom: 0, padding: '0 0 12px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#6b7280', fontWeight: 700, fontSize: 20, cursor: 'pointer', width: 32, height: 32, borderRadius: 16, marginRight: 8 }} title="Close">✕</button>
              <span style={{ fontWeight: 600, fontSize: 16, color: '#1f2937', marginRight: 16 }}>Unit Detail</span>
              <span style={{ color: '#2563eb', fontWeight: 600, fontSize: 16 }}>{property.name}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <span style={{ color: '#64748b', fontSize: 13 }}>Last Updated: 0m ago</span>
              <button style={{ background: 'none', border: '1.5px solid #e5e7eb', color: '#2563eb', fontWeight: 500, fontSize: 15, cursor: 'pointer', borderRadius: 8, padding: '7px 16px', display: 'flex', alignItems: 'center', gap: 6 }}>🔄 Refresh</button>
              <button style={{ background: 'none', border: '1.5px solid #e5e7eb', color: '#7c3aed', fontWeight: 500, fontSize: 15, cursor: 'pointer', borderRadius: 8, padding: '7px 16px', display: 'flex', alignItems: 'center', gap: 6 }}>🗄️ Archive</button>
              <button style={{ background: 'none', border: '1.5px solid #e5e7eb', color: '#ef4444', fontWeight: 500, fontSize: 15, cursor: 'pointer', borderRadius: 8, padding: '7px 16px', display: 'flex', alignItems: 'center', gap: 6 }}>✏️ Edit</button>
              <button style={{ background: 'none', border: '1.5px solid #e5e7eb', color: '#6b7280', fontWeight: 500, fontSize: 15, cursor: 'pointer', borderRadius: 8, padding: '7px 16px', display: 'flex', alignItems: 'center', gap: 6 }}>📝 Add Notes</button>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginTop: 18 }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', marginRight: 12 }}>
              <img src={property.image || 'https://randomuser.me/api/portraits/men/1.jpg'} alt="Property" style={{ width: 56, height: 56, objectFit: 'cover' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ fontWeight: 700, fontSize: 18, color: '#222' }}>{property.name}</span>
              <span style={{ fontSize: 14, color: '#64748b' }}>{property.address} <a href="#" style={{ color: '#2563eb', textDecoration: 'underline', marginLeft: 6 }}>View on map</a></span>
            </div>
            <div style={{ flex: 1 }} />
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 18 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, fontSize: 16 }}><span role="img" aria-label="house">🏠</span> {unit.unit}</span>
              <span style={{ color: '#ef4444', fontWeight: 700, fontSize: 16 }}>1</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, fontSize: 16 }}><span role="img" aria-label="bed">🛏️</span> {beds}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, fontSize: 16 }}><span role="img" aria-label="bath">🛁</span> {baths}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, fontSize: 16 }}><span role="img" aria-label="laundry">🧺</span> {washer}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, fontSize: 16 }}><span role="img" aria-label="box">🧊</span> {fridge}</span>
            </div>
          </div>
        </div>
        {/* Property/Unit Header */}
  {/* Removed duplicate property/unit header row */}
        {/* Main Content */}
  <div style={{ display: 'flex', flexDirection: 'column', gap: 0, padding: '32px 0 40px 0', flex: 1, width: '100%', position: 'relative', boxSizing: 'border-box', paddingRight: 0, marginRight: 0 }}>
          {/* Lease and Financial Summary Row */}
      <div style={{ display: 'flex', flexDirection: 'row', gap: 32, width: '100%', alignItems: 'flex-start', position: 'relative', marginLeft: 0, marginRight: 0 }}>
            {/* Lease Section */}
        <div style={{ flex: 2, minWidth: 0, paddingTop: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                <div style={{ fontWeight: 700, fontSize: 17, marginRight: 8 }}>Lease</div>
                <span style={{ color: '#2563eb', fontWeight: 600, fontSize: 15, marginLeft: 8, cursor: 'pointer' }}>▼</span>
                <button style={{ marginLeft: 'auto', background: '#2563eb', color: 'white', border: 'none', borderRadius: 8, padding: '7px 18px', fontSize: 15, fontWeight: 600, cursor: 'pointer', boxShadow: '0 2px 8px 0 rgba(37,99,235,0.08)' }}>New Lease</button>
              </div>
              <div style={{ color: '#374151', fontSize: 15, marginBottom: 4, fontWeight: 500 }}>Current Lease: <b style={{ fontWeight: 700 }}>{leaseStart} - {leaseType}</b></div>
              <div style={{ color: '#6b7280', fontSize: 14, marginBottom: 8 }}>Days left: {daysLeft}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <div style={{ background: '#e0e7ff', borderRadius: 4, height: 8, width: 260 }}>
                  <div style={{ background: '#2563eb', width: '60%', height: '100%', borderRadius: 4 }} />
                </div>
                <span style={{ color: '#6b7280', fontSize: 14, marginLeft: 8 }}>M to M</span>
              </div>
              <div style={{ color: '#6b7280', fontSize: 14, marginBottom: 8 }}>Start: {leaseStart}</div>
              <a href="#" style={{ color: '#2563eb', textDecoration: 'underline', fontSize: 14, fontWeight: 500 }}>View Lease Document</a>
            </div>
            {/* Financial Summary */}
        <div style={{ flex: 2, minWidth: 0, display: 'flex', flexDirection: 'row', gap: 24, alignItems: 'flex-start', justifyContent: 'flex-end', marginTop: 0, marginRight: 0 }}>
              {/* Rent Collected */}
              <div style={{ background: '#fff', borderRadius: 16, padding: 22, minWidth: 230, boxShadow: '0 4px 24px 0 rgba(0,0,0,0.08)', border: '1.5px solid #f3f4f6', marginBottom: 0, marginRight: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: 22, color: '#2563eb' }}>💵</span>
                  <span style={{ fontWeight: 600, fontSize: 15 }}>Rent Collected This Month</span>
                </div>
                <div style={{ fontSize: 28, fontWeight: 700, color: '#16a34a', marginBottom: 2 }}>${unit.rent?.toLocaleString() ?? 0} <span style={{ color: '#6b7280', fontWeight: 500, fontSize: 16 }}>/ ${unit.rent?.toLocaleString() ?? 0}</span></div>
                <a href="#" style={{ color: '#2563eb', textDecoration: 'underline', fontSize: 13 }}>View Details</a>
              </div>
              {/* Total Overdue */}
              <div style={{ background: '#fff', borderRadius: 16, padding: 22, minWidth: 200, boxShadow: '0 4px 24px 0 rgba(0,0,0,0.08)', border: '1.5px solid #f3f4f6', marginBottom: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: 22, color: '#ef4444' }}>📄</span>
                  <span style={{ fontWeight: 600, fontSize: 15 }}>Total Overdue</span>
                </div>
                <div style={{ fontSize: 28, fontWeight: 700, color: '#ef4444', marginBottom: 2 }}>${unit.overdue?.toLocaleString() ?? 0}</div>
                <div style={{ color: '#6b7280', fontSize: 14, fontWeight: 500 }}>Total of All Due Invoices</div>
              </div>
            </div>
          </div>
          {/* Tenants and Collection Row */}
        <div style={{ display: 'flex', flexDirection: 'row', gap: 32, width: '100%', marginTop: 40 }}>
            {/* Tenants Section */}
        <div style={{ flex: 2, minWidth: 0, paddingTop: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 8 }}>Tenants <span style={{ color: '#6b7280', fontWeight: 500, fontSize: 15 }}>(1)</span></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <img src={tenant.avatar} alt="Tenant" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', border: '2px solid #e5e7eb' }} />
                <span style={{ color: '#374151', fontSize: 15, fontWeight: 500 }}>{tenant.name}</span>
                {tenant.verified && <span style={{ color: '#10b981', fontSize: 18, marginLeft: 4 }}>✔️</span>}
                <a href="#" style={{ color: '#2563eb', fontSize: 13, marginLeft: 12 }}>View Tenant</a>
              </div>
            </div>
            {/* Collection Section */}
        <div style={{ flex: 2, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start', justifyContent: 'flex-end', marginTop: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <div style={{ fontWeight: 600, fontSize: 15 }}>Collection</div>
                <span style={{ color: '#2563eb', fontWeight: 500, fontSize: 13, marginLeft: 8, cursor: 'pointer' }}>▼</span>
                <span style={{ color: '#6b7280', fontSize: 13, marginLeft: 8 }}>Jan 2025</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, width: '100%' }}>
                {/* Circle progress bar */}
                <svg width="60" height="60" viewBox="0 0 60 60">
                  <circle cx="30" cy="30" r="26" stroke="#e0e7ff" strokeWidth="6" fill="none" />
                  <circle cx="30" cy="30" r="26" stroke="#16a34a" strokeWidth="6" fill="none" strokeDasharray="163.36" strokeDashoffset="0" style={{ transition: 'stroke-dashoffset 0.5s' }} />
                </svg>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#2563eb', minWidth: 0 }}>Total ${unit.rent?.toLocaleString() ?? 0}</div>
              </div>
              <div style={{ fontSize: 13, color: '#6b7280', marginTop: 8, width: '100%' }}>
                <div><span style={{ color: '#10b981', fontWeight: 600 }}>Collected</span>: ${unit.rent?.toLocaleString() ?? 0}</div>
                <div><span style={{ color: '#f59e0b', fontWeight: 600 }}>Processing</span>: $0.00</div>
                <div><span style={{ color: '#ef4444', fontWeight: 600 }}>Outstanding</span>: $0.00</div>
              </div>
              <a href="#" style={{ color: '#2563eb', textDecoration: 'underline', fontSize: 13, marginTop: 8, display: 'inline-block', alignSelf: 'flex-start' }}>View All Payment History</a>
            </div>
          </div>
          {/* Open Maintenance Requests Row */}
          <div style={{ marginTop: 40 }}>
            <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 8 }}>Open Maintenance Requests</div>
            <div style={{ color: unit.maintenance > 0 ? '#ef4444' : '#6b7280', fontSize: 15, fontWeight: 600 }}>{unit.maintenance > 0 ? unit.maintenance : 0}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
