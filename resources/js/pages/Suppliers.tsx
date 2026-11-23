import React from 'react';
import AppDashboardShell, {
  sampleDashboardSeries,
  type DashboardOrder,
} from '@/components/ui/app-dashboard-shell';
import SuppliersContent from '@/components/SuppliersContent';

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

const suppliers: Supplier[] = [
  {
    id: 1,
    name: 'PT Beton Jaya Abadi',
    contact_person: 'Budi Santoso',
    phone: '021-5555-6789',
    email: 'info@betonjaya.com',
    address: 'Jl. Raya Bekasi No.123, Jakarta Timur',
    created_at: '2025-01-15T09:30:00Z',
  },
  {
    id: 2,
    name: 'CV Readymix Nusantara',
    contact_person: 'Siti Rahayu',
    phone: '021-5555-1234',
    email: 'sales@readymix.co.id',
    address: 'Jl.Prof. Dr. Soemidi No.45, Surabaya',
    created_at: '2025-02-20T14:15:00Z',
  },
  {
    id: 3,
    name: 'PT Semen Beton Indonesia',
    contact_person: 'Ahmad Fauzi',
    phone: '022-8888-9999',
    email: 'contact@semenbeton.co.id',
    address: 'Jl. Industri No.77, Bandung',
    created_at: '2025-03-10T11:00:00Z',
  },
];

export interface Supplier {
  id: number;
  name: string;
  contact_person: string;
  phone: string;
  email: string;
  address: string;
  created_at: string;
}

export default function Suppliers() {
  const handleNavigate = (id: string) => {
    const routes: Record<string, string> = {
      overview: '/dashboard',
      analytics: '/analytics',
      orders: '/orders',
      'hotmix-orders': '/hotmix-orders',
      customers: '/customers',
      suppliers: '/suppliers',
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
      defaultActive="suppliers"
      onNavigate={handleNavigate}
      onRangeChange={(range) => console.log('range', range)}
      customContent={<SuppliersContent />}
    />
  );
}
