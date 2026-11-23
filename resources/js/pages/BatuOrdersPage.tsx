import React from 'react';
import AppDashboardShell, {
  sampleDashboardSeries,
  type DashboardOrder,
} from '@/components/ui/app-dashboard-shell';
import BatuOrdersContent from '@/components/BatuOrdersContent';

const orders: DashboardOrder[] = [
  {
    id: 'BT-91823',
    customer: 'Batu Supplier A',
    email: 'suppliera@batu.co.id',
    status: 'paid',
    channel: 'Direct',
    date: '2026-11-10',
    amount: 154_800,
  },
  {
    id: 'BT-91822',
    customer: 'Batu Supplier B',
    email: 'supplierb@batu.co.id',
    status: 'pending',
    channel: 'Partner',
    date: '2026-11-09',
    amount: 212_000,
  },
];

export default function BatuOrdersPage() {
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
    };

    if (routes[id]) {
      window.location.href = routes[id];
    }
  };

  return (
    <AppDashboardShell
      workspace={{ name: 'PO Material HBP', plan: 'Professional' }}
      user={{ name: 'Admin User', email: 'admin@pomaterial.co.id' }}
      orders={orders}
      getSeries={sampleDashboardSeries}
      defaultRange="30d"
      currency="IDR"
      locale="id-ID"
      theme="auto"
      defaultCollapsed={false}
      defaultActive="batu-orders"
      onNavigate={handleNavigate}
      onRangeChange={(range) => console.log('range', range)}
      customContent={<BatuOrdersContent />}
    />
  );
}
