<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\Shop;
use App\Models\ShopCard;
use App\Models\User;
use App\Models\Deck;
use App\Models\DeckCard;
use App\Models\Duel;
use App\Models\DuelTurn;
use App\Models\GameSession;


class ShopController extends Controller
{
    protected array $cardSettings;

    public function __construct()
    {
        $this->cardSettings = [];
        $string = file_get_contents(resource_path('settings/cards.json'));
        if (!empty($string)) {
            $this->cardSettings = json_decode($string, true);
        }

    }

    public function enter(Request $request)
    {
        /** @var User $user */
        $user = Auth::user();

        $gameSession = $user->gameSessions()
            ->whereNull('game_sessions.disabled_at')
            ->first();

        $shop = $gameSession->shops()->first();
        $shopCards = $shop->shopCards()->orderBy('order')->get();

        $deckCards = [];
        for ($i = 0; $i < 20; $i++) {
            $deckCards[] = ($i + 1) % 10;
        }

        $cardNumberList = [];
        foreach ($shopCards as $c) {
            $cardNumberList[] = $c->card_number;
        }

        return response()->json([
            'deckCards' => $deckCards,
            'shopCards' => $cardNumberList,
        ]);
    }

    public function select(Request $request)
    {
        $selectedCards = $request->input('selectedCards');

        /** @var User $user */
        $user = Auth::user();

        $gameSession = $user->gameSessions()
            ->whereNull('game_sessions.disabled_at')
            ->first();

        $duel = $gameSession->duels()->first();

        $deck = $duel->deck()->first();



    }
}
