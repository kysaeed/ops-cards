<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Arr;

class DuelController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {

        $defaultDeck = [
            1, 1, 1, 2, 3, 4,
        ];

        $decks = [];
        for ($i = 0; $i < 2; $i++) {
            $decks[$i] = $defaultDeck;
            for ($j = 0; $j < 5; $j++) {
                //
                $decks[$i][] = 5 + rand(0, 8);
            }
            $decks[$i] = Arr::shuffle($decks[$i]);
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
