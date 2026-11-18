<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PurchaseOrder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class OrderDetailApiController extends Controller
{
    public function show($id)
    {
        $order = PurchaseOrder::with('supplier', 'items')->findOrFail($id);

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

    public function update($id, Request $request)
    {
        $order = PurchaseOrder::findOrFail($id);

        $validated = $request->validate([
            'po_number' => 'required|string|unique:purchase_orders,po_number,' . $id,
            'po_date' => 'required|date',
            'supplier_id' => 'required|exists:suppliers,id',
            'buyer_company' => 'required|string',
            'buyer_address' => 'required|string',
            'delivery_address' => 'required|string',
            'delivery_schedule' => 'required|date',
            'payment_terms' => 'required|in:cash,termin,invoice',
            'payment_days' => 'nullable|integer',
            'status' => 'required|in:draft,submitted,approved,delivered,cancelled',
            'notes' => 'nullable|string',
        ]);

        $validated['status'] = $this->normalizeStatus($validated['status']);

        $user = Auth::user();
        if ($user->hasPermission('data.edit_draft') && ! $user->hasPermission('data.edit_all')) {
            if (! in_array($order->status, ['Draft', 'Pending'], true)) {
                abort(403, 'Anda hanya dapat mengubah data berstatus Draft.');
            }
            if ((int) $order->created_by !== (int) $user->id) {
                abort(403, 'Anda hanya dapat mengubah data yang Anda buat sendiri.');
            }
        }

        $order->update($validated);

        return response()->json([
            'message' => 'PO berhasil diperbarui',
            'data' => $order->load('supplier', 'items')
        ]);
    }

    protected function normalizeStatus(string $status): string
    {
        $map = [
            'draft' => 'Draft',
            'submitted' => 'Submited',
            'approved' => 'Approved',
            'delivered' => 'Delivered',
            'cancelled' => 'Cancelled',
        ];

        return $map[strtolower($status)] ?? 'Draft';
    }
}
