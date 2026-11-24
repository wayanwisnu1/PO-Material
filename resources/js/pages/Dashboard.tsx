import React, { useEffect, useState } from 'react';
import { ShoppingBag, TrendingUp, Calendar } from 'lucide-react';
import AppDashboardShell, {
  sampleDashboardSeries,
} from '@/components/ui/app-dashboard-shell';
import { Header } from '../components/dashboard/Header';
import { AlertBanner } from '../components/dashboard/AlertBanner';
import { KpiCard } from '../components/dashboard/KpiCard';
import { RevenueChart, DailyRevenuePoint } from '../components/dashboard/RevenueChart';
import { ProductRevenue, ProductRevenueItem } from '../components/dashboard/ProductRevenue';
import { OrdersTable } from '../components/dashboard/OrdersTable';
import { formatCurrency, toNumber, Order } from '../components/dashboard/utils';

export interface DashboardStats {
  total_orders: number;
  monthly_orders: number;
  total_revenue: number;
  monthly_revenue: number;
  pending_count: number;
  submitted_count: number;
  revenue_beton: number;
  revenue_hotmix: number;
  revenue_batu: number;
  chart_data: { name: string; value: number }[];
  recent_orders: {
    id: string;
    customer: string;
    email: string;
    status: string;
    channel: string;
    date: string;
    amount: number;
  }[];
}

export default function Dashboard() {
  const [period, setPeriod] = useState<'7d' | '30d' | '90d' | '12m'>('7d');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/purchase-orders/stats');
      const json = await res.json();
      if (res.ok) {
        setStats(json);
      }
    } catch (err) {
      console.error('Gagal mengambil stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const totalOrders = stats?.total_orders ?? 0;
  const monthlyOrders = stats?.monthly_orders ?? 0;
  const totalRevenue = toNumber(stats?.total_revenue);
  const pendingOrders = stats?.pending_count ?? 0;
  const submittedOrders = stats?.submitted_count ?? 0;

  const productRevenue: ProductRevenueItem[] = [
    { label: 'Beton', value: toNumber(stats?.revenue_beton), color: '#C2410C' },
    { label: 'Batu', value: toNumber(stats?.revenue_batu), color: '#1D5FA8' },
    { label: 'Hotmix', value: toNumber(stats?.revenue_hotmix), color: '#0F6B3A' },
  ];

  const dailyRevenue: DailyRevenuePoint[] =
    stats?.chart_data?.map((d) => ({ label: d.name, value: toNumber(d.value) })) ?? [];

  const recentOrders: Order[] =
    stats?.recent_orders?.map((o) => ({
      id: o.id,
      customer: o.customer,
      product: o.email,
      status: o.status,
      location: o.channel,
      date: o.date,
      amount: o.amount,
    })) ?? [];

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
    if (routes[id]) window.location.href = routes[id];
  };

  return (
    <AppDashboardShell
      workspace={{ name: 'PO Material HBP', plan: 'Professional' }}
      user={{ name: 'Admin User', email: 'admin@pomaterial.co.id' }}
      orders={[]}
      getSeries={sampleDashboardSeries}
      defaultRange="7d"
      currency="IDR"
      locale="id-ID"
      theme="auto"
      defaultCollapsed={false}
      defaultActive="overview"
      onNavigate={handleNavigate}
      onRangeChange={(range) => setPeriod(range as typeof period)}
      customContent={
        <div className="space-y-6">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#C2410C] border-r-transparent"></div>
                <p className="text-[#6B5B4E]">Memuat data dashboard...</p>
              </div>
            </div>
          )}

          {!loading && stats && (
            <>
              <Header
                period={period}
                onPeriodChange={setPeriod}
                dateRange="11–17 Nov 2026"
              />

              <AlertBanner pending={pendingOrders} submitted={submittedOrders} />

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <KpiCard
                  label="Total Pesanan"
                  value={totalOrders.toString()}
                  delta={0}
                  icon={<ShoppingBag className="h-5 w-5" />}
                  iconBg="bg-orange-100"
                  iconColor="text-orange-600"
                />
                <KpiCard
                  label="Pesanan Bulan Ini"
                  value={monthlyOrders.toString()}
                  delta={0}
                  icon={<Calendar className="h-5 w-5" />}
                  iconBg="bg-blue-100"
                  iconColor="text-blue-600"
                />
                <KpiCard
                  label="Pendapatan Total"
                  value={formatCurrency(totalRevenue)}
                  delta={null}
                  icon={<TrendingUp className="h-5 w-5" />}
                  iconBg="bg-green-100"
                  iconColor="text-green-600"
                />
              </div>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.8fr,1fr]">
                <RevenueChart data={dailyRevenue} total={totalRevenue} />
                <ProductRevenue data={productRevenue} />
              </div>

              <OrdersTable orders={recentOrders} />
            </>
          )}

          {!loading && !stats && (
            <div className="rounded-[18px] border border-[#EFE4D4] bg-white p-8 text-center text-[#6B5B4E]">
              <p>Gagal memuat data dashboard. Silakan refresh halaman.</p>
            </div>
          )}
        </div>
      }
    />
  );
}
