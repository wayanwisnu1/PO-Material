<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="h-full">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Dashboard - PO Material Beton</title>
    @vite(['resources/css/app.css', 'resources/js/app.tsx'])
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
<body class="h-full">
    <div id="app" class="h-full"></div>
</body>
</html>
