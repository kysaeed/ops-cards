<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Deck;

class Duel extends Model
{
    use HasFactory;

    protected $guards = ['id'];

    public function deck()
    {
        return $this->belongsTo(Deck::class);
    }

    public function enemyDeck()
    {
        return $this->belongsTo(Deck::class, 'enemy_deck_id');
    }
}
