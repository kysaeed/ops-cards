<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Models\Duel;
use App\Models\Deck;
use App\Models\DeckCard;
use App\Models\GameSession;
use App\Models\Shop;
use App\Models\ShopCard;

class AuthController extends Controller
{
    public function login()
    {
        $user = Auth::user();
// $user = User::find(3);
// Auth::login($user);

        if (!$user) {
            $user = DB::transaction(function () {
                $maxNumber = User::max('id') ?? 0;
                $maxNumber++;

                $user = new User([
                    'name' => "user{$maxNumber}",
                    'email' => "user{$maxNumber}@exampe.jp",
                    'password' => '1234', //@todo
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


                $cardSettings = [];
                $string = file_get_contents(resource_path('settings/cards.json'));
                if (!empty($string)) {
                    $cardSettings = json_decode($string, true);
                }

                for ($j = 0; $j < 5; $j++) {
                    $count = count($cardSettings);
                    $cardNumber = mt_rand(5, $count - 1);

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


                $this->createShop($user);

                Auth::login($user, true);

                return $user;
            });
        }


        return response()->json([
            'user' => $user,
        ]);
    }

    protected function createShop(User $user)
    {
        $gameSession = new GameSession();
        $user->gameSesssions()->save($gameSession);


        $shop = new Shop();
        $gameSession->shops()->save($shop);

        $shopCards = [];
        for ($i = 1; $i <= 3; $i++) {
            $shopCard = new ShopCard();
            $shopCard->card_number = ($i + 5);
            $shopCard->order = $i;
            $shop->shopCards()->save($shopCard);
            $shopCards[] = $shopCard;
        }
    }
}
