import React from 'react';
import AppDashboardShell, {
  sampleDashboardSeries,
  type DashboardOrder,
} from '@/components/ui/app-dashboard-shell';
import ActivityLogsContent from '@/components/ActivityLogsContent';

const orders: DashboardOrder[] = [];

export default function ActivityLogsPage() {
  const handleNavigate = (id: string) => {
    const routes: Record<string, string> = {
      overview: '/dashboard',
      analytics: '/analytics',
      orders: '/orders',
      'hotmix-orders': '/hotmix-orders',
      'batu-orders': '/batu-orders',
      customers: '/customers',
      products: '/products',
      'products-hotmix': '/products-hotmix',
      'products-batu': '/products-batu',
      reports: '/reports',
      team: '/team',
      integrations: '/integrations',
      settings: '/settings',
      'activity-logs': '/activity-logs',
    };

    if (routes[id]) {
      window.location.href = routes[id];
    }
  };

  const profile = (window as any).__HALCYON_PROFILE__;
  const permissions = (window as any).__HALCYON_PERMISSIONS__;

  return (
    <AppDashboardShell
      workspace={{ name: 'PO Material HBP', plan: 'Professional' }}
      user={profile || { name: 'Admin User', email: 'admin@pomaterial.co.id' }}
      granted={permissions || []}
      orders={orders}
      getSeries={sampleDashboardSeries}
      defaultRange="30d"
      currency="IDR"
      locale="id-ID"
      theme="auto"
      defaultCollapsed={false}
      defaultActive="activity-logs"
      onNavigate={handleNavigate}
      onRangeChange={(range) => console.log('range', range)}
      customContent={<ActivityLogsContent />}
    />
  );
}
