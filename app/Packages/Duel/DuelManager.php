<?php
namespace App\Packages\Duel;


class DuelManager
{
    public const Player = 0;
    public const Enemy = 1;



    protected array $state;
    protected array $cardSettings;

    protected array $players;
    protected array $cardStackList; // @todo
    protected array $deckList;

    public function __construct(array $state, array $cardSettings)
    {
        $this->state = $state;
        $this->cardSettings = $cardSettings;

        $this->players = [
            0 => null,
            1 => null,
        ];

    }

    public function getState()
    {
        return $this->state;
    }

    public function initial()
    {
        $nextState = $this->state;

        foreach ($this->players as $i => $deck) {
            $this->players[$i] = Player::fromJson($nextState['players'][$i], $this->cardSettings);
        }

        foreach ($this->players as $i => $player) {
            $c = $this->players[$i]->getDeck()->draw();

            if ($c) {
                // $nextState['players'][$i]['handCardNumber'] = $c->getCardNumber();
                $player->getHandCard()->setCard($c);
            }
        }

        $turnPlayerIndex = $nextState['turnPalyerIndex'];
        $def = self::Enemy;
        if (!$turnPlayerIndex) {
            $def = self::Enemy;
        } else {
            $def = self::Player;
        }

        // 初期配置
        $initialCard = $this->players[$def]->getDeck()->draw();
        $this->players[$def]->getCardStack()->add($initialCard);

        // state
        $nextState['players'][self::Player] = $this->players[self::Player]->toJson();
        $nextState['players'][self::Enemy] = $this->players[self::Enemy]->toJson();
        $this->state = $nextState;

        return [
            'isResume' => false,
            'isPlayerTurn' => ($nextState['turnPalyerIndex'] ?? 0) === 0,
            'players' => [
                [
                    'handCardNumber' => $this->players[self::Player]->getHandCard()->toJson(),
                    'initialStackCards' => $this->players[self::Player]->getCardStack()->toJson(),
                    'cardCount' => $this->players[self::Player]->getDeck()->getCount(),
                    'initialBench' => $this->players[self::Player]->getBench()->toJson(),
                ],
                [
                    'handCardNumber' => $this->players[self::Enemy]->getHandCard()->toJson(),
                    'initialStackCards' => $this->players[self::Enemy]->getCardStack()->toJson(),
                    'cardCount' => $this->players[self::Enemy]->getDeck()->getCount(),
                    'initialBench' => $this->players[self::Enemy]->getBench()->toJson(),
                ],
            ],
        ];
    }

    public function resume()
    {

        $nextState = $this->state;

        foreach ($this->players as $i => $deck) {
            $this->players[$i] = Player::fromJson($nextState['players'][$i], $this->cardSettings);
        }

        return [
            'isResume' => true,
            'isPlayerTurn' => ($nextState['turnPalyerIndex'] ?? 0) === 0,
            'players' => [
                [
                    'handCardNumber' => $this->players[self::Player]->getHandCard()->toJson(),
                    'initialStackCards' => $this->players[self::Player]->getCardStack()->toJson(),
                    'cardCount' => $this->players[self::Player]->getDeck()->getCount(),
                    'initialBench' => $this->players[self::Player]->getBench()->toJson(),
                ],
                [
                    'handCardNumber' => $this->players[self::Enemy]->getHandCard()->toJson(),
                    'initialStackCards' => $this->players[self::Enemy]->getCardStack()->toJson(),
                    'cardCount' => $this->players[self::Enemy]->getDeck()->getCount(),
                    'initialBench' => $this->players[self::Enemy]->getBench()->toJson(),
                ],
            ],
        ];
    }

    protected function clearCardsBuf(array $cardStack)
    {
        $cards = [];
        foreach ($cardStack as $card) {
            $cards[] = $this->clearBuf($card);
        }

        return $cards;
    }

    protected function clearBuf(array $card)
    {
        return [
            'cardNumber' => $card['cardNumber'],
            'addPower' => 0,
        ];
    }

