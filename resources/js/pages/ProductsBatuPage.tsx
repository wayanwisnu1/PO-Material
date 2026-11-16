import React from 'react';
import AppDashboardShell, { sampleDashboardSeries } from '@/components/ui/app-dashboard-shell';

export default function ProductsBatuPage() {
  const [products, setProducts] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  const fetchProducts = () => {
    setLoading(true);
    fetch('/api/products-batu')
      .then(res => res.json())
      .then(json => {
        setProducts(json.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  React.useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = (id: number) => {
    if (confirm('Hapus produk batu ini?')) {
      fetch(`/api/products-batu/${id}`, { 
        method: 'DELETE',
        headers: { 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '' }
      })
        .then(() => fetchProducts());
    }
  };

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
    };
    if (routes[id]) window.location.href = routes[id];
  };

  return (
    <AppDashboardShell
      workspace={{ name: 'PO Material Beton', plan: 'Professional' }}
      user={{ name: 'Admin User', email: 'admin@pomaterial.co.id' }}
      orders={[]}
      getSeries={sampleDashboardSeries}
      defaultActive="products-batu"
      defaultCollapsed={false}
      onNavigate={handleNavigate}
      customContent={
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Products Batu</h2>
              <p className="mt-1 text-sm text-gray-600">Kelola daftar produk batu</p>
            </div>
            <button
              onClick={() => window.location.href = '/dashboard/create-products-batu'}
              className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Tambah Produk
            </button>
          </div>
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Nama Barang</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Deskripsi</th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase text-gray-500">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr><td colSpan={3} className="px-6 py-4 text-center text-sm">Memuat...</td></tr>
                ) : products.length === 0 ? (
                  <tr><td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">Belum ada produk batu</td></tr>
                ) : (
                  products.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{p.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{p.description || '-'}</td>
                      <td className="px-6 py-4 text-right text-sm font-medium space-x-2">
                        <a href={`/dashboard/detail-products-batu/${p.id}`} className="text-blue-600">Detail</a>
                        <a href={`/dashboard/edit-products-batu/${p.id}`} className="text-indigo-600">Edit</a>
                        <button onClick={() => handleDelete(p.id)} className="text-red-600">Hapus</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      }
    />
  );
}
