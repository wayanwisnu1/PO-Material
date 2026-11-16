<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PurchaseOrder;
use Illuminate\Http\Request;

class PurchaseOrderApiController extends Controller
{
    public function index()
    {
        $orders = PurchaseOrder::with('customer')
            ->orderBy('po_date', 'desc')
            ->paginate(50);

        return response()->json([
            'data' => $orders->items(),
            'meta' => [
                'current_page' => $orders->currentPage(),
                'last_page' => $orders->lastPage(),
                'per_page' => $orders->perPage(),
                'total' => $orders->total(),
            ]
        ]);
    }

    public function stats()
    {
        $now = now();
        $startOfMonth = $now->copy()->startOfMonth();
        
        $totalOrders = PurchaseOrder::count();
        $monthlyOrders = PurchaseOrder::where('po_date', '>=', $startOfMonth)->count();
        $totalRevenue = PurchaseOrder::sum(\DB::raw('quantity * harga'));
        $monthlyRevenue = PurchaseOrder::where('po_date', '>=', $startOfMonth)->sum(\DB::raw('quantity * harga'));
        
        // Data untuk chart (7 hari terakhir)
        $chartData = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subDays($i)->format('Y-m-d');
            $count = PurchaseOrder::whereDate('po_date', $date)->count();
            $chartData[] = [
                'name' => now()->subDays($i)->format('d M'),
                'value' => $count
            ];
        }

        $recentOrders = PurchaseOrder::with('customer')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function($order) {
                return [
                    'id' => $order->po_number,
                    'customer' => $order->customer->name ?? 'N/A',
                    'email' => $order->po_type, // Gunakan po_type sebagai info tambahan
                    'status' => $order->status,
                    'channel' => $order->lokasi_sumber,
                    'date' => $order->po_date->format('Y-m-d'),
                    'amount' => $order->quantity * $order->harga
                ];
            });

        return response()->json([
            'total_orders' => $totalOrders,
            'monthly_orders' => $monthlyOrders,
            'total_revenue' => $totalRevenue,
            'monthly_revenue' => $monthlyRevenue,
            'chart_data' => $chartData,
            'recent_orders' => $recentOrders
        ]);
    }

    public function show($id)
    {
        $order = PurchaseOrder::with(['customer'])
            ->findOrFail($id);

        return response()->json([
            'data' => $order
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'po_date' => 'required|date',
            'po_type' => 'required|in:beton,batu,hotmix',
            'nama_marketing' => 'required|string',
            'customer_id' => 'required|exists:customers,id',
            'contact_person' => 'required|string',
            'quantity' => 'required|numeric|min:0',
            'material_name' => 'required|string',
            'satuan' => 'required|in:Ton,M3',
            'harga' => 'required|numeric|min:0',
            'buyer_address' => 'required|string',
            'delivery_address' => 'required|string',
            'delivery_schedule' => 'required|date',
            'payment_terms' => 'required|in:cash,termin,invoice',
            'payment_days' => 'nullable|integer',
            'status' => 'nullable|in:draft,submitted,approved,delivered,cancelled',
            'jenis_transaksi' => 'required|in:F,NF',
            'lokasi_sumber' => 'required|string',
            'foto_po' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Generate po_number otomatis
        $lastPo = PurchaseOrder::orderBy('id', 'desc')->first();
        $nextNumber = ($lastPo ? intval(substr($lastPo->po_number, -4)) + 1 : 1);
        $validated['po_number'] = 'PO-' . date('Ym') . '-' . str_pad($nextNumber, 4, '0', STR_PAD_LEFT);
        
        // Set default status
        $validated['status'] = 'draft';

        // Handle foto_po upload
        if ($request->hasFile('foto_po')) {
            $file = $request->file('foto_po');
            $path = $file->store('purchase-orders', 'public');
            $validated['foto_po'] = $path;
        }

        $order = PurchaseOrder::create($validated);

        return response()->json([
            'message' => 'Purchase Order berhasil dibuat',
            'data' => $order->load('customer')
        ], 201);
    }

    public function destroy($id)
    {
        $order = PurchaseOrder::findOrFail($id);
        
        // Delete foto jika ada
        if ($order->foto_po && \Storage::disk('public')->exists($order->foto_po)) {
            \Storage::disk('public')->delete($order->foto_po);
        }
        
        $order->delete();

        return response()->json([
            'message' => 'Purchase Order berhasil dihapus'
        ]);
    }

    public function update(Request $request, $id)
    {
        $order = PurchaseOrder::findOrFail($id);

        $validated = $request->validate([
            'po_date' => 'required|date',
            'po_type' => 'required|in:beton,batu,hotmix',
            'nama_marketing' => 'required|string',
            'customer_id' => 'required|exists:customers,id',
            'contact_person' => 'required|string',
            'quantity' => 'required|numeric|min:0',
            'material_name' => 'required|string',
            'satuan' => 'required|in:Ton,M3',
            'harga' => 'required|numeric|min:0',
            'buyer_address' => 'required|string',
            'delivery_address' => 'required|string',
            'delivery_schedule' => 'required|date',
            'payment_terms' => 'required|in:cash,termin,invoice',
            'payment_days' => 'nullable|integer',
            'status' => 'nullable|in:draft,submitted,approved,delivered,cancelled',
            'jenis_transaksi' => 'required|in:F,NF',
            'lokasi_sumber' => 'required|string',
            'foto_po' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Handle foto_po upload
        if ($request->hasFile('foto_po')) {
            // Delete old foto if exists
            if ($order->foto_po && \Storage::disk('public')->exists($order->foto_po)) {
                \Storage::disk('public')->delete($order->foto_po);
            }
            $file = $request->file('foto_po');
            $path = $file->store('purchase-orders', 'public');
            $validated['foto_po'] = $path;
        }

        $order->update($validated);

        return response()->json([
            'message' => 'Purchase Order berhasil diupdate',
            'data' => $order->load('customer')
        ]);
    }
}
