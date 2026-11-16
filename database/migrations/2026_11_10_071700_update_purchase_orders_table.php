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
            // Tambah kolom baru
            if (!Schema::hasColumn('purchase_orders', 'customer_id')) {
                $table->foreignId('customer_id')->nullable()->constrained()->onDelete('cascade');
            }
            if (!Schema::hasColumn('purchase_orders', 'contact_person')) {
                $table->string('contact_person')->nullable();
            }
            if (!Schema::hasColumn('purchase_orders', 'quantity')) {
                $table->decimal('quantity', 10, 2)->nullable();
            }
            if (!Schema::hasColumn('purchase_orders', 'material_name')) {
                $table->string('material_name')->nullable();
            }
            if (!Schema::hasColumn('purchase_orders', 'harga')) {
                $table->decimal('harga', 15, 2)->nullable();
            }
            if (!Schema::hasColumn('purchase_orders', 'jenis_transaksi')) {
                $table->enum('jenis_transaksi', ['F', 'NF'])->nullable();
            }
            if (!Schema::hasColumn('purchase_orders', 'lokasi_sumber')) {
                $table->string('lokasi_sumber')->nullable();
            }
            if (!Schema::hasColumn('purchase_orders', 'foto_po')) {
                $table->string('foto_po')->nullable();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('purchase_orders', function (Blueprint $table) {
            $columns = [
                'customer_id',
                'contact_person',
                'quantity',
                'material_name',
                'harga',
                'jenis_transaksi',
                'lokasi_sumber',
                'foto_po'
            ];
            
            foreach ($columns as $column) {
                if (Schema::hasColumn('purchase_orders', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }
};
