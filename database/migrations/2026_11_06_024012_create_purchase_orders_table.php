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
        Schema::create('purchase_orders', function (Blueprint $table) {
            $table->id();
            $table->string('po_number')->unique();
            $table->date('po_date');
            $table->foreignId('supplier_id')->constrained()->onDelete('cascade');
            $table->string('buyer_company');
            $table->text('buyer_address');
            $table->text('delivery_address');
            $table->dateTime('delivery_schedule');
            $table->enum('payment_terms', ['cash', 'termin', 'invoice'])->default('invoice');
            $table->integer('payment_days')->nullable(); // untuk TOP
            $table->decimal('total_amount', 15, 2)->default(0);
            $table->enum('status', ['draft', 'submitted', 'approved', 'delivered', 'cancelled'])->default('draft');
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('purchase_orders');
    }
};
