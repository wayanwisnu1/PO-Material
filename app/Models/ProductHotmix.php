<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductHotmix extends Model
{
    protected $table = 'products_hotmix';
    protected $fillable = ['name', 'description', 'price'];
}