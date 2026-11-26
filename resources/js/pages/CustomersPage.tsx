import React from 'react';
import AppDashboardShell, {
  sampleDashboardSeries,
  type DashboardOrder,
} from '@/components/ui/app-dashboard-shell';
import { useCurrentUser } from '@/lib/auth';

const customers: DashboardOrder[] = [
  {
    id: 'CS-001',
    customer: 'PT Beton Jaya Abadi',
    email: 'info@betonjaya.com',
    status: 'active',
    channel: 'Direct',
    date: '2026-01-15',
    amount: 24_800_000,
  },
  {
    id: 'CS-002',
    customer: 'CV Readymix Nusantara',
    email: 'sales@readymix.co.id',
    status: 'active',
    channel: 'Partner',
    date: '2026-02-20',
    amount: 112_000_000,
  },
  {
    id: 'CS-003',
    customer: 'PT Semen Beton Indonesia',
    email: 'contact@semenbeton.co.id',
    status: 'active',
    channel: 'Partner',
    date: '2026-03-10',
    amount: 8_900_000,
  },
];

export default function CustomersPage() {
  const [customers, setCustomers] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const { canAny } = useCurrentUser();
  const canCreate = canAny(['master.create', 'data.create']);
  const canEdit = canAny(['master.edit', 'data.edit_draft', 'data.edit_all']);

  const canDelete = canAny(['master.delete', 'data.delete']);

  const fetchCustomers = () => {
    setLoading(true);
    fetch('/api/customers')
      .then(res => res.json())
      .then(json => {
        setCustomers(json.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  React.useEffect(() => {
    fetchCustomers();
  }, []);

  const handleDelete = (id: number) => {
    if (confirm('Hapus customer ini?')) {
      fetch(`/api/customers/${id}`, { 
        method: 'DELETE',
        headers: { 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '' }
      })
        .then(() => fetchCustomers());
    }
  };

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
      orders={customers.map(c => ({
        id: c.id?.toString() || '',
        customer: c.name || '',
        email: c.email || '',
        status: 'active',
        channel: 'Direct',
        date: c.created_at ? new Date(c.created_at).toISOString().split('T')[0] : '',
        amount: 0
      }))}
      getSeries={sampleDashboardSeries}
      defaultRange="30d"
      currency="IDR"
      locale="id-ID"
      theme="auto"
      defaultCollapsed={false}
      defaultActive="customers"
      onNavigate={handleNavigate}
      onRangeChange={(range) => console.log('range', range)}
      customContent={<div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Data Customer</h2>
            <p className="mt-1 text-sm text-gray-600">Kelola data customer material beton</p>
          </div>
          {canCreate && (
          <button
            onClick={() => window.location.href = '/dashboard/create-customers?from=customers'}
            className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Buat Customer
          </button>
          )}
        </div>
<div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          <table className="w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">ID</th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Nama</th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Email</th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Telepon</th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Dibuat Oleh</th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Diubah</th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Terdaftar</th>
                <th scope="col" className="px-3 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {loading ? (
                <tr>
                  <td colSpan={9} className="px-3 py-4 text-center text-sm text-gray-500">Memuat...</td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-3 py-4 text-center text-sm text-gray-500">Kosong</td>
                </tr>
              ) : (
                customers.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-3 py-4 text-sm text-gray-900">{c.id}</td>
                    <td className="px-3 py-4 text-sm font-medium text-gray-900">{c.name}</td>
                    <td className="px-3 py-4 text-sm text-gray-500">{c.email}</td>
                    <td className="px-3 py-4 text-sm">
                      <span className="inline-flex rounded-full px-2 py-1 text-xs font-semibold bg-green-100 text-green-800">Active</span>
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-900">{c.phone}</td>
                    <td className="px-3 py-4 text-sm text-gray-500">{c.creator?.name || 'Sistem'}</td>
                    <td className="px-3 py-4 text-sm text-gray-500">{c.updater?.name || '-'}</td>
                    <td className="px-3 py-4 text-sm text-gray-900">{c.created_at ? new Date(c.created_at).toLocaleDateString('id-ID') : '-'}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-right text-sm font-medium">
                      <div className="inline-flex items-center justify-end gap-2">
                        <a
                          href={`/dashboard/detail-customers/${c.id}`}
                          className="inline-flex items-center justify-center rounded-md border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 transition-colors hover:bg-blue-100"
                        >
                          Detail
                        </a>
                        {canEdit && (
                          <a
                            href={`/dashboard/edit-customers/${c.id}`}
                            className="inline-flex items-center justify-center rounded-md border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 transition-colors hover:bg-indigo-100"
                          >
                            Edit
                          </a>
                        )}
                        {canDelete && (
                          <button
                            onClick={() => handleDelete(c.id)}
                            className="inline-flex items-center justify-center rounded-md border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700 transition-colors hover:bg-red-100"
                          >
                            Hapus
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>}
    />
  );
}
