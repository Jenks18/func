import React, { useState } from 'react';

export default function CreateTemplatePage({ onBack, onSave }) {
  const [uploadMethod, setUploadMethod] = useState('upload'); // 'upload' or 'select'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  // Mock state templates (replace with API call later)
  const stateTemplates = [
    { id: 1, name: 'Alabama Residential Lease Agreement', state: 'Alabama' },
    { id: 2, name: 'Alaska Residential Lease Agreement', state: 'Alaska' },
    { id: 3, name: 'Arizona Residential Lease Agreement', state: 'Arizona' },
    { id: 4, name: 'Arkansas Residential Lease Agreement', state: 'Arkansas' },
    { id: 5, name: 'California Residential Lease Agreement', state: 'California' },
    { id: 6, name: 'Colorado Residential Lease Agreement', state: 'Colorado' },
  ];

  const filteredTemplates = stateTemplates.filter(template =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      // Handle file upload
      console.log('File dropped:', e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      // Handle file upload
      console.log('File selected:', e.target.files[0]);
    }
  };

  return (
    <div style={{
      width: '100%',
      height: '100vh',
      background: '#ffffff',
      overflow: 'auto'
    }}>
      {/* Header */}
      <div style={{
        padding: '24px 32px',
        borderBottom: '2px solid #e5e7eb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'linear-gradient(135deg, #ffffff 0%, #f0fdfa 100%)',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Back Arrow */}
          <button
            onClick={onBack}
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: '24px',
              color: '#6b7280',
              cursor: 'pointer',
              padding: '8px',
              transition: 'color 0.2s ease',
              display: 'flex',
              alignItems: 'center'
            }}
            onMouseOver={(e) => e.target.style.color = '#115e59'}
            onMouseOut={(e) => e.target.style.color = '#6b7280'}
          >
            ←
          </button>
          <div>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#115e59',
              margin: 0,
              marginBottom: '4px'
            }}>
              CREATE LEASE TEMPLATE
            </h2>
            <div style={{
              fontSize: '13px',
              color: '#14b8a6'
            }}>
              Need help with your template?{' '}
              <a href="#" style={{
                color: '#14b8a6',
                fontWeight: '600',
                textDecoration: 'none'
              }}>
                Watch this short video →
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ 
        padding: '32px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Upload Section */}
        <div style={{
          marginBottom: '32px'
        }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#6b7280',
            textAlign: 'center',
            marginBottom: '20px'
          }}>
            Upload Your Own New Document
          </h3>
          
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            style={{
              border: dragActive ? '3px dashed #14b8a6' : '2px dashed #d1d5db',
              borderRadius: '12px',
              padding: '48px 24px',
              textAlign: 'center',
                background: dragActive ? '#f0fdfa' : '#f9fafb',
                transition: 'all 0.2s ease',
                cursor: 'pointer'
              }}
              onClick={() => document.getElementById('fileInput').click()}
            >
              <div style={{
                fontSize: '48px',
                marginBottom: '16px',
                opacity: 0.5
              }}>
                📄
              </div>
              <div style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#115e59',
                marginBottom: '8px'
              }}>
                Drag & Drop
              </div>
              <div style={{
                fontSize: '13px',
                color: '#14b8a6',
                marginBottom: '16px'
              }}>
                <span
                  style={{
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  Upload
                </span>
                {' '}a document to create a signable template
              </div>
              <input
                id="fileInput"
                type="file"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
                accept=".pdf,.doc,.docx"
              />
            </div>
          </div>

          {/* Divider */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '32px'
          }}>
            <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
            <span style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#9ca3af',
              textTransform: 'uppercase'
            }}>
              OR
            </span>
            <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
          </div>

          {/* Select Existing Templates */}
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '16px'
            }}>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#6b7280',
                margin: 0
              }}>
                Select from one of our existing templates
              </h3>
              <div style={{
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                background: '#e5e7eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
                color: '#6b7280',
                fontWeight: '600',
                cursor: 'help'
              }}
              title="State-specific lease templates"
              >
                ?
              </div>
            </div>

            {/* Search */}
            <div style={{
              position: 'relative',
              marginBottom: '16px'
            }}>
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px 12px 40px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.2s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = '#14b8a6'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
              />
              <span style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '16px',
                color: '#9ca3af'
              }}>
                🔍
              </span>
            </div>

            {/* Templates Table */}
            <div style={{
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              overflow: 'hidden',
              maxHeight: '400px',
              overflowY: 'auto'
            }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse'
              }}>
                <thead style={{
                  position: 'sticky',
                  top: 0,
                  background: '#f9fafb',
                  zIndex: 1
                }}>
                  <tr>
                    <th style={{
                      padding: '12px 16px',
                      textAlign: 'left',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#6b7280',
                      borderBottom: '1px solid #e5e7eb'
                    }}>
                      Forms and Templates
                    </th>
                    <th style={{
                      padding: '12px 16px',
                      textAlign: 'right',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#6b7280',
                      borderBottom: '1px solid #e5e7eb',
                      width: '100px'
                    }}>
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTemplates.map((template) => (
                    <tr
                      key={template.id}
                      style={{
                        borderBottom: '1px solid #f3f4f6',
                        transition: 'background 0.2s ease'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.background = '#f9fafb';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      <td style={{
                        padding: '12px 16px',
                        fontSize: '14px',
                        color: '#4b5563'
                      }}>
                        {template.name}
                      </td>
                      <td style={{
                        padding: '12px 16px',
                        textAlign: 'right'
                      }}>
                        <button
                          onClick={() => {
                            setSelectedTemplate(template);
                            if (onSave) {
                              onSave(template);
                            }
                          }}
                          style={{
                            padding: '6px 16px',
                            background: 'white',
                            color: '#3b82f6',
                            border: '1px solid #3b82f6',
                            borderRadius: '6px',
                            fontSize: '13px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseOver={(e) => {
                            e.target.style.background = '#3b82f6';
                            e.target.style.color = 'white';
                          }}
                          onMouseOut={(e) => {
                            e.target.style.background = 'white';
                            e.target.style.color = '#3b82f6';
                          }}
                        >
                          Select
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
  );
}
