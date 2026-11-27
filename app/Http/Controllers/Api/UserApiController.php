<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserApiController extends Controller
{
    /**
     * List semua user dengan role.
     */
    public function index(): JsonResponse
    {
        $users = User::with('role')
            ->orderBy('name', 'asc')
            ->get()
            ->map(fn (User $u) => [
                'id' => $u->id,
                'name' => $u->name,
                'email' => $u->email,
                'is_active' => $u->is_active,
                'created_at' => $u->created_at?->toDateTimeString(),
                'role' => $u->role ? [
                    'id' => $u->role->id,
                    'name' => $u->role->name,
                    'description' => $u->role->description,
                ] : null,
            ]);

        return response()->json(['data' => $users]);
    }

    /**
     * List semua role (untuk dropdown).
     */
    public function roles(): JsonResponse
    {
        $roles = Role::orderBy('name', 'asc')
            ->get(['id', 'name', 'description']);

        return response()->json(['data' => $roles]);
    }

    /**
     * Detail user (termasuk permission IDs).
     */
    public function show(int $id): JsonResponse
    {
        $user = User::with('role')->findOrFail($id);
        return response()->json([
            'data' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'password' => $user->password_plain,
                'is_active' => $user->is_active,
                'role_id' => $user->role_id,
                'role' => $user->role ? [
                    'id' => $user->role->id,
                    'name' => $user->role->name,
                ] : null,
                'permission_ids' => $user->permissions()->pluck('permissions.id')->all(),
            ]
        ]);
    }

    /**
     * List semua permission (untuk checkbox di form Team).
     */
    public function permissions(): JsonResponse
    {
        $permissions = \App\Models\Permission::orderBy('name', 'asc')
            ->get(['id', 'name', 'description']);

        return response()->json(['data' => $permissions]);
    }

    /**
     * Katalog permission terkelompok + preset role untuk form Team.
     */
    public function permissionCatalog(): JsonResponse
    {
        $catalog = \App\Support\PermissionCatalog::groups();

        // Lampirkan ID permission dari DB ke tiap aksi.
        $ids = \App\Models\Permission::pluck('id', 'name');

        foreach ($catalog as &$group) {
            foreach ($group['actions'] as &$action) {
                $action['id'] = $ids[$action['name']] ?? null;
            }
            unset($action);
        }
        unset($group);

        $presets = [];
        foreach (\App\Support\PermissionCatalog::presets() as $key => $preset) {
            $presets[] = [
                'key' => $key,
                'label' => $preset['label'],
                'description' => $preset['description'],
                'permissions' => $preset['permissions'],
            ];
        }

        return response()->json([
            'groups' => $catalog,
            'presets' => $presets,
        ]);
    }

    /**
     * Simpan user baru.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:6'],
            'role_id' => ['nullable', 'integer', 'exists:roles,id'],
            'is_active' => ['nullable', 'boolean'],
            'permissions' => ['nullable', 'array'],
            'permissions.*' => ['integer', 'exists:permissions,id'],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'password_plain' => $validated['password'],
            'role_id' => $validated['role_id'] ?? null,
            'is_active' => $validated['is_active'] ?? true,
        ]);

        $this->syncPermissions($user, $validated['permissions'] ?? []);

        return response()->json([
            'message' => 'User berhasil dibuat.',
            'data' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'is_active' => $user->is_active,
                'role' => $user->role ? [
                    'id' => $user->role->id,
                    'name' => $user->role->name,
                ] : null,
                'permission_ids' => $user->permissions()->pluck('permissions.id')->all(),
            ],
        ], 201);
    }

    protected function syncPermissions(User $user, array $permissionIds): void
    {
        $user->permissions()->sync($permissionIds);
    }

    /**
     * Update user (termasuk reset password & ganti role/permission).
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $user = User::findOrFail($id);

        if ($user->id === auth()->id() && !auth()->user()->hasRole('superadmin')) {
            return response()->json(['message' => 'Tidak bisa mengedit akun sendiri.'], 403);
        }

        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'email' => ['sometimes', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'password' => ['nullable', 'string', 'min:6'],
            'role_id' => ['nullable', 'integer', 'exists:roles,id'],
            'is_active' => ['sometimes', 'boolean'],
            'permissions' => ['nullable', 'array'],
            'permissions.*' => ['integer', 'exists:permissions,id'],
        ]);

        if (isset($validated['name'])) $user->name = $validated['name'];
        if (isset($validated['email'])) $user->email = $validated['email'];
        if (!empty($validated['password'])) {
            $user->password = Hash::make($validated['password']);
            $user->password_plain = $validated['password'];
        }
        if (array_key_exists('role_id', $validated)) $user->role_id = $validated['role_id'];
        if (isset($validated['is_active'])) $user->is_active = $validated['is_active'];

        $user->save();

        if (array_key_exists('permissions', $validated)) {
            $this->syncPermissions($user, $validated['permissions'] ?? []);
        }

        return response()->json([
            'message' => 'User berhasil diperbarui.',
            'data' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'is_active' => $user->is_active,
                'role' => $user->role ? [
                    'id' => $user->role->id,
                    'name' => $user->role->name,
                ] : null,
                'permission_ids' => $user->permissions()->pluck('permissions.id')->all(),
            ],
        ]);
    }

    /**
     * Toggle aktif/nonaktif user (soft-disable).
     */
    public function toggleActive(int $id): JsonResponse
    {
        $user = User::findOrFail($id);

        // Hindari menonaktifkan diri sendiri
        if ($user->id === auth()->id()) {
            return response()->json(['message' => 'Tidak bisa menonaktifkan akun sendiri.'], 403);
        }

        $user->is_active = !$user->is_active;
        $user->save();

        $status = $user->is_active ? 'diaktifkan' : 'dinonaktifkan';

        return response()->json([
            'message' => "User berhasil {$status}.",
            'data' => [
                'id' => $user->id,
                'is_active' => $user->is_active,
            ],
        ]);
    }

    /**
     * Hapus user secara permanen.
     */
    public function destroy(int $id): JsonResponse
    {
        $user = User::findOrFail($id);

        // Hindari menghapus diri sendiri
        if ($user->id === auth()->id()) {
            return response()->json(['message' => 'Tidak bisa menghapus akun sendiri.'], 403);
        }

        $user->delete();

        return response()->json(['message' => 'User berhasil dihapus.']);
    }
}
