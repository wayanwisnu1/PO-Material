<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\PurchaseOrderController;
use Illuminate\Support\Facades\Route;

Route::view('/login', 'login')->middleware('guest')->name('login');
Route::post('/login', [AuthController::class, 'login'])->middleware('guest')->name('login.attempt');

Route::get('/', function () {
    return auth()->check()
        ? redirect()->route('dashboard')
        : redirect()->route('login');
});

Route::middleware(['auth'])->group(function () {
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
    Route::get('/api/me', [AuthController::class, 'me'])->name('api.me');

    Route::view('/dashboard', 'dashboard')->name('dashboard');
    Route::view('/dashboard/create-team', 'create-team')->name('create-team');
    Route::view('/dashboard/edit-team/{id}', 'edit-team')->name('edit-team');
    Route::view('/analytics', 'analytics')->name('analytics');
    Route::view('/reports', 'reports')->name('reports');
    Route::view('/team', 'team')->name('team');
    Route::view('/integrations', 'integrations')->name('integrations');
    Route::view('/settings', 'settings')->name('settings');

    Route::view('/orders', 'orders')->name('orders');
    Route::view('/hotmix-orders', 'hotmix-orders')->name('hotmix-orders');
    Route::view('/batu-orders', 'batu-orders')->name('batu-orders');

    Route::view('/customers', 'customers')->name('customers');
    Route::view('/suppliers', 'suppliers')->name('suppliers');
    Route::view('/products', 'products')->name('products');
    Route::view('/products-hotmix', 'products-hotmix')->name('products-hotmix');
    Route::view('/products-batu', 'products-batu')->name('products-batu');

    Route::middleware('permission:data.create')->group(function () {
        Route::view('/dashboard/create-orders', 'create-orders')->name('create-orders');
        Route::view('/dashboard/create-hotmix-orders', 'create-hotmix-orders')->name('create-hotmix-orders');
        Route::view('/dashboard/create-batu-orders', 'create-batu-orders')->name('create-batu-orders');
        Route::view('/dashboard/create-customers', 'create-customers')->name('create-customers');
        Route::view('/dashboard/create-suppliers', 'create-suppliers')->name('create-suppliers');
        Route::view('/dashboard/create-products', 'create-products')->name('create-products');
        Route::view('/dashboard/create-products-hotmix', 'create-products-hotmix')->name('create-products-hotmix');
        Route::view('/dashboard/create-products-batu', 'create-products-batu')->name('create-products-batu');
    });

    Route::middleware('permission:data.edit_draft,data.edit_all')->group(function () {
        Route::view('/dashboard/edit-orders/{id}', 'edit-orders')->name('edit-orders');
        Route::view('/dashboard/edit-hotmix-orders/{id}', 'edit-hotmix-orders')->name('edit-hotmix-orders');
        Route::view('/dashboard/edit-batu-orders/{id}', 'edit-batu-orders')->name('edit-batu-orders');
        Route::view('/dashboard/edit-customers/{id}', 'edit-customers')->name('edit-customers');
        Route::view('/dashboard/edit-suppliers/{id}', 'edit-suppliers')->name('edit-suppliers');
        Route::view('/dashboard/edit-products/{id}', 'edit-products')->name('edit-products');
        Route::view('/dashboard/edit-products-hotmix/{id}', 'edit-products-hotmix')->name('edit-products-hotmix');
        Route::view('/dashboard/edit-products-batu/{id}', 'edit-products-batu')->name('edit-products-batu');
    });

    Route::middleware('permission:data.view_own,data.view_all')->group(function () {
        Route::view('/dashboard/detail-orders/{id}', 'detail-orders')->name('detail-orders');
        Route::view('/dashboard/detail-hotmix-orders/{id}', 'detail-hotmix-orders')->name('detail-hotmix-orders');
        Route::view('/dashboard/detail-batu-orders/{id}', 'detail-batu-orders')->name('detail-batu-orders');
        Route::view('/dashboard/detail-suppliers/{id}', 'detail-suppliers')->name('detail-suppliers');
        Route::view('/dashboard/detail-products/{id}', 'detail-products')->name('detail-products');
        Route::view('/dashboard/detail-products-hotmix/{id}', 'detail-products-hotmix')->name('detail-products-hotmix');
        Route::view('/dashboard/detail-products-batu/{id}', 'detail-products-batu')->name('detail-products-batu');
    });
});

