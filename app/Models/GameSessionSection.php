<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class GameSessionSection extends Model
{
    use HasFactory;

    protected $gurded = ['id'];


    public function gemeSessionSectionSteps(): HasMany
    {
        return $this->hasMany(GameSessionSectionStep::class);
    }
}
