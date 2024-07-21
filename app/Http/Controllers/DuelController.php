<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use App\Models\User;

class DuelController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users = User::query()
            ->whereIn('id', [1, 2])
            ->get();

        $decks = [];
        foreach ($users as $user) {
            $deck = $user->decks()->first();
            $deckCards = $deck->deckCards()->orderBy('order')->get();

            $deckArray = [];
            foreach ($deckCards as $deckCard) {
                $deckArray[] = $deckCard->card_number;
            }
            $decks[] = $deckArray;
        }


        return response()->json([
            'players' => [
                [
                    'deck' => $decks[0],
                ],
                [
                    'deck' => $decks[1],
                ]
            ],
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
