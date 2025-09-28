import React from 'react';
import {
  ArrowUpIcon,
  ArrowDownIcon,
  DollarSignIcon,
  CreditCardIcon,
  UsersIcon,
  HomeIcon
} from 'lucide-react';

const StatCard = ({ title, value, icon: IconComponent, trend, trendValue }) => {
  const isPositiveTrend = trend === 'up';

  return (
    <div style={{
      background: 'white',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      padding: '24px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontSize: '14px', fontWeight: '500', color: '#64748b' }}>{title}</p>
          <h3 style={{ fontSize: '24px', fontWeight: '600', marginTop: '4px' }}>{value}</h3>
        </div>
        <div style={{
          height: '48px',
          width: '48px',
          background: '#dbeafe',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {IconComponent && <IconComponent style={{ height: '24px', width: '24px', color: '#2563eb' }} />}
        </div>
      </div>
      {trend && trendValue && (
        <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center' }}>
          {isPositiveTrend ? (
            <ArrowUpIcon style={{ height: '16px', width: '16px', color: '#10b981' }} />
          ) : (
            <ArrowDownIcon style={{ height: '16px', width: '16px', color: '#ef4444' }} />
          )}
          <span style={{
            marginLeft: '4px',
            fontSize: '14px',
            color: isPositiveTrend ? '#10b981' : '#ef4444'
          }}>
            {trendValue}
          </span>
          <span style={{ marginLeft: '8px', fontSize: '14px', color: '#64748b' }}>vs last month</span>
        </div>
      )}
    </div>
  );
};

export const DashboardStats = ({ stats, propertyCount, tenantCount }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
      <StatCard
        title="Total Revenue"
        value={formatCurrency(stats?.totalIncome || 0)}
        icon={DollarSignIcon}
        trend="up"
        trendValue="12.5%"
      />
      <StatCard
        title="Transaction Count"
        value={stats?.count || 0}
        icon={CreditCardIcon}
        trend="up"
        trendValue="8.2%"
      />
      <StatCard
        title="Active Tenants"
        value={tenantCount || 0}
        icon={UsersIcon}
      />
      <StatCard
        title="Properties"
        value={propertyCount || 0}
        icon={HomeIcon}
      />
    </div>
  );
};
