<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Deck extends Model
{
    use HasFactory;

    protected $fillable = [
        'level',
    ];

    public function deckCards()
    {
        return $this->hasMany(DeckCard::class);
    }
}
