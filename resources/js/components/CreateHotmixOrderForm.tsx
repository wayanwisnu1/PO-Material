import React, { useState, useEffect } from 'react';

interface Customer {
  id: number;
  name: string;
}

interface ProductHotmix {
  id: number;
  name: string;
}

interface CreateHotmixOrderFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function CreateHotmixOrderForm({ onSuccess, onCancel }: CreateHotmixOrderFormProps) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [productsHotmix, setProductsHotmix] = useState<ProductHotmix[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    po_date: new Date().toISOString().split('T')[0],
    delivery_schedule: new Date().toISOString().split('T')[0],
    po_type: 'hotmix',
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
    foto_po: null as File | null,
  });

  useEffect(() => {
    fetch('/api/customers')
      .then(res => res.json())
      .then(data => setCustomers(data.data || []))
      .catch(() => setCustomers([]));

    fetch('/api/products-hotmix')
      .then(res => res.json())
      .then(data => setProductsHotmix(data.data || []))
      .catch(() => setProductsHotmix([]));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, foto_po: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'foto_po' && value instanceof File) {
          submitData.append(key, value);
        } else if (value !== null && value !== undefined) {
          submitData.append(key, String(value));
        }
      });

      const response = await fetch('/api/purchase-orders', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: submitData,
      });

      if (response.ok) {
        onSuccess();
      } else {
        const error = await response.json();
        alert('Error: ' + (error.message || 'Gagal membuat PO'));
      }
    } catch (error) {
      alert('Network error: ' + error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Buat Hotmix Order Baru</h2>
          <p className="mt-1 text-sm text-gray-600">Buat Hotmix Purchase Order baru</p>
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
                placeholder="Nama marketing yang bertanggung jawab"
                required
              />
            </div>

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
                placeholder="Alamat lokasi proyek hotmix"
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
                <option value="">Pilih Jenis Material Hotmix</option>
                {productsHotmix.map(product => (
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
                <option value="AMP - Lematang">AMP - Lematang</option>
                <option value="AMP - Terbanggi">AMP - Terbanggi</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Foto PO (Jika Ada)
            </label>
            <input
              type="file"
              name="foto_po"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {formData.foto_po && (
              <p className="mt-2 text-sm text-gray-600">
                File terpilih: {formData.foto_po.name}
              </p>
            )}
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
              disabled={loading}
              className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Menyimpan...' : 'Simpan PO'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}