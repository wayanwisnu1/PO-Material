import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

interface Role {
  id: number;
  name: string;
  description: string;
}

interface EditTeamFormProps {
  userId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function EditTeamForm({ userId, onSuccess, onCancel }: EditTeamFormProps) {
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState<Role[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role_id: '',
    is_active: true,
  });

  useEffect(() => {
    // Fetch roles and user data concurrently
    Promise.all([
      fetch('/api/users/roles').then((res) => res.json()),
      fetch(`/api/users/${userId}`).then((res) => res.json()),
    ])
      .then(([rolesRes, userRes]) => {
        setRoles(rolesRes.data || []);
        if (userRes.data) {
          setFormData({
            name: userRes.data.name || '',
            email: userRes.data.email || '',
            password: '', // Blank by default
            role_id: userRes.data.role_id?.toString() || '',
            is_active: userRes.data.is_active ?? true,
          });
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
        Swal.fire('Error!', 'Gagal memuat data user.', 'error');
      });
  }, [userId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify(formData),
      });

      const json = await response.json();

      if (response.ok) {
        Swal.fire('Berhasil!', 'Data user berhasil diperbarui.', 'success').then(() => {
          onSuccess();
        });
      } else {
        Swal.fire('Error!', json.message || 'Gagal memperbarui user.', 'error');
      }
    } catch (error) {
      Swal.fire('Error!', 'Terjadi kesalahan jaringan.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500 font-medium">Memuat data user...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Edit User</h2>
          <p className="mt-1 text-sm text-gray-600">Perbarui informasi akun dan hak akses karyawan.</p>
        </div>
        <button
          onClick={onCancel}
          className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Kembali ke Daftar
        </button>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Masukkan nama lengkap"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="nama@perusahaan.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Password Baru</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Biarkan kosong jika tidak ingin mengubah password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                minLength={6}
              />
              <p className="mt-1 text-xs text-gray-500">Isi hanya jika ingin mereset password user.</p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Role Akses</label>
              <select
                name="role_id"
                value={formData.role_id}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                required
              >
                <option value="">Pilih Role</option>
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name.toUpperCase().replace('_', ' ')} — {r.description}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2 flex items-center gap-2 bg-gray-50 p-3 rounded-md border border-gray-100">
              <input
                type="checkbox"
                name="is_active"
                id="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                className="h-5 w-5 rounded border-gray-300 text-orange-600 focus:ring-orange-500 cursor-pointer"
              />
              <label htmlFor="is_active" className="text-sm font-medium text-gray-700 cursor-pointer select-none">
                Akun aktif (dapat melakukan login ke sistem)
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 text-sm font-medium text-white bg-orange-600 rounded-md hover:bg-orange-700 disabled:opacity-50 shadow-sm"
            >
              {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
