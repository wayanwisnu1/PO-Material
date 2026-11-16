<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ProductHotmix;
use Illuminate\Http\Request;

class ProductHotmixApiController extends Controller
{
    public function index()
    {
        return response()->json(['data' => ProductHotmix::orderBy('name', 'asc')->get()]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|unique:products_hotmix,name',
            'description' => 'nullable|string',
            'price' => 'nullable|numeric',
        ]);
        $validated['price'] = $validated['price'] ?? 0;
        $product = ProductHotmix::create($validated);
        return response()->json(['message' => 'Produk hotmix berhasil dibuat', 'data' => $product], 201);
    }

    public function show($id)
    {
        return response()->json(['data' => ProductHotmix::findOrFail($id)]);
    }

    public function update(Request $request, $id)
    {
        $product = ProductHotmix::findOrFail($id);
        $validated = $request->validate([
            'name' => 'required|string|unique:products_hotmix,name,' . $id,
            'description' => 'nullable|string',
            'price' => 'nullable|numeric',
        ]);
        $validated['price'] = $validated['price'] ?? 0;
        $product->update($validated);
        return response()->json(['message' => 'Produk hotmix berhasil diperbarui', 'data' => $product]);
    }

    public function destroy($id)
    {
        ProductHotmix::findOrFail($id)->delete();
        return response()->json(['message' => 'Produk hotmix berhasil dihapus']);
    }
}