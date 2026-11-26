<?php

use App\Models\Permission;
use App\Models\User;
use App\Support\PermissionCatalog;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Sinkronkan katalog permission dan beri user lama permission yang setara
     * dengan role-nya (backward compatibility).
     */
    public function up(): void
    {
        // 1. Pastikan semua permission di katalog ada di tabel permissions.
        foreach (PermissionCatalog::groups() as $group) {
            foreach ($group['actions'] as $action) {
                DB::table('permissions')->updateOrInsert(
                    ['name' => $action['name']],
                    [
                        'description' => $action['description'],
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]
                );
            }
        }

        // 2. User lama: pastikan permission dari role-nya ikut tersalin.
        //    Ini idempoten — user yang sudah punya permission tidak dobel.
        foreach (User::with('role')->get() as $user) {
            if (! $user->role) {
                continue;
            }

            $preset = PermissionCatalog::presets()[$user->role->name] ?? null;
            $names = $preset['permissions'] ?? [];

            if (empty($names)) {
                continue;
            }

            $ids = Permission::whereIn('name', $names)->pluck('id')->all();

            foreach ($ids as $id) {
                DB::table('user_permissions')->insertOrIgnore([
                    'user_id' => $user->id,
                    'permission_id' => $id,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }

    public function down(): void
    {
        // Tidak ada rollback destruktif: permission lama tetap dipertahankan.
    }
};
