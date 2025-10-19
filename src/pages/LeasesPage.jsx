import React, { useState } from 'react';
import { useLeases, useSorting } from '../components/leases/useLeases';
import LeasesTableView from '../components/leases/LeasesTableView';
import LeaseDetailView from '../components/leases/LeaseDetailView';
import TemplatesTableView from '../components/leases/TemplatesTableView';
import CreateTemplatePage from '../components/leases/CreateTemplatePage';

export default function LeasesPage() {
  // Mobile detection
  const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 768);
  
  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch leases data
  const { createdLeases, isLoadingLeases, leasesError } = useLeases();
  
  // Sorting
  const { sortedData: sortedLeases, sortField, sortDirection, handleSort } = useSorting(createdLeases);
  
  // Selected lease for detail view
  const [selectedLeaseDetail, setSelectedLeaseDetail] = useState(null);
  
  // Tab state
  const [activeMainTab, setActiveMainTab] = useState('leases');
  const [showNewLeaseWizard, setShowNewLeaseWizard] = useState(false);
  
  // Template state
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showCreateTemplatePage, setShowCreateTemplatePage] = useState(false);
  
  // Mock templates data (replace with actual API call later)
  const templates = [
    {
      id: 1,
      name: 'Lease Agreement',
      tenants: 1,
      description: 'Updated lease agreement as of 2/26/24',
      type: 'Lease'
    }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 50%, #99f6e4 100%)',
      padding: isMobile ? '16px' : '24px',
      position: 'relative'
    }}>
      {/* Show Create Template Page */}
      {showCreateTemplatePage ? (
        <CreateTemplatePage
          onBack={() => setShowCreateTemplatePage(false)}
          onSave={(template) => {
            console.log('Selected template:', template);
            setShowCreateTemplatePage(false);
            // Handle template selection/creation
          }}
        />
      ) : (
        <>
      {/* Centered Tab Navigation */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(20,184,166,0.15)',
        border: '1px solid #99f6e4',
        padding: '0',
        marginBottom: '16px',
        overflow: 'hidden'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          padding: '8px',
          gap: '8px'
        }}>
          <button
            onClick={() => setActiveMainTab('leases')}
            style={{
              flex: isMobile ? 1 : 'none',
              padding: isMobile ? '12px' : '12px 32px',
              background: activeMainTab === 'leases' 
                ? 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)' 
                : 'transparent',
              color: activeMainTab === 'leases' ? 'white' : '#6b7280',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '700',
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              justifyContent: 'center',
              textTransform: 'uppercase',
              letterSpacing: '0.03em',
              boxShadow: activeMainTab === 'leases' ? '0 2px 8px rgba(20,184,166,0.3)' : 'none'
            }}
          >
            LEASES
            <span style={{
              background: activeMainTab === 'leases' ? 'rgba(255,255,255,0.2)' : '#ccfbf1',
              color: activeMainTab === 'leases' ? 'white' : '#0f766e',
              fontSize: '10px',
              padding: '2px 6px',
              borderRadius: '10px',
              fontWeight: '700',
              minWidth: '18px',
              textAlign: 'center'
            }}>
              {createdLeases.length}
            </span>
          </button>
          <button
            onClick={() => setActiveMainTab('templates')}
            style={{
              flex: isMobile ? 1 : 'none',
              padding: isMobile ? '12px' : '12px 32px',
              background: activeMainTab === 'templates' 
                ? 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)' 
                : 'transparent',
              color: activeMainTab === 'templates' ? 'white' : '#6b7280',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '700',
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              justifyContent: 'center',
              textTransform: 'uppercase',
              letterSpacing: '0.03em',
              boxShadow: activeMainTab === 'templates' ? '0 2px 8px rgba(20,184,166,0.3)' : 'none'
            }}
          >
            TEMPLATES
            <span style={{
              background: activeMainTab === 'templates' ? 'rgba(255,255,255,0.2)' : '#ccfbf1',
              color: activeMainTab === 'templates' ? 'white' : '#0f766e',
              fontSize: '10px',
              padding: '2px 6px',
              borderRadius: '10px',
              fontWeight: '700',
              minWidth: '18px',
              textAlign: 'center'
            }}>
              1
            </span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ marginBottom: '24px' }}>
        {activeMainTab === 'leases' ? (
          <div>
            {/* Filters and Actions */}
            <div style={{
              background: 'white',
              borderRadius: '12px',
              border: '1px solid #99f6e4',
              boxShadow: '0 4px 12px rgba(20,184,166,0.15)',
              padding: '16px 20px',
              marginBottom: '16px'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '16px'
              }}>
                {/* Left side - Filter and Count */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  flex: 1
                }}>
                  <select style={{
                    background: '#f0fdfa',
                    border: '1px solid #99f6e4',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    fontSize: '13px',
                    cursor: 'pointer',
                    color: '#0f766e',
                    fontWeight: '600',
                    outline: 'none',
                    transition: 'all 0.2s ease'
                  }}>
                    <option>All Statuses</option>
                    <option>Active</option>
                    <option>Pending</option>
                    <option>Expired</option>
                  </select>

                  {!isLoadingLeases && !leasesError && createdLeases.length > 0 && (
                    <div style={{
                      fontSize: '13px',
                      color: '#14b8a6',
                      fontWeight: '600'
                    }}>
                      Showing {createdLeases.length} of {createdLeases.length}
                    </div>
                  )}
                </div>
              
                {/* Right side - Actions */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <button
                    style={{
                      padding: '8px 16px',
                      background: 'white',
                      color: '#0f766e',
                      border: '1px solid #99f6e4',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.background = '#f0fdfa';
                      e.target.style.borderColor = '#14b8a6';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.background = 'white';
                      e.target.style.borderColor = '#99f6e4';
                    }}
                  >
                    Export
                  </button>

                  <button
                    onClick={() => setShowNewLeaseWizard(true)}
                    style={{
                      padding: '8px 20px',
                      background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 2px 8px rgba(20,184,166,0.3)'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.background = 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)';
                      e.target.style.boxShadow = '0 4px 12px rgba(20,184,166,0.4)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.background = 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)';
                      e.target.style.boxShadow = '0 2px 8px rgba(20,184,166,0.3)';
                    }}
                  >
                    + New Lease
                  </button>
                </div>
              </div>
            </div>

            {/* Main Content - Toggle between table view and detail view */}
            {selectedLeaseDetail ? (
              <LeaseDetailView
                selectedLease={selectedLeaseDetail}
                allLeases={sortedLeases}
                onLeaseSelect={setSelectedLeaseDetail}
                onClose={() => setSelectedLeaseDetail(null)}
                isMobile={isMobile}
              />
            ) : (
              <LeasesTableView
                leases={sortedLeases}
                isLoading={isLoadingLeases}
                error={leasesError}
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
                onLeaseSelect={setSelectedLeaseDetail}
                onNewLease={() => setShowNewLeaseWizard(true)}
                isMobile={isMobile}
              />
            )}
          </div>
        ) : (
          <div>
            {/* Templates Section */}
            
            {/* Filters and Actions */}
            <div style={{
              background: 'white',
              borderRadius: '12px',
              border: '1px solid #99f6e4',
              boxShadow: '0 4px 12px rgba(20,184,166,0.15)',
              padding: '16px 20px',
              marginBottom: '16px'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '16px'
              }}>
                {/* Left side - Filter and Count */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  flex: 1
                }}>
                  <select style={{
                    background: '#f0fdfa',
                    border: '1px solid #99f6e4',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    fontSize: '13px',
                    cursor: 'pointer',
                    color: '#0f766e',
                    fontWeight: '600',
                    outline: 'none',
                    transition: 'all 0.2s ease'
                  }}>
                    <option>Filter</option>
                    <option>Lease</option>
                    <option>Amendment</option>
                    <option>Other</option>
                  </select>

                  <div style={{
                    fontSize: '13px',
                    color: '#14b8a6',
                    fontWeight: '600'
                  }}>
                    Showing {templates.length} of {templates.length}
                  </div>
                </div>
              
                {/* Right side - Actions */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <button
                    onClick={() => setShowCreateTemplatePage(true)}
                    style={{
                      padding: '8px 20px',
                      background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 2px 8px rgba(20,184,166,0.3)'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.background = 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)';
                      e.target.style.boxShadow = '0 4px 12px rgba(20,184,166,0.4)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.background = 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)';
                      e.target.style.boxShadow = '0 2px 8px rgba(20,184,166,0.3)';
                    }}
                  >
                    + New Template
                  </button>
                </div>
              </div>
            </div>

            {/* Templates Table */}
            <TemplatesTableView
              templates={templates}
              isLoading={false}
              error={null}
              onTemplateSelect={setSelectedTemplate}
              isMobile={isMobile}
            />
          </div>
        )}
      </div>
      </>
      )}
    </div>
  );
}
