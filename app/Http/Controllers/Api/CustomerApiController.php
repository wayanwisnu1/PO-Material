<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use Illuminate\Http\Request;

class CustomerApiController extends Controller
{
    public function index()
    {
        $customers = Customer::orderBy('name', 'asc')->get();

        return response()->json([
            'data' => $customers
        ]);
    }
}
