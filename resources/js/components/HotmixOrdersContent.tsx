import React, { useEffect, useState } from 'react';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import CreateOrderForm from './CreateOrderForm';

interface PurchaseOrder {
  id: number;
  po_number: string;
  po_type: string;
  po_date: string;
  delivery_schedule: string;
  nama_marketing: string;
  customer: {
    name: string;
  };
  buyer_address: string;
  delivery_address: string;
  contact_person: string;
  material_name: string;
  quantity: number;
  satuan: string;
  harga: number;
  jenis_transaksi: string;
  payment_terms: string;
  lokasi_sumber: string;
  status: string;
}

const STATUS_MAP: Record<string, { label: string; className: string }> = {
  draft: { label: 'Draft', className: 'bg-gray-200 text-gray-800' },
  submitted: { label: 'Submitted', className: 'bg-blue-200 text-blue-800' },
  approved: { label: 'Approved', className: 'bg-emerald-200 text-emerald-800' },
  delivered: { label: 'Delivered', className: 'bg-green-200 text-green-800' },
  cancelled: { label: 'Cancelled', className: 'bg-red-200 text-red-800' },
};

const getStatus = (status?: string) =>
  STATUS_MAP[status || ''] || { label: status || '-', className: 'bg-gray-200 text-gray-800' };

