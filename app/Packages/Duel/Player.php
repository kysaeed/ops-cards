<?php
namespace App\Packages\Duel;

class Player
{
    protected array $cardSettings;
    protected Deck $deck;
    protected CardStack $cardStack;
    protected Bench $bench;

    public function __construct(Deck $deck, CardStack $cardStack, Bench $bench, array $cardSettings)
    {
        $this->deck = $deck;
        $this->cardStack = $cardStack;
        $this->bench = $bench;
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

    public function getBench(): Bench
    {
        return $this->bench;
    }

    public static function fromJson(array $json, array $cardSettings): Player
    {
        $deck = Deck::fromJson($json['deckCardNumbers'], $cardSettings);
        $cardStack = CardStack::fromJson($json['cardStack'], $cardSettings);
        $bench = Bench::fromJson($json['benchCardNumbers'], $cardSettings);

        return new Player($deck, $cardStack, $bench, $cardSettings);
    }


}