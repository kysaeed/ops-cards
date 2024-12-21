<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Models\Duel;
use App\Models\Deck;
use App\Models\DeckCard;

class AuthController extends Controller
{
    public function login()
    {
        $user = Auth::user();
        if (!$user) {
            $user = DB::transaction(function () {
                $maxNumber = User::max('id') ?? 0;
                $maxNumber++;

                $user = new User([
                    'name' => "user{$maxNumber}",
                    'email' => "user{$maxNumber}@exampe.jp",
                    'password' => '1234',
                ]);

                $user->save();

                $defaultDeck = [
                    1, 1, 1, 2, 3, 4,
                ];

                $deck = new Deck([
                    'level' => 1,
                ]);

                $user->decks()->save($deck);

                $order = 1;
                foreach ($defaultDeck as $cardNumber) {

                    $deckCard = new DeckCard([
                        'card_number' => $cardNumber,
                        'order' => $order,
                    ]);

                    $deck->deckCards()->save($deckCard);

                    $order++;
                }

                $testDeckCard = 5;
                for ($j = 0; $j < 5; $j++) {
                    //$cardNumber = 5 + rand(0, 12);
                    $cardNumber = $testDeckCard;
                    $testDeckCard++;

                    $deckCard = new DeckCard([
                        'card_number' => $cardNumber,
                        'order' => $order,
                    ]);

                    $deck->deckCards()->save($deckCard);

                    $order++;
                }


                Duel::create([
                    'user_id' => $user->id,
                    'turn' => 1,
                    'deck_id' => $deck->id,
                    'enemy_deck_id' => 1,
                ]);


                Auth::login($user);

                return $user;
            });
        }


        return response()->json([
            'user' => $user,
        ]);
    }
}
