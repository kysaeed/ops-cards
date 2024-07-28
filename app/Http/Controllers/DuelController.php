<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use App\Models\User;
use App\Models\Duel;

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
            $deckCards = $deck->deckCards()->orderBy('order')->get();

            $deckArray = [];
            foreach ($deckCards as $deckCard) {
                $deckArray[] = $deckCard->card_number;
            }
            $deckArrays[] = $deckArray;
        }

        return response()->json([
            'players' => [
                [
                    'deck' => $deckArrays[0],
                ],
                [
                    'deck' => $deckArrays[1],
                ]
            ],
        ]);
    }

    public function draw(Request $request)
    {
        $idUser = $request->input('idUser');
        $index = $request->input('index');

        $duel = Duel::query()
            ->first();

        if ($idUser != 1) {
            $deck = $duel->deck;
        } else {
            $deck = $duel->enemyDeck;
        }

        $deckCards = $deck->deckCards;

        $deckCard = $deckCards[$index];
        return response()->json([
            'cardNumber' => $deckCard->card_number,
        ]);

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
