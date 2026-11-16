import React, { useEffect, useState } from 'react';
import AppDashboardShell, {
  type DashboardOrder,
  type DashboardSeries,
} from '@/components/ui/app-dashboard-shell';

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/purchase-orders/stats')
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching stats:', err);
        setLoading(false);
      });
  }, []);

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

  const getSeries = (): DashboardSeries => {
    if (!stats) {
      return {
        points: [],
        kpis: [],
        channels: []
      };
    }

    return {
      points: stats.chart_data || [],
      kpis: [
        {
          label: "Total Pesanan",
          value: stats.total_orders?.toString() || "0",
          trend: 10,
          trendLabel: "Data keseluruhan",
          spark: [10, 20, 15, 30, 25, 40, 35]
        },
        {
          label: "Pesanan Bulan Ini",
          value: stats.monthly_orders?.toString() || "0",
          trend: 5,
          trendLabel: "Performa bulanan",
          spark: [5, 10, 8, 12, 10, 15, 14]
        },
        {
          label: "Pendapatan Total",
          value: "Rp " + (stats.total_revenue?.toLocaleString('id-ID') || "0"),
          trend: 15,
          trendLabel: "Pertumbuhan nilai",
          spark: [100, 120, 110, 130, 140, 150, 160]
        }
      ],
      channels: [
        { label: "Hotmix", value: stats.total_hotmix || 0 },
        { label: "Batu", value: stats.total_batu || 0 },
        { label: "Lainnya", value: stats.total_other || 0 }
      ]
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600 font-medium">Memuat data Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <AppDashboardShell
      workspace={{ name: 'PO Material Beton', plan: 'Dashboard Operasional' }}
      user={{ name: 'Admin', email: 'admin@pomaterial.co.id' }}
      orders={stats?.recent_orders || []}
      getSeries={getSeries}
      defaultRange="7d"
      currency="IDR"
      locale="id-ID"
      theme="auto"
      defaultCollapsed={false}
      defaultActive="overview"
      onNavigate={handleNavigate}
      onRangeChange={(range) => console.log('range', range)}
    />
  );
}
