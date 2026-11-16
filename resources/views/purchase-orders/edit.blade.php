@extends('layouts.app')

@section('title', 'Edit Purchase Order')

@section('content')
<div class="mb-6">
    <h1 class="text-3xl font-bold">Edit Purchase Order: {{ $purchaseOrder->po_number }}</h1>
</div>

<div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
    <form action="{{ route('purchase-orders.update', $purchaseOrder) }}" method="POST">
        @csrf
        @method('PUT')
        
        <div class="grid grid-cols-2 gap-4">
            <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="po_number">
                    Nomor PO *
                </label>
                <input type="text" name="po_number" id="po_number" value="{{ old('po_number', $purchaseOrder->po_number) }}" 
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 @error('po_number') border-red-500 @enderror" required>
                @error('po_number')
                    <p class="text-red-500 text-xs italic">{{ $message }}</p>
                @enderror
            </div>

            <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="po_date">
                    Tanggal PO *
                </label>
                <input type="date" name="po_date" id="po_date" value="{{ old('po_date', $purchaseOrder->po_date->format('Y-m-d')) }}" 
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 @error('po_date') border-red-500 @enderror" required>
                @error('po_date')
                    <p class="text-red-500 text-xs italic">{{ $message }}</p>
                @enderror
            </div>
        </div>

        <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="supplier_id">
                Supplier *
            </label>
            <select name="supplier_id" id="supplier_id" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 @error('supplier_id') border-red-500 @enderror" required>
                <option value="">Pilih Supplier</option>
                @foreach($suppliers as $supplier)
                <option value="{{ $supplier->id }}" {{ old('supplier_id', $purchaseOrder->supplier_id) == $supplier->id ? 'selected' : '' }}>
                    {{ $supplier->name }}
                </option>
                @endforeach
            </select>
            @error('supplier_id')
                <p class="text-red-500 text-xs italic">{{ $message }}</p>
            @enderror
        </div>

        <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="buyer_company">
                Perusahaan Pembeli *
            </label>
            <input type="text" name="buyer_company" id="buyer_company" value="{{ old('buyer_company', $purchaseOrder->buyer_company) }}" 
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 @error('buyer_company') border-red-500 @enderror" required>
            @error('buyer_company')
                <p class="text-red-500 text-xs italic">{{ $message }}</p>
            @enderror
        </div>

        <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="buyer_address">
                Alamat Pembeli *
            </label>
            <textarea name="buyer_address" id="buyer_address" rows="3" 
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 @error('buyer_address') border-red-500 @enderror" required>{{ old('buyer_address', $purchaseOrder->buyer_address) }}</textarea>
            @error('buyer_address')
                <p class="text-red-500 text-xs italic">{{ $message }}</p>
            @enderror
        </div>

        <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="delivery_address">
                Alamat Pengiriman *
            </label>
            <textarea name="delivery_address" id="delivery_address" rows="3" 
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 @error('delivery_address') border-red-500 @enderror" required>{{ old('delivery_address', $purchaseOrder->delivery_address) }}</textarea>
            @error('delivery_address')
                <p class="text-red-500 text-xs italic">{{ $message }}</p>
            @enderror
        </div>

        <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="delivery_schedule">
                Jadwal Pengiriman *
            </label>
            <input type="datetime-local" name="delivery_schedule" id="delivery_schedule" value="{{ old('delivery_schedule', $purchaseOrder->delivery_schedule->format('Y-m-d H:i')) }}" 
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 @error('delivery_schedule') border-red-500 @enderror" required>
            @error('delivery_schedule')
                <p class="text-red-500 text-xs italic">{{ $message }}</p>
            @enderror
        </div>

        <div class="grid grid-cols-2 gap-4">
            <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="payment_terms">
                    Syarat Pembayaran *
                </label>
                <select name="payment_terms" id="payment_terms" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 @error('payment_terms') border-red-500 @enderror" required>
                    <option value="invoice" {{ old('payment_terms', $purchaseOrder->payment_terms) == 'invoice' ? 'selected' : '' }}>Invoice (Setelah Pengiriman)</option>
                    <option value="termin" {{ old('payment_terms', $purchaseOrder->payment_terms) == 'termin' ? 'selected' : '' }}>Termin</option>
                    <option value="cash" {{ old('payment_terms', $purchaseOrder->payment_terms) == 'cash' ? 'selected' : '' }}>Tunai</option>
                </select>
                @error('payment_terms')
                    <p class="text-red-500 text-xs italic">{{ $message }}</p>
                @enderror
            </div>

            <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="payment_days">
                    TOP (Hari)
                </label>
                <input type="number" name="payment_days" id="payment_days" value="{{ old('payment_days', $purchaseOrder->payment_days) }}" min="0" 
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 @error('payment_days') border-red-500 @enderror">
                @error('payment_days')
                    <p class="text-red-500 text-xs italic">{{ $message }}</p>
                @enderror
            </div>
        </div>

        <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="status">
                Status *
            </label>
            <select name="status" id="status" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 @error('status') border-red-500 @enderror" required>
                <option value="draft" {{ old('status', $purchaseOrder->status) == 'draft' ? 'selected' : '' }}>Draft</option>
                <option value="submitted" {{ old('status', $purchaseOrder->status) == 'submitted' ? 'selected' : '' }}>Submitted</option>
                <option value="approved" {{ old('status', $purchaseOrder->status) == 'approved' ? 'selected' : '' }}>Approved</option>
                <option value="delivered" {{ old('status', $purchaseOrder->status) == 'delivered' ? 'selected' : '' }}>Delivered</option>
                <option value="cancelled" {{ old('status', $purchaseOrder->status) == 'cancelled' ? 'selected' : '' }}>Cancelled</option>
            </select>
            @error('status')
                <p class="text-red-500 text-xs italic">{{ $message }}</p>
            @enderror
        </div>

        <div class="mb-6">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="notes">
                Catatan
            </label>
            <textarea name="notes" id="notes" rows="2" 
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 @error('notes') border-red-500 @enderror">{{ old('notes', $purchaseOrder->notes) }}</textarea>
            @error('notes')
                <p class="text-red-500 text-xs italic">{{ $message }}</p>
            @enderror
        </div>

        <div class="flex items-center justify-between">
            <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Update PO
            </button>
            <a href="{{ route('purchase-orders.show', $purchaseOrder) }}" class="text-gray-600 hover:text-gray-900">
                Batal
            </a>
        </div>
    </form>
</div>
@endsection
