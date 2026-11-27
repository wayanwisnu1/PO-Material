import React, { useEffect, useState } from 'react';
import AppDashboardShell, {
  sampleDashboardSeries,
} from '@/components/ui/app-dashboard-shell';
import Swal from 'sweetalert2';

interface User {
  id: number;
  name: string;
  email: string;
  is_active: boolean;
  created_at: string;
  role: {
    id: number;
    name: string;
    description: string;
  } | null;
}

export default function Team() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      const json = await res.json();
      setUsers(json.data || []);
      setLoading(false);
    } catch (err) {
      console.error('Fetch users error:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

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

  const openAddModal = () => {
    window.location.href = '/dashboard/create-team?from=team';
  };

  const openEditModal = (user: User) => {
    window.location.href = `/dashboard/edit-team/${user.id}?from=team`;
  };

  const toggleStatus = async (user: User) => {
    const action = user.is_active ? 'nonaktifkan' : 'aktifkan';
    const result = await Swal.fire({
      title: `Apakah Anda yakin?`,
      text: `Ingin ${action} akun ${user.name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya',
      cancelButtonText: 'Batal',
      backdrop: 'rgba(0,0,0,0.4)',
      heightAuto: false,
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`/api/users/${user.id}/toggle-active`, {
          method: 'PATCH',
          headers: {
            'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
          },
        });
        const json = await res.json();
        if (res.ok) {
          Swal.fire({
            title: 'Berhasil!',
            text: json.message,
            icon: 'success',
            heightAuto: false,
          });
          fetchUsers();
        } else {
          Swal.fire({
            title: 'Error!',
            text: json.message,
            icon: 'error',
            heightAuto: false,
          });
        }
      } catch (err) {
        Swal.fire({
          title: 'Error!',
          text: 'Gagal mengubah status.',
          icon: 'error',
          heightAuto: false,
        });
      }
    }
  };

  const handleDelete = async (user: User) => {
    const result = await Swal.fire({
      title: `Hapus User?`,
      text: `Akun ${user.name} akan dihapus permanen.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal',
      backdrop: 'rgba(0,0,0,0.4)',
      heightAuto: false,
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`/api/users/${user.id}`, {
          method: 'DELETE',
          headers: {
            'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
            'Accept': 'application/json',
          },
        });
        const json = await res.json();
        if (res.ok) {
          Swal.fire({
            title: 'Dihapus!',
            text: json.message,
            icon: 'success',
            heightAuto: false,
          });
          fetchUsers();
        } else {
          Swal.fire({
            title: 'Error!',
            text: json.message,
            icon: 'error',
            heightAuto: false,
          });
        }
      } catch (err) {
        Swal.fire({
          title: 'Error!',
          text: 'Gagal menghapus user.',
          icon: 'error',
          heightAuto: false,
        });
      }
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
      defaultActive="team"
      onNavigate={handleNavigate}
      onRangeChange={(range) => console.log('range', range)}
      customContent={
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Manajemen User (Team)</h2>
              <p className="mt-1 text-sm text-gray-600">Kelola akses akun dan role karyawan</p>
            </div>
            <button
              onClick={openAddModal}
              className="inline-flex items-center rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700"
            >
              <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              Tambah User
            </button>
          </div>

          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Nama / Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Terdaftar</th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {loading ? (
                  <tr><td colSpan={5} className="px-6 py-4 text-center">Memuat data...</td></tr>
                ) : users.length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-4 text-center">Belum ada user.</td></tr>
                ) : (
                  users.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{u.name}</div>
                        <div className="text-xs text-gray-500">{u.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex rounded bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700 uppercase">
                          {u.role?.name || '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${u.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {u.is_active ? 'Aktif' : 'Nonaktif'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {u.created_at ? new Date(u.created_at).toLocaleDateString('id-ID') : '-'}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                        <div className="inline-flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(u)}
                            className="inline-flex items-center justify-center rounded-md border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 transition-colors hover:bg-indigo-100"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => toggleStatus(u)}
                            className={`inline-flex items-center justify-center rounded-md border px-2.5 py-1 text-xs font-semibold transition-colors ${
                              u.is_active
                                ? 'border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100'
                                : 'border-green-200 bg-green-50 text-green-700 hover:bg-green-100'
                            }`}
                          >
                            {u.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                          </button>
                          <button
                            onClick={() => handleDelete(u)}
                            className="inline-flex items-center justify-center rounded-md border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700 transition-colors hover:bg-red-100"
                          >
                            Hapus
                          </button>
                        </div>
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
