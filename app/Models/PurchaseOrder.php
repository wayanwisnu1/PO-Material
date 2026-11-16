<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PurchaseOrder extends Model
{
    protected $fillable = [
        'po_number',
        'po_type',
        'po_date',
        'nama_marketing',
        'customer_id',
        'contact_person',
        'quantity',
        'material_name',
        'harga',
        'buyer_address',
        'delivery_address',
        'delivery_schedule',
        'payment_terms',
        'payment_days',
        'total_amount',
        'status',
        'jenis_transaksi',
        'lokasi_sumber',
        'foto_po',
        'satuan',
    ];

    protected $casts = [
        'po_date' => 'date',
        'delivery_schedule' => 'datetime',
        'total_amount' => 'decimal:2',
    ];

    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function items()
    {
        return $this->hasMany(PoItem::class);
    }

    public function updateTotalAmount()
    {
        $this->total_amount = $this->items()->sum('subtotal');
        $this->save();
    }
}