export default function HotmixOrdersContent() {
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  const fetchOrders = () => {
    setLoading(true);
    fetch('/api/purchase-orders')
      .then(res => res.json())
      .then(data => {
        setOrders((data.data || []).filter((order: PurchaseOrder) => 
          order.po_type === 'hotmix'
        ));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const handleDelete = (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus Purchase Order ini?')) {
      fetch(`/api/purchase-orders/${id}`, {
        method: 'DELETE',
        headers: {
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
          'Accept': 'application/json',
        },
      })
        .then(res => {
          if (res.ok) {
            setOrders(orders.filter(order => order.id !== id));
            setDeleteSuccess(true);
            setTimeout(() => setDeleteSuccess(false), 3000);
          } else {
            alert('Gagal menghapus purchase order');
          }
        })
        .catch(() => alert('Gagal menghapus purchase order'));
    }
  };

  const handleExportSpreadsheet = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Purchase Orders Hotmix');

    const headers = [
      'Timestamp', 'Tanggal Pemesanan', 'Tanggal Kirim', 'Nama Marketing', 
      'Nama Pelanggan/Perusahaan', 'Alamat Kantor', 'Alamat Proyek', 
      'Contact Person', 'Nama Barang/Jenis Material', 'Jumlah', 
      'Satuan', 'Harga Satuan', 'Total Harga', 'Jenis Transaksi', 
      'Tipe Pembayaran', 'Lokasi Sumber'
    ];

    worksheet.columns = headers.map(header => ({
      header,
      key: header,
      width: 20
    }));

    worksheet.getRow(1).eachCell((cell) => {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4F46E5' } };
      cell.font = { color: { argb: 'FFFFFFFF' }, bold: true };
      cell.alignment = { horizontal: 'center' };
    });

    const formatDate = (dateString?: string) => {
      if (!dateString) return '-';
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    };

    orders.forEach(order => {
      worksheet.addRow({
        Timestamp: formatDate(order.po_date),
        'Tanggal Pemesanan': formatDate(order.po_date),
        'Tanggal Kirim': formatDate(order.delivery_schedule),
        'Nama Marketing': order.nama_marketing,
        'Nama Pelanggan/Perusahaan': order.customer?.name,
        'Alamat Kantor': order.buyer_address,
        'Alamat Proyek': order.delivery_address,
        'Contact Person': order.contact_person,
        'Nama Barang/Jenis Material': order.material_name,
        'Jumlah': order.quantity,
        'Satuan': order.satuan,
        'Harga Satuan': order.harga,
        'Total Harga': (order.quantity || 0) * (order.harga || 0),
        'Jenis Transaksi': order.jenis_transaksi,
        'Tipe Pembayaran': paymentTermsLabels[order.payment_terms] || order.payment_terms,
        'Lokasi Sumber': order.lokasi_sumber
      });
    });

    const lastRow = worksheet.rowCount;
    for (let rowNum = 2; rowNum <= lastRow; rowNum++) {
      const row = worksheet.getRow(rowNum);
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin', color: { argb: 'FFE5E7EB' } },
          left: { style: 'thin', color: { argb: 'FFE5E7EB' } },
          bottom: { style: 'thin', color: { argb: 'FFE5E7EB' } },
          right: { style: 'thin', color: { argb: 'FFE5E7EB' } }
        };
        cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
      });
      if (rowNum % 2 === 0) {
        row.eachCell((cell) => {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF3F4F6' } };
        });
      }
    }

    const jumlahCol = worksheet.getColumn('Jumlah');
    jumlahCol.numFmt = '#,##0.##';
    jumlahCol.alignment = { horizontal: 'center' };

    const hargaCol = worksheet.getColumn('Harga Satuan');
    hargaCol.numFmt = '#,##0';
    hargaCol.alignment = { horizontal: 'center' };

    const totalCol = worksheet.getColumn('Total Harga');
    totalCol.numFmt = '#,##0';
    totalCol.alignment = { horizontal: 'center' };

    worksheet.columns.forEach((column) => {
      let maxLength = 14;
      column.eachCell!({ includeEmpty: false }, (cell) => {
        const text = cell.value ? String(cell.value) : '';
        if (text.length > maxLength) {
          maxLength = Math.min(text.length, 40);
        }
      });
      if (column.header) {
        column.width = Math.max(column.header.length + 4, maxLength + 2);
      }
    });

    const grandTotalRow = worksheet.addRow({
      'Timestamp': `TOTAL ${orders.length} PO`,
      'Total Harga': orders.reduce((sum, order) => sum + (order.quantity || 0) * (order.harga || 0), 0)
    });
    grandTotalRow.getCell('Timestamp').font = { bold: true };
    grandTotalRow.getCell('Timestamp').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE0E7FF' } };
    const grandTotalCell = grandTotalRow.getCell('Total Harga');
    grandTotalCell.numFmt = '#,##0';
    grandTotalCell.font = { bold: true };
    grandTotalCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE0E7FF' } };
    grandTotalCell.alignment = { horizontal: 'center', vertical: 'middle' };

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), `hotmix-purchase-orders-${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const jenisTransaksiColors: Record<string, string> = {
    F: 'bg-blue-200 text-blue-800',
    NF: 'bg-green-200 text-green-800',
  };

  const paymentTermsLabels: Record<string, string> = {
    cash: 'Transfer',
    termin: 'Cash KP',
    invoice: 'Cash Site',
  };

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatTotal = (quantity: number, harga: number) => {
    return formatRupiah(quantity * harga);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Hotmix Purchase Orders</h2>
          <p className="mt-1 text-sm text-gray-600">Kelola Purchase Order Hotmix</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportSpreadsheet}
            className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm transition-colors"
          >
            <svg className="mr-2 h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Ekspor Spreadsheet (.xlsx)
          </button>
          <a
            href="/dashboard/create-hotmix-orders?from=hotmix-orders"
            className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 shadow-sm transition-colors"
          >
            <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Buat PO Baru Hotmix
          </a>
        </div>
      </div>

      {deleteSuccess && (
        <div className="rounded-lg bg-green-50 border border-green-200 p-4 flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-green-800">
              Purchase Order berhasil dihapus!
            </p>
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 table-auto">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 w-32">
                  Tanggal PO
                </th>
                <th scope="col" className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 w-32">
                  Tanggal Kirim
                </th>
                <th scope="col" className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 w-48">
                  Pelanggan
                </th>
                <th scope="col" className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 w-48">
                  Material
                </th>
                <th scope="col" className="px-4 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-600 w-28">
                  Jumlah (M3)
                </th>
                <th scope="col" className="px-4 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-600 w-40">
                  Total Harga
                </th>
                <th scope="col" className="px-4 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-600 w-32">
                  Jenis Transaksi
                </th>
                <th scope="col" className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 w-32">
                  Tipe Pembayaran
                </th>
                <th scope="col" className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 w-40">
                  Lokasi Sumber
                </th>
                <th scope="col" className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 w-32">
                  Status
                </th>
                <th scope="col" className="px-4 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-600 w-32">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={11} className="px-6 py-12 text-center">
                    <div className="text-gray-500">
                      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p className="mt-4 text-sm">Belum ada Purchase Order</p>
                    </div>
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-700">{formatDate(order.po_date)}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-700">{formatDate(order.delivery_schedule)}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm font-medium text-gray-900">{order.customer?.name || '-'}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-900">{order.material_name}</div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="text-sm font-medium text-gray-900">{order.quantity}</div>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="text-sm font-semibold text-gray-900">{formatTotal(order.quantity, order.harga)}</div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className={`inline-flex rounded-full px-3 py-1.5 text-xs font-bold leading-5 ${jenisTransaksiColors[order.jenis_transaksi] || 'bg-gray-200 text-gray-800'}`}>
                        {order.jenis_transaksi}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-900">{paymentTermsLabels[order.payment_terms] || order.payment_terms}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm font-medium text-gray-900">{order.lokasi_sumber}</div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex rounded-full px-3 py-1.5 text-xs font-bold leading-5 ${getStatus(order.status).className}`}>
                        {getStatus(order.status).label}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-4">
                        <a
                          href={`/dashboard/detail-hotmix-orders/${order.id}?from=hotmix-orders`}
                          className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                        >
                          Detail
                        </a>
                        <span className="text-gray-300">|</span>
                        <a 
                          href={`/dashboard/edit-hotmix-orders/${order.id}?from=hotmix-orders`}
                          className="text-indigo-600 hover:text-indigo-800 font-medium text-sm"
                        >
                          Edit
                        </a>
                        <span className="text-gray-300">|</span>
                        <button
                          onClick={() => handleDelete(order.id)}
                          className="text-red-600 hover:text-red-800 font-medium text-sm"
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
    </div>
  );
}