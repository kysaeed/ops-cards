<?php

namespace App\Models;

use App\Models\Deck;
use App\Models\DuelTurn;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Duel extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    public function deck()
    {
        return $this->belongsTo(Deck::class);
    }

    public function enemyDeck()
    {
        return $this->belongsTo(Deck::class, 'enemy_deck_id');
    }

    public function duelTurns()
    {
        return $this->hasMany(DuelTurn::class);
    }

    public function gameSessionSectionStep(): BelongsTo
    {
        return $this->belongsTo(GameSessionSectionStep::class);
    }
}