    public function subTurn(bool $isPlyaerTurn, bool $isHandCard)
    {
        $nextState = $this->state;

        /////
        foreach ($this->players as $i => $player) {
            $this->players[$i] = Player::fromJson($nextState['players'][$i], $this->cardSettings);
        }

        $jsonIndex = self::Player;
        $enemyJsonIndex = self::Enemy;
        if (!$isPlyaerTurn) {
            $jsonIndex = self::Enemy;
            $enemyJsonIndex = self::Player;
        }

        $drawCount = 0;
        $nextHandCardNumber = null;
        $nextHandCard = null;
        $card = null;
        if ($isHandCard) {
logger('*** isHandCard *** ');
            $card = $this->players[$jsonIndex]->getHandCard()->takeCard();
            $nextHandCard = $this->players[$jsonIndex]->getDeck()->draw();
            $this->players[$jsonIndex]->getHandCard()->setCard($nextHandCard);
            if ($nextHandCard) {
                $drawCount = 1;
            }

        } else {
logger('*** not hand card ...... *** ');
            $card = $this->players[$jsonIndex]->getDeck()->draw();
logger('====================');
logger($card?->getCardNumber());
logger('====================');
            if ($card) {
                $drawCount = 1;
            }
        }


        /////////
        $defCard = $this->players[$enemyJsonIndex]->getCardStack()->getTop();

        $judge = 0;
        if ($card) {

            // カードの登場時の処理を実行
            $enterResult = $this->onEnter($card, $this->players[$jsonIndex]->getCardStack(), $isPlyaerTurn);

            // $defenseCardNumber = $defenseCard['cardNumber'];
            $attackResult = $this->onAttack(
                $card,
                $enterResult,
                $this->players[$jsonIndex]->getCardStack(),
                $defCard,
            );

            $this->players[$jsonIndex]->getCardStack()->add($card);

            if ($attackResult) {
                if ($attackResult['isTurnChange']) {
                    // 攻撃側を防御側へ
                    $this->players[$jsonIndex]->getCardStack()->clearBuf();

                    // 防御側のカードをBenchへ
                    $stackCards = $this->players[$enemyJsonIndex]->getCardStack()->takeAll();
                    $this->players[$enemyJsonIndex]->getBench()->addCardList($stackCards);

                    // ターン交代
                    $nextState['turnPalyerIndex'] = (1 - $nextState['turnPalyerIndex']);
                }

                if ($attackResult['isTurnChange']) {
                    if ($this->players[$enemyJsonIndex]->getDeck()->isEmpty()) {
                        if ($this->players[$enemyJsonIndex]->getHandCard()->isEmpty()) {
                            $judge = 1;
                        }
                    }

                    if ($this->players[$enemyJsonIndex]->getBench()->getTypeCount() >= 8) {
                        $judge = 2;
                    }
                } else {
                    if ($this->players[$jsonIndex]->getDeck()->isEmpty()) {
                        if ($this->players[$jsonIndex]->getHandCard()->isEmpty()) {
                            $judge = -1;
                        }
                    }
                }
            }
        }

        ////// TEST //////
        // $judge = 1;
        //////////////////

        // state
        $nextState['players'][self::Player] = $this->players[self::Player]->toJson();
        $nextState['players'][self::Enemy] = $this->players[self::Enemy]->toJson();
        $this->state = $nextState;

        return [
            'judge' => $judge,
            'isHandCard' => $isHandCard,
            'isTurnChange' => $attackResult['isTurnChange'],
            'cardNumber' => $card->getCardNumber(), //$cardNumber,
            'ability' => $attackResult['ability'],
            'nextHnadCardNumber' => $nextHandCard?->getCardNumber(), //$nextHandCardNumber,
            'cardCount' => $this->players[$jsonIndex]->getDeck()->getCount(),
            'drawCount' => $drawCount,
            'order' => null,
        ];
    }

    protected function onAttack(Card $attackCard, array $ability, CardStack $attackCardStack, ?Card $defenseCard)
    {
        $attackCardStatus = $attackCard->getStatus();
        $defenseCardStatus = $defenseCard->getStatus();

        // prevAttackPowerをstackから計算する
        $prevAttackPower = $attackCardStack->getTotalPower();

        // 攻撃力の加算を初期化
        $ability['attack']['power'] = $ability['attack']['power'] ?? 0;
        $ability['defense']['power'] = $ability['defense']['power'] ?? 0;

        $addAttackPower = 0;
        $attackAbility = $attackCardStatus['ability']['attack'] ?? null;
        if ($attackAbility) {
            $addAttackPower = $attackAbility['power'] ?? 0;
            $ability['attack']['power'] = $addAttackPower;
            $attackCard->setAddPower($addAttackPower);
        }

        $totalAttackPower = $attackCard->getTotalPower() + $prevAttackPower;

        $addDefensePower = 0;
        $defenseAbility = $defenseCardStatus['ability']['defense'] ?? null;
        if ($defenseAbility) {
            $addDefensePower = $defenseAbility['power'] ?? 0;
            $defenseCard->setAddPower($addDefensePower);
            $ability['defense']['power'] = $addDefensePower;
        }

        $totalDefensePower = $defenseCard->getTotalPower();

        // 勝敗判定
        $judge = 0;

        // ターンの入れ替えをチェック
        $isTurnChange = false;
        if ($totalAttackPower >= $totalDefensePower) {
            $isTurnChange = true;
        }

        return [
            'judge' => $judge,
            'isTurnChange' => $isTurnChange,
            'attackPower' => $totalAttackPower,
            'defensePower' => $totalDefensePower,
            'ability' => $ability,
        ];
    }

