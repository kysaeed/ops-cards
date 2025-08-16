<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\Deck;

class GameSessionSection extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    public function deck(): BelongsTo
    {
        return $this->belongsTo(Deck::class);
    }

    public function gameSession(): BelongsTo
    {
        return $this->belongsTo(GameSession::class);
    }

    public function gameSessionSectionSteps(): HasMany
    {
        return $this->hasMany(GameSessionSectionStep::class);
    }

    public function scopeActive(Builder $query): void
    {
        $query->whereNull('game_session_sections.compleated_at');
    }


}
