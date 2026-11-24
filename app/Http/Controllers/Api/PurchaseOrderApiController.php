<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PurchaseOrder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PurchaseOrderApiController extends Controller
{
    public function index()
    {
        $query = PurchaseOrder::with(['customer', 'creator', 'updater'])->orderBy('po_date', 'desc');

        if (Auth::user()->hasPermission('data.view_all')) {
            // Semua data
        } elseif (Auth::user()->hasPermission('data.view_own')) {
            $query->where('created_by', Auth::id());
        } else {
            $query->whereRaw('1 = 0'); // Tidak boleh melihat data sama sekali
        }

        $orders = $query->paginate(50);

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
        $user = Auth::user();
        $baseQuery = PurchaseOrder::query();

        if ($user->hasPermission('data.view_all')) {
            // Semua data
        } elseif ($user->hasPermission('data.view_own')) {
            $baseQuery->where('created_by', $user->id);
        } else {
            $baseQuery->whereRaw('1 = 0');
        }

        $now = now();
        $startOfMonth = $now->copy()->startOfMonth();
        $countQuery = clone $baseQuery;

        $totalOrders = $countQuery->count();
        $monthlyOrders = (clone $baseQuery)->where('po_date', '>=', $startOfMonth)->count();
        $totalRevenue = (clone $baseQuery)->sum(\DB::raw('quantity * harga'));
        $monthlyRevenue = (clone $baseQuery)->where('po_date', '>=', $startOfMonth)->sum(\DB::raw('quantity * harga'));
        
        $pendingCount = (clone $baseQuery)->where('status', 'pending')->count();
        $submittedCount = (clone $baseQuery)->where('status', 'submitted')->count();
        
        $revenueBeton = (clone $baseQuery)->where('po_type', 'beton')->sum(\DB::raw('quantity * harga'));
        $revenueHotmix = (clone $baseQuery)->where('po_type', 'hotmix')->sum(\DB::raw('quantity * harga'));
        $revenueBatu = (clone $baseQuery)->where('po_type', 'batu')->sum(\DB::raw('quantity * harga'));

        // Data untuk chart (7 hari terakhir)
        $chartData = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subDays($i)->format('Y-m-d');
            $rev = (clone $baseQuery)->whereDate('po_date', $date)->sum(\DB::raw('quantity * harga'));
            $chartData[] = [
                'name' => now()->subDays($i)->format('d M'),
                'value' => $rev
            ];
        }

        $recentOrders = (clone $baseQuery)
            ->with('customer')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function($order) {
                return [
                    'id' => $order->po_number,
                    'customer' => $order->customer->name ?? 'N/A',
                    'email' => $order->po_type,
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
            'pending_count' => $pendingCount,
            'submitted_count' => $submittedCount,
            'revenue_beton' => $revenueBeton,
            'revenue_hotmix' => $revenueHotmix,
            'revenue_batu' => $revenueBatu,
            'chart_data' => $chartData,
            'recent_orders' => $recentOrders
        ]);
    }

    public function show($id)
    {
        $order = PurchaseOrder::with(['customer', 'creator', 'updater'])->findOrFail($id);

        $user = Auth::user();
        if (! $user->hasPermission('data.view_all')) {
            if ($user->hasPermission('data.view_own') && $order->created_by !== $user->id) {
                abort(403, 'Anda tidak berhak melihat data ini.');
            }
        }

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
            'status' => 'nullable|in:draft,submitted,approved,delivered,received,cancelled,Draft,Submited,Submitted,Approved,Delivered,Received,Cancelled',
            'jenis_transaksi' => 'required|in:F,NF',
            'lokasi_sumber' => 'required|string',
            'foto_po' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Generate po_number otomatis
        $lastPo = PurchaseOrder::orderBy('id', 'desc')->first();
        $nextNumber = ($lastPo ? intval(substr($lastPo->po_number, -4)) + 1 : 1);
        $validated['po_number'] = 'PO-' . date('Ym') . '-' . str_pad($nextNumber, 4, '0', STR_PAD_LEFT);

        // Normalisasi case status ke format database enum
        $validated['status'] = $this->normalizeStatus($validated['status'] ?? 'draft');

        // Set pembuat data
        $validated['created_by'] = Auth::id();

        // Handle foto_po upload
        if ($request->hasFile('foto_po')) {
            $file = $request->file('foto_po');
            $path = $file->store('purchase-orders', 'public');
            $validated['foto_po'] = $path;
        }

        $order = PurchaseOrder::create($validated);

        // Log Activity: data baru dibuat
        \App\Models\ActivityLog::create([
            'user_id' => Auth::id(),
            'subject_type' => 'PurchaseOrder',
            'subject_id' => $order->id,
            'description' => 'Menambahkan data PO ' . $order->po_number,
            'old_data' => null,
            'new_data' => $order->toArray(),
        ]);

        return response()->json([
            'message' => 'Purchase Order berhasil dibuat',
            'data' => $order->load('customer')
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $order = PurchaseOrder::findOrFail($id);
        $oldData = $order->toArray();

        $validated = $request->validate([
            'po_date' => 'sometimes|nullable|date',
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
            'delivery_schedule' => 'sometimes|nullable|date',
            'payment_terms' => 'required|in:cash,termin,invoice',
            'payment_days' => 'nullable|integer',
            'status' => 'nullable|in:draft,submitted,approved,delivered,received,cancelled,Draft,Submited,Submitted,Approved,Delivered,Received,Cancelled',
            'jenis_transaksi' => 'required|in:F,NF',
            'lokasi_sumber' => 'required|string',
            'foto_po' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Field tanggal yang dikirim kosong tidak boleh menimpa nilai lama.
        foreach (['po_date', 'delivery_schedule'] as $dateField) {
            if (array_key_exists($dateField, $validated) && blank($validated[$dateField])) {
                unset($validated[$dateField]);
            }
        }

        if (isset($validated['status'])) {
            $validated['status'] = $this->normalizeStatus($validated['status']);
        }

        // Set pengedit data
        $validated['updated_by'] = Auth::id();

        // Admin Marketing tidak boleh mengubah status ke selain Draft/Pending
        $user = Auth::user();
        if ($user->hasPermission('data.edit_draft') && ! $user->hasPermission('data.edit_all')) {
            if (! in_array($validated['status'] ?? $order->status, ['Draft', 'Pending'], true)) {
                abort(403, 'Anda hanya dapat mengubah data berstatus Draft.');
            }
        }

        // Handle foto_po upload
        if ($request->hasFile('foto_po')) {
            if ($order->foto_po && \Storage::disk('public')->exists($order->foto_po)) {
                \Storage::disk('public')->delete($order->foto_po);
            }
            $file = $request->file('foto_po');
            $path = $file->store('purchase-orders', 'public');
            $validated['foto_po'] = $path;
        }

        $order->update($validated);

        // Log Activity
        \App\Models\ActivityLog::create([
            'user_id' => Auth::id(),
            'subject_type' => 'PurchaseOrder',
            'subject_id' => $order->id,
            'description' => 'Update PO: ' . $order->po_number,
            'old_data' => $oldData,
            'new_data' => $order->fresh()->toArray(),
        ]);

        return response()->json([
            'message' => 'Purchase Order berhasil diupdate',
            'data' => $order->load('customer')
        ]);
    }

    public function destroy($id)
    {
        $order = PurchaseOrder::findOrFail($id);

        if (! Auth::user()->hasPermission('data.delete')) {
            abort(403, 'Anda tidak memiliki izin menghapus data.');
        }

        if ($order->foto_po && \Storage::disk('public')->exists($order->foto_po)) {
            \Storage::disk('public')->delete($order->foto_po);
        }

        // Log Activity: data dihapus
        \App\Models\ActivityLog::create([
            'user_id' => Auth::id(),
            'subject_type' => 'PurchaseOrder',
            'subject_id' => $order->id,
            'description' => 'Menghapus data PO ' . $order->po_number,
            'old_data' => $order->toArray(),
            'new_data' => null,
        ]);

        $order->delete();

        return response()->json([
            'message' => 'Purchase Order berhasil dihapus'
        ]);
    }

    /**
     * Normalisasi status input frontend (lowercase) ke format database enum.
     */
    protected function normalizeStatus(string $status): string
    {
        $map = [
            'draft' => 'Draft',
            'submitted' => 'Submited',
            'submited' => 'Submited', // Handle typo in DB if exists
            'approved' => 'Approved',
            'delivered' => 'Delivered',
            'received' => 'Received',
            'cancelled' => 'Cancelled',
            'Draft' => 'Draft',
            'Submited' => 'Submited',
            'Submitted' => 'Submited',
            'Approved' => 'Approved',
            'Delivered' => 'Delivered',
            'Received' => 'Received',
            'Cancelled' => 'Cancelled',
        ];

        return $map[$status] ?? $map[strtolower($status)] ?? 'Draft';
    }
}
