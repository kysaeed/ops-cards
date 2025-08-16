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
     * ゲームセッションを初期化する
     */
    public function initializeGameSession(User $user): GameSession
    {
        return DB::transaction(function () use ($user) {
            // ゲームセッションの初期化
            $gameSession = $this->initializeGameSessionForUser($user);

            // ゲームセクションの初期化
            $gameSessionSection = $this->initializeGameSessionSection($gameSession);

            // ゲームセクションステップの初期化?
            // $this->initializeGameSessionSectionSteps($gameSessionSection);

            // ショップステップの初期化
            $this->initializeShopStep($gameSessionSection);

            // デュエルステップの初期化
            $this->initializeDuelSteps($gameSessionSection);

            return $gameSession;

            // return [
            //     'game_session_id' => $gameSession->id,
            //     'game_session_section_id' => $gameSessionSection->id,
            // ];
        });
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

    public function hasGameSessionSection(User $user): bool
    {
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

    /**
     * ユーザーのゲームセッションを初期化
     */
    protected function initializeGameSessionForUser(User $user): GameSession
    {
        $gameSession = $user->gameSessions()
            ->active()
            ->first();

        if (!$gameSession) {
            $gameSession = new GameSession();
            $user->gameSessions()->save($gameSession);
        }

        return $gameSession;
    }

    /**
     * ゲームセクションを初期化
     */
    protected function initializeGameSessionSection(GameSession $gameSession): GameSessionSection
    {
        $gameSessionSection = $gameSession->gameSessionSections()
            ->active()
            ->first();

        if (!$gameSessionSection) {
            $deck = $this->createInitialDeck($gameSession->user);

            $gameSessionSection = new GameSessionSection([
                'order' => 1,
                'deck_id' => $deck->id,
            ]);
            $gameSession->gameSessionSections()->save($gameSessionSection);
        }

        return $gameSessionSection;
    }

    /**
     * ゲームセクションステップを初期化
     */
    protected function initializeGameSessionSectionSteps(GameSessionSection $gameSessionSection): void
    {
        // ショップステップの初期化
        if (!$gameSessionSection->gameSessionSectionSteps()
            ->whereNull('compleated_at')
            ->whereNotNull('shop_id')
            ->exists()) {

            $shop = $this->createShop();

            $shopStep = new GameSessionSectionStep([
                'order' => 1,
                'shop_id' => $shop->id
            ]);
            $gameSessionSection->gameSessionSectionSteps()->save($shopStep);
        }

        // デュエルステップの初期化
        if (!$gameSessionSection->gameSessionSectionSteps()
            ->whereNull('compleated_at')
            ->whereNotNull('duel_id')
            ->exists()) {

            for ($i = 0; $i < 3; $i++) {
                $duel = $this->createDuel($gameSessionSection);

                $duelStep = new GameSessionSectionStep([
                    'order' => $i + 2, // ショップの後に配置
                    'duel_id' => $duel->id
                ]);
                $gameSessionSection->gameSessionSectionSteps()->save($duelStep);
            }
        }
    }

    /**
     * ショップステップを初期化
     */
    protected function initializeShopStep(GameSessionSection $gameSessionSection)
    {
        if (!$gameSessionSection->gameSessionSectionSteps()
            ->whereNull('compleated_at')
            ->whereNotNull('shop_id')
            ->exists()) {

            $shop = $this->createShop();

            $shopStep = new GameSessionSectionStep([
                'order' => 1,
                'shop_id' => $shop->id
            ]);
            $gameSessionSection->gameSessionSectionSteps()->save($shopStep);
        }
    }

    /**
     * デュエルステップを初期化
     */
    protected function initializeDuelSteps(GameSessionSection $gameSessionSection)
    {
        if (!$gameSessionSection->gameSessionSectionSteps()
            ->whereNull('compleated_at')
            ->whereNotNull('duel_id')
            ->exists()) {

            for ($i = 0; $i < 3; $i++) {
                $duel = $this->createDuel($gameSessionSection);

                $duelStep = new GameSessionSectionStep([
                    'order' => $i + 2, // ショップの後に配置
                    'duel_id' => $duel->id
                ]);
                $gameSessionSection->gameSessionSectionSteps()->save($duelStep);
            }
        }
    }

    /**
     * 初期デッキを作成
     */
    protected function createInitialDeck(User $user): Deck
    {
        $deck = new Deck([
            'level' => 1,
        ]);
        $user->decks()->save($deck);

        // デフォルトデッキの作成
        $defaultDeck = [1, 1, 1, 2, 3, 4];
        $order = 1;

        // デフォルトカードの追加
        foreach ($defaultDeck as $cardNumber) {
            $deckCard = new DeckCard([
                'card_number' => $cardNumber,
                'order' => $order++
            ]);
            $deck->deckCards()->save($deckCard);
        }

        return $deck;
    }

    /**
     * デュエルを作成
     */
    protected function createDuel(GameSessionSection $gameSessionSection): Duel
    {
        $duel = new Duel([
            'user_id' => $gameSessionSection->gameSession->user_id,
            'turn' => 1,
            'deck_id' => $gameSessionSection->deck->id,
            'enemy_deck_id' => 2, // 敵の固定デッキID
        ]);
        $duel->save();

        return $duel;
    }

    /**
     * ショップを作成
     */
    protected function createShop(): Shop
    {
        $shop = new Shop();
        $shop->save();

        // 5枚のカードを生成
        for ($i = 1; $i <= 5; $i++) {
            $cardNumber = mt_rand(5, count($this->cardSettings));
            $shopCard = new ShopCard([
                'card_number' => $cardNumber,
                'order' => $i
            ]);
            $shop->shopCards()->save($shopCard);
        }

        return $shop;
    }
}