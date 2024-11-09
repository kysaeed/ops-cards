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
        $nextState['players'][$def]['cardStackNumbers'][] = $initialCardStack;

        $this->state = $nextState;

        /*
        $this->onAttack(
            $nextState['players'][self::Player]['handCardNumber'],
            0,
            $initialCardStack,
        );
        */

        return [
            'players' => [
                [
                    //
                    'deck' => null,
                    'handCardNumber' => $nextState['players'][self::Player]['handCardNumber'],
                    'initialStackCard' => null,
                    'cardCount' => count($nextState['players'][self::Player]['deckCardNumbers']),
                ],
                [
                    //
                    'deck' => null,
                    'handCardNumber' => $nextState['players'][self::Enemy]['handCardNumber'],
                    'initialStackCard' => $initialCardStack,
                    'cardCount' => count($nextState['players'][self::Enemy]['deckCardNumbers']),
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
            array_unshift($nextState['players'][$jsonIndex]['cardStackNumbers'], $cardNumber);

        }

        $cardCount = count($nextState['players'][$jsonIndex]['deckCardNumbers']);

        /////////
        $prevAttackPower = $nextState['players'][$jsonIndex]['cardStackPower'];
        $defenseCardNumber = $nextState['players'][$enemyJsonIndex]['cardStackNumbers'][0];

        $attackResult = $this->onAttack(
            $cardNumber,
            $prevAttackPower,
            $defenseCardNumber,
        );

        if ($attackResult) {
            if (!$attackResult['isTurnChange']) {
                $nextState['players'][$jsonIndex]['cardStackPower'] = $attackResult['attackPower'];
            } else {
                // 交代時に積み直す
                $nextState['players'][$jsonIndex]['cardStackPower'] = 0;
                $nextState['turnPalyerIndex'] = (1 - $nextState['turnPalyerIndex']);
            }
        }

logger('turn : ' . $nextState['turnPalyerIndex']);

        $this->state = $nextState;

        return [
            'isHandCard' => $isHandCard,
            'isTurnChange' => $attackResult['isTurnChange'],
            'cardNumber' => $cardNumber,
            'addAttackPower' => $attackResult['addAttackPower'],
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

logger('attakc cared status **');
logger($attackCardStatus);
        $addAttackPower = 0;
        $attackAbility = $attackCardStatus['ability']['attack'] ?? null;
        if ($attackAbility) {
            $addAttackPower = $attackAbility['power'] ?? 0;
        }


        // @todo ターンの入れ替えをチェック
        $attackPower = $attackCardStatus['power'];
        $totalAttackPower = $attackPower + $prevAttackPower;

        $defensePower = $defenseCardStatus['power'];

        $isTurnChange = false;
        if ($totalAttackPower >= $defensePower) {
            $isTurnChange = true;
        }

        return [
            'isTurnChange' => $isTurnChange,
            'attackPower' => $totalAttackPower,
            'addAttackPower' => $addAttackPower,
            'addDefensePower' => 0,
            'defensePower' => $defensePower,
        ];
    }

}