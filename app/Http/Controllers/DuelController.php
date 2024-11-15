<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Models\Duel;
use App\Models\DuelTurn;
use App\Packages\DuelManager;

class DuelController extends Controller
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

    /**
     * Display a listing of the resource.
     */
    public function index()
    {

        $duel = Duel::query()
            ->first();

        if ($duel->duelTurns()->exists()) {
            $resume = $duel->duelTurns()
                ->latest('order')
                ->first();

            $duelManager = new DuelManager($resume->turn_state, $this->cardSettings);

            $initialState = $duelManager->resume();

            // dd($resume?->toArray());
            return response()->json($initialState);
        }

        $deckModels = [];
        $deckModels[] = $duel->deck;
        $deckModels[] = $duel->enemyDeck;

        $deckArrays = [];
        foreach ($deckModels as $deck) {
            $deckCards = $deck->deckCards()
                ->orderBy('order')
                ->get();

            $deckArray = [];
            foreach ($deckCards as $deckCard) {
                $deckArray[] = $deckCard->card_number;
            }
            $deckArrays[] = $deckArray;
        }

        $cardCountList = [];
        foreach ($deckModels as $deck) {
            $cardCountList[] = $deck->deckCards()->count();
        }

        /**
         *　@todo 新しいオブジェクトを作る
         *    （テストのために全削除しているのでなおす）
         */
        $duel->duelTurns()->delete();

        $order = $duel->duelTurns()
            ->max('order') ?? 0;

        $order++;

        $deckCardNumbers = [];
        $handCardNumbers = [];
        foreach ($deckModels as $i => $deck) {
            $n = $deck->deckCards()
                ->pluck('card_number')
                ->shuffle();

            $deckCardNumbers[] = $n;
            $handCardNumbers[] = null;
        }

        $turnState = [
            'turnPalyerIndex' => 0,
            'players' => [
                0 => [
                    'handCardNumber' => null,
                    'deckCardNumbers' => $deckCardNumbers[0]->toArray(),
                    'cardStack' => [],
                    'benchCardNumbers' => [],
                    'cardStackPower' => 0,
                ],
                1 => [
                    'handCardNumber' => null,
                    'deckCardNumbers' => $deckCardNumbers[1]->toArray(), //
                    'cardStack' => [],
                    'benchCardNumbers' => [],
                    'cardStackPower' => 0,
                ],
            ],

        ];

        $duelManager = new DuelManager($turnState, $this->cardSettings);

        $initialState = $duelManager->initial();

        $turn = new DuelTurn([
            'user_id' => 1, // @todo validation
            'is_player_turn' => true,
            'is_hand' => false,
            'order' => $order,
            //'deck_card_id' => $deckCard->id,
            'hand_card_id' => null, ////$handCardNumbers[0],
            'turn_state' => $duelManager->getState(),
        ]);
        $duel->duelTurns()->save($turn);

        /////
        return response()->json($initialState);
    }

    public function draw(Request $request)
    {
        // @todo チェックに使用？
        //$idUser = $request->input('idUser');
        //$index = $request->input('index');

        $isHandCrad = $request->input('isHandCard');

        /**
         * @todo PlayerのturnかをBEで判定する
         */
        // $isPlayerTurn = $request->input('isPlayer');

        return DB::transaction(function () use ($isHandCrad) {

            $duel = Duel::query()
                ->first();

            $prevTurn = $duel->duelTurns()
                ->latest('order')
                ->first();

            $turnState = $prevTurn->turn_state;
            $turnPlayerIndex = $turnState['turnPalyerIndex'] ?? 0;

            $isPlayerTurn = true;
            if ($turnPlayerIndex != 0) {
                $isPlayerTurn = false;
                $enemyJsonIndex = 1;
                $enemyState = $prevTurn->turn_state['players'][$enemyJsonIndex];

                $isHandCrad = false;
                if (empty($enemyState['deckCardNumbers'])) {
                    $isHandCrad = true;
                } else {
                    $isHandCrad = (bool)mt_rand(0, 1);
                }
            }


            $order = $prevTurn->order + 1;
            $turn = new DuelTurn([
                'user_id' => $turnPlayerIndex, // @todo 正しい値をいれる
                'is_player_turn' => ($turnPlayerIndex === 0),
                'is_hand' => $isHandCrad,
                'order' => $order,
                'turn_state' => $prevTurn->turn_state,
                'hand_card_id' => $prevTurn->hand_card_id,
                //'deck_card_id' => $deckCard->id,
            ]);


            $nextHandCardNumber = null;

            $duelManager = new DuelManager($turnState, $this->cardSettings);

            $step = $duelManager->subTurn($isPlayerTurn, $isHandCrad);

            $turnState = $duelManager->getState();

            // $deckCardNumbers = $deck->deckCards()
            //     ->pluck('card_number');

            $turn->turn_state = $turnState;

            $turn->is_player_turn = $isPlayerTurn;

            $duel->duelTurns()->save($turn);

            return response()->json($step);
        });

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
