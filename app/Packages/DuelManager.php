<?php
namespace App\Packages;

class DuelManager
{
    protected array $state;

    public function __construct(array $state)
    {
        $this->state = $state;
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

        // return $this->state;
        return [
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
        if ($isPlyaerTurn) {
            $jsonIndex = 'enemy';
        }

        $nextHandCardNumber = null;
        if ($isHandCard) {
            $cardNumber = $nextState[$jsonIndex]['handCardNumber'];
            $nextHandCardNumber = array_shift($nextState[$jsonIndex]['deckCardNumbers']);
            $turnState[$jsonIndex]['handCardNumber'] = $nextHandCardNumber;
        } else {
            $cardNumber = array_shift($nextState[$jsonIndex]['deckCardNumbers']);
        }

        $cardCount = count($nextState[$jsonIndex]['deckCardNumbers']);

        $this->state = $nextState;

        return [
            'isHandCard' => $isHandCard,
            'cardNumber' => $cardNumber,
            'nextHnadCardNumber' => $nextHandCardNumber,
            'cardCount' => $cardCount,
            'order' => null,
        ];
    }


}