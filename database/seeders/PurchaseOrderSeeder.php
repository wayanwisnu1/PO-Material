<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PurchaseOrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $suppliers = \App\Models\Supplier::all();

        if ($suppliers->isEmpty()) {
            $this->command->warn('No suppliers found. Run SupplierSeeder first.');
            return;
        }

        // PO 1
        $po1 = \App\Models\PurchaseOrder::create([
            'po_number' => 'PO/2026/11/001',
            'po_date' => '2026-11-01',
            'supplier_id' => $suppliers->first()->id,
            'buyer_company' => 'PT Konstruksi Mega',
            'buyer_address' => 'Jl. Sudirman No. 123, Jakarta Pusat 10220',
            'delivery_address' => 'Proyek Apartemen Green Valley, Jl. TB Simatupang KM 15, Jakarta Selatan',
            'delivery_schedule' => '2026-11-10 08:00:00',
            'payment_terms' => 'termin',
            'payment_days' => 30,
            'status' => 'approved',
            'notes' => 'Pengiriman pada pagi hari, koordinasi dengan site manager.',
        ]);

        \App\Models\PoItem::create([
            'purchase_order_id' => $po1->id,
            'concrete_type' => 'Readymix',
            'concrete_grade' => 'K-300',
            'quantity' => 50.00,
            'unit' => 'm3',
            'unit_price' => 850000,
            'subtotal' => 42500000,
            'specifications' => 'Slump 12±2 cm, untuk struktur kolom',
        ]);

        \App\Models\PoItem::create([
            'purchase_order_id' => $po1->id,
            'concrete_type' => 'Readymix',
            'concrete_grade' => 'K-250',
            'quantity' => 30.00,
            'unit' => 'm3',
            'unit_price' => 800000,
            'subtotal' => 24000000,
            'specifications' => 'Slump 12±2 cm, untuk struktur balok',
        ]);

        $po1->updateTotalAmount();

        // PO 2
        $po2 = \App\Models\PurchaseOrder::create([
            'po_number' => 'PO/2026/11/002',
            'po_date' => '2026-11-03',
            'supplier_id' => $suppliers->skip(1)->first()->id ?? $suppliers->first()->id,
            'buyer_company' => 'PT Pembangunan Indah',
            'buyer_address' => 'Jl. Rasuna Said Kav. C-22, Jakarta Selatan 12940',
            'delivery_address' => 'Proyek Jalan Tol Cikarang-Cikampek KM 40',
            'delivery_schedule' => '2026-11-12 07:00:00',
            'payment_terms' => 'invoice',
            'payment_days' => 14,
            'status' => 'submitted',
            'notes' => 'Untuk pengecoran jalan. Koordinasi dengan tim QC di lokasi.',
        ]);

        \App\Models\PoItem::create([
            'purchase_order_id' => $po2->id,
            'concrete_type' => 'Readymix',
            'concrete_grade' => 'K-350',
            'quantity' => 100.00,
            'unit' => 'm3',
            'unit_price' => 900000,
            'subtotal' => 90000000,
            'specifications' => 'fc\' 29 MPa, untuk perkerasan jalan',
        ]);

        $po2->updateTotalAmount();

        // PO 3
        $po3 = \App\Models\PurchaseOrder::create([
            'po_number' => 'PO/2026/11/003',
            'po_date' => '2026-11-05',
            'supplier_id' => $suppliers->last()->id,
            'buyer_company' => 'CV Bangun Sejahtera',
            'buyer_address' => 'Jl. Merdeka No. 88, Bandung 40111',
            'delivery_address' => 'Proyek Perumahan Asri Residence Blok A, Bandung',
            'delivery_schedule' => '2026-11-15 09:00:00',
            'payment_terms' => 'cash',
            'payment_days' => null,
            'status' => 'draft',
            'notes' => null,
        ]);

        \App\Models\PoItem::create([
            'purchase_order_id' => $po3->id,
            'concrete_type' => 'Precast',
            'concrete_grade' => 'K-225',
            'quantity' => 200.00,
            'unit' => 'unit',
            'unit_price' => 125000,
            'subtotal' => 25000000,
            'specifications' => 'Panel dinding precast 3m x 2.5m',
        ]);

        $po3->updateTotalAmount();
    }
}
