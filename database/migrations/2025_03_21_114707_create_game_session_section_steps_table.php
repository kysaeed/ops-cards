<?php

use App\Models\GameSessionSection;
use App\Models\Duel;
use App\Models\Shop;
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
        Schema::create('game_session_section_steps', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(GameSessionSection::class);
            $table->unsignedInteger('order')->index();
            $table->foreignIdFor(Duel::class)->nullable();
            $table->foreignIdFor(Shop::class)->nullable();
            $table->timestamp('compleated_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('game_session_section_steps');
    }
};
