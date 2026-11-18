<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasColumn('purchase_orders', 'created_by')) {
            Schema::table('purchase_orders', function (Blueprint $table) {
                $table->foreignId('created_by')->nullable()->constrained('users')->onDelete('set null')->after('status');
            });
        }

        $firstUser = \DB::table('users')->first();
        if ($firstUser) {
            \DB::table('purchase_orders')->whereNull('created_by')->update(['created_by' => $firstUser->id]);
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('purchase_orders', 'created_by')) {
            Schema::table('purchase_orders', function (Blueprint $table) {
                $table->dropForeign(['created_by']);
                $table->dropColumn('created_by');
            });
        }
    }
};
