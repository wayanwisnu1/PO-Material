import React, { useState, useEffect } from 'react';

const params = new URLSearchParams(window.location.search);
const from = params.get('from') || 'orders';
const backUrl = from === 'orders' ? '/orders' : '/dashboard';

interface Customer {
  id: number;
  name: string;
}

interface PurchaseOrder {
  id: number;
  po_number: string;
  po_date: string;
  customer: Customer;
  customer_id: number;
  contact_person: string;
  quantity: number;
  material_name: string;
  harga: number;
  buyer_address: string;
  delivery_address: string;
  delivery_schedule: string;
  payment_terms: string;
  payment_days: number | null;
  jenis_transaksi: string;
  lokasi_sumber: string;
  foto_po: string | null;
  total_amount: number;
  status: string;
  created_at: string;
  updated_at: string;
}

interface DetailOrderViewProps {
  orderId: string;
  onBack: () => void;
}

const jenisTransaksiColors: Record<string, string> = {
  F: 'bg-blue-50 text-blue-700 border-blue-200',
  NF: 'bg-green-50 text-green-700 border-green-200',
};

const paymentTermsLabels: Record<string, string> = {
  cash: 'Transfer',
  termin: 'Cash KP',
  invoice: 'Cash Site',
};

const STATUS_MAP: Record<string, { label: string; className: string }> = {
  draft: { label: 'Draft', className: 'bg-gray-200 text-gray-800' },
  submitted: { label: 'Submitted', className: 'bg-blue-200 text-blue-800' },
  approved: { label: 'Approved', className: 'bg-emerald-200 text-emerald-800' },
  delivered: { label: 'Delivered', className: 'bg-green-200 text-green-800' },
  received: { label: 'Received', className: 'bg-emerald-200 text-emerald-800' },
  cancelled: { label: 'Cancelled', className: 'bg-red-200 text-red-800' },
};

const getStatus = (status?: string) =>
  STATUS_MAP[status || ''] || { label: status || '-', className: 'bg-gray-200 text-gray-800' };

export default function DetailOrderView({ orderId, onBack }: DetailOrderViewProps) {
  const [order, setOrder] = useState<PurchaseOrder | null>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/me').then(res => res.json()).then(data => setUser(data.user));
    fetch(`/api/purchase-orders/${orderId}`)
      .then(res => res.json())
      .then(data => {
        setOrder(data.data);
        setLoading(false);
      });
  }, [orderId]);

  useEffect(() => {
    if (user?.permissions.includes('data.view_all')) {
      fetch(`/api/activity-logs/PurchaseOrder/${orderId}`)
        .then(res => res.json())
        .then(data => setLogs(data));
    }
  }, [orderId, user]);


  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
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

  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Data tidak ditemukan</p>
        <button
          onClick={onBack}
          className="mt-4 text-blue-600 hover:text-blue-800"
        >
          Kembali ke Daftar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Detail Purchase Order</h2>
          <p className="mt-1 text-sm text-gray-600">Informasi lengkap PO</p>
          <span className={`mt-2 inline-flex rounded-full px-3 py-1 text-sm font-semibold ${getStatus(order.status).className}`}>
            {getStatus(order.status).label}
          </span>
        </div>
        <div className="flex gap-2">
          <a
            href={`/dashboard/edit-orders/${orderId}?from=${from}`}
            className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </a>
          <button
            onClick={onBack}
            className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="px-6 py-4 border-b">
            <h3 className="text-lg font-medium text-gray-900">Informasi PO</h3>
          </div>
          <div className="px-6 py-4 space-y-4">
            <div>
              <p className="text-sm text-gray-500">Tanggal Pemesanan</p>
              <p className="text-lg text-gray-900">{formatDate(order.po_date)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${getStatus(order.status).className}`}>
                {getStatus(order.status).label}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-500">Tanggal Kirim</p>
              <p className="text-lg text-gray-900">{formatDate(order.delivery_schedule)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Nilai</p>
              <p className="text-xl font-bold text-gray-900">{formatRupiah(order.total_amount)}</p>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="px-6 py-4 border-b">
            <h3 className="text-lg font-medium text-gray-900">Pelanggan & Kontak</h3>
          </div>
          <div className="px-6 py-4 space-y-4">
            <div>
              <p className="text-sm text-gray-500">Pelanggan</p>
              <p className="text-lg font-medium text-gray-900">{order.customer.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Nama Kontak</p>
              <p className="text-lg text-gray-900">{order.contact_person}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Jenis Transaksi</p>
              <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold border ${jenisTransaksiColors[order.jenis_transaksi] || 'bg-gray-50 text-gray-700 border-gray-200'}`}>
                {order.jenis_transaksi}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-medium text-gray-900">Material & Harga</h3>
        </div>
        <div className="px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500">Material</p>
              <p className="text-lg font-medium text-gray-900">{order.material_name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Jumlah (M3)</p>
              <p className="text-lg text-gray-900">{order.quantity}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Harga Per M3</p>
              <p className="text-lg font-medium text-gray-900">{formatRupiah(order.harga)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Harga</p>
              <p className="text-lg font-bold text-gray-900">{formatRupiah(order.total_amount)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-medium text-gray-900">Pengiriman & Pembayaran</h3>
        </div>
        <div className="px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <p className="text-sm text-gray-500">Alamat Kantor</p>
              <p className="text-gray-900 whitespace-pre-line">{order.buyer_address}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-gray-500">Alamat Proyek</p>
              <p className="text-gray-900 whitespace-pre-line">{order.delivery_address}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Tipe Pembayaran</p>
              <p className="text-gray-900">{paymentTermsLabels[order.payment_terms] || order.payment_terms}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Lokasi Sumber</p>
              <p className="text-gray-900">{order.lokasi_sumber}</p>
            </div>
            {(order.payment_terms === 'termin' || order.payment_terms === 'invoice') && order.payment_days && (
              <div>
                <p className="text-sm text-gray-500">Hari Pembayaran (TOP)</p>
                <p className="text-gray-900">{order.payment_days} hari</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {order.foto_po && (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="px-6 py-4 border-b">
            <h3 className="text-lg font-medium text-gray-900">Foto PO</h3>
          </div>
          <div className="px-6 py-4">
            <img
              src={`/storage/${order.foto_po}`}
              alt="Foto PO"
              className="max-w-md rounded-lg border border-gray-200"
            />
          </div>
        </div>
      )}

      {user?.permissions.includes('data.view_all') && logs.length > 0 && (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="px-6 py-4 border-b bg-gray-50">
            <h3 className="text-lg font-medium text-gray-900">Riwayat Perubahan (Admin Only)</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Waktu</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aktivitas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {logs.map((log: any) => (
                  <tr key={log.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(log.created_at).toLocaleString('id-ID')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {log.user?.name || 'Sistem'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {log.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="text-sm text-gray-500 text-center">
        <p>PO dibuat: {formatDate(order.created_at)} • Terakhir diperbarui: {formatDate(order.updated_at)}</p>
      </div>
    </div>
  );
}
