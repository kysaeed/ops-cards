<?php
namespace App\Packages;

class DuelManager
{
    public const Player = 0;
    public const Enemy = 1;

    protected array $state;
    protected array $cardSettings;

    public function __construct(array $state, array $cardSettings)
    {
        $this->state = $state;
        $this->cardSettings = $cardSettings;

    }

    public function getState()
    {
        return $this->state;
    }

    public function initial()
    {

        $nextState = $this->state;
        foreach ($nextState['players'] as &$player) {
            $player['handCardNumber'] = array_shift($player['deckCardNumbers']);

        }

        $turnPlayerIndex = $nextState['turnPalyerIndex'];
        $def = self::Enemy;
        if (!$turnPlayerIndex) {
            $def = self::Enemy;
        } else {
            $def = self::Player;
        }

        $initialCardStack = array_shift($nextState['players'][$def]['deckCardNumbers']);

        $nextState['players'][$def]['cardStack'][] = [
            'cardNumber' => $initialCardStack,
        ];

        $this->state = $nextState;

        /*
        $this->onAttack(
            $nextState['players'][self::Player]['handCardNumber'],
            0,
            $initialCardStack,
        );
        */

        return [
            'isResume' => false,
            'isPlayerTurn' => ($nextState['turnPalyerIndex'] ?? 0) === 0,
            'players' => [
                [
                    //
                    //'deck' => null,
                    'handCardNumber' => $nextState['players'][self::Player]['handCardNumber'],
                    'initialStackCards' => [],
                    'cardCount' => count($nextState['players'][self::Player]['deckCardNumbers']),
                    'initialBench' => $nextState['players'][self::Player]['benchCardNumbers'],
                ],
                [
                    //
                    //'deck' => null,
                    'handCardNumber' => $nextState['players'][self::Enemy]['handCardNumber'],
                    'initialStackCards' => [$initialCardStack],
                    'cardCount' => count($nextState['players'][self::Enemy]['deckCardNumbers']),
                    'initialBench' => [],
                    'initialBench' => $nextState['players'][self::Enemy]['benchCardNumbers'],
                ],
            ],
        ];
    }

    public function resume()
    {

        $nextState = $this->state;

        /*
        foreach ($nextState['players'] as &$player) {
            $player['handCardNumber'] = array_shift($player['deckCardNumbers']);

        }

        $turnPlayerIndex = $nextState['turnPalyerIndex'];
        $def = self::Enemy;
        if (!$turnPlayerIndex) {
            $def = self::Enemy;
        } else {
            $def = self::Player;
        }

        $initialCardStack = array_shift($nextState['players'][$def]['deckCardNumbers']);
        $nextState['players'][$def]['cardStack'][] = $initialCardStack;

        $this->state = $nextState;
        */

        return [
            'isResume' => true,
            'isPlayerTurn' => ($nextState['turnPalyerIndex'] ?? 0) === 0,
            'players' => [
                [
                    //
                    //'deck' => null,
                    'handCardNumber' => $nextState['players'][self::Player]['handCardNumber'],
                    'initialStackCards' => $nextState['players'][self::Player]['cardStack'],
                    'cardCount' => count($nextState['players'][self::Player]['deckCardNumbers']),
                    'initialBench' => $nextState['players'][self::Player]['benchCardNumbers'],
                ],
                [
                    //
                    //'deck' => null,
                    'handCardNumber' => $nextState['players'][self::Enemy]['handCardNumber'],
                    'initialStackCards' => $nextState['players'][self::Enemy]['cardStack'],
                    'cardCount' => count($nextState['players'][self::Enemy]['deckCardNumbers']),
                    'initialBench' => $nextState['players'][self::Enemy]['benchCardNumbers'],
                ],
            ],
        ];
    }

    public function subTurn(bool $isPlyaerTurn, bool $isHandCard)
    {
        $nextState = $this->state;

        $jsonIndex = self::Player;
        $enemyJsonIndex = self::Enemy;
        if (!$isPlyaerTurn) {
            $jsonIndex = self::Enemy;
            $enemyJsonIndex = self::Player;
        }

        $nextHandCardNumber = null;
        if ($isHandCard) {
            $cardNumber = $nextState['players'][$jsonIndex]['handCardNumber'];
            $nextHandCardNumber = array_shift($nextState['players'][$jsonIndex]['deckCardNumbers']);
            $nextState['players'][$jsonIndex]['handCardNumber'] = $nextHandCardNumber;

        } else {
            $cardNumber = array_shift($nextState['players'][$jsonIndex]['deckCardNumbers']);
        }

        if ($cardNumber) {
            array_unshift($nextState['players'][$jsonIndex]['cardStack'], [
                'cardNumber' => $cardNumber,
            ]);

        }

        $cardCount = count($nextState['players'][$jsonIndex]['deckCardNumbers']);

        /////////
        $prevAttackPower = $nextState['players'][$jsonIndex]['cardStackPower'];
        $defenseCard = $nextState['players'][$enemyJsonIndex]['cardStack'][0];

        $attackResult = $this->onAttack(
            $cardNumber,
            $prevAttackPower,
            $defenseCard['cardNumber'],
        );

        if ($attackResult) {
            if (!$attackResult['isTurnChange']) {
                $nextState['players'][$jsonIndex]['cardStackPower'] = $attackResult['attackPower'];
            } else {
                // 交代時に積み直す
                $nextState['players'][$jsonIndex]['cardStackPower'] = 0;
                $nextState['turnPalyerIndex'] = (1 - $nextState['turnPalyerIndex']);
                $defenseBench = $nextState['players'][$enemyJsonIndex]['benchCardNumbers'];
logger('******');
logger($defenseBench);
                $defenseStackCards = ($nextState['players'][$enemyJsonIndex]['cardStack']);
                $nextState['players'][$enemyJsonIndex]['benchCardNumbers'] = $this->addCardsToBench(
                    $defenseStackCards,
                    $defenseBench,
                );
logger($nextState['players'][$enemyJsonIndex]['benchCardNumbers']);
                $nextState['players'][$enemyJsonIndex]['cardStack'] = [];
            }
        }

        $this->state = $nextState;

        return [
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

    protected function onAttack(int $attackCardNumber, int $prevAttackPower, ?int $defenseCardNumber)
    {

        /**
         * @todo それぞれのパラメータを取得
         *  カードIDは1起点なので合わせやすいように修正する
         * */
        $attackCardStatus = $this->cardSettings[$attackCardNumber - 1];
        $defenseCardStatus = $this->cardSettings[$defenseCardNumber - 1];

        $ability = [
            'attack' => [],
            'defense' => [],
        ];

logger('attakc cared status **');
logger($attackCardStatus);
        $addAttackPower = 0;
        $attackAbility = $attackCardStatus['ability']['attack'] ?? null;
        if ($attackAbility) {
            $addAttackPower = $attackAbility['power'] ?? 0;
            if ($addAttackPower) {
                $ability['attack']['power'] = $addAttackPower;
            }
        }


        $attackPower = $attackCardStatus['power'];
        $totalAttackPower = $attackPower + $prevAttackPower;


        $defensePower = $defenseCardStatus['power'];
        $addDefensePower = 0;
        $defenseAbility = $defenseCardStatus['ability']['defense'] ?? null;
        if ($defenseAbility) {
            $addDefensePower = $defenseAbility['power'];
            $ability['defense']['power'] = $addDefensePower;
        }

        $totalDefensePower = $defensePower + $addDefensePower;


        // ターンの入れ替えをチェック
        $isTurnChange = false;
        if ($totalAttackPower >= $totalDefensePower) {
            $isTurnChange = true;
        }

        return [
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