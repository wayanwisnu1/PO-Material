<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Supplier;
use Illuminate\Http\Request;

class SupplierApiController extends Controller
{
    public function index()
    {
        $suppliers = Supplier::with(['creator', 'updater'])->orderBy('name', 'asc')->get();

        return response()->json([
            'data' => $suppliers
        ]);
    }
}
