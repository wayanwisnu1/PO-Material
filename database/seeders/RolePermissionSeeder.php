<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class RolePermissionSeeder extends Seeder
{
    /**
     * Daftar permission sesuai spesifikasi.
     *
     * @var array<string, string>
     */
    protected array $permissions = [
        'data.create' => 'Membuat data purchase order baru',
        'data.view_own' => 'Melihat data milik sendiri',
        'data.view_all' => 'Melihat seluruh data',
        'data.edit_draft' => 'Mengedit data sendiri saat status Draft/Pending',
        'data.edit_all' => 'Mengedit seluruh data & verifikasi status',
        'data.delete' => 'Menghapus data',
        'report.export' => 'Export laporan',
        'user.manage' => 'Manajemen user, role & permission',
    ];

    /**
     * Matriks hak akses default per role.
     *
     * @var array<string, array{description: string, permissions: array<int, string>}>
     */
    protected array $roles = [
        'superadmin' => [
            'description' => 'Akses penuh ke seluruh sistem',
            'permissions' => [
                'data.create',
                'data.view_own',
                'data.view_all',
                'data.edit_draft',
                'data.edit_all',
                'data.delete',
                'report.export',
                'user.manage',
            ],
        ],
        'admin_marketing' => [
            'description' => 'Input data & kelola data milik sendiri (Draft/Pending)',
            'permissions' => [
                'data.create',
                'data.view_own',
                'data.edit_draft',
            ],
        ],
        'admin_penjualan' => [
            'description' => 'Verifikasi & kelola seluruh data penjualan',
            'permissions' => [
                'data.view_all',
                'data.edit_all',
            ],
        ],
        'manager' => [
            'description' => 'Akses read-only & export laporan',
            'permissions' => [
                'data.view_all',
                'report.export',
            ],
        ],
    ];

    /**
     * Akun demo per role.
     *
     * @var array<string, array{name: string, email: string, password: string}>
     */
    protected array $users = [
        'superadmin' => [
            'name' => 'Super Admin',
            'email' => 'superadmin@example.com',
            'password' => 'password',
        ],
        'admin_marketing' => [
            'name' => 'Admin Marketing',
            'email' => 'marketing@example.com',
            'password' => 'password',
        ],
        'admin_penjualan' => [
            'name' => 'Admin Penjualan',
            'email' => 'penjualan@example.com',
            'password' => 'password',
        ],
        'manager' => [
            'name' => 'Manager',
            'email' => 'manager@example.com',
            'password' => 'password',
        ],
    ];

    public function run(): void
    {
        // 1. Permissions
        foreach ($this->permissions as $name => $description) {
            Permission::updateOrCreate(
                ['name' => $name],
                ['description' => $description]
            );
        }

        // 2. Roles + pivot
        foreach ($this->roles as $name => $config) {
            $role = Role::updateOrCreate(
                ['name' => $name],
                ['description' => $config['description']]
            );

            $permissionIds = Permission::whereIn('name', $config['permissions'])->pluck('id');
            $role->permissions()->sync($permissionIds);
        }

        // 3. Demo users
        foreach ($this->users as $roleName => $data) {
            $role = Role::where('name', $roleName)->first();

            User::updateOrCreate(
                ['email' => $data['email']],
                [
                    'name' => $data['name'],
                    'password' => Hash::make($data['password']),
                    'role_id' => $role?->id,
                    'is_active' => true,
                ]
            );
        }
    }
}
