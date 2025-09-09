import React, { useState } from 'react';

const leaseData = {
  propertyName: "Main Street Lofts",
  address: "101 Main St, Milford Oaks",
  unit: "Unit 201",
  rentalLeaseFee: "KSH 2,500",
  start: "Jan 1, 2024",
  end: "Dec 31, 2024",
  securityDeposit: "KSH 45,000",
  monthlyRent: "KSH 75,000",
  tenants: 2,
  rentersInsurance: "Required",
  propertyType: "Apartment",
};

const steps = [
  { id: 0, title: "Property Details", icon: "⚙️", completed: false },
  { id: 1, title: "Lease Term", icon: "📄", completed: false },
  { id: 2, title: "Lease Dates", icon: "📅", completed: false },
  { id: 3, title: "Security Deposit", icon: "💰", completed: false },
  { id: 4, title: "Rent/Additional Fee", icon: "💵", completed: false },
  { id: 5, title: "Add Tenants", icon: "👥", completed: false },
  { id: 6, title: "Rent/Deposit Sharing", icon: "🤝", completed: false },
  { id: 7, title: "Renter's Insurance", icon: "🛡️", completed: false },
  { id: 8, title: "Lease/Documents", icon: "📑", completed: false },
];

const templateData = [
  {
    id: 1,
    name: "Lease Agreement",
    tenants: 1,
    description: "Leases",
    type: "Lease"
  }
];

const propertiesData = [
  {
    id: 1,
    name: "Main Street Lofts",
    type: "101 Residential",
    address: "101 Main St, Milford Oaks 45140",
    rent: "$0.00",
    bedrooms: 2,
    bathrooms: 1,
    sqft: "1200 sq ft"
  },
  {
    id: 2,
    name: "Main Street Lofts",
    type: "101 Residential", 
    address: "101 Main St, Milford Oaks 45140",
    rent: "$1,500.00",
    bedrooms: 1,
    bathrooms: 1,
    sqft: "1000 sq ft"
  },
  {
    id: 3,
    name: "Main Street Lofts",
    type: "201 Residential",
    address: "101 Main St, Milford Oaks 45140", 
    rent: "$0.00",
    bedrooms: 2,
    bathrooms: 1,
    sqft: "1200 sq ft"
  },
  {
    id: 4,
    name: "Main Street Lofts",
    type: "201 Residential",
    address: "101 Main St, Milford Oaks 45140",
    rent: "$2,000.00", 
    bedrooms: 1,
    bathrooms: 1,
    sqft: "1000 sq ft"
  }
];

