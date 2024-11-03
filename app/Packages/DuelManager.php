<?php
namespace App\Packages;

class DuelManager
{
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
        foreach ($nextState as &$player) {
            // dump($player);
            $player['handCardNumber'] = array_shift($player['deckCardNumbers']);

        }

        $def = 'enemy';
        $initialCardStack = array_shift($nextState[$def]['deckCardNumbers']);
        $nextState[$def]['cardStackNumbers'][] = $initialCardStack;

        $this->state = $nextState;

        $this->onAttack(
            $nextState['player']['handCardNumber'],
            0,
            $initialCardStack,
        );

        return [
            'turnPalyerIndex' => 0,
            'players' => [
                [
                    //
                    'deck' => null,
                    'handCardNumber' => $nextState['player']['handCardNumber'],
                    'initialStackCard' => null,
                    'cardCount' => count($nextState['player']['deckCardNumbers']),
                ],
                [
                    //
                    'deck' => null,
                    'handCardNumber' => $nextState['enemy']['handCardNumber'],
                    'initialStackCard' => $initialCardStack,
                    'cardCount' => count($nextState['enemy']['deckCardNumbers']),
                ],
            ],
        ];
    }

    public function step(bool $isPlyaerTurn, bool $isHandCard)
    {
        $nextState = $this->state;

        $jsonIndex = 'player';
        $enemyJsonIndex = 'enemy';
        if ($isPlyaerTurn) {
            $jsonIndex = 'enemy';
            $enemyJsonIndex = 'player';
        }

        $nextHandCardNumber = null;
        if ($isHandCard) {
            $cardNumber = $nextState[$jsonIndex]['handCardNumber'];
            $nextHandCardNumber = array_shift($nextState[$jsonIndex]['deckCardNumbers']);
            $nextState[$jsonIndex]['handCardNumber'] = $nextHandCardNumber;

        } else {
            $cardNumber = array_shift($nextState[$jsonIndex]['deckCardNumbers']);
        }

        // todo 交代時に積み直す
        if ($cardNumber) {
            array_unshift($nextState[$jsonIndex]['cardStackNumbers'], $cardNumber);

        }

        $cardCount = count($nextState[$jsonIndex]['deckCardNumbers']);

        /////////
        $defenceCardNumber = $nextState[$enemyJsonIndex]['cardStackNumbers'][0] ?? null;

        $this->onAttack(
            $cardNumber,
            $defenceCardNumber,
        );


        $this->state = $nextState;

        return [
            'isHandCard' => $isHandCard,
            'cardNumber' => $cardNumber,
            'nextHnadCardNumber' => $nextHandCardNumber,
            'cardCount' => $cardCount,
            'order' => null,
        ];
    }

    protected function onAttack(int $attackCardNumber, int $prevAttackPower, ?int $defenceCardNumber)
    {

        // @todo それぞれのパラメータを取得
        $attackCardStatus = $this->cardSettings[$attackCardNumber];
        $defenceCardStatus = $this->cardSettings[$defenceCardNumber];


        // @todo ターンの入れ替えをチェック
        $attackPower = $attackCardStatus['power'];

        /// dd($attckPower);
        $defencePower = $defenceCardStatus['power'];

        $isTrunChange = false;
        if ($attackPower >= $defencePower) {

            $isTrunChange = true;

        }

        return [
            'isTrunChange' => $isTrunChange,
        ];
    }

}