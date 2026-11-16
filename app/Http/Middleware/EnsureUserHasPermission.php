<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserHasPermission
{
    /**
     * Contoh pemakaian di route:
     *   ->middleware('permission:data.create')
     *   ->middleware('permission:data.view_all,data.view_own')
     */
    public function handle(Request $request, Closure $next, string ...$permissions): Response
    {
        $user = $request->user();

        if (! $user || ! $user->is_active) {
            abort(403, 'Akses ditolak.');
        }

        if (! $user->hasAnyPermission($permissions)) {
            abort(403, 'Anda tidak memiliki hak akses untuk aksi ini.');
        }

        return $next($request);
    }
}
