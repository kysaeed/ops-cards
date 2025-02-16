<?php
namespace App\Packages\Duel;

use App\Exceptions\Handler;

class Player
{
    protected array $cardSettings;
    protected HandCard $handCared;
    protected Deck $deck;
    protected CardStack $cardStack;
    protected Bench $bench;

    public function __construct(HandCard $handCard, Deck $deck, CardStack $cardStack, Bench $bench, array $cardSettings)
    {
        $this->handCared = $handCard;
        $this->deck = $deck;
        $this->cardStack = $cardStack;
        $this->bench = $bench;
        $this->cardSettings = $cardSettings;
    }

    public function getHandCard(): HandCard
    {
        return $this->handCared;
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
        $handCard = HandCard::fromJson($json['handCardNumber'], $cardSettings);
        $deck = Deck::fromJson($json['deckCardNumbers'], $cardSettings);
        $cardStack = CardStack::fromJson($json['cardStack'], $cardSettings);
        $bench = Bench::fromJson($json['benchCardNumbers'], $cardSettings);

        return new Player($handCard, $deck, $cardStack, $bench, $cardSettings);
    }


}