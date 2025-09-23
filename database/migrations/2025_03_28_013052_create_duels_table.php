<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\User;
use App\Models\Deck;
use App\Models\GameSessionSectionStep;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('duels', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(GameSessionSectionStep::class)->constrained();
            $table->foreignIdFor(User::class)->constrained();
            $table->foreignIdFor(Deck::class)->constrained();
            $table->foreignIdFor(Deck::class, 'enemy_deck_id')->constrained('decks');
            $table->boolean('is_player_win')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('duels');
    }
};
