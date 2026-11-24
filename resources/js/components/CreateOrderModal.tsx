import React, { useState, useEffect } from 'react';

interface Supplier {
  id: number;
  name: string;
}

interface Customer {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
}

interface CreateOrderModalProps {
  open: boolean;
  onClose: () => void;
  onCreateSuccess: () => void;
}

export default function CreateOrderModal({ open, onClose, onCreateSuccess }: CreateOrderModalProps) {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    po_number: '',
    po_date: new Date().toISOString().split('T')[0],
    supplier_id: '',
    customer_id: '',
    contact_person: '',
    quantity: '',
    material_name: '',
    buyer_address: '',
    delivery_address: '',
    delivery_schedule: new Date().toISOString().split('T')[0],
    payment_terms: 'cash',
    payment_days: '',
    status: 'draft',
    notes: '',
  });

  useEffect(() => {
    if (open) {
      // Fetch suppliers
      fetch('/api/suppliers')
        .then(res => res.json())
        .then(data => setSuppliers(data.data || []))
        .catch(() => setSuppliers([]));
      
      // Fetch customers
      fetch('/api/customers')
        .then(res => res.json())
        .then(data => setCustomers(data.data || []))
        .catch(() => setCustomers([]));

      // Fetch products
      fetch('/api/products')
        .then(res => res.json())
        .then(data => setProducts(data.data || []))
        .catch(() => setProducts([]));
    }
  }, [open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/purchase-orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        onCreateSuccess();
        onClose();
        // Reset form
        setFormData({
                po_number: '',
                po_date: new Date().toISOString().split('T')[0],
                supplier_id: '',
                customer_id: '',
                contact_person: '',
                quantity: '',
                material_name: '',
                buyer_address: '',
                delivery_address: '',
          delivery_schedule: new Date().toISOString().split('T')[0],
          payment_terms: 'cash',
          payment_days: '',
          status: 'draft',
          notes: '',
        });
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

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Buat Purchase Order Baru</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600"
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tanggal PO <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="po_date"
                  value={formData.po_date}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tanggal Kirim <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="delivery_schedule"
                  value={formData.delivery_schedule}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Supplier <span className="text-red-500">*</span>
                </label>
                <select
                  name="supplier_id"
                  value={formData.supplier_id}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Pilih Supplier</option>
                  {suppliers.map(supplier => (
                    <option key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Pelanggan/Perusahaan <span className="text-red-500">*</span>
                </label>
                <select
                  name="customer_id"
                  value={formData.customer_id}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
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

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alamat Kantor <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="buyer_address"
                  value={formData.buyer_address}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Alamat lengkap kantor"
                  required
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alamat Proyek <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="delivery_address"
                  value={formData.delivery_address}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Alamat lokasi proyek beton"
                  required
                  />
                  </div>

                <div className="grid grid-cols-2 gap-6">
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
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Jumlah (M3) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0"
                    required
                  />
                </div>

                  <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                  Syarat Pembayaran <span className="text-red-500">*</span>
                  </label>
                <input
                  type="date"
                  name="delivery_schedule"
                  value={formData.delivery_schedule}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Syarat Pembayaran <span className="text-red-500">*</span>
                </label>
                <select
                  name="payment_terms"
                  value={formData.payment_terms}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="cash">Cash (Tunai)</option>
                  <option value="termin">Termin (Angsuran)</option>
                  <option value="invoice">Invoice (Setelah Invoice)</option>
                </select>
              </div>

              {formData.payment_terms === 'termin' || formData.payment_terms === 'invoice' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hari Pembayaran (TOP)
                  </label>
                  <input
                    type="number"
                    name="payment_days"
                    value={formData.payment_days}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="30"
                  />
                </div>
              ) : null}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="draft">Draft</option>
                  <option value="submitted">Submitted</option>
                  <option value="approved">Approved</option>
                  <option value="delivered">Delivered</option>
                  <option value="received">Received</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Catatan
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Catatan tambahan untuk PO"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Menyimpan...' : 'Simpan PO'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
