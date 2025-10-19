import React from 'react';

export default function TemplatesTableView({ templates, isLoading, error, onTemplateSelect, isMobile }) {
  
  if (isLoading) {
    return (
      <div style={{
        background: 'white',
        borderRadius: '16px',
        border: '2px solid #99f6e4',
        padding: '48px 24px',
        textAlign: 'center',
        boxShadow: '0 4px 16px rgba(20,184,166,0.1)'
      }}>
        <div style={{
          fontSize: '18px',
          color: '#14b8a6',
          fontWeight: '600'
        }}>
          Loading templates...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        background: 'white',
        borderRadius: '16px',
        border: '2px solid #fee2e2',
        padding: '48px 24px',
        textAlign: 'center',
        boxShadow: '0 4px 16px rgba(239,68,68,0.1)'
      }}>
        <div style={{
          fontSize: '18px',
          color: '#dc2626',
          fontWeight: '600'
        }}>
          Error loading templates
        </div>
        <div style={{
          fontSize: '14px',
          color: '#6b7280',
          marginTop: '8px'
        }}>
          {error}
        </div>
      </div>
    );
  }

  if (!templates || templates.length === 0) {
    return (
      <div style={{
        background: 'white',
        borderRadius: '16px',
        border: '2px solid #99f6e4',
        padding: '48px 24px',
        textAlign: 'center',
        boxShadow: '0 4px 16px rgba(20,184,166,0.1)'
      }}>
        <div style={{ fontSize: '64px', marginBottom: '16px', opacity: 0.5 }}>📋</div>
        <div style={{
          fontSize: '18px',
          color: '#115e59',
          fontWeight: '700',
          marginBottom: '8px'
        }}>
          No Templates Yet
        </div>
        <div style={{
          fontSize: '14px',
          color: '#14b8a6',
          marginBottom: '24px'
        }}>
          Create your first lease template to get started
        </div>
      </div>
    );
  }

  // Mobile view - Cards
  if (isMobile) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {templates.map((template) => (
          <div
            key={template.id}
            onClick={() => onTemplateSelect(template)}
            style={{
              background: 'white',
              borderRadius: '12px',
              border: '2px solid #99f6e4',
              padding: '16px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 8px rgba(20,184,166,0.1)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(20,184,166,0.2)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(20,184,166,0.1)';
            }}
          >
            <div style={{
              fontSize: '15px',
              fontWeight: '700',
              color: '#115e59',
              marginBottom: '8px'
            }}>
              {template.name}
            </div>
            <div style={{
              fontSize: '12px',
              color: '#14b8a6',
              marginBottom: '8px'
            }}>
              {template.description}
            </div>
            <div style={{
              display: 'flex',
              gap: '8px',
              fontSize: '11px',
              color: '#6b7280'
            }}>
              <span>📄 {template.tenants} Tenants</span>
              <span>•</span>
              <span>Type: {template.type}</span>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Desktop view - Table
  return (
    <div style={{
      background: 'white',
      borderRadius: '16px',
      border: '2px solid #99f6e4',
      overflow: 'hidden',
      boxShadow: '0 4px 16px rgba(20,184,166,0.1)'
    }}>
      <table style={{
        width: '100%',
        borderCollapse: 'collapse'
      }}>
        <thead>
          <tr style={{
            background: 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%)',
            borderBottom: '2px solid #99f6e4'
          }}>
            <th style={{
              padding: '16px 20px',
              textAlign: 'left',
              fontSize: '11px',
              fontWeight: '700',
              color: '#0f766e',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              Template Name
            </th>
            <th style={{
              padding: '16px 20px',
              textAlign: 'left',
              fontSize: '11px',
              fontWeight: '700',
              color: '#0f766e',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              # of Tenants
            </th>
            <th style={{
              padding: '16px 20px',
              textAlign: 'left',
              fontSize: '11px',
              fontWeight: '700',
              color: '#0f766e',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              Description
            </th>
            <th style={{
              padding: '16px 20px',
              textAlign: 'left',
              fontSize: '11px',
              fontWeight: '700',
              color: '#0f766e',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              Type
            </th>
            <th style={{
              padding: '16px 20px',
              textAlign: 'center',
              fontSize: '11px',
              fontWeight: '700',
              color: '#0f766e',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {templates.map((template, index) => (
            <tr
              key={template.id}
              style={{
                borderBottom: index < templates.length - 1 ? '1px solid #f0fdfa' : 'none',
                transition: 'background 0.2s ease',
                cursor: 'pointer'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = '#f0fdfa';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
              onClick={() => onTemplateSelect(template)}
            >
              <td style={{
                padding: '16px 20px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#115e59'
              }}>
                {template.name}
              </td>
              <td style={{
                padding: '16px 20px',
                fontSize: '13px',
                color: '#14b8a6',
                fontWeight: '600'
              }}>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: '#f0fdfa',
                  padding: '4px 12px',
                  borderRadius: '12px',
                  border: '1px solid #ccfbf1'
                }}>
                  <svg 
                    width="12" 
                    height="12" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="#14b8a6" 
                    strokeWidth="2.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <span style={{
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#115e59'
                  }}>
                    {template.tenants}
                  </span>
                </div>
              </td>
              <td style={{
                padding: '16px 20px',
                fontSize: '13px',
                color: '#6b7280',
                maxWidth: '300px'
              }}>
                {template.description}
              </td>
              <td style={{
                padding: '16px 20px',
                fontSize: '13px',
                color: '#0f766e',
                fontWeight: '600'
              }}>
                <span style={{
                  background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
                  padding: '4px 12px',
                  borderRadius: '12px',
                  border: '1px solid #6ee7b7',
                  fontSize: '11px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  {template.type}
                </span>
              </td>
              <td style={{
                padding: '16px 20px',
                textAlign: 'center'
              }}>
                <div style={{
                  display: 'flex',
                  gap: '8px',
                  justifyContent: 'center'
                }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle edit
                    }}
                    style={{
                      padding: '6px 16px',
                      background: 'white',
                      color: '#14b8a6',
                      border: '1px solid #99f6e4',
                      borderRadius: '6px',
                      fontSize: '12px',
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
                    Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle duplicate
                    }}
                    style={{
                      padding: '6px 16px',
                      background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 2px 6px rgba(20,184,166,0.3)'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.background = 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)';
                      e.target.style.transform = 'translateY(-1px)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.background = 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)';
                      e.target.style.transform = 'translateY(0)';
                    }}
                  >
                    Duplicate
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle delete
                    }}
                    style={{
                      padding: '6px 12px',
                      background: 'white',
                      color: '#dc2626',
                      border: '1px solid #fca5a5',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.background = '#fee2e2';
                      e.target.style.borderColor = '#dc2626';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.background = 'white';
                      e.target.style.borderColor = '#fca5a5';
                    }}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
