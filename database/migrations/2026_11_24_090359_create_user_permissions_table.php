<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\User;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('user_permissions')) {
            Schema::create('user_permissions', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->constrained()->onDelete('cascade');
                $table->foreignId('permission_id')->constrained()->onDelete('cascade');
                $table->timestamps();
                $table->unique(['user_id', 'permission_id']);
            });
        }

        // Seed permissions baru
        $permissions = [
            ['name' => 'orders.view', 'description' => 'Melihat data pesanan'],
            ['name' => 'orders.create', 'description' => 'Membuat pesanan baru'],
            ['name' => 'orders.edit', 'description' => 'Mengubah data pesanan'],
            ['name' => 'orders.delete', 'description' => 'Menghapus pesanan'],
            ['name' => 'orders.verify', 'description' => 'Verifikasi/Approve pesanan'],
            ['name' => 'master.view', 'description' => 'Melihat master data'],
            ['name' => 'master.create', 'description' => 'Menambah master data'],
            ['name' => 'master.edit', 'description' => 'Mengubah master data'],
            ['name' => 'master.delete', 'description' => 'Menghapus master data'],
            ['name' => 'user.manage', 'description' => 'Mengelola user dan permission'],
            ['name' => 'report.view', 'description' => 'Melihat laporan'],
            ['name' => 'audit.view', 'description' => 'Melihat log aktivitas'],
        ];

        foreach ($permissions as $p) {
            DB::table('permissions')->updateOrInsert(['name' => $p['name']], $p);
        }

        // Migrasi data lama: Beri user permission berdasarkan role_id mereka
        $users = User::all();
        foreach ($users as $user) {
            if ($user->role_id) {
                $rolePermissions = DB::table('role_permissions')
                    ->where('role_id', $user->role_id)
                    ->pluck('permission_id');
                
                foreach ($rolePermissions as $pId) {
                    DB::table('user_permissions')->insertOrIgnore([
                        'user_id' => $user->id,
                        'permission_id' => $pId,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
            }
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('user_permissions');
    }
};
