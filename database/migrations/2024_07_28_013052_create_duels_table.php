<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\User;
use App\Models\Deck;
use App\Models\GameSession;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('duels', function (Blueprint $table) {
            $table->id();
            $table->integer('turn');
            $table->foreignIdFor(GameSession::class);
            $table->foreignIdFor(User::class);
            $table->foreignIdFor(Deck::class);
            $table->foreignIdFor(Deck::class, 'enemy_deck_id');
            $table->timestamp('compleated_at')->nullable();
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
