<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Carbon\CarbonImmutable;
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
            ->active()
            ->first();

        $gameSessionSection = $gameSession->gameSessionSections()
            ->active()
            ->first();

        $gemeSessionSectionStep = $gameSessionSection->gameSessionSectionSteps()
            ->active()
            ->first();

        $shop = $gemeSessionSectionStep->shop;

        $shopCards = $shop->shopCards()->orderBy('order')->get();


        $cardNumberList = [];
        foreach ($shopCards as $c) {
            $cardNumberList[] = $c->card_number;
        }


        /*
            @todo deck取得
        */
        // $duel = $gameSessionSection->duels()->first();
        $deck = $gameSessionSection->deck;

        $deckCards = $deck->deckCards()
            ->orderBy('order')
            ->get();

        $deckCardNumberList = [];
        foreach ($deckCards as $card) {
            $deckCardNumberList[] = $card->card_number;
        }

        return response()->json([
            'deckCards' => $deckCardNumberList,
            'shopCards' => $cardNumberList,
        ]);
    }

    public function select(Request $request)
    {

        /** @var User $user */
        $user = Auth::user();

        $gameSession = $user->gameSessions()
            ->whereNull('game_sessions.compleated_at')
            ->first();

        $gameSessionSection = $gameSession->gameSessionSections()
            ->active()
            ->first();

        $gameSessionSectionStep = $gameSessionSection->gameSessionSectionSteps()
            ->active()
            ->first();

        $shop = $gameSessionSectionStep->shop;
        $shopCards = $shop->shopCards()->orderBy('order')->get();


        $selectedCardIndexList = $request->input('selectedIndexList');

        $selectedCardNumbers = [];
        foreach ($selectedCardIndexList as $selectedCardIndex) {
            $selectedCardNumbers[] = $shopCards[$selectedCardIndex]->card_number;
        }

        $deck = $gameSessionSection->deck;
        // todo transaction
        $order = $deck->deckCards()->max('order') ?? 0;
        foreach ($selectedCardNumbers as $cardNumber) {
            $order++;
            $deckCard = new DeckCard([
                'card_number' => $cardNumber,
                'order' => $order,
            ]);
            $deck->deckCards()->save($deckCard);
        }


        $gameSessionSectionStep->compleated_at = CarbonImmutable::now();
        $gameSessionSectionStep->save();

        $deck = $gameSessionSection->deck;


    }
}
