<?php

use App\Models\DeckCard;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\Duel;
use App\Models\User;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('duel_turns', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Duel::class);
            $table->foreignIdFor(User::class);
            $table->foreignIdFor(DeckCard::class, 'deck_card_id')->nullable();
            $table->foreignIdFor(DeckCard::class, 'hand_card_id')->nullable();
            $table->json('turn_state');
            $table->boolean('is_player_turn');
            $table->boolean('is_hand');
            $table->integer('order')->index();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('duel_turns');
    }
};
