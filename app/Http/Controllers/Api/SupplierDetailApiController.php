<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Supplier;
use Illuminate\Http\Request;

class SupplierDetailApiController extends Controller
{
    public function show($id)
    {
        $supplier = Supplier::findOrFail($id);

        return response()->json([
            'data' => $supplier
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|unique:suppliers,name',
            'contact_person' => 'required|string',
            'phone' => 'required|string',
            'email' => 'required|email',
            'address' => 'required|string',
        ]);

        $supplier = Supplier::create($validated);

        return response()->json([
            'message' => 'Supplier berhasil dibuat',
            'data' => $supplier
        ], 201);
    }

    public function update($id, Request $request)
    {
        $supplier = Supplier::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|unique:suppliers,name,' . $id,
            'contact_person' => 'required|string',
            'phone' => 'required|string',
            'email' => 'required|email',
            'address' => 'required|string',
        ]);

        $supplier->update($validated);

        return response()->json([
            'message' => 'Supplier berhasil diperbarui',
            'data' => $supplier
        ]);
    }
}
