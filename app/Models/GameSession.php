<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class GameSession extends Model
{
    use HasFactory;

    protected $gurded = ['id'];


    /**
     * @todo 進行の管理ができるようになおす
     */
    public function shops(): HasMany
    {
        return $this->hasMany(Shop::class);
    }

    /**
     * @todo 進行の管理ができるようになおす
     */
    public function duels(): HasMany
    {
        return $this->hasMany(Duel::class);
    }

}
