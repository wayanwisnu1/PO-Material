<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductBatu extends Model
{
    protected $table = 'products_batu';
    protected $fillable = ['name', 'description', 'price'];
}
