<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PurchaseOrderController;

Route::view('/dashboard', 'dashboard')->name('dashboard');
Route::view('/login', 'login')->name('login');
Route::view('/analytics', 'analytics')->name('analytics');
Route::view('/orders', 'orders')->name('orders');
Route::view('/hotmix-orders', 'hotmix-orders')->name('hotmix-orders');
Route::view('/batu-orders', 'batu-orders')->name('batu-orders');
Route::view('/customers', 'customers')->name('customers');
Route::view('/suppliers', 'suppliers')->name('suppliers');
Route::view('/products', 'products')->name('products');
Route::view('/products-hotmix', 'products-hotmix')->name('products-hotmix');
Route::view('/products-batu', 'products-batu')->name('products-batu');
Route::view('/dashboard/create-products', 'create-products')->name('create-products');
Route::view('/dashboard/edit-products/{id}', 'edit-products')->name('edit-products');
Route::view('/dashboard/detail-products/{id}', 'detail-products')->name('detail-products');
Route::view('/dashboard/create-products-hotmix', 'create-products-hotmix')->name('create-products-hotmix');
Route::view('/dashboard/edit-products-hotmix/{id}', 'edit-products-hotmix')->name('edit-products-hotmix');
Route::view('/dashboard/detail-products-hotmix/{id}', 'detail-products-hotmix')->name('detail-products-hotmix');
Route::view('/dashboard/create-products-batu', 'create-products-batu')->name('create-products-batu');
Route::view('/dashboard/edit-products-batu/{id}', 'edit-products-batu')->name('edit-products-batu');
Route::view('/dashboard/edit-batu-orders/{id}', 'edit-batu-orders')->name('edit-batu-orders');
Route::view('/dashboard/detail-products-batu/{id}', 'detail-products-batu')->name('detail-products-batu');
Route::view('/dashboard/detail-batu-orders/{id}', 'detail-batu-orders')->name('detail-batu-orders');
Route::view('/reports', 'reports')->name('reports');
Route::view('/team', 'team')->name('team');
Route::view('/integrations', 'integrations')->name('integrations');
Route::view('/settings', 'settings')->name('settings');
Route::view('/dashboard/create-orders', 'create-orders')->name('create-orders');
Route::view('/dashboard/edit-orders/{id}', 'edit-orders')->name('edit-orders');
Route::view('/dashboard/detail-orders/{id}', 'detail-orders')->name('detail-orders');
Route::view('/dashboard/create-hotmix-orders', 'create-hotmix-orders')->name('create-hotmix-orders');
Route::view('/dashboard/create-batu-orders', 'create-batu-orders')->name('create-batu-orders');
Route::view('/dashboard/edit-hotmix-orders/{id}', 'edit-hotmix-orders')->name('edit-hotmix-orders');
Route::view('/dashboard/detail-hotmix-orders/{id}', 'detail-hotmix-orders')->name('detail-hotmix-orders');
Route::view('/dashboard/create-customers', 'create-customers')->name('create-customers');
Route::view('/dashboard/create-suppliers', 'create-suppliers')->name('create-suppliers');
Route::view('/dashboard/edit-suppliers/{id}', 'edit-suppliers')->name('edit-suppliers');
Route::view('/dashboard/detail-suppliers/{id}', 'detail-suppliers')->name('detail-suppliers');

Route::get('/', function () {
    return redirect()->route('dashboard');
});

// API routes
Route::prefix('api')->group(function () {
    Route::get('/purchase-orders', [App\Http\Controllers\Api\PurchaseOrderApiController::class, 'index']);
    Route::get('/purchase-orders/stats', [App\Http\Controllers\Api\PurchaseOrderApiController::class, 'stats']);
    Route::get('/purchase-orders/{id}', [App\Http\Controllers\Api\PurchaseOrderApiController::class, 'show']);
    Route::post('/purchase-orders', [App\Http\Controllers\Api\PurchaseOrderApiController::class, 'store']);
    Route::put('/purchase-orders/{id}', [App\Http\Controllers\Api\PurchaseOrderApiController::class, 'update']);
    Route::delete('/purchase-orders/{id}', [App\Http\Controllers\Api\PurchaseOrderApiController::class, 'destroy']);
    Route::get('/orders/{id}', [App\Http\Controllers\Api\OrderDetailApiController::class, 'show']);
    Route::put('/orders/{id}', [App\Http\Controllers\Api\OrderDetailApiController::class, 'update']);
    
    // Customer routes
    Route::get('/customers', [App\Http\Controllers\Api\CustomerApiController::class, 'index']);
    Route::get('/customers/{id}', [App\Http\Controllers\Api\CustomerDetailApiController::class, 'show']);
    Route::post('/customers', [App\Http\Controllers\Api\CustomerDetailApiController::class, 'store']);
    Route::put('/customers/{id}', [App\Http\Controllers\Api\CustomerDetailApiController::class, 'update']);
    
    // Supplier routes
    Route::get('/suppliers', [App\Http\Controllers\Api\SupplierApiController::class, 'index']);
    Route::get('/suppliers/{id}', [App\Http\Controllers\Api\SupplierDetailApiController::class, 'show']);
    Route::post('/suppliers', [App\Http\Controllers\Api\SupplierDetailApiController::class, 'store']);
    Route::put('/suppliers/{id}', [App\Http\Controllers\Api\SupplierDetailApiController::class, 'update']);

    // Product routes
    Route::get('/products', [App\Http\Controllers\Api\ProductApiController::class, 'index']);
    Route::get('/products/{id}', [App\Http\Controllers\Api\ProductApiController::class, 'show']);
    Route::post('/products', [App\Http\Controllers\Api\ProductApiController::class, 'store']);
    Route::put('/products/{id}', [App\Http\Controllers\Api\ProductApiController::class, 'update']);
    Route::delete('/products/{id}', [App\Http\Controllers\Api\ProductApiController::class, 'destroy']);

    // Products Hotmix routes
    Route::get('/products-hotmix', [App\Http\Controllers\Api\ProductHotmixApiController::class, 'index']);
    Route::get('/products-hotmix/{id}', [App\Http\Controllers\Api\ProductHotmixApiController::class, 'show']);
    Route::post('/products-hotmix', [App\Http\Controllers\Api\ProductHotmixApiController::class, 'store']);
    Route::put('/products-hotmix/{id}', [App\Http\Controllers\Api\ProductHotmixApiController::class, 'update']);
    Route::delete('/products-hotmix/{id}', [App\Http\Controllers\Api\ProductHotmixApiController::class, 'destroy']);

    // Products Batu routes
    Route::get('/products-batu', [App\Http\Controllers\Api\ProductBatuApiController::class, 'index']);
    Route::get('/products-batu/{id}', [App\Http\Controllers\Api\ProductBatuApiController::class, 'show']);
    Route::post('/products-batu', [App\Http\Controllers\Api\ProductBatuApiController::class, 'store']);
    Route::put('/products-batu/{id}', [App\Http\Controllers\Api\ProductBatuApiController::class, 'update']);
    Route::delete('/products-batu/{id}', [App\Http\Controllers\Api\ProductBatuApiController::class, 'destroy']);
});

Route::resource('purchase-orders', PurchaseOrderController::class);
Route::post('purchase-orders/{purchaseOrder}/items', [PurchaseOrderController::class, 'addItem'])->name('purchase-orders.items.add');
Route::delete('purchase-orders/{purchaseOrder}/items/{item}', [PurchaseOrderController::class, 'removeItem'])->name('purchase-orders.items.remove');