    protected function onEnter(Card $card, CardStack $cardStack, bool $isPlayer): array
    {
        $cardStatus = $card->getStatus();
        $ability = $cardStatus['ability'] ?? null;

        if (!$ability || !($ability['enter'] ?? null)) {
            return [
                'attack' => ['power' => 0],
                'defense' => ['power' => 0],
            ];
        }

        $enterAbility = $ability['enter'];

        $enterAbilityResult = [];

        $discard = $enterAbility['discard'] ?? [];
        if (!empty($discard)) {
            $target = $discard['target'];

            // discared処理
            $currentPlayerIndex = $isPlayer ? self::Player : self::Enemy;
            $enemyPlayerIndex = (1 - $currentPlayerIndex);
            $isPlayerTarget = $target['isPlayer'] ?? true;

            // 相手カードの情報を取得
            $targetPlayerIndex = $currentPlayerIndex;
            if (!$isPlayerTarget) {
                $targetPlayerIndex = $enemyPlayerIndex;
            }

            $targetPlayer = $this->players[$targetPlayerIndex];

            // ベンチから対象タイプのカードを取り出す
            $bench = $targetPlayer->getBench();
            $takenCard = null;
            if (!is_null($target['type'] ?? null)) {
                $takenCard = $bench->takeCardByType($target['type']);
            } else if (!is_null($target['cardNumber'] ?? null)) {
                $takenCard = $bench->takeCardByNumber($target['cardNumber']);
            }

            // カードを取り出せた場合、cardNumberを設定
            if ($takenCard) {
                $enterAbilityResult['discard'] = [
                    'cardNumber' => $takenCard->getCardNumber(),
                    'isPlayer' => $isPlayerTarget,
                    'benchCardType' => $target['type'] ?? null,
                ];
            }
        }

        $recycle = $enterAbility['recycle'] ?? [];

        if (!empty($recycle)) {
            // recycleの処理

            $target = $recycle['target'];

            $currentPlayerIndex = $isPlayer ? self::Player : self::Enemy;
            $enemyPlayerIndex = (1 - $currentPlayerIndex);
            $isPlyaerTarget = $target['isPlayer'] ?? true;

            $targetPlayerIndex = $currentPlayerIndex;
            if (!$isPlyaerTarget) {
                $targetPlayerIndex = $enemyPlayerIndex;
            }

            $targetPlayer = $this->players[$targetPlayerIndex];

            logger('** *discared処理 *** ');
            logger($target);

            // ベンチから対象タイプのカードを取り出す
            $bench = $targetPlayer->getBench();
            $takenCard = null;

            if (!is_null($target['type'] ?? null)) {
                $takenCard = $bench->takeCardByType($target['type']);
            } else if (!is_null($target['cardNumber'] ?? null)) {
                $takenCard = $bench->takeCardByNumber($target['cardNumber']);
            }

            // カードを取り出せた場合、cardNumberを設定
            if ($takenCard) {

                // toDeckBottomがtrueならデッキの一番下に戻す
                $targetPlayer->getDeck()->addToBottom($takenCard);

                $enterAbilityResult['recycle'] = [
                    'cardNumber' => $takenCard->getCardNumber(),
                    'isPlayer' => $isPlyaerTarget,
                    'benchCardType' => $target['type'] ?? null,
                    'deckCount' => $targetPlayer->getDeck()->getCount(),
                ];
            }
        }

        return [
            'attack' => ['power' => 0],
            'defense' => ['power' => 0],
            'enter' => $enterAbilityResult,
        ];
    }

}