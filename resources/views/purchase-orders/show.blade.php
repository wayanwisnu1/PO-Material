@extends('layouts.app')

@section('title', 'PO - ' . $purchaseOrder->po_number)

@section('content')
<div class="flex justify-between items-center mb-6">
    <h1 class="text-3xl font-bold">Purchase Order: {{ $purchaseOrder->po_number }}</h1>
    <div class="space-x-2">
        <a href="{{ route('purchase-orders.edit', $purchaseOrder) }}" class="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded">
            Edit
        </a>
        <a href="{{ route('purchase-orders.index') }}" class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
            Kembali
        </a>
    </div>
</div>

<div class="grid grid-cols-2 gap-6 mb-6">
    <div class="bg-white shadow-md rounded px-8 pt-6 pb-8">
        <h2 class="text-xl font-bold mb-4">Informasi PO</h2>
        <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
                <span class="font-semibold">Nomor PO:</span> {{ $purchaseOrder->po_number }}
            </div>
            <div>
                <span class="font-semibold">Tanggal:</span> {{ $purchaseOrder->po_date->format('d/m/Y') }}
            </div>
            <div>
                <span class="font-semibold">Status:</span>
                @php
                    $statusColors = [
                        'draft' => 'bg-gray-200 text-gray-800',
                        'submitted' => 'bg-yellow-100 text-yellow-800',
                        'approved' => 'bg-blue-100 text-blue-800',
                        'delivered' => 'bg-green-100 text-green-800',
                        'received' => 'bg-emerald-100 text-emerald-800',
                        'cancelled' => 'bg-red-100 text-red-800',
                    ];
                @endphp
                <span class="px-3 py-1 rounded-full text-xs font-semibold {{ $statusColors[$purchaseOrder->status] }}">
                    {{ ucfirst($purchaseOrder->status) }}
                </span>
            </div>
            <div>
                <span class="font-semibold">Jadwal Pengiriman:</span> {{ $purchaseOrder->delivery_schedule->format('d/m/Y H:i') }}
            </div>
            <div>
                <span class="font-semibold">Pembayaran:</span> {{ ucfirst($purchaseOrder->payment_terms) }}
                @if($purchaseOrder->payment_days)
                    ({{ $purchaseOrder->payment_days }} hari)
                @endif
            </div>
            <div>
                <span class="font-semibold">Total:</span> <strong>Rp {{ number_format($purchaseOrder->total_amount, 0, ',', '.') }}</strong>
            </div>
        </div>
    </div>

    <div class="bg-white shadow-md rounded px-8 pt-6 pb-8">
        <h2 class="text-xl font-bold mb-4">Pihak Terlibat</h2>
        <div class="grid grid-cols-1 gap-4 text-sm">
            <div>
                <span class="font-semibold">Supplier:</span> {{ $purchaseOrder->supplier->name }}<br>
                <span class="text-gray-600">{{ $purchaseOrder->supplier->address }}</span>
            </div>
            <div>
                <span class="font-semibold">Pembeli:</span> {{ $purchaseOrder->buyer_company }}<br>
                <span class="text-gray-600">{{ $purchaseOrder->buyer_address }}</span>
            </div>
            <div>
                <span class="font-semibold">Alamat Pengiriman:</span><br>
                <span class="text-gray-600">{{ $purchaseOrder->delivery_address }}</span>
            </div>
        </div>
    </div>
</div>

@if($purchaseOrder->notes)
<div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-6">
    <h2 class="text-xl font-bold mb-2">Catatan</h2>
    <p class="text-gray-600">{{ $purchaseOrder->notes }}</p>
</div>
@endif

<div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-6">
    <h2 class="text-xl font-bold mb-4">Item Beton</h2>
    
    <table class="min-w-full mb-4">
        <thead class="bg-gray-50">
            <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jenis Beton</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mutu</th>
                <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Qty</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Satuan</th>
                <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Harga Satuan</th>
                <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Subtotal</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
            </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
            @forelse($purchaseOrder->items as $item)
            <tr>
                <td class="px-4 py-3">{{ $item->concrete_type }}</td>
                <td class="px-4 py-3">{{ $item->concrete_grade }}</td>
                <td class="px-4 py-3 text-right">{{ number_format($item->quantity, 2) }}</td>
                <td class="px-4 py-3">{{ $item->unit }}</td>
                <td class="px-4 py-3 text-right">Rp {{ number_format($item->unit_price, 0, ',', '.') }}</td>
                <td class="px-4 py-3 text-right font-semibold">Rp {{ number_format($item->subtotal, 0, ',', '.') }}</td>
                <td class="px-4 py-3">
                    <form action="{{ route('purchase-orders.items.remove', [$purchaseOrder, $item]) }}" method="POST" class="inline">
                        @csrf
                        @method('DELETE')
                        <button type="submit" class="text-red-600 hover:text-red-900" onclick="return confirm('Yakin hapus item ini?')">Hapus</button>
                    </form>
                </td>
            </tr>
            @empty
            <tr>
                <td colspan="7" class="px-4 py-8 text-center text-gray-500">Belum ada item. Tambah item di bawah.</td>
            </tr>
            @endforelse
        </tbody>
    </table>

    <div class="border-t pt-4">
        <div class="flex justify-end">
            <div class="text-right">
                <span class="font-bold text-lg">Total: Rp {{ number_format($purchaseOrder->total_amount, 0, ',', '.') }}</span>
            </div>
        </div>
    </div>
</div>

<div class="bg-white shadow-md rounded px-8 pt-6 pb-8">
    <h2 class="text-xl font-bold mb-4">Tambah Item Beton</h2>
    
    <form action="{{ route('purchase-orders.items.add', $purchaseOrder) }}" method="POST">
        @csrf
        
        <div class="grid grid-cols-3 gap-4">
            <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="concrete_type">
                    Jenis Beton *
                </label>
                <input type="text" name="concrete_type" id="concrete_type" placeholder="Readymix, Precast, dll" 
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" required>
            </div>

            <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="concrete_grade">
                    Mutu Beton *
                </label>
                <input type="text" name="concrete_grade" id="concrete_grade" placeholder="K-250, K-300, fc' 20 MPa" 
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" required>
            </div>

            <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="quantity">
                    Kuantitas *
                </label>
                <input type="number" name="quantity" id="quantity" step="0.01" min="0.01" placeholder="0.00" 
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" required>
            </div>
        </div>

        <div class="grid grid-cols-3 gap-4">
            <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="unit">
                    Satuan *
                </label>
                <select name="unit" id="unit" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" required>
                    <option value="m3">m³ (Meter Kubik)</option>
                    <option value="unit">Unit</option>
                    <option value="m2">m² (Meter Persegi)</option>
                </select>
            </div>

            <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="unit_price">
                    Harga Satuan (Rp) *
                </label>
                <input type="number" name="unit_price" id="unit_price" step="1" min="0" placeholder="0" 
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" required>
            </div>

            <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="specifications">
                    Spesifikasi
                </label>
                <input type="text" name="specifications" id="specifications" placeholder="Spesifikasi tambahan" 
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700">
            </div>
        </div>

        <div class="flex justify-end">
            <button type="submit" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                Tambah Item
            </button>
        </div>
    </form>
</div>
@endsection
