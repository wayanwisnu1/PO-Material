<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Edit Produk - PO Material Beton</title>
    @vite(['resources/css/app.css', 'resources/js/edit-products.tsx'])
    @auth
    @php
        $__halcyonUser = auth()->user();
        $__halcyonProfile = [
            'name' => $__halcyonUser->name,
            'email' => $__halcyonUser->email,
            'role' => optional($__halcyonUser->role)->name,
        ];
        $__halcyonPerms = $__halcyonUser->permissionNames();
    @endphp
    <script>
        window.__HALCYON_PROFILE__ = {!! json_encode($__halcyonProfile) !!};
        window.__HALCYON_PERMISSIONS__ = {!! json_encode($__halcyonPerms) !!};
    </script>
    @endauth
</head>
<body>
    <div id="app"></div>
</body>
</html>