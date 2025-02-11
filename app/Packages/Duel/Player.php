<?php
namespace App\Packages\Duel;

class Player
{
    protected array $cardSettings;
    protected Deck $deck;
    protected CardStack $cardStack;

    public function __construct(Deck $deck, CardStack $cardStack, array $cardSettings)
    {
        $this->deck = $deck;
        $this->cardStack = $cardStack;
        $this->cardSettings = $cardSettings;
    }

    public function getDeck(): Deck
    {
        return $this->deck;
    }

    public function getCardStack(): CardStack
    {
        return $this->cardStack;
    }

    public static function fromJson(array $json, array $cardSettings): Player
    {
        $deck = Deck::fromJson($json['deckCardNumbers'], $cardSettings);
        $cardStack = CardStack::fromJson($json['cardStack'], $cardSettings);

        return new Player($deck, $cardStack, $cardSettings);
    }


}