<?php

namespace App\Packages\GameMaster;

use App\Models\Deck;
use App\Models\DeckCard;
use App\Models\Duel;
use App\Models\GameSession;
use App\Models\GameSessionSection;
use App\Models\GameSessionSectionStep;
use App\Models\Shop;
use App\Models\ShopCard;
use App\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\DB;

class GameMaster
{
    protected array $cardSettings;
    protected User $user;

    public function __construct(User $user)
    {
        $this->user = $user;
        $this->cardSettings = [];
        $string = file_get_contents(resource_path('settings/cards.json'));
        if (!empty($string)) {
            $this->cardSettings = json_decode($string, true);
        }
    }

    /**
     * ユーザーのゲームセッションを初期化
     */
    public function initializeGameSessionForUser(): GameSession
    {
        $user = $this->user;

        $gameSession = new GameSession();
        $user->gameSessions()->save($gameSession);

        $gameSessionSection = new GameSessionSection();
        $gameSessionSection->order = 1;
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

        return $gameSession;
    }



    /**
     * 初期デッキを作成
     */
    protected function createInitialDeck(GameSessionSection $gameSessionSection)
    {
        $deck = new Deck([
            //'level' => 1,
        ]);


        $gameSessionSection->deck()->save($deck);

        $defaultDeck = config('game.player.defaultDeck');

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


    /**
     * すべてのゲームセッションを終了する
     */
    public function closeAllGameSession(): void
    {
        $this->user->gameSessions()->delete();
    }

    /**
     * ゲームセッションを終了する
     */
    public function closeGameSession(User $user): void
    {
        $gameSession = $user->gameSessions()
            ->active()
            ->first();

        if (!$gameSession) {
            return;
        }

        $gameSession->compleated_at = CarbonImmutable::now();
        $gameSession->save();
    }

    public function closeGameSessionSection(User $user): void
    {
        $gameSession = $user->gameSessions()
            ->active()
            ->first();

        if (!$gameSession) {
            return;
        }

        $gameSessionSection = $gameSession->gameSessionSections()
            ->active()
            ->first();

        if (!$gameSessionSection) {
            return;
        }

        $gameSessionSection->compleated_at = CarbonImmutable::now();
        $gameSessionSection->save();

    }

    public function hasGameSessionSection(): bool
    {
        $user = $this->user;

        $gameSession = $user->gameSessions()
            ->active()
            ->first();

        if (!$gameSession) {
            return false;
        }

        return $gameSession->gameSessionSections()
            ->active()
            ->exists();
    }

    public function hasGameSessionSectionSteps(User $user): bool
    {
        $gameSession = $user->gameSessions()
            ->active()
            ->first();

        if (!$gameSession) {
            return false;
        }

        $gameSessionSection = $gameSession->gameSessionSections()
            ->active()
            ->first();

        if (!$gameSessionSection) {
            return false;
        }

        return $gameSessionSection->gameSessionSectionSteps()
            ->active()
            ->exists();
    }


}