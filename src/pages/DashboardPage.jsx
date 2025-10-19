import { useEffect, useState } from 'react';
// All hooks must be called inside the DashboardPage function below
import propertyService from '../services/propertyService';
import tenantService from '../services/tenantService';
import leaseService from '../services/leaseService';
import SendReminderModal from '../components/modals/SendReminderModal';
import RecordPaymentModal from '../components/modals/RecordPaymentModal';
import { DollarSign, Building2, AlertCircle, FileText, Users, ChevronRight } from 'lucide-react';
import { THEMES, ACTIVE_THEME } from '../config/theme';

const DashboardPage = ({ onNavigate }) => {
  const theme = THEMES[ACTIVE_THEME];
  
  const [properties, setProperties] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [leases, setLeases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reminderModal, setReminderModal] = useState({ isOpen: false, tenant: null });
  const [paymentModal, setPaymentModal] = useState({ isOpen: false, tenant: null });

  // Past Overdue filter state and logic
  const [pastOverdueFilter, setPastOverdueFilter] = useState('active'); // 'active' or 'all'
  // Filtered past overdue calculation
  const filteredPastOverdue = leases
    .filter(l => (pastOverdueFilter === 'active' ? (l.status || '').toLowerCase() === 'active' : true))
    .reduce((sum, l) => sum + (l.pastOverdueAmount || 0), 0);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const [props, tens, leas] = await Promise.all([
        propertyService.getAllProperties(),
        tenantService.getAllTenants(),
        leaseService.getAllLeases(),
      ]);
      setProperties(props || []);
      setTenants(tens || []);
      setLeases(leas || []);
      setLoading(false);
    }
    fetchData();
  }, []);

  // Calculations
  const totalCollected = leases.reduce((sum, l) => sum + (l.totalPayments || 0), 0);
  const totalOverdue = leases.reduce((sum, l) => sum + (l.overdueAmount || 0), 0);
  const totalProcessing = leases.reduce((sum, l) => sum + (l.processingAmount || 0), 0);
  const totalComingDue = leases.reduce((sum, l) => sum + (l.comingDueAmount || 0), 0);
  const totalAmount = totalCollected + totalOverdue + totalProcessing + totalComingDue;
  const percentCollected = totalAmount ? (totalCollected / totalAmount) * 100 : 0;
  const percentOverdue = totalAmount ? (totalOverdue / totalAmount) * 100 : 0;
  const percentProcessing = totalAmount ? (totalProcessing / totalAmount) * 100 : 0;
  const percentComingDue = totalAmount ? (totalComingDue / totalAmount) * 100 : 0;

  const totalUnits = properties.reduce((sum, p) => sum + (p.unitDetails ? p.unitDetails.length : (p.units || 1)), 0);
  const occupiedUnits = leases.filter(l => (l.status || '').toLowerCase() === 'active').length;
  const vacantUnits = Math.max(0, totalUnits - occupiedUnits);
  const occupancyPercent = totalUnits ? Math.round((occupiedUnits / totalUnits) * 100) : 0;
  const unitsWithOverdue = leases.filter(l => (l.overdueAmount || 0) > 0).length;

  const unsignedLeases = leases.filter(l => {
    const sigs = l.signatures;
    return !sigs || Object.keys(sigs || {}).length === 0;
  });

  const applicationsProcessing = tenants.filter(t => t.applicationStatus && t.applicationStatus !== 'No Applied Yet');

  // Handlers
  const handleAddTenant = () => {
    if (onNavigate) onNavigate('LeasesFiles');
  };

  const handleRecordPayment = (tenant = null) => {
    setPaymentModal({ isOpen: true, tenant });
  };

  const handleViewOverdue = () => {
    if (onNavigate) onNavigate('Income', { statusFilter: 'overdue' });
  };

  const handleViewCollected = () => {
    if (onNavigate) onNavigate('Income', { statusFilter: 'collected' });
  };

  const handleViewProcessing = () => {
    if (onNavigate) onNavigate('Income', { statusFilter: 'processing' });
  };

  const handleViewComingDue = () => {
    if (onNavigate) onNavigate('Income', { statusFilter: 'coming-due' });
  };

  const handleSignLease = (leaseId = null) => {
    if (onNavigate) {
      if (leaseId) {
        onNavigate('LeasesFiles', { leaseId });
      } else {
        onNavigate('LeasesFiles');
      }
    }
  };

  const handleSendReminder = (tenant) => {
    setReminderModal({ isOpen: true, tenant });
  };

  const handleReminderSent = async (reminderData) => {
    try {
      await tenantService.addReminder(reminderData);
      setReminderModal({ isOpen: false, tenant: null });
    } catch (error) {
      console.error('Failed to send reminder:', error);
    }
  };

  const handlePaymentRecorded = async (paymentData) => {
    try {
      await tenantService.addTenantPayment(paymentData.tenantId, paymentData);
      setPaymentModal({ isOpen: false, tenant: null });
      const [updatedProps, updatedTenants, updatedLeases] = await Promise.all([
        propertyService.getAllProperties(),
        tenantService.getAllTenants(),
        leaseService.getAllLeases(),
      ]);
      setProperties(updatedProps || []);
      setTenants(updatedTenants || []);
      setLeases(updatedLeases || []);
    } catch (error) {
      console.error('Failed to record payment:', error);
      throw error;
    }
  };

  const handleTenantClick = (tenantId) => {
    if (onNavigate) onNavigate('Tenants', { selectedTenantId: tenantId });
  };

  const handleLeaseClick = (leaseId) => {
    if (onNavigate) onNavigate('LeasesFiles', { selectedLeaseId: leaseId });
  };

  if (loading) {
    return (
      <div style={{ padding: 32, color: '#64748b', fontSize: 14 }}>Loading...</div>
    );
  }

  return (
    <div style={{ padding: 32, maxWidth: 1400, margin: '0 auto', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      {/* Top action buttons */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginBottom: 32 }}>
        <button
          onClick={handleRecordPayment}
          style={{
            background: 'white',
            color: theme.colors.text.secondary,
            border: `1px solid ${theme.colors.border.light}`,
            borderRadius: '6px',
            padding: '8px 16px',
            fontSize: '13px',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = theme.colors.border.medium;
            e.currentTarget.style.background = theme.gradients.card;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = theme.colors.border.light;
            e.currentTarget.style.background = 'white';
          }}
        >
          Record Payment
        </button>
        <button
          onClick={handleAddTenant}
          style={{
            background: theme.colors.gradient.primary,
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            padding: '8px 16px',
            fontSize: '13px',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = theme.colors.gradient.primaryDark;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = theme.colors.gradient.primary;
          }}
        >
          Add Tenant
        </button>
      </div>

      {/* Main grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr', gap: '20px', marginBottom: '20px', alignItems: 'start' }}>
        {/* Collection Stats */}
        <div style={{
          background: 'white',
          borderRadius: '8px',
          border: `1px solid ${theme.colors.border.light}`,
          padding: '24px',
          minHeight: 280,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: theme.colors.text.primary, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <DollarSign size={16} color={theme.colors.gradient.primary} strokeWidth={2} />
              Collection Stats
            </div>
            <select style={{ 
              border: `1px solid ${theme.colors.border.light}`, 
              borderRadius: '4px', 
              padding: '4px 8px', 
              fontSize: '12px', 
              background: 'white', 
              color: theme.colors.text.secondary 
            }}>
              <option>May 2023</option>
            </select>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', justifyContent: 'space-between' }}>
            {/* Donut chart */}
            <div style={{ position: 'relative', width: 140, height: 140 }}>
              <svg width="140" height="140" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="70" cy="70" r="60" fill="none" stroke={theme.colors.gradient.light} strokeWidth="14" />
                <circle
                  cx="70" cy="70" r="60" fill="none" stroke={theme.colors.gradient.primary} strokeWidth="14"
                  strokeDasharray="376.99"
                  strokeDashoffset={(376.99 * (1 - percentCollected / 100)).toFixed(2)}
                  strokeLinecap="round"
                />
              </svg>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: theme.colors.text.secondary, fontWeight: 500 }}>Total</div>
                <div style={{ fontSize: '18px', color: theme.colors.gradient.primary, fontWeight: 600 }}>${totalAmount.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</div>
              </div>
            </div>
            
            {/* Stats */}
            <div style={{ display: 'flex', flex: 1, justifyContent: 'space-between', gap: 16 }}>
              <div 
                onClick={handleViewCollected}
                style={{ 
                  textAlign: 'center',
                  cursor: 'pointer',
                  padding: '8px',
                  borderRadius: '8px',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = theme.gradients.card;
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <div style={{ fontSize: '12px', color: theme.colors.text.secondary, fontWeight: 500, marginBottom: 4 }}>Collected</div>
                <div style={{ fontSize: '16px', fontWeight: 600, color: theme.colors.gradient.primary, marginBottom: 2 }}>${totalCollected.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</div>
                <div style={{ fontSize: '11px', color: theme.colors.text.secondary, fontWeight: 500 }}>{percentCollected.toFixed(1)}%</div>
              </div>
              <div 
                onClick={handleViewOverdue}
                style={{ 
                  textAlign: 'center',
                  cursor: 'pointer',
                  padding: '8px',
                  borderRadius: '8px',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#fee2e2';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <div style={{ fontSize: '12px', color: '#ef4444', fontWeight: 500, marginBottom: 4 }}>Overdue</div>
                <div style={{ fontSize: '16px', fontWeight: 600, color: '#ef4444', marginBottom: 2 }}>${totalOverdue.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</div>
                <div style={{ fontSize: '11px', color: '#ef4444', fontWeight: 500 }}>{percentOverdue.toFixed(1)}%</div>
              </div>
              <div 
                onClick={handleViewProcessing}
                style={{ 
                  textAlign: 'center',
                  cursor: 'pointer',
                  padding: '8px',
                  borderRadius: '8px',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#fef3c7';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <div style={{ fontSize: '12px', color: '#f59e0b', fontWeight: 500, marginBottom: 4 }}>Processing</div>
                <div style={{ fontSize: '16px', fontWeight: 600, color: '#f59e0b', marginBottom: 2 }}>${totalProcessing.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</div>
                <div style={{ fontSize: '11px', color: '#f59e0b', fontWeight: 500 }}>{percentProcessing.toFixed(1)}%</div>
              </div>
              <div 
                onClick={handleViewComingDue}
                style={{ 
                  textAlign: 'center',
                  cursor: 'pointer',
                  padding: '8px',
                  borderRadius: '8px',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = theme.gradients.card;
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <div style={{ fontSize: '12px', color: theme.colors.gradient.primary, fontWeight: 500, marginBottom: 4 }}>Coming Due</div>
                <div style={{ fontSize: '16px', fontWeight: 600, color: theme.colors.gradient.primary, marginBottom: 2 }}>${totalComingDue.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</div>
                <div style={{ fontSize: '11px', color: theme.colors.gradient.primary, fontWeight: 500 }}>{percentComingDue.toFixed(1)}%</div>
              </div>
            </div>
            
            {/* Overdue units */}
            <div style={{ textAlign: 'center', borderLeft: `1px solid ${theme.colors.border.light}`, paddingLeft: 20 }}>
              <div style={{ fontSize: 12, color: theme.colors.text.secondary, marginBottom: 8, fontWeight: 500 }}>Units with Overdue</div>
              <div style={{ fontSize: 20, fontWeight: 600, color: '#ef4444' }}>{unitsWithOverdue}/{leases.length}</div>
              <div onClick={handleViewOverdue} style={{ marginTop: 8, fontSize: 12, color: theme.colors.gradient.primary, cursor: 'pointer', fontWeight: 500 }}>View All</div>
            </div>
          </div>
          
          {/* Past overdue */}
          {/* Past Overdue with filter toggle */}
          <div style={{ 
            marginTop: 20, 
            background: theme.gradients.card, 
            borderRadius: 6, 
            padding: '10px 16px', 
            color: '#ef4444', 
            fontWeight: 500, 
            fontSize: 13 
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <span>Past Overdue</span>
              <div style={{ display: 'flex', gap: 4, background: '#fff', borderRadius: 20, padding: 2, boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
                <button
                  onClick={() => setPastOverdueFilter('active')}
                  style={{
                    background: pastOverdueFilter === 'active' ? theme.colors.gradient.primary : 'transparent',
                    color: pastOverdueFilter === 'active' ? '#fff' : theme.colors.text.primary,
                    border: 'none',
                    borderRadius: 16,
                    padding: '4px 14px',
                    fontWeight: 600,
                    fontSize: 12,
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >Active Only</button>
                <button
                  onClick={() => setPastOverdueFilter('all')}
                  style={{
                    background: pastOverdueFilter === 'all' ? theme.colors.gradient.primary : 'transparent',
                    color: pastOverdueFilter === 'all' ? '#fff' : theme.colors.text.primary,
                    border: 'none',
                    borderRadius: 16,
                    padding: '4px 14px',
                    fontWeight: 600,
                    fontSize: 12,
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >All Time</button>
              </div>
            </div>
            <div>
              {/* Calculate and display filtered past overdue amount */}
              ${filteredPastOverdue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
        </div>

        {/* Right sidebar: Occupancy */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{
            background: 'white',
            borderRadius: '8px',
            border: `1px solid ${theme.colors.border.light}`,
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
            <div style={{ fontSize: 13, color: theme.colors.text.primary, marginBottom: 16, fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Building2 size={14} color={theme.colors.gradient.primary} strokeWidth={2} />
              Occupancy
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 18, fontWeight: 600, color: '#ef4444' }}>{vacantUnits}</div>
                <div style={{ fontSize: 11, color: theme.colors.text.secondary }}>Vacant</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 18, fontWeight: 600, color: theme.colors.gradient.primary }}>{occupiedUnits}</div>
                <div style={{ fontSize: 11, color: theme.colors.text.secondary }}>Occupied</div>
              </div>
              <div style={{ width: 44, height: 44, position: 'relative' }}>
                <svg width="44" height="44" style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx="22" cy="22" r="18" fill="none" stroke={theme.colors.gradient.light} strokeWidth="5" />
                  <circle cx="22" cy="22" r="18" fill="none" stroke={theme.colors.gradient.primary} strokeWidth="5" strokeDasharray="113.1" strokeDashoffset={(113.1 * (1 - occupancyPercent / 100)).toFixed(2)} strokeLinecap="round" />
                </svg>
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: 10, fontWeight: 600, color: theme.colors.text.primary }}>{occupancyPercent}%</div>
              </div>
            </div>
          </div>

          {/* Maintenance */}
          <div style={{
            background: 'white',
            borderRadius: '8px',
            border: `1px solid ${theme.colors.border.light}`,
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
            <div style={{ fontSize: 13, color: theme.colors.text.primary, marginBottom: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <AlertCircle size={14} color={theme.colors.gradient.primary} strokeWidth={2} />
              Maintenance
            </div>
            <div style={{ fontSize: 18, color: theme.colors.gradient.primary, fontWeight: 600 }}>1 Open</div>
            <div style={{ fontSize: 18, color: '#f59e0b', fontWeight: 600 }}>1 Scheduled</div>
          </div>
        </div>
      </div>

      {/* Bottom grid: Leases & Applications */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Unsigned Leases */}
        <div style={{
          background: 'white',
          borderRadius: '8px',
          border: `1px solid ${theme.colors.border.light}`,
          padding: '20px',
        }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: theme.colors.text.primary, marginBottom: 16, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <FileText size={14} color={theme.colors.gradient.primary} strokeWidth={2} />
            Unsigned Leases
          </div>
          {unsignedLeases.length === 0 && (
            <div style={{ color: theme.colors.text.secondary, fontSize: 12 }}>No unsigned leases</div>
          )}
          {unsignedLeases.slice(0, 4).map((lease) => (
            <div key={lease.id} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 0',
              borderBottom: `1px solid ${theme.colors.border.light}`,
              gap: 12
            }}>
              <div>
                <div 
                  onClick={() => handleLeaseClick(lease.id)}
                  style={{ fontWeight: 600, color: theme.colors.gradient.primary, fontSize: 13, cursor: 'pointer' }}
                >
                  {lease.property?.name || lease.unit?.unitNumber || 'Unknown Property'}
                </div>
                <div style={{ fontSize: 11, color: theme.colors.text.secondary }}>
                  {lease.signatures && Object.keys(lease.signatures || {}).length || 0}/{lease.tenants?.length || 1} signed
                </div>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button 
                  onClick={() => handleSendReminder(lease.tenant)} 
                  style={{ 
                    background: 'white', 
                    color: theme.colors.text.secondary, 
                    border: `1px solid ${theme.colors.border.light}`, 
                    borderRadius: 4, 
                    padding: '4px 10px', 
                    fontSize: 11, 
                    fontWeight: 500, 
                    cursor: 'pointer' 
                  }}
                >
                  Remind
                </button>
                <button 
                  onClick={() => handleSignLease(lease.id)} 
                  style={{ 
                    background: theme.colors.gradient.primary, 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: 4, 
                    padding: '4px 10px', 
                    fontSize: 11, 
                    fontWeight: 500, 
                    cursor: 'pointer' 
                  }}
                >
                  Sign
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Applications */}
        <div style={{
          background: 'white',
          borderRadius: '8px',
          border: `1px solid ${theme.colors.border.light}`,
          padding: '20px',
        }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: theme.colors.text.primary, marginBottom: 16, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Users size={14} color={theme.colors.gradient.primary} strokeWidth={2} />
            Applications Processing
          </div>
          {applicationsProcessing.length === 0 && (
            <div style={{ color: theme.colors.text.secondary, fontSize: 12 }}>No applications in process</div>
          )}
          {applicationsProcessing.slice(0, 6).map((app) => (
            <div key={app.id} style={{ 
              padding: '10px 0', 
              borderBottom: `1px solid ${theme.colors.border.light}`, 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center' 
            }}>
              <div>
                <div 
                  style={{ fontWeight: 600, color: theme.colors.gradient.primary, fontSize: 13, cursor: 'pointer' }} 
                  onClick={() => handleTenantClick(app.id)}
                >
                  {app.firstName} {app.lastName}
                </div>
                <div style={{ fontSize: 11, color: theme.colors.text.secondary }}>
                  {app.applicationDate || app.appliedOn || 'Applied recently'}
                </div>
              </div>
              <button 
                onClick={() => handleSendReminder(app)} 
                style={{ 
                  background: theme.colors.gradient.primary, 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: 4, 
                  padding: '4px 10px', 
                  fontSize: 11, 
                  fontWeight: 500, 
                  cursor: 'pointer' 
                }}
              >
                Follow Up
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Modals */}
      <SendReminderModal
        isOpen={reminderModal.isOpen}
        onClose={() => setReminderModal({ isOpen: false, tenant: null })}
        tenant={reminderModal.tenant}
        onSendReminder={handleReminderSent}
      />

      <RecordPaymentModal
        isOpen={paymentModal.isOpen}
        onClose={() => setPaymentModal({ isOpen: false, tenant: null })}
        tenant={paymentModal.tenant}
        onPaymentRecorded={handlePaymentRecorded}
      />
    </div>
  );
};

export default DashboardPage;
