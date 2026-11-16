@extends('layouts.app')

@section('title', 'Edit Supplier')

@section('content')
<div class="mb-6">
    <h1 class="text-3xl font-bold">Edit Supplier</h1>
</div>

<div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
    <form action="{{ route('suppliers.update', $supplier) }}" method="POST">
        @csrf
        @method('PUT')
        
        <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="name">
                Nama Supplier *
            </label>
            <input type="text" name="name" id="name" value="{{ old('name', $supplier->name) }}" 
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 @error('name') border-red-500 @enderror" required>
            @error('name')
                <p class="text-red-500 text-xs italic">{{ $message }}</p>
            @enderror
        </div>

        <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="address">
                Alamat *
            </label>
            <textarea name="address" id="address" rows="3" 
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 @error('address') border-red-500 @enderror" required>{{ old('address', $supplier->address) }}</textarea>
            @error('address')
                <p class="text-red-500 text-xs italic">{{ $message }}</p>
            @enderror
        </div>

        <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="phone">
                Telepon
            </label>
            <input type="text" name="phone" id="phone" value="{{ old('phone', $supplier->phone) }}" 
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 @error('phone') border-red-500 @enderror">
            @error('phone')
                <p class="text-red-500 text-xs italic">{{ $message }}</p>
            @enderror
        </div>

        <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="email">
                Email
            </label>
            <input type="email" name="email" id="email" value="{{ old('email', $supplier->email) }}" 
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 @error('email') border-red-500 @enderror">
            @error('email')
                <p class="text-red-500 text-xs italic">{{ $message }}</p>
            @enderror
        </div>

        <div class="mb-6">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="contact_person">
                Contact Person
            </label>
            <input type="text" name="contact_person" id="contact_person" value="{{ old('contact_person', $supplier->contact_person) }}" 
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 @error('contact_person') border-red-500 @enderror">
            @error('contact_person')
                <p class="text-red-500 text-xs italic">{{ $message }}</p>
            @enderror
        </div>

        <div class="flex items-center justify-between">
            <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Update
            </button>
            <a href="{{ route('suppliers.index') }}" class="text-gray-600 hover:text-gray-900">
                Batal
            </a>
        </div>
    </form>
</div>
@endsection
