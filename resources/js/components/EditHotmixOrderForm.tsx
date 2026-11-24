import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

interface Customer {
  id: number;
  name: string;
}

interface ProductHotmix {
  id: number;
  name: string;
  unit?: string;
  price?: number;
}

interface EditHotmixOrderFormProps {
  orderId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function EditHotmixOrderForm({ orderId, onSuccess, onCancel }: EditHotmixOrderFormProps) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<ProductHotmix[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    po_date: '',
    po_type: 'hotmix',
    nama_marketing: '',
    customer_id: '',
    contact_person: '',
    material_name: '',
    quantity: '',
    satuan: '',
    harga: '',
    jenis_transaksi: '',
    buyer_address: '',
    delivery_address: '',
    delivery_schedule: '',
    payment_terms: '',
    lokasi_sumber: '',
    payment_days: '',
    status: 'draft',
  });
  const [fotoPoFile, setFotoPoFile] = useState<File | null>(null);

  useEffect(() => {
    Promise.all([
      fetch('/api/customers').then(res => res.json()),
      fetch('/api/products-hotmix').then(res => res.json()),
      fetch(`/api/purchase-orders/${orderId}`).then(res => res.json())
    ])
      .then(([customersData, productsData, orderData]) => {
        setCustomers(customersData.data || []);
        setProducts(productsData.data || productsData || []);
        const order = orderData.data;
        setFormData({
          po_date: order.po_date ? order.po_date.substring(0, 10) : '',
          po_type: order.po_type || 'hotmix',
          nama_marketing: order.nama_marketing || '',
          customer_id: order.customer_id || '',
          contact_person: order.contact_person || '',
          material_name: order.material_name || '',
          quantity: order.quantity || '',
          satuan: order.satuan || '',
          harga: order.harga || '',
          jenis_transaksi: order.jenis_transaksi || '',
          buyer_address: order.buyer_address || '',
          delivery_address: order.delivery_address || '',
          delivery_schedule: order.delivery_schedule ? order.delivery_schedule.substring(0, 10) : '',
          payment_terms: order.payment_terms || '',
          lokasi_sumber: order.lokasi_sumber || '',
          payment_days: order.payment_days || '',
          status: order.status || 'draft',
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFotoPoFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          data.append(key, value.toString());
        }
      });
      if (fotoPoFile) {
        data.append('foto_po', fotoPoFile);
      }
      data.append('_method', 'PUT');

      const response = await fetch(`/api/purchase-orders/${orderId}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: data,
      });

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Hotmix Purchase Order berhasil diperbarui',
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
          text: error.message || 'Gagal mengupdate PO Hotmix',
          confirmButtonText: 'OK',
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Terjadi kesalahan sistem',
        confirmButtonText: 'OK',
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
          <h2 className="text-2xl font-bold text-gray-900">Edit Hotmix Order</h2>
          <p className="mt-1 text-sm text-gray-600">Perbarui data PO Hotmix</p>
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
                Tanggal Pemesanan <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="po_date"
                value={formData.po_date}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tanggal Kirim <span className="text-red-500">*</span>
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
                Nama Pelanggan/Perusahaan <span className="text-red-500">*</span>
              </label>
              <select
                name="customer_id"
                value={formData.customer_id}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Pilih Pelanggan/Perusahaan</option>
                {customers.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alamat Kantor <span className="text-red-500">*</span>
              </label>
              <textarea
                name="buyer_address"
                rows={3}
                value={formData.buyer_address}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alamat Proyek <span className="text-red-500">*</span>
              </label>
              <textarea
                name="delivery_address"
                rows={3}
                value={formData.delivery_address}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Person <span className="text-red-500">*</span>
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
                Nama Barang (Jenis Material) <span className="text-red-500">*</span>
              </label>
              <select
                name="material_name"
                value={formData.material_name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Pilih Jenis Material</option>
                {products.map((p, idx) => (
                  <option key={p.id || idx} value={p.name}>{p.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Jumlah <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="any"
                min="0"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Satuan <span className="text-red-500">*</span>
              </label>
              <select
                name="satuan"
                value={formData.satuan}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Pilih Satuan</option>
                <option value="M3">M3</option>
                <option value="Ton">Ton</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Harga <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                name="harga"
                value={formData.harga}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

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
                <option value="">Pilih Jenis Transaksi</option>
                <option value="F">F</option>
                <option value="NF">NF</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipe Bayar <span className="text-red-500">*</span>
              </label>
              <select
                name="payment_terms"
                value={formData.payment_terms}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Pilih Tipe Bayar</option>
                <option value="cash">Transfer</option>
                <option value="termin">Cash KP</option>
                <option value="invoice">Cash Site</option>
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
                <option value="">Pilih Lokasi Sumber</option>
                <option value="AMP - Lematang">AMP - Lematang</option>
                <option value="AMP - Terbanggi">AMP - Terbanggi</option>
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
                <option value="received">Received</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Foto PO (Jika ada)</label>
              <input
                type="file"
                name="foto_po"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Menyimpan...' : 'Update PO Hotmix'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
