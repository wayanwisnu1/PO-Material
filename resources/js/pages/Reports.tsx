import React from 'react';
import AppDashboardShell, {
  sampleDashboardSeries,
} from '@/components/ui/app-dashboard-shell';
import ReportsContent from '@/components/ReportsContent';

export default function Reports() {
  const handleNavigate = (id: string) => {
    const routes: Record<string, string> = {
      overview: '/dashboard',
      analytics: '/analytics',
      orders: '/orders',
      'hotmix-orders': '/hotmix-orders',
      'batu-orders': '/batu-orders',
      customers: '/customers',
      suppliers: '/suppliers',
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

  return (
    <AppDashboardShell
      workspace={{ name: 'PO Material HBP', plan: 'Professional' }}
      user={{ name: 'Admin User', email: 'admin@pomaterial.co.id' }}
      orders={[]}
      getSeries={sampleDashboardSeries}
      defaultRange="30d"
      currency="IDR"
      locale="id-ID"
      theme="auto"
      defaultCollapsed={false}
      defaultActive="reports"
      onNavigate={handleNavigate}
      onRangeChange={(range) => console.log('range', range)}
      customContent={
        <div className="p-8 max-w-7xl mx-auto w-full">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Laporan Penjualan</h1>
            <p className="mt-2 text-gray-600">Analisa performa penjualan purchase order material beton, hotmix, dan batu.</p>
          </div>
          
          <ReportsContent />
        </div>
      }
    />
  );
}
