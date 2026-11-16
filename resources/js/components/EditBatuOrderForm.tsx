import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

interface Customer {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
}

interface EditBatuOrderFormProps {
  orderId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function EditBatuOrderForm({ orderId, onSuccess, onCancel }: EditBatuOrderFormProps) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    po_date: '',
    po_type: 'batu',
    delivery_schedule: '',
    nama_marketing: '',
    customer_id: '',
    buyer_address: '',
    delivery_address: '',
    contact_person: '',
    material_name: '',
    quantity: '',
    satuan: '',
    harga: '',
    jenis_transaksi: '',
    payment_terms: '',
    lokasi_sumber: '',
    status: 'draft',
  });

  useEffect(() => {
    Promise.all([
      fetch('/api/customers').then(res => res.json()),
      fetch('/api/products-batu').then(res => res.json()),
      fetch(`/api/purchase-orders/${orderId}`).then(res => res.json())
    ])
      .then(([customersData, productsData, orderData]) => {
        setCustomers(customersData.data || []);
        setProducts(productsData.data || []);
        const order = orderData.data;
        setFormData({
          po_date: order.po_date || '',
          po_type: order.po_type || 'batu',
          delivery_schedule: order.delivery_schedule || '',
          nama_marketing: order.nama_marketing || '',
          customer_id: order.customer_id || '',
          buyer_address: order.buyer_address || '',
          delivery_address: order.delivery_address || '',
          contact_person: order.contact_person || '',
          material_name: order.material_name || '',
          quantity: order.quantity || '',
          satuan: order.satuan || '',
          harga: order.harga || '',
          jenis_transaksi: order.jenis_transaksi || '',
          payment_terms: order.payment_terms || '',
          lokasi_sumber: order.lokasi_sumber || '',
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
          text: 'Purchase Order Batu berhasil diperbarui',
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
          text: error.message || 'Gagal mengupdate PO Batu',
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
          <h2 className="text-2xl font-bold text-gray-900">Edit Purchase Order Batu</h2>
          <p className="mt-1 text-sm text-gray-600">Perbarui data PO Batu</p>
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
                placeholder="Nama marketing yang bertanggung jawab"
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
                {customers.map(customer => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alamat Kantor <span className="text-red-500">*</span>
              </label>
              <textarea
                name="buyer_address"
                value={formData.buyer_address}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Alamat lengkap kantor"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alamat Proyek <span className="text-red-500">*</span>
              </label>
              <textarea
                name="delivery_address"
                value={formData.delivery_address}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Alamat lokasi proyek batu"
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
                placeholder="Nama contact person"
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
                {products.map(product => (
                  <option key={product.id} value={product.name}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Jumlah <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                min="0"
                step="any"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Masukkan jumlah"
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
                <option value="" disabled>Pilih Satuan</option>
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
                name="harga"
                value={formData.harga}
                onChange={handleChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Masukkan harga satuan"
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
                <option value="" disabled>Pilih Jenis Transaksi</option>
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
                <option value="" disabled>Pilih Tipe Bayar</option>
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
                <option value="" disabled>Pilih Lokasi Sumber</option>
                <option value="PT.HBP Mojokerto">PT.HBP Mojokerto</option>
                <option value="PT. BBD Mojokerto">PT. BBD Mojokerto</option>
                <option value="PT. HBP Bengkunat">PT. HBP Bengkunat</option>
                <option value="PT. SCD UMBAR">PT. SCD UMBAR</option>
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
              className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Menyimpan...' : 'Update PO Batu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}