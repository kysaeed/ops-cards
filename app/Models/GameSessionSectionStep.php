<?php

namespace App\Models;

use App\Models\Duel;
use App\Models\Shop;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GameSessionSectionStep extends Model
{
    use HasFactory;

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

    public function scopeActive(Builder $query): void
    {
        $query
            ->orderBy('game_session_section_steps.order')
            ->whereNull('game_session_section_steps.compleated_at');
    }

}
