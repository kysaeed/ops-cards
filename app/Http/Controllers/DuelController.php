<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Models\Duel;
use App\Models\DuelTurn;

class DuelController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        /*
        $users = User::query()
            ->whereIn('id', [1, 2])
            ->oldest('id')
            ->get();
        */

        $duel = Duel::query()
            ->first();

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
            $cardCountList[] = $deck->deckCArds()->count();
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
        $initialStackCardNumbers = [];
        foreach ($deckModels as $i => $deck) {
            $n = $deck->deckCards()
                ->pluck('card_number')
                ->shuffle();

            $deckCardNumbers[] = $n;
            $handCardNumbers[] = $n->shift();

            if ($i == 0) {
                $initialStackCardNumbers[] = null;
            } else {
                $initialStackCardNumbers[] = $n->shift();
            }
        }

        $turnState = [
            'player' => [
                'handCardNumber' => $handCardNumbers[0],
                'deckCardNumbers' => $deckCardNumbers[0]->toArray(),
            ],
            'enemy' => [
                'handCardNumber' => $handCardNumbers[1],
                'deckCardNumbers' => $deckCardNumbers[1]->toArray(), //
            ],
        ];

        $turn = new DuelTurn([
            'user_id' => 1, // @todo validation
            'is_player_turn' => true,
            'is_hand' => false,
            'order' => $order,
            //'deck_card_id' => $deckCard->id,
            'hand_card_id' => null, ////$handCardNumbers[0],
            'turn_state' => $turnState,
        ]);
        $duel->duelTurns()->save($turn);

        /////

        return response()->json([
            'players' => [
                [
                    'deck' => null,
                    'handCardNumber' => 1,
                    'initialStackCard' => $initialStackCardNumbers[0],
                    'cardCount' => count($turnState['player']['deckCardNumbers']),
                ],
                [
                    'deck' => null,
                    'handCardNumber' => 1,
                    'initialStackCard' => $initialStackCardNumbers[1],
                    'cardCount' => count($turnState['enemy']['deckCardNumbers']),
                ]
            ],
        ]);
    }

    public function draw(Request $request)
    {
        $idUser = $request->input('idUser');
        //$index = $request->input('index');
        $isHandCrad = $request->input('isHandCard');

        /**
         * @todo PlayerのturnかをBEで判定する
         */
        $isPlayerTurn = $request->input('isPlayer');

        return DB::transaction(function () use ($idUser, $isPlayerTurn, $isHandCrad) {

            $duel = Duel::query()
                ->first();

            $jsonIndex = 'player';
            if ($idUser != 0) {
                $jsonIndex = 'enemy';
                $isHandCrad = (bool)mt_rand(0, 1);
            }

            $prevTrun = $duel->duelTurns()
                ->latest('order')
                ->first();

            $order = $prevTrun->order + 1;
            $turn = new DuelTurn([
                'user_id' => $idUser, // @todo validation
                'is_player_turn' => true, // @todo カレントのturnを設定
                'is_hand' => $isHandCrad,
                'order' => $order,
                'turn_state' => $prevTrun->turn_state,
                'hand_card_id' => $prevTrun->hand_card_id,
                //'deck_card_id' => $deckCard->id,
            ]);


            $nextHandCardNumber = null;
            $turnState = $turn->turn_state;
            if ($isHandCrad) {

                $cardNumber = $turn->hand_card_id; // $turnState[$jsonIndex]['handCardNumber'];
                $turn->hand_card_id = array_shift($turnState[$jsonIndex]['deckCardNumbers']);
                $nextHandCardNumber = $turn->hand_card_id;
                $turnState[$jsonIndex]['handCardNumber'] = $turn->hand_card_id;

                $cardCount = count($turnState[$jsonIndex]['deckCardNumbers']);


            } else {
                $cardNumber = array_shift($turnState[$jsonIndex]['deckCardNumbers']);
                $cardCount = count($turnState[$jsonIndex]['deckCardNumbers']);
            }


            // $deckCardNumbers = $deck->deckCards()
            //     ->pluck('card_number');

            $turn->turn_state = $turnState;


            $turn->is_player_turn = $isPlayerTurn;

            $duel->duelTurns()->save($turn);

            return response()->json([
                'isHandCard' => $isHandCrad,
                'cardNumber' => $cardNumber,
                'nextHnadCardNumber' => $nextHandCardNumber,
                'cardCount' => $cardCount,
                'order' => null,
            ]);

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
