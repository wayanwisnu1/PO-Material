@extends('layouts.app')

@section('title', 'Purchase Orders')

@section('content')
<div class="flex justify-between items-center mb-6">
    <h1 class="text-3xl font-bold">Purchase Orders</h1>
    <a href="{{ route('purchase-orders.create') }}" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Buat PO Baru
    </a>
</div>

<div class="bg-white shadow-md rounded">
    <table class="min-w-full">
        <thead class="bg-gray-50">
            <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">No PO</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Supplier</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pengiriman</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
            </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
            @foreach($purchaseOrders as $po)
            <tr>
                <td class="px-6 py-4 font-mono">{{ $po->po_number }}</td>
                <td class="px-6 py-4">{{ $po->po_date->format('d/m/Y') }}</td>
                <td class="px-6 py-4">{{ $po->supplier->name }}</td>
                <td class="px-6 py-4">Rp {{ number_format($po->total_amount, 0, ',', '.') }}</td>
                <td class="px-6 py-4">
                    @php
                        $statusColors = [
                            'draft' => 'bg-gray-200 text-gray-800',
                            'submitted' => 'bg-yellow-100 text-yellow-800',
                            'approved' => 'bg-blue-100 text-blue-800',
                            'delivered' => 'bg-green-100 text-green-800',
                            'cancelled' => 'bg-red-100 text-red-800',
                        ];
                    @endphp
                    <span class="px-3 py-1 rounded-full text-xs font-semibold {{ $statusColors[$po->status] }}">
                        {{ ucfirst($po->status) }}
                    </span>
                </td>
                <td class="px-6 py-4">{{ $po->delivery_schedule->format('d/m/Y H:i') }}</td>
                <td class="px-6 py-4 space-x-2">
                    <a href="{{ route('purchase-orders.show', $po) }}" class="text-blue-600 hover:text-blue-900">View</a>
                    <a href="{{ route('purchase-orders.edit', $po) }}" class="text-green-600 hover:text-green-900">Edit</a>
                    <form action="{{ route('purchase-orders.destroy', $po) }}" method="POST" class="inline">
                        @csrf
                        @method('DELETE')
                        <button type="submit" class="text-red-600 hover:text-red-900" onclick="return confirm('Yakin hapus PO ini?')">Delete</button>
                    </form>
                </td>
            </tr>
            @endforeach
        </tbody>
    </table>
</div>

<div class="mt-4">
    {{ $purchaseOrders->links() }}
</div>
@endsection
