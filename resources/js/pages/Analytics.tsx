import React from 'react';
import AppDashboardShell, {
  sampleDashboardSeries,
  type DashboardOrder,
} from '@/components/ui/app-dashboard-shell';

const orders: DashboardOrder[] = [
  {
    id: 'HL-48213',
    customer: 'Maren Okafor',
    email: 'maren@fieldnote.studio',
    status: 'paid',
    channel: 'Direct',
    date: '2026-10-08',
    amount: 24_800,
  },
  {
    id: 'HL-48212',
    customer: 'Tomás Reyes',
    email: 'tomas@kilnworks.co',
    status: 'pending',
    channel: 'Partner',
    date: '2026-10-08',
    amount: 112_000,
  },
  {
    id: 'HL-48211',
    customer: 'Ines Halvorsen',
    email: 'ines@northpier.no',
    status: 'paid',
    channel: 'Organic',
    date: '2026-10-07',
    amount: 8_900,
  },
];

export default function Analytics() {
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
      workspace={{ name: 'PO Material HBP', plan: 'Professional' }}
      user={{ name: 'Admin User', email: 'admin@pomaterial.co.id' }}
      orders={orders}
      getSeries={sampleDashboardSeries}
      defaultRange="30d"
      currency="IDR"
      locale="id-ID"
      theme="auto"
      defaultCollapsed={false}
      defaultActive="analytics"
      onNavigate={handleNavigate}
      onRangeChange={(range) => console.log('range', range)}
    />
  );
}
