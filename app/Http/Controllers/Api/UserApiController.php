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
     * Simpan user baru.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:6'],
            'role_id' => ['required', 'integer', 'exists:roles,id'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role_id' => $validated['role_id'],
            'is_active' => $validated['is_active'] ?? true,
        ]);

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
            ],
        ], 201);
    }

    /**
     * Update user (termasuk reset password & ganti role).
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $user = User::findOrFail($id);

        // Hindari edit diri sendiri lewat endpoint ini (kecuali superadmin)
        if ($user->id === auth()->id() && !auth()->user()->hasRole('superadmin')) {
            return response()->json(['message' => 'Tidak bisa mengedit akun sendiri.'], 403);
        }

        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'email' => ['sometimes', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'password' => ['nullable', 'string', 'min:6'],
            'role_id' => ['sometimes', 'integer', 'exists:roles,id'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        if (isset($validated['name'])) {
            $user->name = $validated['name'];
        }
        if (isset($validated['email'])) {
            $user->email = $validated['email'];
        }
        if (!empty($validated['password'])) {
            $user->password = Hash::make($validated['password']);
        }
        if (isset($validated['role_id'])) {
            $user->role_id = $validated['role_id'];
        }
        if (isset($validated['is_active'])) {
            $user->is_active = $validated['is_active'];
        }

        $user->save();

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
}
