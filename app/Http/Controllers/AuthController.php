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
use App\Models\GameSessionSection;
use App\Models\GameSessionSectionStep;
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
            ->active()
            ->first();

        if (!$gameSession) {
            $gameSession = new GameSession();
            $user->gameSessions()->save($gameSession);
        }

        $gameSessionSection = $gameSession->gameSessionSections()
            ->active()
            ->orderBy('order')
            ->first();
        if (!$gameSessionSection) {

            $deck = $this->createInitialDeck($user);

            $gameSessionSection = new GameSessionSection();
            $gameSessionSection->order = 1;
            $gameSessionSection->deck_id = $deck->id;
            $gameSession->gameSessionSections()
                ->save($gameSessionSection);
        }

        $order = 1;

        $shopStep =  $gameSessionSection->gameSessionSectionSteps()
            ->whereNull('compleated_at')
            ->whereNotNull('shop_id')
            ->orderBy('order')
            ->first();

        if (!$shopStep) {
            $shop = $this->createShop($user);

            $gameSessionSectionsStep = new GameSessionSectionStep([
                'order' => $order++,
            ]);
            $gameSessionSectionsStep->fill([
            ]);
            $gameSessionSectionsStep->shop_id = $shop->id;
            $gameSessionSection->gameSessionSectionSteps()
                ->save($gameSessionSectionsStep);
        }


        $duelStep = $gameSessionSection->gameSessionSectionSteps()
            ->whereNull('compleated_at')
            ->whereNotNull('duel_id')
            ->orderBy('order')
            ->first();

        // $duel = $gameSession->duels()
        //     ->whereNull('compleated_at')
        //     ->where('user_id', $user->id)
        //     ->first();
        if (!$duelStep) {

            for ($i = 0; $i < 3; $i++) {

                $duel = new Duel([
                    //'turn' => 1,
                    'user_id' => $user->id,
                    'turn' => 1,
                    'deck_id' => $gameSessionSection->deck->id,
                    'enemy_deck_id' => 2,
                ]);
                $duel->save();

                $gameSessionSectionsStep = new GameSessionSectionStep();
                $gameSessionSectionsStep->fill([
                    'duel_id' => $duel->id,
                    'order' => $order++,
                ]);
                $gameSessionSection->gameSessionSectionSteps()
                    ->save($gameSessionSectionsStep);
            }

        }

        // if (!$duel) {
        //     $deck = $this->createInitialDeck($user);
        //     $duel = new Duel([
        //         'turn' => 1,
        //         'user_id' => $user->id,
        //         'turn' => 1,
        //         'deck_id' => $deck->id,
        //         'enemy_deck_id' => 2,
        //     ]);
        //     $gameSession->duels()->save($duel);
        // }
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


                Auth::login($user, true);

                return $user;
            });
        }

        $gameSession = $user->gameSessions()
            ->active()
            ->first();

        if (!$gameSession) {
            $this->createInitialData($user);

            $gameSession = $user->gameSessions()
                ->active()
                ->first();
        }

        $gameSessionSection = $gameSession->gameSessionSections()
            ->active()
            ->first();

        $gameSessionSectionStep = $gameSessionSection->gameSessionSectionSteps()
            ->active()
            ->first();

        $state = 0;
        if ($gameSessionSectionStep->shop_id) {
            $state = 1;
        } elseif ($gameSessionSectionStep->duel_id) {
            $state = 2;
        }

        /*
        if ($gameSession->shops()->whereNull('compleated_at')->exists()) {
            $state = 1;
        } elseif ($gameSession->duels()->whereNull('compleated_at')->exists()) {
            $state = 2;
        }
        */

        return response()->json([
            'user' => $user,
            'state' => $state,
        ]);
    }

    protected function createShop(User $user)
    {

        // $gameSession = $user->gameSessions()
        //     ->whereNull('compleated_at')
        //     ->first();

        // if (!$gameSession) {
        //     $gameSession = new GameSession();
        //     $user->gameSessions()->save($gameSession);
        // }

        $shop = new Shop();
        $shop->save();

        $shopCards = [];
        for ($i = 1; $i <= 5; $i++) {
            $cardNumber = mt_rand(5, count($this->cardSettings));

            $shopCard = new ShopCard();
            $shopCard->card_number = $cardNumber;
            $shopCard->order = $i;
            $shop->shopCards()->save($shopCard);
            $shopCards[] = $shopCard;
        }

        return $shop;
    }
}
