<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PurchaseOrder;
use Illuminate\Http\Request;

class OrderDetailApiController extends Controller
{
    public function show($id)
    {
        $order = PurchaseOrder::with('supplier', 'items')->findOrFail($id);

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

        $order->update($validated);

        return response()->json([
            'message' => 'PO berhasil diperbarui',
            'data' => $order->load('supplier', 'items')
        ]);
    }
}
