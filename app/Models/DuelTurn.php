<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DuelTurn extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    protected $casts = [
        'turn_state' => 'json',
    ];
}
