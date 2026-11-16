<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('purchase_orders', function (Blueprint $table) {
            // Buat nullable kolom yang tidak dipakai
            if (Schema::hasColumn('purchase_orders', 'buyer_company')) {
                $table->string('buyer_company')->nullable()->change();
            }
            if (Schema::hasColumn('purchase_orders', 'notes')) {
                $table->text('notes')->nullable()->change();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('purchase_orders', function (Blueprint $table) {
            if (Schema::hasColumn('purchase_orders', 'buyer_company')) {
                $table->string('buyer_company')->nullable(false)->change();
            }
            if (Schema::hasColumn('purchase_orders', 'notes')) {
                $table->text('notes')->nullable(false)->change();
            }
        });
    }
};
