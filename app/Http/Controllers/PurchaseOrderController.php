<?php

namespace App\Http\Controllers;

use App\Models\PurchaseOrder;
use App\Models\Supplier;
use App\Models\PoItem;
use Illuminate\Http\Request;

class PurchaseOrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $purchaseOrders = PurchaseOrder::with('supplier', 'items')->paginate(15);
        return view('purchase-orders.index', compact('purchaseOrders'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $suppliers = Supplier::all();
        return view('purchase-orders.create', compact('suppliers'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'po_number' => 'required|string|unique:purchase_orders',
            'po_date' => 'required|date',
            'supplier_id' => 'required|exists:suppliers,id',
            'buyer_company' => 'required|string|max:255',
            'buyer_address' => 'required|string',
            'delivery_address' => 'required|string',
            'delivery_schedule' => 'required|date_format:Y-m-d H:i',
            'payment_terms' => 'required|in:cash,termin,invoice',
            'payment_days' => 'nullable|integer|min:0',
            'status' => 'required|in:draft,submitted,approved,delivered,received,cancelled',
            'notes' => 'nullable|string',
        ]);

        $po = PurchaseOrder::create($validated);

        return redirect()->route('purchase-orders.show', $po)->with('success', 'PO berhasil dibuat');
    }

    /**
     * Display the specified resource.
     */
    public function show(PurchaseOrder $purchaseOrder)
    {
        $purchaseOrder->load('supplier', 'items');
        return view('purchase-orders.show', compact('purchaseOrder'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(PurchaseOrder $purchaseOrder)
    {
        $suppliers = Supplier::all();
        $purchaseOrder->load('items');
        return view('purchase-orders.edit', compact('purchaseOrder', 'suppliers'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, PurchaseOrder $purchaseOrder)
    {
        $validated = $request->validate([
            'po_number' => 'required|string|unique:purchase_orders,po_number,' . $purchaseOrder->id,
            'po_date' => 'required|date',
            'supplier_id' => 'required|exists:suppliers,id',
            'buyer_company' => 'required|string|max:255',
            'buyer_address' => 'required|string',
            'delivery_address' => 'required|string',
            'delivery_schedule' => 'required|date_format:Y-m-d H:i',
            'payment_terms' => 'required|in:cash,termin,invoice',
            'payment_days' => 'nullable|integer|min:0',
            'status' => 'required|in:draft,submitted,approved,delivered,received,cancelled',
            'notes' => 'nullable|string',
        ]);

        $purchaseOrder->update($validated);

        return redirect()->route('purchase-orders.show', $purchaseOrder)->with('success', 'PO berhasil diupdate');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PurchaseOrder $purchaseOrder)
    {
        $purchaseOrder->delete();
        return redirect()->route('purchase-orders.index')->with('success', 'PO berhasil dihapus');
    }

    /**
     * Add item to PO
     */
    public function addItem(Request $request, PurchaseOrder $purchaseOrder)
    {
        $validated = $request->validate([
            'concrete_type' => 'required|string|max:255',
            'concrete_grade' => 'required|string|max:255',
            'quantity' => 'required|numeric|min:0.01',
            'unit' => 'required|string|max:50',
            'unit_price' => 'required|numeric|min:0',
            'specifications' => 'nullable|string',
        ]);

        $validated['purchase_order_id'] = $purchaseOrder->id;
        $validated['subtotal'] = $validated['quantity'] * $validated['unit_price'];

        PoItem::create($validated);

        $purchaseOrder->updateTotalAmount();

        return redirect()->route('purchase-orders.show', $purchaseOrder)->with('success', 'Item berhasil ditambah');
    }

    /**
     * Remove item from PO
     */
    public function removeItem(PurchaseOrder $purchaseOrder, PoItem $item)
    {
        $item->delete();
        $purchaseOrder->updateTotalAmount();

        return redirect()->route('purchase-orders.show', $purchaseOrder)->with('success', 'Item berhasil dihapus');
    }
}
