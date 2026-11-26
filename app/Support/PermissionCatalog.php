<?php

namespace App\Support;

/**
 * Katalog permission terpusat.
 *
 * Dipakai backend (seeder/migration) dan dikirim ke frontend lewat
 * GET /api/permissions agar checkbox di form Team selalu sinkron dengan
 * apa yang benar-benar dicek di server.
 */
class PermissionCatalog
{
    /**
     * Grup modul => daftar aksi.
     *
     * Format tiap aksi: 'name' => nama permission, 'label' => label UI.
     *
     * @return array<int, array{key: string, label: string, description: string, actions: array<int, array{name: string, label: string, description: string}>}>
     */
    public static function groups(): array
    {
        return [
            [
                'key' => 'orders',
                'label' => 'Pesanan (Beton / Hotmix / Batu)',
                'description' => 'Purchase order dan detail pengiriman material.',
                'actions' => [
                    ['name' => 'orders.view', 'label' => 'View', 'description' => 'Melihat daftar & detail pesanan'],
                    ['name' => 'orders.create', 'label' => 'Create', 'description' => 'Membuat pesanan baru'],
                    ['name' => 'orders.edit', 'label' => 'Edit', 'description' => 'Mengubah pesanan'],
                    ['name' => 'orders.delete', 'label' => 'Delete', 'description' => 'Menghapus pesanan'],
                    ['name' => 'orders.verify', 'label' => 'Verifikasi', 'description' => 'Menyetujui / memverifikasi pesanan'],
                ],
            ],
            [
                'key' => 'master',
                'label' => 'Master Data (Customer, Supplier, Produk)',
                'description' => 'Data referensi yang dipakai pesanan.',
                'actions' => [
                    ['name' => 'master.view', 'label' => 'View', 'description' => 'Melihat master data'],
                    ['name' => 'master.create', 'label' => 'Create', 'description' => 'Menambah master data'],
                    ['name' => 'master.edit', 'label' => 'Edit', 'description' => 'Mengubah master data'],
                    ['name' => 'master.delete', 'label' => 'Delete', 'description' => 'Menghapus master data'],
                ],
            ],
            [
                'key' => 'report',
                'label' => 'Laporan',
                'description' => 'Halaman laporan dan ekspor data.',
                'actions' => [
                    ['name' => 'report.view', 'label' => 'View', 'description' => 'Melihat laporan'],
                    ['name' => 'report.export', 'label' => 'Export', 'description' => 'Mengekspor laporan ke spreadsheet'],
                ],
            ],
            [
                'key' => 'audit',
                'label' => 'Log Aktivitas',
                'description' => 'Riwayat perubahan data.',
                'actions' => [
                    ['name' => 'audit.view', 'label' => 'View', 'description' => 'Melihat log aktivitas'],
                ],
            ],
            [
                'key' => 'user',
                'label' => 'Manajemen User (Team)',
                'description' => 'Mengelola akun karyawan dan hak aksesnya.',
                'actions' => [
                    ['name' => 'user.manage', 'label' => 'Kelola', 'description' => 'Membuat, mengubah, menonaktifkan user'],
                ],
            ],
            [
                'key' => 'scope',
                'label' => 'Cakupan Data',
                'description' => 'Menentukan data siapa yang boleh dilihat/diubah.',
                'actions' => [
                    ['name' => 'data.view_all', 'label' => 'Lihat Semua Data', 'description' => 'Melihat data milik semua user'],
                    ['name' => 'data.view_own', 'label' => 'Lihat Data Sendiri', 'description' => 'Hanya melihat data yang ia buat'],
                    ['name' => 'data.edit_all', 'label' => 'Edit Semua Data', 'description' => 'Mengubah data siapa pun tanpa batas status'],
                    ['name' => 'data.edit_draft', 'label' => 'Edit Draft Sendiri', 'description' => 'Hanya mengubah draft miliknya'],
                ],
            ],
        ];
    }

    /**
     * Semua nama permission (flat).
     *
     * @return array<int, string>
     */
    public static function names(): array
    {
        $names = [];

        foreach (self::groups() as $group) {
            foreach ($group['actions'] as $action) {
                $names[] = $action['name'];
            }
        }

        return $names;
    }

    /**
     * Preset role => daftar permission.
     *
     * Preset hanya mengisi checkbox; user tetap bisa mengubahnya manual.
     *
     * @return array<string, array{label: string, description: string, permissions: array<int, string>}>
     */
    public static function presets(): array
    {
        return [
            'admin_marketing' => [
                'label' => 'Admin Marketing',
                'description' => 'Buat & kelola pesanan milik sendiri sampai status draft.',
                'permissions' => [
                    'orders.view', 'orders.create', 'orders.edit',
                    'master.view',
                    'data.view_own', 'data.edit_draft',
                ],
            ],
            'admin_penjualan' => [
                'label' => 'Admin Penjualan',
                'description' => 'Verifikasi dan kelola seluruh pesanan.',
                'permissions' => [
                    'orders.view', 'orders.create', 'orders.edit', 'orders.verify',
                    'master.view', 'master.create', 'master.edit',
                    'report.view',
                    'data.view_all', 'data.edit_all',
                ],
            ],
            'logistics' => [
                'label' => 'Logistics',
                'description' => 'Pantau pesanan dan perbarui status pengiriman.',
                'permissions' => [
                    'orders.view', 'orders.edit',
                    'master.view',
                    'data.view_all',
                ],
            ],
            'manager' => [
                'label' => 'Manager',
                'description' => 'Akses baca menyeluruh + ekspor laporan.',
                'permissions' => [
                    'orders.view', 'master.view',
                    'report.view', 'report.export',
                    'data.view_all',
                ],
            ],
            'superadmin' => [
                'label' => 'Superadmin',
                'description' => 'Akses penuh ke seluruh modul.',
                'permissions' => self::names(),
            ],
        ];
    }
}
