<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

use App\Models\User;
use Illuminate\Support\Facades\Auth;

class ProductApiController extends Controller
{
    public function index()
    {
        return response()->json(['data' => Product::with(['creator', 'updater'])->orderBy('name', 'asc')->get()]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|unique:products,name',
            'description' => 'nullable|string',
            'price' => 'nullable|numeric',
        ]);
        $validated['price'] = $validated['price'] ?? 0;
        $validated['created_by'] = Auth::id();
        $product = Product::create($validated);
        return response()->json(['message' => 'Produk berhasil dibuat', 'data' => $product], 201);
    }

    public function show($id)
    {
        return response()->json(['data' => Product::with(['creator', 'updater'])->findOrFail($id)]);
    }

    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);
        $validated = $request->validate([
            'name' => 'required|string|unique:products,name,' . $id,
            'description' => 'nullable|string',
            'price' => 'nullable|numeric',
        ]);
        $validated['price'] = $validated['price'] ?? 0;
        $validated['updated_by'] = Auth::id();
        $product->update($validated);
        return response()->json(['message' => 'Produk berhasil diperbarui', 'data' => $product]);
    }

    public function destroy($id)
    {
        Product::findOrFail($id)->delete();
        return response()->json(['message' => 'Produk berhasil dihapus']);
    }
}