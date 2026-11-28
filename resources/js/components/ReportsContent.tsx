import React, { useState, useEffect } from 'react';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { FileDown, Filter, ClipboardList, Box, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { DateRangePicker } from '@/components/ui/date-range-picker';

interface PurchaseOrder {
  id: number;
  po_number: string;
  po_date: string;
  po_type: 'beton' | 'hotmix' | 'batu';
  customer?: {
    name: string;
  };
  material_name: string;
  quantity: number;
  harga: number;
  status: string;
  jenis_transaksi: string;
  lokasi_sumber: string;
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

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

export default function ReportsContent() {
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    setLoading(true);
    fetch('/api/purchase-orders')
      .then(res => res.json())
      .then(data => {
        setOrders(data.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const filteredOrders = orders.filter(order => {
    const orderDate = new Date(order.po_date);
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    
    const matchesDate = orderDate >= start && orderDate <= end;
    const matchesType = filterType === 'all' || order.po_type === filterType;
    
    return matchesDate && matchesType;
  });

  const stats = {
    totalOrders: filteredOrders.length,
    totalVolume: filteredOrders.reduce((sum, o) => sum + Number(o.quantity || 0), 0),
    totalAmount: filteredOrders.reduce((sum, o) => sum + (Number(o.quantity || 0) * Number(o.harga || 0)), 0),
  };

  const chartData = [
    { name: 'Beton', value: filteredOrders.filter(o => o.po_type === 'beton').reduce((sum, o) => sum + Number(o.quantity || 0), 0) },
    { name: 'Hotmix', value: filteredOrders.filter(o => o.po_type === 'hotmix').reduce((sum, o) => sum + Number(o.quantity || 0), 0) },
    { name: 'Batu', value: filteredOrders.filter(o => o.po_type === 'batu').reduce((sum, o) => sum + Number(o.quantity || 0), 0) },
  ];

  const dailySales = filteredOrders.reduce((acc: any, order) => {
    const date = order.po_date;
    if (!acc[date]) acc[date] = { date, amount: 0 };
    acc[date].amount += (Number(order.quantity || 0) * Number(order.harga || 0));
    return acc;
  }, {});

  const barChartData = Object.values(dailySales).sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  const handleExport = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Laporan Penjualan');

    worksheet.columns = [
      { header: 'No PO', key: 'po_number', width: 20 },
      { header: 'Tanggal', key: 'po_date', width: 15 },
      { header: 'Tipe', key: 'po_type', width: 10 },
      { header: 'Customer', key: 'customer_name', width: 30 },
      { header: 'Produk', key: 'material_name', width: 25 },
      { header: 'Jumlah (m3)', key: 'quantity', width: 12 },
      { header: 'Harga Satuan', key: 'harga', width: 15 },
      { header: 'Total', key: 'total_amount', width: 15 },
      { header: 'Status', key: 'status', width: 15 },
    ];

    filteredOrders.forEach(order => {
      worksheet.addRow({
        po_number: order.po_number,
        po_date: order.po_date,
        po_type: order.po_type,
        customer_name: order.customer?.name || '-',
        material_name: order.material_name,
        quantity: Number(order.quantity || 0),
        harga: Number(order.harga || 0),
        total_amount: Number(order.quantity || 0) * Number(order.harga || 0),
        status: getStatus(order.status).label,
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), `Laporan_Penjualan_${startDate}_ke_${endDate}.xlsx`);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex flex-1 flex-wrap items-end gap-4">
            <DateRangePicker
              startDate={startDate}
              endDate={endDate}
              onChange={(start, end) => {
                setStartDate(start);
                setEndDate(end);
              }}
              label="Periode Laporan (Start - End)"
              className="flex-1 min-w-[300px]"
            />

            <div className="space-y-1.5 min-w-[200px]">
              <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                Material Type
              </Label>
              <div className="relative group">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="flex h-11 w-full rounded-md border border-gray-200 bg-gray-50/50 px-3 py-2 text-sm ring-offset-background focus:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none transition-all cursor-pointer"
                >
                  <option value="all">Semua Material</option>
                  <option value="beton">Beton</option>
                  <option value="hotmix">Hotmix</option>
                  <option value="batu">Batu</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 group-hover:text-blue-500 transition-colors">
                  <Filter className="h-4 w-4" />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-5 lg:pt-0">
            <Button 
              onClick={handleExport}
              className="h-11 px-6 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm font-semibold gap-2"
            >
              <FileDown className="h-4 w-4" />
              Export Excel
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
            <ClipboardList className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Purchase Orders</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-0.5">{stats.totalOrders.toLocaleString('id-ID')}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600">
            <Box className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Volume Terjual</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-0.5">
              {stats.totalVolume.toLocaleString('id-ID')} <span className="text-sm font-normal text-gray-500 ml-0.5">m³</span>
            </h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Nilai Penjualan</p>
            <h3 className="text-2xl font-bold text-blue-600 mt-0.5">{formatCurrency(stats.totalAmount)}</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Volume m³ per Material</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={chartData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} fill="#8884d8" paddingAngle={5} dataKey="value" label>
                  {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Tren Penjualan (IDR)</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" fontSize={12} tickFormatter={(val) => new Date(val).toLocaleDateString('id-ID', { day: 'numeric' })} />
                <YAxis fontSize={12} tickFormatter={(val) => `Rp${(val / 1000000).toFixed(0)}M`} />
                <Tooltip formatter={(val: number) => [formatCurrency(val), 'Penjualan']} />
                <Bar dataKey="amount" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">Rincian Penjualan</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase">
              <tr>
                <th className="px-6 py-3">No PO</th>
                <th className="px-6 py-3">Tanggal</th>
                <th className="px-6 py-3">Tipe</th>
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3 text-right">Volume</th>
                <th className="px-6 py-3 text-right">Total</th>
                <th className="px-6 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders.map(order => (
                <tr key={order.id}>
                  <td className="px-6 py-4 text-sm font-medium">{order.po_number}</td>
                  <td className="px-6 py-4 text-sm">{new Date(order.po_date).toLocaleDateString('id-ID')}</td>
                  <td className="px-6 py-4 text-sm capitalize">{order.po_type}</td>
                  <td className="px-6 py-4 text-sm">{order.customer?.name || '-'}</td>
                  <td className="px-6 py-4 text-sm text-right">{Number(order.quantity || 0).toLocaleString('id-ID')}</td>
                  <td className="px-6 py-4 text-sm text-right">{formatCurrency(Number(order.quantity || 0) * Number(order.harga || 0))}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatus(order.status).className}`}>
                      {getStatus(order.status).label}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

