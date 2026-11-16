<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ProductBatu;
use Illuminate\Http\Request;

class ProductBatuApiController extends Controller
{
    public function index()
    {
        return response()->json(['data' => ProductBatu::orderBy('name', 'asc')->get()]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|unique:products_batu,name',
            'description' => 'nullable|string',
            'price' => 'nullable|numeric',
        ]);
        $validated['price'] = $validated['price'] ?? 0;
        $product = ProductBatu::create($validated);
        return response()->json(['message' => 'Produk batu berhasil dibuat', 'data' => $product], 201);
    }

    public function show($id)
    {
        return response()->json(['data' => ProductBatu::findOrFail($id)]);
    }

    public function update(Request $request, $id)
    {
        $product = ProductBatu::findOrFail($id);
        $validated = $request->validate([
            'name' => 'required|string|unique:products_batu,name,' . $id,
            'description' => 'nullable|string',
            'price' => 'nullable|numeric',
        ]);
        $validated['price'] = $validated['price'] ?? 0;
        $product->update($validated);
        return response()->json(['message' => 'Produk batu berhasil diperbarui', 'data' => $product]);
    }

    public function destroy($id)
    {
        ProductBatu::findOrFail($id)->delete();
        return response()->json(['message' => 'Produk batu berhasil dihapus']);
    }
}
