<?php
namespace App\Packages\Duel;

class Player
{
    protected $deck;
    protected $cardStack;

    public function __construct(array $cardSettings)
    {

        $this->deck = new Deck([], $cardSettings);

        $this->cardStack = new CardStack();
    }
}