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
        $users = User::query()
            ->whereIn('id', [1, 2])
            ->oldest('id')
            ->get();

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

        return response()->json([
            'players' => [
                [
                    'deck' => null,
                    'cardCount' => $cardCountList[0],
                ],
                [
                    'deck' => null,
                    'cardCount' => $cardCountList[1],
                ]
            ],
        ]);
    }

    public function draw(Request $request)
    {
        $idUser = $request->input('idUser');
        $index = $request->input('index');

        return DB::transaction(function () use ($idUser, $index) {
            $duel = Duel::query()
                ->first();


            $order = $duel->duelTurns()
                ->max('order') ?? 0;

            $order++;

            $turn = new DuelTurn([
                'user_id' => $idUser, // @todo validation
                'is_hand' => false,
                'order' => $order,
            ]);

            $duel->duelTurns()->save($turn);


            if ($idUser != 1) {
                $deck = $duel->deck;
            } else {
                $deck = $duel->enemyDeck;
            }

            $deckCards = $deck->deckCards;

            $deckCard = $deckCards[$index];

            return response()->json([
                'cardNumber' => $deckCard->card_number,
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
