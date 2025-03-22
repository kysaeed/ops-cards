<?php

namespace App\Models;

use app\Models\Duel;
use app\Models\Shop;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GameSessionSectionStep extends Model
{
    use HasFactory;

    //protected $gurded = ['id'];
    protected $fillable = [
        'order',
        'shop_id',
        'duel_id',
    ];

    public function duel(): BelongsTo
    {
        return $this->belongsTo(Duel::class);
    }

    public function shop(): BelongsTo
    {
        return $this->belongsTo(Shop::class);
    }
}
