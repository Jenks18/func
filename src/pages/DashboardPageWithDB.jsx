import { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { supabase } from '../services/supabaseClient';
import SendReminderModal from '../components/modals/SendReminderModal';
import RecordPaymentModalEnhanced from '../components/modals/RecordPaymentModalEnhanced';
import { DollarSign, Building2, AlertCircle, FileText, Users } from 'lucide-react';
import { THEMES, ACTIVE_THEME } from '../config/theme';

const DashboardPageWithDB = ({ onNavigate }) => {
  const theme = THEMES[ACTIVE_THEME];
  const { user } = useUser();
  
  // State
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [monthOptions, setMonthOptions] = useState([]);
  const [stats, setStats] = useState({
    collected: 0,
    overdue: 0,
    processing: 0,
    comingDue: 0,
    total: 0
  });
  const [pastOverdue, setPastOverdue] = useState({ active: 0, allTime: 0 });
  const [pastOverdueFilter, setPastOverdueFilter] = useState('active');
  const [occupancy, setOccupancy] = useState({
    total: 0,
    occupied: 0,
    vacant: 0,
    percent: 0,
    unitsWithOverdue: 0
  });
  const [maintenance, setMaintenance] = useState({ open: 0, scheduled: 0 });
  const [unsignedLeases, setUnsignedLeases] = useState([]);
  const [applications, setApplications] = useState([]);
  const [reminderModal, setReminderModal] = useState({ isOpen: false, tenant: null });
  const [paymentModal, setPaymentModal] = useState({ isOpen: false, tenant: null });
  const [organizationId, setOrganizationId] = useState(null);
  const [accountCreatedDate, setAccountCreatedDate] = useState(null);

  // Get organization ID and setup
  useEffect(() => {
    async function setupDashboard() {
      if (!user?.id) return;
      
      try {
        // Get organization ID from user
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('organization_id')
          .eq('clerk_id', user.id)
          .single();

        if (userError) throw userError;
        
        const orgId = userData.organization_id;
        setOrganizationId(orgId);

        // Get organization created date
        const { data: orgData, error: orgError } = await supabase
          .from('organizations')
          .select('created_at')
          .eq('id', orgId)
          .single();

        if (orgError) throw orgError;

        const createdDate = new Date(orgData.created_at);
        setAccountCreatedDate(createdDate);

        // Generate month options from account creation to now
        const months = generateMonthOptions(createdDate);
        setMonthOptions(months);
        
        // Set current month as default
        const currentMonth = months[0];
        setSelectedMonth(currentMonth);

      } catch (error) {
        console.error('Setup error:', error);
      }
    }

    setupDashboard();
  }, [user]);

  // Fetch all dashboard data when month or org changes
  useEffect(() => {
    if (organizationId && selectedMonth) {
      fetchDashboardData();
    }
  }, [organizationId, selectedMonth]);

  // Generate month options from account creation to present
  const generateMonthOptions = (startDate) => {
    const months = [];
    const now = new Date();
    const current = new Date(now.getFullYear(), now.getMonth(), 1);
    const start = new Date(startDate.getFullYear(), startDate.getMonth(), 1);

    while (current >= start) {
      months.push({
        value: `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}`,
        label: current.toLocaleString('default', { month: 'long', year: 'numeric' })
      });
      current.setMonth(current.getMonth() - 1);
    }

    return months;
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchCollectionStats(),
        fetchPastOverdue(),
        fetchOccupancy(),
        fetchMaintenance(),
        fetchUnsignedLeases(),
        fetchApplications()
      ]);
    } catch (error) {
      console.error('Dashboard data fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Collection Stats (Collected, Overdue, Processing, Coming Due)
  const fetchCollectionStats = async () => {
    try {
      // Get month start and end dates
      const [year, month] = selectedMonth.value.split('-');
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Fetch all leases with rent amounts
      const { data: leases, error: leasesError } = await supabase
        .from('leases')
        .select('id, rent_amount, status, lease_start_date, lease_end_date')
        .eq('organization_id', organizationId)
        .eq('status', 'active');

      if (leasesError) throw leasesError;

      // Fetch all transactions for the selected month
      const { data: transactions, error: transError } = await supabase
        .from('transactions')
        .select('*')
        .eq('organization_id', organizationId)
        .eq('type', 'income')
        .gte('date', startDate.toISOString().split('T')[0])
        .lte('date', endDate.toISOString().split('T')[0]);

      if (transError) throw transError;

      // Calculate stats
      let collected = 0;
      let overdue = 0;
      let processing = 0;
      let comingDue = 0;

      // Collected: all completed transactions
      collected = transactions
        ?.filter(t => t.status === 'completed')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0) || 0;

      // For each active lease, calculate what's owed
      leases?.forEach(lease => {
        const rentAmount = parseFloat(lease.rent_amount);
        
        // Find payments for this lease this month
        const leasePaid = transactions
          ?.filter(t => t.lease_id === lease.id && t.status === 'completed')
          .reduce((sum, t) => sum + parseFloat(t.amount), 0) || 0;

        const balance = rentAmount - leasePaid;

        if (balance > 0) {
          // Due date is typically the 1st of the month
          const dueDate = new Date(year, month - 1, 1);
          
          if (today > dueDate) {
            overdue += balance;
          } else if (today.getDate() >= 25) {
            // Coming due in next few days
            comingDue += balance;
          } else {
            processing += balance;
          }
        }
      });

      const total = collected + overdue + processing + comingDue;

      setStats({
        collected: Math.round(collected * 100) / 100,
        overdue: Math.round(overdue * 100) / 100,
        processing: Math.round(processing * 100) / 100,
        comingDue: Math.round(comingDue * 100) / 100,
        total: Math.round(total * 100) / 100
      });

    } catch (error) {
      console.error('Error fetching collection stats:', error);
    }
  };

  // Fetch Past Overdue amounts
  const fetchPastOverdue = async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Get all active leases
      const { data: activeLeases, error: activeLeasesError } = await supabase
        .from('leases')
        .select('id, rent_amount')
        .eq('organization_id', organizationId)
        .eq('status', 'active');

      if (activeLeasesError) throw activeLeasesError;

      // Get all leases (for all-time calculation)
      const { data: allLeases, error: allLeasesError } = await supabase
        .from('leases')
        .select('id, rent_amount, status')
        .eq('organization_id', organizationId);

      if (allLeasesError) throw allLeasesError;

      // Get all transactions
      const { data: transactions, error: transError } = await supabase
        .from('transactions')
        .select('*')
        .eq('organization_id', organizationId)
        .eq('type', 'income')
        .lt('date', today.toISOString().split('T')[0]);

      if (transError) throw transError;

      // Calculate active overdue
      let activeOverdue = 0;
      activeLeases?.forEach(lease => {
        const expectedPayments = calculateExpectedPayments(lease);
        const actualPayments = transactions
          ?.filter(t => t.lease_id === lease.id && t.status === 'completed')
          .reduce((sum, t) => sum + parseFloat(t.amount), 0) || 0;
        
        const balance = expectedPayments - actualPayments;
        if (balance > 0) {
          activeOverdue += balance;
        }
      });

      // Calculate all-time overdue
      let allTimeOverdue = 0;
      allLeases?.forEach(lease => {
        const expectedPayments = calculateExpectedPayments(lease);
        const actualPayments = transactions
          ?.filter(t => t.lease_id === lease.id && t.status === 'completed')
          .reduce((sum, t) => sum + parseFloat(t.amount), 0) || 0;
        
        const balance = expectedPayments - actualPayments;
        if (balance > 0) {
          allTimeOverdue += balance;
        }
      });

      setPastOverdue({
        active: Math.round(activeOverdue * 100) / 100,
        allTime: Math.round(allTimeOverdue * 100) / 100
      });

    } catch (error) {
      console.error('Error fetching past overdue:', error);
    }
  };

  // Helper to calculate expected payments based on lease duration
  const calculateExpectedPayments = (lease) => {
    // Simplified: assume monthly rent from start date to now or end date
    // This should be enhanced based on your business logic
    const rentAmount = parseFloat(lease.rent_amount);
    const startDate = new Date(lease.lease_start_date);
    const endDate = lease.lease_end_date ? new Date(lease.lease_end_date) : new Date();
    const today = new Date();
    
    const effectiveEndDate = endDate < today ? endDate : today;
    
    const monthsPassed = Math.max(0, 
      (effectiveEndDate.getFullYear() - startDate.getFullYear()) * 12 +
      (effectiveEndDate.getMonth() - startDate.getMonth()) + 1
    );

    return rentAmount * monthsPassed;
  };

  // Fetch Occupancy stats
  const fetchOccupancy = async () => {
    try {
      // Get total units
      const { data: units, error: unitsError } = await supabase
        .from('units')
        .select('id')
        .eq('organization_id', organizationId);

      if (unitsError) throw unitsError;

      // Get active leases (occupied units)
      const { data: activeLeases, error: leasesError } = await supabase
        .from('leases')
        .select('id, unit_id')
        .eq('organization_id', organizationId)
        .eq('status', 'active');

      if (leasesError) throw leasesError;

      const total = units?.length || 0;
      const occupied = activeLeases?.length || 0;
      const vacant = total - occupied;
      const percent = total > 0 ? Math.round((occupied / total) * 100) : 0;

      // Count units with overdue payments
      const { data: overdueLeases, error: overdueError } = await supabase
        .from('leases')
        .select('id, rent_amount')
        .eq('organization_id', organizationId)
        .eq('status', 'active');

      if (overdueError) throw overdueError;

      // Check which leases have overdue amounts
      let unitsWithOverdue = 0;
      if (overdueLeases) {
        for (const lease of overdueLeases) {
          const expected = calculateExpectedPayments(lease);
          const { data: payments } = await supabase
            .from('transactions')
            .select('amount')
            .eq('lease_id', lease.id)
            .eq('status', 'completed')
            .eq('type', 'income');
          
          const paid = payments?.reduce((sum, p) => sum + parseFloat(p.amount), 0) || 0;
          if (expected > paid) {
            unitsWithOverdue++;
          }
        }
      }

      setOccupancy({
        total,
        occupied,
        vacant,
        percent,
        unitsWithOverdue
      });

    } catch (error) {
      console.error('Error fetching occupancy:', error);
    }
  };

  // Fetch Maintenance stats
  const fetchMaintenance = async () => {
    try {
      const { data, error } = await supabase
        .from('maintenance_requests')
        .select('status')
        .eq('organization_id', organizationId)
        .in('status', ['open', 'in_progress']);

      if (error) throw error;

      const open = data?.filter(m => m.status === 'open').length || 0;
      const scheduled = data?.filter(m => m.status === 'in_progress').length || 0;

      setMaintenance({ open, scheduled });

    } catch (error) {
      console.error('Error fetching maintenance:', error);
    }
  };

  // Fetch Unsigned Leases
  const fetchUnsignedLeases = async () => {
    try {
      const { data, error } = await supabase
        .from('leases')
        .select(`
          id,
          status,
          metadata,
          properties (name),
          units (unit_number),
          tenants (id, first_name, last_name, email)
        `)
        .eq('organization_id', organizationId)
        .eq('status', 'pending');

      if (error) throw error;

      // Filter for leases that don't have all signatures
      const unsigned = data?.filter(lease => {
        const signatures = lease.metadata?.signatures || {};
        const signatureCount = Object.keys(signatures).length;
        // Assume need at least 1 signature (tenant signature)
        return signatureCount === 0;
      }) || [];

      setUnsignedLeases(unsigned);

    } catch (error) {
      console.error('Error fetching unsigned leases:', error);
    }
  };

  // Fetch Applications
  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('tenants')
        .select('id, first_name, last_name, email, metadata')
        .eq('organization_id', organizationId);

      if (error) throw error;

      // Filter for applications in process (has application_status in metadata)
      const processing = data?.filter(tenant => {
        const appStatus = tenant.metadata?.application_status;
        return appStatus && appStatus !== 'approved' && appStatus !== 'rejected';
      }) || [];

      setApplications(processing);

    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  // Handlers
  const handleRecordPayment = (tenant = null) => {
    setPaymentModal({ isOpen: true, tenant });
  };

  const handlePaymentRecorded = async (paymentData) => {
    try {
      // Create transaction in database
      const { error } = await supabase
        .from('transactions')
        .insert({
          organization_id: organizationId,
          tenant_id: paymentData.tenantId,
          lease_id: paymentData.leaseId,
          property_id: paymentData.propertyId,
          unit_id: paymentData.unitId,
          type: 'income',
          category: 'rent',
          amount: paymentData.amount,
          date: paymentData.paymentDate,
          description: paymentData.description,
          payment_method: paymentData.paymentMethod,
          reference_number: paymentData.reference,
          status: 'completed'
        });

      if (error) throw error;

      setPaymentModal({ isOpen: false, tenant: null });
      
      // Refresh dashboard data
      await fetchDashboardData();

    } catch (error) {
      console.error('Failed to record payment:', error);
      throw error;
    }
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

  const handleSendReminder = (tenant) => {
    setReminderModal({ isOpen: true, tenant });
  };

  const handleReminderSent = async (reminderData) => {
    try {
      // TODO: Implement reminder sending logic
      setReminderModal({ isOpen: false, tenant: null });
    } catch (error) {
      console.error('Failed to send reminder:', error);
    }
  };

  if (loading || !selectedMonth) {
    return (
      <div style={{ padding: 32, color: '#64748b', fontSize: 14 }}>Loading dashboard...</div>
    );
  }

  const percentCollected = stats.total ? (stats.collected / stats.total) * 100 : 0;
  const percentOverdue = stats.total ? (stats.overdue / stats.total) * 100 : 0;
  const percentProcessing = stats.total ? (stats.processing / stats.total) * 100 : 0;
  const percentComingDue = stats.total ? (stats.comingDue / stats.total) * 100 : 0;

  const filteredPastOverdue = pastOverdueFilter === 'active' ? pastOverdue.active : pastOverdue.allTime;

  return (
    <div style={{ padding: 32, maxWidth: 1400, margin: '0 auto', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      {/* Top action buttons */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginBottom: 32 }}>
        <button
          onClick={() => handleRecordPayment()}
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
          onClick={() => onNavigate && onNavigate('LeasesFiles')}
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
            <select 
              value={selectedMonth?.value || ''}
              onChange={(e) => {
                const selected = monthOptions.find(m => m.value === e.target.value);
                setSelectedMonth(selected);
              }}
              style={{ 
                border: `1px solid ${theme.colors.border.light}`, 
                borderRadius: '4px', 
                padding: '4px 8px', 
                fontSize: '12px', 
                background: 'white', 
                color: theme.colors.text.secondary,
                cursor: 'pointer'
              }}
            >
              {monthOptions.map(month => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
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
                <div style={{ fontSize: '18px', color: theme.colors.gradient.primary, fontWeight: 600 }}>
                  ${stats.total.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}
                </div>
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
                <div style={{ fontSize: '16px', fontWeight: 600, color: theme.colors.gradient.primary, marginBottom: 2 }}>
                  ${stats.collected.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}
                </div>
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
                <div style={{ fontSize: '16px', fontWeight: 600, color: '#ef4444', marginBottom: 2 }}>
                  ${stats.overdue.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}
                </div>
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
                <div style={{ fontSize: '16px', fontWeight: 600, color: '#f59e0b', marginBottom: 2 }}>
                  ${stats.processing.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}
                </div>
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
                <div style={{ fontSize: '16px', fontWeight: 600, color: theme.colors.gradient.primary, marginBottom: 2 }}>
                  ${stats.comingDue.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}
                </div>
                <div style={{ fontSize: '11px', color: theme.colors.gradient.primary, fontWeight: 500 }}>{percentComingDue.toFixed(1)}%</div>
              </div>
            </div>
            
            {/* Overdue units */}
            <div style={{ textAlign: 'center', borderLeft: `1px solid ${theme.colors.border.light}`, paddingLeft: 20 }}>
              <div style={{ fontSize: 12, color: theme.colors.text.secondary, marginBottom: 8, fontWeight: 500 }}>Units with Overdue</div>
              <div style={{ fontSize: 20, fontWeight: 600, color: '#ef4444' }}>
                {occupancy.unitsWithOverdue}/{occupancy.occupied}
              </div>
              <div 
                onClick={handleViewOverdue} 
                style={{ marginTop: 8, fontSize: 12, color: theme.colors.gradient.primary, cursor: 'pointer', fontWeight: 500 }}
              >
                View All
              </div>
            </div>
          </div>
          
          {/* Past overdue with filter */}
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
              ${filteredPastOverdue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Occupancy */}
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
                <div style={{ fontSize: 18, fontWeight: 600, color: '#ef4444' }}>{occupancy.vacant}</div>
                <div style={{ fontSize: 11, color: theme.colors.text.secondary }}>Vacant</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 18, fontWeight: 600, color: theme.colors.gradient.primary }}>{occupancy.occupied}</div>
                <div style={{ fontSize: 11, color: theme.colors.text.secondary }}>Occupied</div>
              </div>
              <div style={{ width: 44, height: 44, position: 'relative' }}>
                <svg width="44" height="44" style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx="22" cy="22" r="18" fill="none" stroke={theme.colors.gradient.light} strokeWidth="5" />
                  <circle 
                    cx="22" cy="22" r="18" fill="none" stroke={theme.colors.gradient.primary} strokeWidth="5" 
                    strokeDasharray="113.1" 
                    strokeDashoffset={(113.1 * (1 - occupancy.percent / 100)).toFixed(2)} 
                    strokeLinecap="round" 
                  />
                </svg>
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: 10, fontWeight: 600, color: theme.colors.text.primary }}>
                  {occupancy.percent}%
                </div>
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
            cursor: 'pointer'
          }}
          onClick={() => onNavigate && onNavigate('Maintenance')}
          >
            <div style={{ fontSize: 13, color: theme.colors.text.primary, marginBottom: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <AlertCircle size={14} color={theme.colors.gradient.primary} strokeWidth={2} />
              Maintenance
            </div>
            <div style={{ fontSize: 18, color: theme.colors.gradient.primary, fontWeight: 600 }}>
              {maintenance.open} Open
            </div>
            <div style={{ fontSize: 18, color: '#f59e0b', fontWeight: 600 }}>
              {maintenance.scheduled} Scheduled
            </div>
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
            <div style={{ color: theme.colors.text.secondary, fontSize: 12, padding: '20px 0', textAlign: 'center' }}>
              ✓ All leases are signed
            </div>
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
                  onClick={() => onNavigate && onNavigate('LeasesFiles', { selectedLeaseId: lease.id })}
                  style={{ fontWeight: 600, color: theme.colors.gradient.primary, fontSize: 13, cursor: 'pointer' }}
                >
                  {lease.properties?.name || lease.units?.unit_number || 'Unknown Property'}
                </div>
                <div style={{ fontSize: 11, color: theme.colors.text.secondary }}>
                  {lease.tenants?.first_name} {lease.tenants?.last_name}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button 
                  onClick={() => handleSendReminder(lease.tenants)} 
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
                  onClick={() => onNavigate && onNavigate('LeasesFiles', { selectedLeaseId: lease.id })} 
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
          {applications.length === 0 && (
            <div style={{ color: theme.colors.text.secondary, fontSize: 12, padding: '20px 0', textAlign: 'center' }}>
              No applications in process
            </div>
          )}
          {applications.slice(0, 6).map((app) => (
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
                  onClick={() => onNavigate && onNavigate('Tenants', { selectedTenantId: app.id })}
                >
                  {app.first_name} {app.last_name}
                </div>
                <div style={{ fontSize: 11, color: theme.colors.text.secondary }}>
                  {app.metadata?.application_date || 'Applied recently'}
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

      <RecordPaymentModalEnhanced
        isOpen={paymentModal.isOpen}
        onClose={() => setPaymentModal({ isOpen: false, tenant: null })}
        tenant={paymentModal.tenant}
        onPaymentRecorded={handlePaymentRecorded}
      />
    </div>
  );
};

export default DashboardPageWithDB;