function StepContent({ step }) {
  switch (step) {
    case 0:
      return (
        <div style={{ padding: '24px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px'
          }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '600',
              color: '#374151',
              margin: 0
            }}>
              Select a Property
            </h2>
            <button style={{
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '10px 16px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer'
            }}>
              + New Property
            </button>
          </div>
          
          <div style={{
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <select style={{
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              padding: '8px 12px',
              fontSize: '14px',
              background: 'white',
              minWidth: '150px'
            }}>
              <option>All Properties</option>
            </select>
            <div style={{
              position: 'relative',
              flex: 1,
              maxWidth: '300px'
            }}>
              <input
                type="text"
                placeholder="Search"
                style={{
                  width: '100%',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  padding: '8px 12px 8px 36px',
                  fontSize: '14px'
                }}
              />
              <div style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#9ca3af'
              }}>
                🔍
              </div>
            </div>
          </div>
          
          <div style={{
            background: 'white',
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
            overflow: 'hidden'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '300px 400px 150px 120px',
              gap: '16px',
              padding: '16px',
              background: '#f9fafb',
              borderBottom: '1px solid #e5e7eb',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151'
            }}>
              <div>Properties</div>
              <div>Address</div>
              <div>Total Monthly Rent</div>
              <div>Features</div>
            </div>
            
            {propertiesData.map((property) => (
              <div key={property.id} style={{
                display: 'grid',
                gridTemplateColumns: '300px 400px 150px 120px',
                gap: '16px',
                padding: '16px',
                borderBottom: '1px solid #f3f4f6',
                alignItems: 'center',
                cursor: 'pointer'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    background: '#3b82f6',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '16px'
                  }}>
                    🏠
                  </div>
                  <div>
                    <div style={{
                      fontWeight: '600',
                      color: '#374151',
                      fontSize: '14px'
                    }}>
                      {property.name}
                    </div>
                    <div style={{
                      color: '#6b7280',
                      fontSize: '12px'
                    }}>
                      {property.type}
                    </div>
                  </div>
                </div>
                
                <div style={{
                  color: '#374151',
                  fontSize: '14px'
                }}>
                  {property.address}
                </div>
                
                <div style={{
                  fontWeight: '600',
                  color: '#374151',
                  fontSize: '14px'
                }}>
                  {property.rent}
                </div>
                
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '12px',
                  color: '#6b7280'
                }}>
                  <span>🛏️ {property.bedrooms}</span>
                  <span>🚿 {property.bathrooms}</span>
                  <span>📐 {property.sqft}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    case 1:
      return (
        <div style={{ padding: '24px' }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '600',
            color: '#374151',
            marginBottom: '24px'
          }}>
            Lease Term
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '32px'
          }}>
            <div style={{
              background: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '24px'
            }}>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                📄 Fixed Term
              </h3>
              <p style={{
                color: '#6b7280',
                fontSize: '14px',
                margin: 0
              }}>
                Traditional lease with fixed end date offering automatic renewal. A fixed term lease.
              </p>
            </div>
            
            <div style={{
              background: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '24px'
            }}>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
              📅 Month to Month
              </h3>
              <p style={{
                color: '#6b7280',
                fontSize: '14px',
                margin: 0
              }}>
                Continues month to month. May be terminated each month by proper notice from either party.
              </p>
            </div>
          </div>
        </div>
      );
            
            {/* Property rows */}
            <div className="divide-y divide-gray-200">
              <div className="grid grid-cols-6 gap-4 p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">🏢</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Main Street Lofts</div>
                    <div className="text-sm text-gray-500">501 - Sacramento</div>
                  </div>
                </div>
                <div className="flex items-center text-gray-900">
                  170 Main St, Milford Drive 48306
                </div>
                <div className="flex items-center font-semibold text-gray-900">
                  $0.00
                </div>
                <div className="flex items-center">
                  <div className="flex gap-1">
                    <span className="text-blue-600">🏠</span>
                    <span className="text-sm text-gray-600">1</span>
                    <span className="text-orange-600">🛏️</span>
                    <span className="text-sm text-gray-600">2.5</span>
                    <span className="text-green-600">📐</span>
                    <span className="text-sm text-gray-600">1500 sq ft</span>
                  </div>
                </div>
                <div></div>
                <div></div>
              </div>
              
              <div className="grid grid-cols-6 gap-4 p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">🏢</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Main Street Lofts</div>
                    <div className="text-sm text-gray-500">505 - Sacramento</div>
                  </div>
                </div>
                <div className="flex items-center text-gray-900">
                  170 Main St, Milford Drive 48306
                </div>
                <div className="flex items-center font-semibold text-gray-900">
                  $1,540.00
                </div>
                <div className="flex items-center">
                  <div className="flex gap-1">
                    <span className="text-blue-600">🏠</span>
                    <span className="text-sm text-gray-600">1</span>
                    <span className="text-orange-600">🛏️</span>
                    <span className="text-sm text-gray-600">1</span>
                    <span className="text-green-600">📐</span>
                    <span className="text-sm text-gray-600">1500 sq ft</span>
                  </div>
                </div>
                <div></div>
                <div></div>
              </div>
              
              <div className="grid grid-cols-6 gap-4 p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">🏢</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Main Street Lofts</div>
                    <div className="text-sm text-gray-500">501 - Sacramento</div>
                  </div>
                </div>
                <div className="flex items-center text-gray-900">
                  170 Main St, Milford Drive 48306
                </div>
                <div className="flex items-center font-semibold text-gray-900">
                  $0.00
                </div>
                <div className="flex items-center">
                  <div className="flex gap-1">
                    <span className="text-blue-600">🏠</span>
                    <span className="text-sm text-gray-600">1</span>
                    <span className="text-orange-600">🛏️</span>
                    <span className="text-sm text-gray-600">2.5</span>
                    <span className="text-green-600">📐</span>
                    <span className="text-sm text-gray-600">1500 sq ft</span>
                  </div>
                </div>
                <div></div>
                <div></div>
              </div>
              
              <div className="grid grid-cols-6 gap-4 p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">🏢</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Main Street Lofts</div>
                    <div className="text-sm text-gray-500">501 - Sacramento</div>
                  </div>
                </div>
                <div className="flex items-center text-gray-900">
                  170 Main St, Milford Drive 48306
                </div>
                <div className="flex items-center font-semibold text-gray-900">
                  $2,030.00
                </div>
                <div className="flex items-center">
                  <div className="flex gap-1">
                    <span className="text-blue-600">🏠</span>
                    <span className="text-sm text-gray-600">1</span>
                    <span className="text-orange-600">🛏️</span>
                    <span className="text-sm text-gray-600">1</span>
                    <span className="text-green-600">📐</span>
                    <span className="text-sm text-gray-600">1500 sq ft</span>
                  </div>
                </div>
                <div></div>
                <div></div>
              </div>
            </div>
          </div>
        </div>
      );
    case 1:
      return (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Lease Term</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:border-blue-300 hover:shadow-md transition-all duration-200 cursor-pointer group">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <span className="text-blue-600 text-xl">📅</span>
                </div>
                <h3 className="text-lg font-semibold text-slate-800">Fixed Term</h3>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Leases have a fixed start date and end date with clearly defined terms.
              </p>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:border-blue-300 hover:shadow-md transition-all duration-200 cursor-pointer group">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <span className="text-blue-600 text-xl">🔄</span>
                </div>
                <h3 className="text-lg font-semibold text-slate-800">Month to Month</h3>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Leases with variable terms that renew automatically each month.
              </p>
            </div>
          </div>
        </div>
      );
    case 2:
      return (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Lease Dates</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Start Date</label>
              <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-slate-800 font-medium">
                {leaseData.start}
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-700 uppercase tracking-wide">End Date</label>
              <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-slate-800 font-medium">
                {leaseData.end}
              </div>
            </div>
          </div>
        </div>
      );
    case 3:
      return (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Security Deposit</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Security Deposit Amount</label>
              <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-slate-800 font-medium">
                {leaseData.securityDeposit}
              </div>
            </div>
          </div>
        </div>
      );
    case 4:
      return (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Rent/Additional Fee</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Monthly Rent</label>
              <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-slate-800 font-medium">
                {leaseData.monthlyRent}
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Rental Lease Fee</label>
              <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-slate-800 font-medium">
                {leaseData.rentalLeaseFee}
              </div>
            </div>
          </div>
        </div>
      );
    case 5:
      return (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Add Tenants</h2>
          
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 text-xl">👥</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800">Tenant Information</h3>
                <p className="text-slate-600">Add tenant details and contact information</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Number of Tenants</label>
              <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-slate-800 font-medium">
                {leaseData.tenants}
              </div>
            </div>
          </div>
        </div>
      );
    case 6:
      return (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Rent/Deposit Sharing</h2>
          
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 text-xl">🤝</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800">Payment Arrangements</h3>
                <p className="text-slate-600">Configure how rent and deposit payments are shared among multiple tenants. Set individual responsibilities and payment arrangements.</p>
              </div>
            </div>
          </div>
        </div>
      );
    case 7:
      return (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Renter's Insurance</h2>
          
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 text-xl">🛡️</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800">Insurance Requirement</h3>
                <p className="text-slate-600">INSURANCE REQUIREMENT</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Status</label>
              <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-slate-800 font-medium">
                {leaseData.rentersInsurance}
              </div>
            </div>
          </div>
        </div>
      );
    case 8:
      return (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Lease/Documents</h2>
          
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 text-xl">📑</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800">Document Management</h3>
                <p className="text-slate-600">Upload and manage lease documents and related files</p>
              </div>
            </div>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <div className="text-gray-400 text-4xl mb-2">📁</div>
              <p className="text-gray-600">Drag and drop files here or click to upload</p>
            </div>
          </div>
        </div>
      );
    default:
      return (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-800">Select a step to continue</h2>
        </div>
      );
  }
}

