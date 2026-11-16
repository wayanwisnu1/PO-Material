import React from 'react';
import AppDashboardShell, {
  sampleDashboardSeries,
  type DashboardOrder,
} from '@/components/ui/app-dashboard-shell';
import HotmixOrdersContent from '@/components/HotmixOrdersContent';

const orders: DashboardOrder[] = [
  {
    id: 'HM-91823',
    customer: 'Hotmix Contractor A',
    email: 'contractora@hotmix.co.id',
    status: 'paid',
    channel: 'Direct',
    date: '2026-11-10',
    amount: 154_800,
  },
  {
    id: 'HM-91822',
    customer: 'Hotmix Contractor B',
    email: 'contractorb@hotmix.co.id',
    status: 'pending',
    channel: 'Partner',
    date: '2026-11-09',
    amount: 212_000,
  },
];

export default function HotmixOrdersPage() {
  const handleNavigate = (id: string) => {
    const routes: Record<string, string> = {
      overview: '/dashboard',
      analytics: '/analytics',
      orders: '/orders',
      'hotmix-orders': '/hotmix-orders',
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
      workspace={{ name: 'PO Material Beton', plan: 'Professional' }}
      user={{ name: 'Admin User', email: 'admin@pomaterial.co.id' }}
      orders={orders}
      getSeries={sampleDashboardSeries}
      defaultRange="30d"
      currency="IDR"
      locale="id-ID"
      theme="auto"
      defaultCollapsed={false}
      defaultActive="hotmix-orders"
      onNavigate={handleNavigate}
      onRangeChange={(range) => console.log('range', range)}
      customContent={<HotmixOrdersContent />}
    />
  );
}