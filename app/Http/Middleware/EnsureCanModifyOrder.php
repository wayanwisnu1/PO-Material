<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureCanModifyOrder
{
    /**
     * Validasi gabungan: Permission + Status Data + Kepemilikan (created_by).
     *
     * Dipakai pada route update/delete order. Route parameter yang dicari
     * bisa berupa {purchase_order}, {purchaseOrder}, atau {id}.
     */
    public function handle(Request $request, Closure $next, string $action = 'update'): Response
    {
        $user = $request->user();

        if (! $user || ! $user->is_active) {
            abort(403, 'Akun tidak aktif.');
        }

        $order = $this->resolveOrder($request);

        if (! $order) {
            abort(404, 'Data pesanan tidak ditemukan.');
        }

        // 1. Cek permission dasar
        $hasEditAll = $user->hasPermission('data.edit_all');
        $hasEditDraft = $user->hasPermission('data.edit_draft');

        if (! $hasEditAll && ! $hasEditDraft) {
            abort(403, 'Anda tidak memiliki izin mengubah data.');
        }

        // 2. Cek kepemilikan & status untuk pemilik permission data.edit_draft
        if (! $hasEditAll) {
            // Admin Marketing: hanya data sendiri
            if ((int) $order->created_by !== (int) $user->id) {
                abort(403, 'Anda hanya dapat mengubah data yang Anda buat sendiri.');
            }

            // Hanya boleh saat status Draft (atau Pending untuk kompatibilitas)
            $allowed = ['Draft', 'Pending'];

            if (! in_array($order->status, $allowed, true)) {
                abort(403, "Data berstatus \"{$order->status}\" tidak dapat diubah. Hanya data berstatus Draft yang dapat diedit.");
            }
        }

        return $next($request);
    }

    protected function resolveOrder(Request $request)
    {
        foreach (['purchase_order', 'purchaseOrder', 'order', 'id'] as $key) {
            $value = $request->route($key);

            if ($value instanceof \App\Models\PurchaseOrder) {
                return $value;
            }

            if (is_numeric($value)) {
                return \App\Models\PurchaseOrder::find($value);
            }
        }

        return null;
    }
}