export default function LeasesFilesPage() {
  const [selectedStep, setSelectedStep] = useState(0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
      <div className="flex flex-col h-screen">
        {/* Top Property Summary Section - Separate div that changes based on context */}
        <div className="bg-white/90 backdrop-blur-lg border-b border-orange-200/40 p-4 shadow-sm">
          <div className="max-w-7xl mx-auto">
            <div className="bg-gradient-to-r from-orange-500/10 to-orange-600/10 backdrop-blur-sm rounded-lg p-4 border border-orange-200/50">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-semibold text-slate-800">Property Name</h1>
                  <p className="text-slate-600 text-sm">{leaseData.propertyName} • {leaseData.address}</p>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <div className="text-center">
                    <p className="text-slate-500">Start</p>
                    <p className="font-semibold text-slate-800">{leaseData.start}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-slate-500">End</p>
                    <p className="font-semibold text-slate-800">{leaseData.end}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-slate-500">Security Deposit</p>
                    <p className="font-semibold text-slate-800">{leaseData.securityDeposit}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-slate-500">Monthly Rent</p>
                    <p className="font-semibold text-slate-800">{leaseData.monthlyRent}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-slate-500">Tenants</p>
                    <p className="font-semibold text-slate-800">{leaseData.tenants}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-slate-500">Renter's Insurance</p>
                    <p className="font-semibold text-slate-800">{leaseData.rentersInsurance}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area - Inner sidebar + Active tab content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Inner Sidebar - Step Navigation (multi bar menu) */}
          <div className="w-64 bg-slate-800/95 backdrop-blur-lg border-r-2 border-gray-300 flex flex-col">
            <div className="flex-1 p-4 overflow-y-auto">
              <nav className="space-y-2">
                {steps.map((step, index) => (
                  <button
                    key={step.id}
                    onClick={() => setSelectedStep(step.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 group border ${
                      selectedStep === step.id
                        ? 'bg-orange-500/20 text-orange-100 border-orange-400/40 shadow-lg shadow-orange-500/10'
                        : 'bg-slate-700/30 text-slate-300 border-slate-600/50 hover:bg-slate-600/50 hover:text-orange-200 hover:border-orange-400/30'
                    }`}
                  >
                    <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-semibold ${
                      step.completed 
                        ? 'bg-orange-500 text-white'
                        : selectedStep === step.id
                        ? 'bg-orange-400 text-white'
                        : 'bg-slate-600 text-slate-300 group-hover:bg-orange-400/50'
                    }`}>
                      {step.completed ? '✓' : index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{step.icon}</span>
                        <span className="text-sm font-medium truncate">{step.title}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </nav>
            </div>
          </div>
          
          {/* Right Content Area - Active tab content (separate section) */}
          <div className="flex-1 bg-gray-50 overflow-y-auto border-l border-gray-200">
            <div className="p-6">
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm min-h-[500px] p-6">
                <StepContent step={selectedStep} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
