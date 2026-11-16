@extends('layouts.app')

@section('title', 'Detail Supplier')

@section('content')
<div class="flex justify-between items-center mb-6">
    <h1 class="text-3xl font-bold">{{ $supplier->name }}</h1>
    <div class="space-x-2">
        <a href="{{ route('suppliers.edit', $supplier) }}" class="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded">
            Edit
        </a>
        <a href="{{ route('suppliers.index') }}" class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
            Kembali
        </a>
    </div>
</div>

<div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-6">
    <div class="grid grid-cols-2 gap-4 text-sm">
        <div>
            <span class="font-semibold">Nama:</span> {{ $supplier->name }}
        </div>
        <div>
            <span class="font-semibold">Telepon:</span> {{ $supplier->phone ?: '-' }}
        </div>
        <div>
            <span class="font-semibold">Email:</span> {{ $supplier->email ?: '-' }}
        </div>
        <div>
            <span class="font-semibold">Contact Person:</span> {{ $supplier->contact_person ?: '-' }}
        </div>
        <div class="col-span-2">
            <span class="font-semibold">Alamat:</span><br>
            {{ $supplier->address }}
        </div>
    </div>
</div>

<div class="bg-white shadow-md rounded px-8 pt-6 pb-8">
    <h2 class="text-xl font-bold mb-4">Riwayat Purchase Order</h2>
    
    @if($supplier->purchaseOrders->count() > 0)
    <table class="min-w-full">
        <thead class="bg-gray-50">
            <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">No PO</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
            @foreach($supplier->purchaseOrders as $po)
            <tr>
                <td class="px-4 py-3">
                    <a href="{{ route('purchase-orders.show', $po) }}" class="text-blue-600 hover:text-blue-900">{{ $po->po_number }}</a>
                </td>
                <td class="px-4 py-3">{{ $po->po_date->format('d/m/Y') }}</td>
                <td class="px-4 py-3">Rp {{ number_format($po->total_amount, 0, ',', '.') }}</td>
                <td class="px-4 py-3">{{ ucfirst($po->status) }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
    @else
    <p class="text-gray-500 text-center py-4">Belum ada purchase order untuk supplier ini.</p>
    @endif
</div>
@endsection
