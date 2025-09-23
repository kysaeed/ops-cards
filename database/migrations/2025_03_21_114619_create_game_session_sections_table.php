<?php

use App\Models\GameSession;
use App\Models\Deck;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('game_session_sections', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(GameSession::class)->constrained();
            $table->unsignedInteger('order')->index();
            // $table->foreignIdFor(Deck::class)->constrained();
            $table->timestamp('compleated_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('game_session_sections');
    }
};
