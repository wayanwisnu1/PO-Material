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

interface Role {
  id: number;
  name: string;
  description: string;
}

export default function Team() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role_id: '',
    is_active: true,
  });

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

  const fetchRoles = async () => {
    try {
      const res = await fetch('/api/users/roles');
      const json = await res.json();
      setRoles(json.data || []);
    } catch (err) {
      console.error('Fetch roles error:', err);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchRoles();
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
    setEditingUser(null);
    setFormData({ name: '', email: '', password: '', role_id: '', is_active: true });
    setShowModal(true);
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '', 
      role_id: user.role?.id.toString() || '',
      is_active: user.is_active,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingUser ? `/api/users/${editingUser.id}` : '/api/users';
    const method = editingUser ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
        },
        body: JSON.stringify(formData),
      });

      const json = await res.json();

      if (res.ok) {
        Swal.fire('Berhasil!', json.message, 'success');
        setShowModal(false);
        fetchUsers();
      } else {
        Swal.fire('Error!', json.message || 'Terjadi kesalahan.', 'error');
      }
    } catch (err) {
      Swal.fire('Error!', 'Gagal menghubungkan ke server.', 'error');
    }
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
          Swal.fire('Berhasil!', json.message, 'success');
          fetchUsers();
        } else {
          Swal.fire('Error!', json.message, 'error');
        }
      } catch (err) {
        Swal.fire('Error!', 'Gagal mengubah status.', 'error');
      }
    }
  };

  return (
    <AppDashboardShell
      workspace={{ name: 'PO Material Beton', plan: 'Professional' }}
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
                      <td className="px-6 py-4 text-right text-sm font-medium space-x-2">
                        <button onClick={() => openEditModal(u)} className="text-indigo-600 hover:text-indigo-900">Edit</button>
                        <button onClick={() => toggleStatus(u)} className={u.is_active ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}>
                          {u.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {showModal && (
            <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <form onSubmit={handleSubmit}>
                  <div className="px-6 py-4 border-b">
                    <h3 className="text-lg font-bold">{editingUser ? 'Edit User' : 'Tambah User Baru'}</h3>
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
                      <input
                        type="text"
                        required
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <input
                        type="email"
                        required
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Password {editingUser && '(Biarkan kosong jika tidak ingin ganti)'}</label>
                      <input
                        type="password"
                        required={!editingUser}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Role</label>
                      <select
                        required
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                        value={formData.role_id}
                        onChange={(e) => setFormData({ ...formData, role_id: e.target.value })}
                      >
                        <option value="">Pilih Role</option>
                        {roles.map((r) => (
                          <option key={r.id} value={r.id}>{r.name} ({r.description})</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="px-6 py-4 bg-gray-50 rounded-b-lg flex justify-end space-x-2">
                    <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-gray-700 border rounded-md">Batal</button>
                    <button type="submit" className="px-4 py-2 text-sm text-white bg-orange-600 rounded-md hover:bg-orange-700">Simpan</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      }
    />
  );
}
