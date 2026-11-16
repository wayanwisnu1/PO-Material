<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SupplierSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $suppliers = [
            [
                'name' => 'PT Beton Jaya Abadi',
                'address' => 'Jl. Industri No. 45, Jakarta Timur 13250',
                'phone' => '021-8501234',
                'email' => 'info@betonjaya.co.id',
                'contact_person' => 'Budi Santoso',
            ],
            [
                'name' => 'CV Readymix Nusantara',
                'address' => 'Jl. Raya Bekasi KM 18, Bekasi 17520',
                'phone' => '021-8889999',
                'email' => 'sales@readymixnusantara.com',
                'contact_person' => 'Andi Wijaya',
            ],
            [
                'name' => 'PT Semen Beton Indonesia',
                'address' => 'Jl. Gatot Subroto No. 99, Jakarta Selatan 12930',
                'phone' => '021-5201111',
                'email' => 'customer@semenbetonindonesia.co.id',
                'contact_person' => 'Siti Nurhaliza',
            ],
        ];

        foreach ($suppliers as $supplier) {
            \App\Models\Supplier::create($supplier);
        }
    }
}
