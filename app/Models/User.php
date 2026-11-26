<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role_id',
        'is_active',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
        ];
    }

    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class);
    }

    /**
     * Map permission lama (v1 / role-based) ke permission granular baru.
     * Jika user memiliki salah satu permission lama, dianggap punya hak yang setara.
     */
    public static array $legacyPermissionMap = [
        // view
        'data.view_all' => ['orders.view', 'master.view', 'report.view'],
        'data.view_own' => ['orders.view', 'master.view'],

        // create
        'data.create' => ['orders.create', 'master.create'],

        // edit
        'data.edit_all' => ['orders.edit', 'master.edit'],
        'data.edit_draft' => ['orders.edit'],

        // delete
        'data.delete' => ['orders.delete', 'master.delete'],

        // report
        'report.export' => ['report.view', 'report.export'],

        // user.manage tetap sama
        'user.manage' => ['user.manage'],
    ];

    /**
     * Permission yang diberikan langsung ke user (checkbox di form Team).
     */
    public function permissions(): BelongsToMany
    {
        return $this->belongsToMany(Permission::class, 'user_permissions');
    }

    /**
     * SUPERADMIN selalu punya akses penuh.
     */
    public function isSuperadmin(): bool
    {
        return $this->role?->name === 'superadmin';
    }

    /**
     * Cek apakah user punya permission tertentu.
     * - Superadmin bypass.
     * - Cek permission baru langsung dari tabel user_permissions.
     * - Cek permission lama dan map ke permission baru (backward compatibility).
     */
    public function hasPermission(string $permission): bool
    {
        if ($this->isSuperadmin()) {
            return true;
        }

        // Direct check permission baru
        if ($this->permissions()->where('name', $permission)->exists()) {
            return true;
        }

        // Backward compatibility: permission lama di-map ke permission baru
        foreach (self::$legacyPermissionMap as $legacy => $mapped) {
            if (in_array($permission, $mapped, true) && $this->permissions()->where('name', $legacy)->exists()) {
                return true;
            }
        }

        return false;
    }

    /**
     * Check if user has any of the given permissions.
     *
     * @param  array<int, string>  $permissions
     */
    public function hasAnyPermission(array $permissions): bool
    {
        foreach ($permissions as $p) {
            if ($this->hasPermission($p)) {
                return true;
            }
        }

        return false;
    }

    public function hasRole(string $role): bool
    {
        return $this->role?->name === $role;
    }

    /**
     * All permission names untuk user.
     * Termasuk permission baru + permission lama yang tersimpan.
     *
     * @return array<int, string>
     */
    public function permissionNames(): array
    {
        if ($this->isSuperadmin()) {
            return Permission::pluck('name')->all();
        }

        $names = $this->permissions()->pluck('name')->all();

        // Expand permission lama ke permission baru agar frontend bisa pakai permission granular
        $expanded = [];
        foreach ($names as $name) {
            $expanded = array_merge($expanded, self::$legacyPermissionMap[$name] ?? [$name]);
        }

        return array_values(array_unique(array_merge($names, $expanded)));
    }
}
