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
        if (!Schema::hasColumn('suppliers', 'created_by')) {
            Schema::table('suppliers', function (Blueprint $table) {
                $table->foreignId('created_by')->nullable()->constrained('users')->onDelete('set null')->after('contact_person');
            });
        }
        if (!Schema::hasColumn('suppliers', 'updated_by')) {
            Schema::table('suppliers', function (Blueprint $table) {
                $table->foreignId('updated_by')->nullable()->constrained('users')->onDelete('set null')->after('created_by');
            });
        }
        if (!Schema::hasColumn('suppliers', 'deleted_by')) {
            Schema::table('suppliers', function (Blueprint $table) {
                $table->foreignId('deleted_by')->nullable()->constrained('users')->onDelete('set null')->after('updated_by');
            });
        }
        if (!Schema::hasColumn('suppliers', 'deleted_at')) {
            Schema::table('suppliers', function (Blueprint $table) {
                $table->softDeletes()->after('deleted_by');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('suppliers', function (Blueprint $table) {
            $table->dropSoftDeletes();
            $table->dropForeign(['deleted_by']);
            $table->dropColumn('deleted_by');
            $table->dropForeign(['updated_by']);
            $table->dropColumn('updated_by');
            $table->dropForeign(['created_by']);
            $table->dropColumn('created_by');
        });
    }
};
