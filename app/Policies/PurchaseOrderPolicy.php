<?php

namespace App\Policies;

use App\Models\PurchaseOrder;
use App\Models\User;

class PurchaseOrderPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasAnyPermission(['data.view_own', 'data.view_all']);
    }

    public function view(User $user, PurchaseOrder $po): bool
    {
        if ($user->hasPermission('data.view_all')) {
            return true;
        }

        if ($user->hasPermission('data.view_own')) {
            return (int) $po->created_by === (int) $user->id;
        }

        return false;
    }

    public function create(User $user): bool
    {
        return $user->hasPermission('data.create');
    }

    /**
     * Update: kombinasi Permission + Status + Kepemilikan (created_by).
     */
    public function update(User $user, PurchaseOrder $po): bool
    {
        // Admin Penjualan / Superadmin: boleh edit semua data
        if ($user->hasPermission('data.edit_all')) {
            return true;
        }

        // Admin Marketing: hanya data sendiri & hanya saat Draft
        if ($user->hasPermission('data.edit_draft')) {
            return (int) $po->created_by === (int) $user->id
                && in_array($po->status, ['Draft', 'Pending'], true);
        }

        return false;
    }

    public function delete(User $user, PurchaseOrder $po): bool
    {
        return $user->hasPermission('data.delete');
    }
}
