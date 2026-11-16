import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

interface Customer {
  id: number;
  name: string;
}

interface EditOrderFormProps {
  orderId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function EditOrderForm({ orderId, onSuccess, onCancel }: EditOrderFormProps) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    customer_id: '',
    contact_person: '',
    quantity: '',
    material_name: '',
    harga: '',
    buyer_address: '',
    delivery_address: '',
    delivery_schedule: '',
    payment_terms: 'cash',
    payment_days: '',
    status: 'draft',
    jenis_transaksi: '',
    lokasi_sumber: '',
    po_type: 'beton',
    nama_marketing: '',
    satuan: 'M3',
    po_date: '',
  });

  useEffect(() => {
    Promise.all([
      fetch('/api/customers').then(res => res.json()),
      fetch(`/api/purchase-orders/${orderId}`).then(res => res.json())
    ])
      .then(([customersData, orderData]) => {
        setCustomers(customersData.data || []);
        const order = orderData.data;
        setFormData({
          po_date: order.po_date || '',
          po_type: order.po_type || 'beton',
          nama_marketing: order.nama_marketing || '',
          customer_id: order.customer_id || '',
          contact_person: order.contact_person || '',
          quantity: order.quantity || '',
          material_name: order.material_name || '',
          harga: order.harga || '',
          buyer_address: order.buyer_address || '',
          delivery_address: order.delivery_address || '',
          delivery_schedule: order.delivery_schedule || '',
          payment_terms: order.payment_terms || 'cash',
          payment_days: order.payment_days || '',
          status: order.status || 'draft',
          jenis_transaksi: order.jenis_transaksi || '',
          lokasi_sumber: order.lokasi_sumber || '',
          satuan: order.satuan || 'M3',
        });
        setLoading(false);
      })
      .catch(() => {
        alert('Gagal memuat data');
        setLoading(false);
      });
  }, [orderId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch(`/api/purchase-orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Purchase Order berhasil diperbarui',
          confirmButtonText: 'OK',
          confirmButtonColor: '#2563eb',
        }).then(() => {
          onSuccess();
        });
      } else {
        const error = await response.json();
        Swal.fire({
          icon: 'error',
          title: 'Gagal!',
          text: error.message || 'Gagal mengupdate PO',
          confirmButtonText: 'OK',
          confirmButtonColor: '#dc2626',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Terjadi kesalahan jaringan',
        confirmButtonText: 'OK',
        confirmButtonColor: '#dc2626',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="text-gray-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Edit Purchase Order</h2>
          <p className="mt-1 text-sm text-gray-600">Perbarui data PO</p>
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama Marketing <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="nama_marketing"
                value={formData.nama_marketing}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pelanggan <span className="text-red-500">*</span>
              </label>
              <select
                name="customer_id"
                value={formData.customer_id}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Pilih Pelanggan</option>
                {customers.map(customer => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama Kontak <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="contact_person"
                value={formData.contact_person}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Material <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="material_name"
                value={formData.material_name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Jumlah (M3) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                step="0.01"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Harga (Per M3) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="harga"
                value={formData.harga}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                step="0.01"
                min="0"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alamat Pembeli <span className="text-red-500">*</span>
              </label>
              <textarea
                name="buyer_address"
                value={formData.buyer_address}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alamat Pengiriman <span className="text-red-500">*</span>
              </label>
              <textarea
                name="delivery_address"
                value={formData.delivery_address}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Jadwal Pengiriman <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="delivery_schedule"
                value={formData.delivery_schedule}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipe Pembayaran <span className="text-red-500">*</span>
              </label>
              <select
                name="payment_terms"
                value={formData.payment_terms}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="cash">Transfer</option>
                <option value="termin">Cash KP</option>
                <option value="invoice">Cash Site</option>
              </select>
            </div>

            {(formData.payment_terms === 'termin' || formData.payment_terms === 'invoice') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hari Pembayaran (TOP)
                </label>
                <input
                  type="number"
                  name="payment_days"
                  value={formData.payment_days}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Jenis Transaksi <span className="text-red-500">*</span>
              </label>
              <select
                name="jenis_transaksi"
                value={formData.jenis_transaksi}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Pilih Jenis</option>
                <option value="F">F (Faktur)</option>
                <option value="NF">NF (Non-Faktur)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lokasi Sumber <span className="text-red-500">*</span>
              </label>
              <select
                name="lokasi_sumber"
                value={formData.lokasi_sumber}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Pilih Lokasi</option>
                <option value="BP-Lematang">BP-Lematang</option>
                <option value="BP-Terbanggi">BP-Terbanggi</option>
                <option value="BP-Kota Baru">BP-Kota Baru</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="draft">Draft</option>
                <option value="submitted">Submitted</option>
                <option value="approved">Approved</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
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
              className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? 'Menyimpan...' : 'Update PO'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
