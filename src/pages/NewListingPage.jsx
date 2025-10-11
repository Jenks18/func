import React, { useState, useEffect } from 'react';
import dataService from '../services/dataService';

export default function NewListingPage({ onBack, onListingCreated }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const steps = [
    { id: 0, title: 'SELECT A PROPERTY', icon: '🏠' },
    { id: 1, title: 'BASIC INFORMATION', icon: '📝' },
    { id: 2, title: 'RENTAL TERMS', icon: '💰' },
    { id: 3, title: 'UNIT FEATURES', icon: '⭐' },
    { id: 4, title: 'UPLOAD PHOTOS', icon: '📸' },
    { id: 5, title: 'PREVIEW & PUBLISH', icon: '👁️' }
  ];

  const [formData, setFormData] = useState({
    // Step 0 - Property Selection
    selectedPropertyId: '',
    selectedUnitId: '',
    
    // Step 1 - Basic Information
    title: '',
    description: '',
    listingType: 'Rental',
    
    // Step 2 - Rental Terms
    rentAmount: '',
    securityDeposit: '',
    leaseLength: '',
    availableDate: '',
    
    // Step 3 - Unit Features
    bedrooms: 1,
    bathrooms: 1,
    squareFeet: '',
    features: [],
    
    // Step 4 - Photos
    photos: [],
    
    // Step 5 - Preview
    status: 'Draft'
  });

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      const propertiesData = await dataService.properties.getAllProperties();
      setProperties(propertiesData);
    } catch (err) {
      console.error('Error loading properties:', err);
      setError('Failed to load properties');
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (stepIndex) => {
    setCurrentStep(stepIndex);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      // Here you would call your listing creation service
      // const newListing = await listingService.createListing(formData);
      
      // Mock success for now
      const mockListing = {
        id: Date.now(),
        ...formData,
        createdAt: new Date().toISOString()
      };
      
      if (onListingCreated) {
        onListingCreated(mockListing);
      }
    } catch (err) {
      console.error('Error creating listing:', err);
      setError('Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      marginBottom: '40px',
      position: 'relative'
    }}>
      {steps.map((step, index) => {
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;
        
        return (
          <div key={step.id} style={{ display: 'flex', alignItems: 'center' }}>
            {/* Step Circle */}
            <div
              onClick={() => handleStepClick(index)}
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: isActive ? '#3b82f6' : isCompleted ? '#10b981' : '#e5e7eb',
                color: isActive || isCompleted ? 'white' : '#6b7280',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                cursor: 'pointer',
                border: isActive ? '3px solid #1d4ed8' : 'none',
                position: 'relative',
                zIndex: 2,
                transition: 'all 0.3s ease'
              }}
            >
              {isCompleted ? '✓' : step.icon}
            </div>
            
            {/* Step Label */}
            <div style={{
              position: 'absolute',
              top: '70px',
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: '12px',
              fontWeight: '600',
              color: isActive ? '#3b82f6' : isCompleted ? '#10b981' : '#6b7280',
              textAlign: 'center',
              width: '100px',
              whiteSpace: 'nowrap'
            }}>
              {step.title}
            </div>
            
            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div style={{
                width: '80px',
                height: '2px',
                background: index < currentStep ? '#10b981' : '#e5e7eb',
                marginLeft: '-10px',
                marginRight: '-10px',
                zIndex: 1
              }} />
            )}
          </div>
        );
      })}
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '32px', fontWeight: '700', color: '#374151', marginBottom: '16px' }}>
              Select a Property
            </h2>
            <p style={{ fontSize: '16px', color: '#6b7280', marginBottom: '40px' }}>
              Choose the property and unit you want to create a listing for
            </p>
            
            <div style={{ display: 'grid', gap: '16px', maxWidth: '500px', margin: '0 auto' }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px',
                  textAlign: 'left'
                }}>
                  Property
                </label>
                <select
                  value={formData.selectedPropertyId}
                  onChange={(e) => handleInputChange('selectedPropertyId', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '16px',
                    background: 'white'
                  }}
                >
                  <option value="">Select a property...</option>
                  {properties.map(property => (
                    <option key={property.id} value={property.id}>
                      {property.name} - {property.address}
                    </option>
                  ))}
                </select>
              </div>
              
              {formData.selectedPropertyId && (
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '8px',
                    textAlign: 'left'
                  }}>
                    Unit (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Unit number (e.g., 1A, 2B, etc.)"
                    value={formData.selectedUnitId}
                    onChange={(e) => handleInputChange('selectedUnitId', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        );

      case 1:
        return (
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '32px', fontWeight: '700', color: '#374151', marginBottom: '16px' }}>
              Basic Information
            </h2>
            <p style={{ fontSize: '16px', color: '#6b7280', marginBottom: '40px' }}>
              Provide the basic details about your listing
            </p>
            
            <div style={{ display: 'grid', gap: '20px', textAlign: 'left' }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Listing Title
                </label>
                <input
                  type="text"
                  placeholder="e.g., Beautiful 2BR Apartment in Downtown"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '16px'
                  }}
                />
              </div>
              
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Description
                </label>
                <textarea
                  placeholder="Describe the property, amenities, and neighborhood..."
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={6}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '16px',
                    resize: 'vertical'
                  }}
                />
              </div>
              
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Listing Type
                </label>
                <select
                  value={formData.listingType}
                  onChange={(e) => handleInputChange('listingType', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '16px',
                    background: 'white'
                  }}
                >
                  <option value="Rental">For Rent</option>
                  <option value="Sale">For Sale</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '32px', fontWeight: '700', color: '#374151', marginBottom: '16px' }}>
              Rental Terms
            </h2>
            <p style={{ fontSize: '16px', color: '#6b7280', marginBottom: '40px' }}>
              Set the pricing and rental terms for this listing
            </p>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', textAlign: 'left' }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Monthly Rent
                </label>
                <input
                  type="number"
                  placeholder="2500"
                  value={formData.rentAmount}
                  onChange={(e) => handleInputChange('rentAmount', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '16px'
                  }}
                />
              </div>
              
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Security Deposit
                </label>
                <input
                  type="number"
                  placeholder="2500"
                  value={formData.securityDeposit}
                  onChange={(e) => handleInputChange('securityDeposit', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '16px'
                  }}
                />
              </div>
              
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Lease Length
                </label>
                <select
                  value={formData.leaseLength}
                  onChange={(e) => handleInputChange('leaseLength', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '16px',
                    background: 'white'
                  }}
                >
                  <option value="">Select lease length...</option>
                  <option value="6 months">6 months</option>
                  <option value="12 months">12 months</option>
                  <option value="18 months">18 months</option>
                  <option value="24 months">24 months</option>
                  <option value="Month-to-month">Month-to-month</option>
                </select>
              </div>
              
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Available Date
                </label>
                <input
                  type="date"
                  value={formData.availableDate}
                  onChange={(e) => handleInputChange('availableDate', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '16px'
                  }}
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '32px', fontWeight: '700', color: '#374151', marginBottom: '16px' }}>
              Unit Features
            </h2>
            <p style={{ fontSize: '16px', color: '#6b7280', marginBottom: '40px' }}>
              Specify the features and amenities of this unit
            </p>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', textAlign: 'left' }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Bedrooms
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.bedrooms}
                  onChange={(e) => handleInputChange('bedrooms', parseInt(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '16px'
                  }}
                />
              </div>
              
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Bathrooms
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={formData.bathrooms}
                  onChange={(e) => handleInputChange('bathrooms', parseFloat(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '16px'
                  }}
                />
              </div>
              
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Square Feet
                </label>
                <input
                  type="number"
                  placeholder="1200"
                  value={formData.squareFeet}
                  onChange={(e) => handleInputChange('squareFeet', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '16px'
                  }}
                />
              </div>
            </div>
            
            <div style={{ marginTop: '30px', textAlign: 'left' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '16px'
              }}>
                Additional Features (Select all that apply)
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {[
                  'Air Conditioning', 'Heating', 'Dishwasher', 'Washer/Dryer',
                  'Balcony/Patio', 'Parking', 'Pet Friendly', 'Gym/Fitness',
                  'Swimming Pool', 'Storage', 'Fireplace', 'Hardwood Floors'
                ].map(feature => (
                  <label key={feature} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}>
                    <input
                      type="checkbox"
                      checked={formData.features.includes(feature)}
                      onChange={(e) => {
                        const newFeatures = e.target.checked
                          ? [...formData.features, feature]
                          : formData.features.filter(f => f !== feature);
                        handleInputChange('features', newFeatures);
                      }}
                      style={{ marginRight: '4px' }}
                    />
                    {feature}
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '32px', fontWeight: '700', color: '#374151', marginBottom: '16px' }}>
              Upload Photos
            </h2>
            <p style={{ fontSize: '16px', color: '#6b7280', marginBottom: '40px' }}>
              Add photos to showcase your property (Coming soon)
            </p>
            
            <div style={{
              border: '2px dashed #d1d5db',
              borderRadius: '12px',
              padding: '60px 20px',
              textAlign: 'center',
              background: '#f9fafb'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📸</div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                Photo Upload Coming Soon
              </h3>
              <p style={{ color: '#6b7280', fontSize: '14px' }}>
                Photo upload functionality will be available in the next update.
                You can continue with the listing creation process.
              </p>
            </div>
          </div>
        );

      case 5:
        const selectedProperty = properties.find(p => p.id === formData.selectedPropertyId);
        
        return (
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '32px', fontWeight: '700', color: '#374151', marginBottom: '16px' }}>
              Preview & Publish
            </h2>
            <p style={{ fontSize: '16px', color: '#6b7280', marginBottom: '40px' }}>
              Review your listing details before publishing
            </p>
            
            <div style={{
              background: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              padding: '24px',
              textAlign: 'left'
            }}>
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  {formData.title || 'Untitled Listing'}
                </h3>
                <p style={{ color: '#6b7280', fontSize: '14px' }}>
                  {selectedProperty?.name} {formData.selectedUnitId && `- Unit ${formData.selectedUnitId}`}
                </p>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <strong style={{ color: '#374151' }}>Monthly Rent:</strong>
                  <div>${formData.rentAmount || 'Not specified'}</div>
                </div>
                <div>
                  <strong style={{ color: '#374151' }}>Available:</strong>
                  <div>{formData.availableDate || 'Not specified'}</div>
                </div>
                <div>
                  <strong style={{ color: '#374151' }}>Bedrooms:</strong>
                  <div>{formData.bedrooms}</div>
                </div>
                <div>
                  <strong style={{ color: '#374151' }}>Bathrooms:</strong>
                  <div>{formData.bathrooms}</div>
                </div>
              </div>
              
              {formData.description && (
                <div style={{ marginBottom: '20px' }}>
                  <strong style={{ color: '#374151' }}>Description:</strong>
                  <p style={{ marginTop: '8px', color: '#6b7280', fontSize: '14px' }}>
                    {formData.description}
                  </p>
                </div>
              )}
              
              {formData.features.length > 0 && (
                <div>
                  <strong style={{ color: '#374151' }}>Features:</strong>
                  <div style={{ marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {formData.features.map(feature => (
                      <span key={feature} style={{
                        padding: '4px 8px',
                        background: '#f3f4f6',
                        borderRadius: '12px',
                        fontSize: '12px',
                        color: '#374151'
                      }}>
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div style={{
      background: '#f8fafc',
      minHeight: '100vh',
      padding: '20px'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '40px',
        maxWidth: '1200px',
        margin: '0 auto',
        marginBottom: '40px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <button
            onClick={onBack}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '20px',
              cursor: 'pointer',
              color: '#6b7280',
              padding: '8px'
            }}
          >
            ←
          </button>
          <h1 style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#374151',
            margin: 0
          }}>
            Create New Listing
          </h1>
        </div>
      </div>

      {/* Step Indicator */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', marginBottom: '60px' }}>
        {renderStepIndicator()}
      </div>

      {/* Main Content */}
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        background: 'white',
        borderRadius: '16px',
        padding: '40px',
        boxShadow: '0 4px 16px 0 rgba(0, 0, 0, 0.08)',
        marginBottom: '40px'
      }}>
        {error && (
          <div style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '8px',
            padding: '12px 16px',
            marginBottom: '24px',
            color: '#dc2626'
          }}>
            {error}
          </div>
        )}

        {renderStepContent()}
      </div>

      {/* Navigation Buttons */}
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <button
          onClick={handlePrevious}
          disabled={currentStep === 0}
          style={{
            background: currentStep === 0 ? '#f3f4f6' : '#e5e7eb',
            color: currentStep === 0 ? '#9ca3af' : '#374151',
            border: 'none',
            borderRadius: '8px',
            padding: '12px 24px',
            fontSize: '16px',
            fontWeight: '500',
            cursor: currentStep === 0 ? 'not-allowed' : 'pointer'
          }}
        >
          Previous
        </button>

        <div style={{
          fontSize: '14px',
          color: '#6b7280'
        }}>
          Step {currentStep + 1} of {steps.length}
        </div>

        {currentStep === steps.length - 1 ? (
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              background: loading ? '#9ca3af' : '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Creating...' : 'Publish Listing'}
          </button>
        ) : (
          <button
            onClick={handleNext}
            style={{
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}
