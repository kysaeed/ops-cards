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

    public static function fromJson(array $json, array $cardSettings): Player
    {
        $deck = Deck::fromJson($json['cardStack'], $cardSettings);
        $cardStack = CardStack::fromJson($json[], $cardSettings);

        return new Player($deck, $cardStack, $cardSettings);
    }


}