Route::middleware(['auth'])->prefix('api')->group(function () {
    Route::middleware('permission:data.view_own,data.view_all')->group(function () {
        Route::get('/purchase-orders', [App\Http\Controllers\Api\PurchaseOrderApiController::class, 'index']);
        Route::get('/purchase-orders/stats', [App\Http\Controllers\Api\PurchaseOrderApiController::class, 'stats']);
        Route::get('/purchase-orders/{id}', [App\Http\Controllers\Api\PurchaseOrderApiController::class, 'show']);
        Route::get('/orders/{id}', [App\Http\Controllers\Api\OrderDetailApiController::class, 'show']);

        Route::get('/customers', [App\Http\Controllers\Api\CustomerApiController::class, 'index']);
        Route::get('/customers/{id}', [App\Http\Controllers\Api\CustomerDetailApiController::class, 'show']);

        Route::get('/suppliers', [App\Http\Controllers\Api\SupplierApiController::class, 'index']);
        Route::get('/suppliers/{id}', [App\Http\Controllers\Api\SupplierDetailApiController::class, 'show']);

        Route::get('/products', [App\Http\Controllers\Api\ProductApiController::class, 'index']);
        Route::get('/products/{id}', [App\Http\Controllers\Api\ProductApiController::class, 'show']);

        Route::get('/products-hotmix', [App\Http\Controllers\Api\ProductHotmixApiController::class, 'index']);
        Route::get('/products-hotmix/{id}', [App\Http\Controllers\Api\ProductHotmixApiController::class, 'show']);

        Route::get('/products-batu', [App\Http\Controllers\Api\ProductBatuApiController::class, 'index']);
        Route::get('/products-batu/{id}', [App\Http\Controllers\Api\ProductBatuApiController::class, 'show']);
    });

    Route::middleware('permission:data.create')->group(function () {
        Route::post('/purchase-orders', [App\Http\Controllers\Api\PurchaseOrderApiController::class, 'store']);
        Route::post('/customers', [App\Http\Controllers\Api\CustomerDetailApiController::class, 'store']);
        Route::post('/suppliers', [App\Http\Controllers\Api\SupplierDetailApiController::class, 'store']);
        Route::post('/products', [App\Http\Controllers\Api\ProductApiController::class, 'store']);
        Route::post('/products-hotmix', [App\Http\Controllers\Api\ProductHotmixApiController::class, 'store']);
        Route::post('/products-batu', [App\Http\Controllers\Api\ProductBatuApiController::class, 'store']);
    });

    Route::middleware('permission:data.edit_draft,data.edit_all')->group(function () {
        Route::put('/purchase-orders/{id}', [App\Http\Controllers\Api\PurchaseOrderApiController::class, 'update'])
            ->middleware('can.modify.order:update');
        Route::put('/orders/{id}', [App\Http\Controllers\Api\OrderDetailApiController::class, 'update'])
            ->middleware('can.modify.order:update');
        Route::put('/customers/{id}', [App\Http\Controllers\Api\CustomerDetailApiController::class, 'update']);
        Route::put('/suppliers/{id}', [App\Http\Controllers\Api\SupplierDetailApiController::class, 'update']);
        Route::put('/products/{id}', [App\Http\Controllers\Api\ProductApiController::class, 'update']);
        Route::put('/products-hotmix/{id}', [App\Http\Controllers\Api\ProductHotmixApiController::class, 'update']);
        Route::put('/products-batu/{id}', [App\Http\Controllers\Api\ProductBatuApiController::class, 'update']);
    });

    Route::middleware('permission:user.manage')->group(function () {
        Route::get('/users', [App\Http\Controllers\Api\UserApiController::class, 'index']);
        Route::get('/users/roles', [App\Http\Controllers\Api\UserApiController::class, 'roles']);
        Route::get('/users/{id}', [App\Http\Controllers\Api\UserApiController::class, 'show']);
        Route::post('/users', [App\Http\Controllers\Api\UserApiController::class, 'store']);
        Route::put('/users/{id}', [App\Http\Controllers\Api\UserApiController::class, 'update']);
        Route::patch('/users/{id}/toggle-active', [App\Http\Controllers\Api\UserApiController::class, 'toggleActive']);
        Route::delete('/users/{id}', [App\Http\Controllers\Api\UserApiController::class, 'destroy']);
    });

    Route::middleware('permission:data.delete')->group(function () {
        Route::delete('/purchase-orders/{id}', [App\Http\Controllers\Api\PurchaseOrderApiController::class, 'destroy']);
        Route::delete('/products/{id}', [App\Http\Controllers\Api\ProductApiController::class, 'destroy']);
        Route::delete('/products-hotmix/{id}', [App\Http\Controllers\Api\ProductHotmixApiController::class, 'destroy']);
        Route::delete('/products-batu/{id}', [App\Http\Controllers\Api\ProductBatuApiController::class, 'destroy']);
    });
});

Route::middleware(['auth'])->group(function () {
    Route::resource('purchase-orders', PurchaseOrderController::class);
    Route::post('purchase-orders/{purchaseOrder}/items', [PurchaseOrderController::class, 'addItem'])->name('purchase-orders.items.add');
    Route::delete('purchase-orders/{purchaseOrder}/items/{item}', [PurchaseOrderController::class, 'removeItem'])->name('purchase-orders.items.remove');
});
