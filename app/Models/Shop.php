<?php

namespace App\Models;

use App\Models\ShopCard;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Shop extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    public function shopCards(): HasMany
    {
        return $this->hasMany(ShopCard::class);
    }

    public function gameSessionSectionStep(): BelongsTo
    {
        return $this->belongsTo(GameSessionSectionStep::class);
    }

}
