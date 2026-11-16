@extends('layouts.app')

@section('title', 'Suppliers')

@section('content')
<div class="flex justify-between items-center mb-6">
    <h1 class="text-3xl font-bold">Suppliers</h1>
    <a href="{{ route('suppliers.create') }}" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Tambah Supplier
    </a>
</div>

<div class="bg-white shadow-md rounded">
    <table class="min-w-full">
        <thead class="bg-gray-50">
            <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Alamat</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Telepon</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact Person</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
            </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
            @foreach($suppliers as $supplier)
            <tr>
                <td class="px-6 py-4">{{ $supplier->name }}</td>
                <td class="px-6 py-4">{{ Str::limit($supplier->address, 50) }}</td>
                <td class="px-6 py-4">{{ $supplier->phone }}</td>
                <td class="px-6 py-4">{{ $supplier->contact_person }}</td>
                <td class="px-6 py-4 space-x-2">
                    <a href="{{ route('suppliers.show', $supplier) }}" class="text-blue-600 hover:text-blue-900">View</a>
                    <a href="{{ route('suppliers.edit', $supplier) }}" class="text-green-600 hover:text-green-900">Edit</a>
                    <form action="{{ route('suppliers.destroy', $supplier) }}" method="POST" class="inline">
                        @csrf
                        @method('DELETE')
                        <button type="submit" class="text-red-600 hover:text-red-900" onclick="return confirm('Yakin hapus supplier ini?')">Delete</button>
                    </form>
                </td>
            </tr>
            @endforeach
        </tbody>
    </table>
</div>

<div class="mt-4">
    {{ $suppliers->links() }}
</div>
@endsection
