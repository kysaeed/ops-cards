<?php

namespace App\Http\Controllers;

use App\Models\Deck;
use App\Models\DeckCard;
use App\Models\Duel;
use App\Models\GameSession;
use App\Models\GameSessionSection;
use App\Models\GameSessionSectionStep;
use App\Models\Shop;
use App\Models\ShopCard;
use App\Models\User;
use App\Packages\GameMaster\GameMaster;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class AuthController extends Controller
{
    protected array $cardSettings;
    //protected GameMaster $gameMaster;

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
        $user->gameSessions()->delete();

        // $gameSession = $user->gameSessions()
        //     ->active()
        //     ->first();

        $gameSession = new GameSession();
        $user->gameSessions()->save($gameSession);

        // $gameSessionSection = $gameSession->gameSessionSections()
        //     ->active()
        //     ->orderBy('order')
        //     ->first();

        $gameSessionSection = new GameSessionSection();
        $gameSessionSection->order = 1;
        // $gameSessionSection->deck_id = $deck->id;
        $gameSession->gameSessionSections()
            ->save($gameSessionSection);

        $deck = $this->createInitialDeck($gameSessionSection);


        $order = 1;


        $gameSessionSectionsStep = new GameSessionSectionStep([
            'order' => $order++,
        ]);
        $gameSessionSectionsStep->fill([
        ]);
        //$gameSessionSectionsStep->shop_id = $shop->id;
        $gameSessionSection->gameSessionSectionSteps()
            ->save($gameSessionSectionsStep);

        $shop = $this->createShop($gameSessionSectionsStep);


        // $duelStep = $gameSessionSection->gameSessionSectionSteps()
        //     ->whereNull('compleated_at')
        //     //->whereNotNull('duel_id')
        //     ->orderBy('order')
        //     ->first();
        // $duel = $gameSession->duels()
        //     ->whereNull('compleated_at')
        //     ->where('user_id', $user->id)
        //     ->first();


        for ($i = 0; $i < 3; $i++) {

            $gameSessionSectionsStep = new GameSessionSectionStep();
            $gameSessionSectionsStep->fill([
                // 'duel_id' => $duel->id,
                'order' => $order++,
            ]);
            $gameSessionSection->gameSessionSectionSteps()
                ->save($gameSessionSectionsStep);

                $duel = new Duel([
                    //'turn' => 1,
                    'user_id' => $user->id,
                    'game_session_section_step_id' => $gameSessionSectionsStep->id,
                    'turn' => 1,
                    'deck_id' => $gameSessionSection->deck->id,
                    'enemy_deck_id' => 2,
                ]);
                $duel->save();

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

    protected function createInitialDeck(GameSessionSection $gameSessionSection)
    {
        return DB::transaction(function () use ($gameSessionSection) {
            $deck = new Deck([
                //'level' => 1,
            ]);


            $gameSessionSection->deck()->save($deck);

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

            return $deck;

        });

    }

    public function login()
    {
logger('179: AuthController::login() -----');
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

                $this->createInitialData($user);


                Auth::login($user, /*true*/);

                return $user;
            });
        }

        $gameMaster = new GameMaster($user);



        $gameSession = $user->gameSessions()
            ->active()
            ->first();

logger('210: gameSession ----- id:' . $user?->id);
logger($gameSession);


        $gameMaster = new GameMaster($user);
        if (!$gameMaster->hasGameSessionSection($user)) {
logger('217: NO gameSession....');
            $gameSession = $gameMaster->initializeGameSession($user);

            // $this->createInitialData($user);
            // $gameSession = $user->gameSessions()
            //     ->active()
            //     ->first();
        }

        $gameSessionSection = $gameSession->gameSessionSections()
            ->active()
            ->first();
logger('GAME SESSION SECTION *********');
logger($gameSessionSection?->toArray());

        $gameSessionSectionStep = $gameSessionSection->gameSessionSectionSteps()
            ->active()
            ->first();
logger('GAME SESSION SECTION STEP *********');
logger($gameSessionSectionStep?->toArray());

        $state = 0;

        // @todo 逆のリレーションになおす
        if ($gameSessionSectionStep->shop) {
            $state = 1;
        } elseif ($gameSessionSectionStep->duel) {
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

    protected function createShop(GameSessionSectionStep $gameSessionSectionStep)
    {

        // $gameSession = $user->gameSessions()
        //     ->whereNull('compleated_at')
        //     ->first();

        // if (!$gameSession) {
        //     $gameSession = new GameSession();
        //     $user->gameSessions()->save($gameSession);
        // }

        $shop = new Shop([
            'game_session_section_step_id' => $gameSessionSectionStep->id,
        ]);
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
