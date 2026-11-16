<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('purchase_orders', function (Blueprint $table) {
            $table->string('po_type')->default('beton')->after('po_number');
        });

        // Backfill existing records berdasarkan lokasi_sumber yang sudah ada
        \DB::table('purchase_orders')
            ->whereIn('lokasi_sumber', ['AMP - Lematang', 'AMP - Terbanggi'])
            ->update(['po_type' => 'hotmix']);

        \DB::table('purchase_orders')
            ->whereIn('lokasi_sumber', ['PT.HBP Mojokerto', 'PT. BBD Mojokerto', 'PT. HBP Bengkunat', 'PT. SCD UMBAR'])
            ->update(['po_type' => 'batu']);
    }

    public function down(): void
    {
        Schema::table('purchase_orders', function (Blueprint $table) {
            $table->dropColumn('po_type');
        });
    }
};
