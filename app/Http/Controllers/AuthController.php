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
    protected array $cardSettings;

    public function __construct()
    {
        $this->cardSettings = [];
        $string = file_get_contents(resource_path('settings/cards.json'));
        if (!empty($string)) {
            $this->cardSettings = json_decode($string, true);
        }

    }

    protected function createInitialData(User $user)
    {
        $gameSession = $user->gameSessions()
            ->first();

        if (!$gameSession) {
            $gameSession = new GameSession();
            $user->gameSessions()->save($gameSession);
        }

        $duel = $gameSession->duels()
            ->whereNull('compleated_at')
            ->where('user_id', $user->id)
            ->first();

        if (!$duel) {
            $deck = $this->createInitialDeck($user);
            $duel = new Duel([
                'turn' => 1,
                'user_id' => $user->id,
                'turn' => 1,
                'deck_id' => $deck->id,
                'enemy_deck_id' => 2,
            ]);
            $gameSession->duels()->save($duel);
        }
    }

    protected function createInitialDeck(User $user)
    {
        return DB::transaction(function () use ($user) {
            $deck = new Deck([
                'level' => 1,
            ]);


            $user->decks()->save($deck);

            $defaultDeck = [
                1, 1, 1, 2, 3, 4,
            ];

            $order = 1;
            foreach ($defaultDeck as $cardNumber) {

                $deckCard = new DeckCard([
                    'card_number' => $cardNumber,
                    'order' => $order,
                ]);

                $deck->deckCards()->save($deckCard);

                $order++;
            }

            /*
            for ($j = 0; $j < 5; $j++) {
                $count = count($this->cardSettings);
                $cardNumber = mt_rand(5, $count);

                $deckCard = new DeckCard([
                    'card_number' => $cardNumber,
                    'order' => $order,
                ]);

                $deck->deckCards()->save($deckCard);

                $order++;
            }
            */

            return $deck;

        });

    }

    public function login()
    {
        $user = Auth::user();
// $user = User::find(3);
// Auth::login($user);

        $state = 0;
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

                $this->createInitialData($user);

                $this->createShop($user);

                Auth::login($user, true);

                return $user;
            });
        }

        $gameSession = $user->gameSessions()
            ->whereNull('game_sessions.disabled_at')
            ->first();

        $state = 0;
        if ($gameSession->shops()->exists()) {
            $state = 1;
        } elseif ($gameSession->duels()->exists()) {
            $state = 2;
        }

        return response()->json([
            'user' => $user,
            'state' => $state,
        ]);
    }

    protected function createShop(User $user)
    {

        $gameSession = $user->gameSessions()
            ->whereNull('disabled_at')
            ->first();

        if (!$gameSession) {
            $gameSession = new GameSession();
            $user->gameSessions()->save($gameSession);
        }

        $shop = new Shop();
        $gameSession->shops()->save($shop);

        $shopCards = [];
        for ($i = 1; $i <= 5; $i++) {
            $cardNumber = mt_rand(5, count($this->cardSettings));

            $shopCard = new ShopCard();
            $shopCard->card_number = $cardNumber;
            $shopCard->order = $i;
            $shop->shopCards()->save($shopCard);
            $shopCards[] = $shopCard;
        }
    }
}
