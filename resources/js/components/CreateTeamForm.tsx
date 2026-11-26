import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import PermissionSelector from './PermissionSelector';

interface Preset {
  key: string;
  label: string;
  description: string;
  permissions: string[];
}

interface Group {
  key: string;
  label: string;
  description: string;
  actions: { id: number; name: string; label: string; description: string }[];
}

interface CreateTeamFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function CreateTeamForm({ onSuccess, onCancel }: CreateTeamFormProps) {
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [catalog, setCatalog] = useState<{ groups: Group[]; presets: Preset[] }>({ groups: [], presets: [] });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    is_active: true,
    permissions: [] as number[],
  });

  useEffect(() => {
    fetch('/api/users/permissions', { headers: { Accept: 'application/json' }, credentials: 'same-origin' })
      .then((res) => res.json())
      .then((json) => {
        setCatalog({ groups: json.groups || [], presets: json.presets || [] });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const applyPreset = (preset: Preset) => {
    const ids: number[] = [];
    catalog.groups.forEach((g) => {
      g.actions.forEach((a) => {
        if (preset.permissions.includes(a.name)) ids.push(a.id);
      });
    });
    setFormData((p) => ({ ...p, permissions: ids }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        credentials: 'same-origin',
        body: JSON.stringify(formData),
      });

      const json = await response.json();

      if (response.ok) {
        Swal.fire('Berhasil!', 'User baru berhasil ditambahkan.', 'success').then(() => onSuccess());
      } else {
        const firstError = json.errors ? Object.values(json.errors)[0] : json.message;
        Swal.fire('Error!', (firstError as string) || 'Gagal membuat user.', 'error');
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
        <p className="text-gray-500 font-medium">Memuat data permission...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Tambah User Baru</h2>
          <p className="mt-1 text-sm text-gray-600">Buat akun karyawan baru dan atur hak aksesnya per aksi.</p>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Minimal 6 karakter"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                required
                minLength={6}
              />
            </div>
          </div>

          <div className="border-t pt-6">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Hak Akses</label>
                <p className="text-xs text-gray-500 mt-1">
                  Centang aksi yang boleh dilakukan user ini. Gunakan preset untuk mengisi cepat, lalu sesuaikan manual.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {catalog.presets.map((p) => (
                  <button
                    key={p.key}
                    type="button"
                    title={p.description}
                    onClick={() => applyPreset(p)}
                    className="text-xs font-medium bg-orange-50 text-orange-700 border border-orange-200 px-3 py-1.5 rounded-full hover:bg-orange-100 transition-colors"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <PermissionSelector
              groups={catalog.groups}
              selectedIds={formData.permissions}
              onChange={(ids) => setFormData((p) => ({ ...p, permissions: ids }))}
            />
          </div>

          <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-md border border-gray-100">
            <input
              type="checkbox"
              name="is_active"
              id="is_active"
              checked={formData.is_active}
              onChange={handleChange}
              className="h-5 w-5 rounded border-gray-300 text-orange-600 focus:ring-orange-500 cursor-pointer"
            />
            <label htmlFor="is_active" className="text-sm font-medium text-gray-700 cursor-pointer select-none">
              Aktifkan akun sekarang (User dapat langsung login setelah dibuat)
            </label>
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
              {saving ? 'Sedang Menyimpan...' : 'Tambah User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
