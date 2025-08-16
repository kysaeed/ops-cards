<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\ShopCard;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Shop extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    public function shopCards(): HasMany
    {
        return $this->hasMany(ShopCard::class);
    }


}
