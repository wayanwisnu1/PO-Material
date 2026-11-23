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
        $tables = ['products', 'products_hotmix', 'products_batu'];
        foreach ($tables as $table) {
            if (!Schema::hasColumn($table, 'created_by')) {
                Schema::table($table, function (Blueprint $t) {
                    $t->foreignId('created_by')->nullable()->constrained('users')->onDelete('set null')->after('price');
                });
            }
            if (!Schema::hasColumn($table, 'updated_by')) {
                Schema::table($table, function (Blueprint $t) {
                    $t->foreignId('updated_by')->nullable()->constrained('users')->onDelete('set null')->after('created_by');
                });
            }
            if (!Schema::hasColumn($table, 'deleted_by')) {
                Schema::table($table, function (Blueprint $t) {
                    $t->foreignId('deleted_by')->nullable()->constrained('users')->onDelete('set null')->after('updated_by');
                });
            }
            if (!Schema::hasColumn($table, 'deleted_at')) {
                Schema::table($table, function (Blueprint $t) {
                    $t->softDeletes()->after('deleted_by');
                });
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $tables = ['products', 'products_hotmix', 'products_batu'];
        foreach ($tables as $table) {
            Schema::table($table, function (Blueprint $t) {
                $t->dropSoftDeletes();
                $t->dropForeign(['deleted_by']);
                $t->dropColumn('deleted_by');
                $t->dropForeign(['updated_by']);
                $t->dropColumn('updated_by');
                $t->dropForeign(['created_by']);
                $t->dropColumn('created_by');
            });
        }
    }
};
