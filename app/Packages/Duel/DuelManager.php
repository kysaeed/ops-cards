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
                $nextState['players'][$i]['handCardNumber'] = $c->getCardNumber();
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

        $initialCardStackTop = array_shift($nextState['players'][$def]['deckCardNumbers']);

        $nextState['players'][$def]['cardStack'][] = [
            'cardNumber' => $initialCardStackTop,
            'addPower' => 0,
        ];


        // 初期配置
        $initialCard = $this->players[$def]->getDeck()->draw();
        $this->players[$def]->getCardStack()->add($initialCard);


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

        $nextHandCardNumber = null;
        $nextHandCard = null;
        $card = null;
        if ($isHandCard) {

            $cardNumber = $nextState['players'][$jsonIndex]['handCardNumber'];
            $nextHandCardNumber = array_shift($nextState['players'][$jsonIndex]['deckCardNumbers']);
            $nextState['players'][$jsonIndex]['handCardNumber'] = $nextHandCardNumber;

            $card = $this->players[$jsonIndex]->getHandCard()->takeCard();
            $nextHandCard = $this->players[$jsonIndex]->getDeck()->draw();
            $this->players[$jsonIndex]->getHandCard()->setCard($nextHandCard);


        } else {
            $cardNumber = array_shift($nextState['players'][$jsonIndex]['deckCardNumbers']);
            $card = $this->players[$jsonIndex]->getDeck()->draw();
        }

        // $cardCount = count($nextState['players'][$jsonIndex]['deckCardNumbers']);
        $cardCount = $this->players[$jsonIndex]->getDeck()->getCount();

        /////////
        $prevAttackPower = $nextState['players'][$jsonIndex]['cardStackPower'];
        $defCard = $this->players[$enemyJsonIndex]->getCardStack()->getTop();

        $judge = 0;
        if ($card) {
            // $defenseCardNumber = $defenseCard['cardNumber'];
            $attackResult = $this->onAttack(
                $card,
                $prevAttackPower,
                $defCard,
            );

            array_unshift($nextState['players'][$jsonIndex]['cardStack'], [
                'cardNumber' => $cardNumber,
                'addPower' => $attackResult['addAttackPower'],
            ]);

            $this->players[$jsonIndex]->getCardStack()->add($card);


            if ($attackResult) {
                if (!$attackResult['isTurnChange']) {
                    $nextState['players'][$jsonIndex]['cardStackPower'] = $attackResult['attackPower'];

                } else {
                    // 交代時に積み直す
                    $nextState['players'][$jsonIndex]['cardStackPower'] = 0;
                    $nextState['players'][$jsonIndex]['cardStack'] = $this->clearCardsBuf($nextState['players'][$jsonIndex]['cardStack']);


                    $nextState['turnPalyerIndex'] = (1 - $nextState['turnPalyerIndex']);
                    $defenseBench = $nextState['players'][$enemyJsonIndex]['benchCardNumbers'];
// logger('******');
// logger($defenseBench);
                    $defenseStackCards = ($nextState['players'][$enemyJsonIndex]['cardStack']);


                    $nextState['players'][$enemyJsonIndex]['benchCardNumbers'] = $this->addCardsToBench(
                        $defenseStackCards,
                        $defenseBench,
                    );


                    $nextState['players'][$enemyJsonIndex]['cardStack'] = [];

                    /**
                     * @todo
                     */
                    //$st = $this->cardStackList[$enemyJsonIndex]->takeAll();
                }

                if ($attackResult['isTurnChange']) {
                    if (empty($nextState['players'][$enemyJsonIndex]['deckCardNumbers'])) {
                        if (empty($nextState['players'][$enemyJsonIndex]['handCardNumber'])) {
                            $judge = 1;
                        }
                    }

                    if (count($nextState['players'][$enemyJsonIndex]['benchCardNumbers']) >= 8) {
                        $judge = 2;
                    }
                } else {
                    if (empty($nextState['players'][$jsonIndex]['deckCardNumbers'])) {
                        if (empty($nextState['players'][$jsonIndex]['handCardNumber'])) {
                            $judge = -1;
                        }
                    }
                }

            }
        }


        $this->state = $nextState;

        return [
            'judge' => $judge,
            'isHandCard' => $isHandCard,
            'isTurnChange' => $attackResult['isTurnChange'],
            'cardNumber' => $cardNumber,
            'addAttackPower' => $attackResult['addAttackPower'],
            'ability' => $attackResult['ability'],
            'nextHnadCardNumber' => $nextHandCardNumber,
            'cardCount' => $cardCount,
            'order' => null,
        ];
    }

    protected function onAttack(Card $attackCard, int $prevAttackPower, ?Card $defenseCard)
    {

        $attackCardNumber = $attackCard->getCardNumber();
        $defenseCardNumber = $defenseCard?->getCardNumber();


        $attackCardStatus = $attackCard->getStatus();
        $defenseCardStatus = $defenseCard->getStatus();

        $ability = [
            'attack' => [],
            'defense' => [],
        ];

        $addAttackPower = 0;
        $attackAbility = $attackCardStatus['ability']['attack'] ?? null;
        if ($attackAbility) {

            $addAttackPower = $attackAbility['power'] ?? 0;
            if ($addAttackPower) {
                $ability['attack']['power'] = $addAttackPower;
            }
        }

        $attackPower = $attackCard->getPower();

        $totalAttackPower = ($attackPower + $addAttackPower) + $prevAttackPower;

        $defensePower = $defenseCard->getPower();
        $addDefensePower = 0;
        $defenseAbility = $defenseCardStatus['ability']['defense'] ?? null;
        if ($defenseAbility) {
            $addDefensePower = $defenseAbility['power'];
            $ability['defense']['power'] = $addDefensePower;
        }

        $totalDefensePower = $defensePower + $addDefensePower;


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
            'addAttackPower' => $addAttackPower,
            'addDefensePower' => $addDefensePower,
            'defensePower' => $totalDefensePower,
            'addDefensePower' => $addDefensePower,
            'ability' => $ability,
        ];
    }

    protected function addCardsToBench(array $addCardList, array $bench): array
    {
        foreach ($addCardList as $addCard) {
            $isAppended = false;
            foreach ($bench as &$benchElement) {
                if (empty($benchElement)) {
                    $benchElement[] = $addCard;
                    $isAppended = true;
                } elseif ($benchElement[0] === $addCard) {
                    $benchElement[] = $addCard;
                    $isAppended = true;
                }
            }
            if (!$isAppended) {
                $bench[] = [$addCard];
            }
        }
        return $bench;
    }
}