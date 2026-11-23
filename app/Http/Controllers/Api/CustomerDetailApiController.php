<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\Auth;

class CustomerDetailApiController extends Controller
{
    public function show($id)
    {
        $customer = Customer::with(['creator', 'updater'])->findOrFail($id);

        return response()->json([
            'data' => $customer
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|unique:customers,name',
            'contact_person' => 'required|string',
            'phone' => 'required|string',
            'email' => 'required|email',
            'address' => 'required|string',
        ]);

        $validated['created_by'] = Auth::id();
        $customer = Customer::create($validated);

        return response()->json([
            'message' => 'Customer berhasil dibuat',
            'data' => $customer
        ], 201);
    }

    public function update($id, Request $request)
    {
        $customer = Customer::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|unique:customers,name,' . $id,
            'contact_person' => 'required|string',
            'phone' => 'required|string',
            'email' => 'required|email',
            'address' => 'required|string',
        ]);

        $validated['updated_by'] = Auth::id();
        $customer->update($validated);

        return response()->json([
            'message' => 'Customer berhasil diperbarui',
            'data' => $customer
        ]);
    }
}
