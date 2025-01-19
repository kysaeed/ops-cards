<?php
namespace App\Packages\Duel;

class CardStack
{
    protected $cards = [];

    public function __construct(array $initial = [])
    {
        $this->cards = $initial;
    }

    public function add(Card $card)
    {
        array_unshift($this->cards, $card);
    }

    public function getTop(): ?Card
    {
        if (empty($this->cards)) {
            return null;
        }

        return $this->cards[0];
    }

    public function getCount(): int
    {
        return count($this->cards);
    }

    public function takeAll(): array
    {
        $cards = $this->cards;
        $this->cards = [];
        return $cards;
    }

    public function fromJson(array $json, array $cardSettings)
    {
        $cards = [];
        foreach ($json as $j) {
            $cards[] = Card::fromJson($j, $cardSettings);
        }
        $this->cards = $cards;
    }

    public function toJson(): array
    {
        $json = [];
        foreach ($this->cards as $card) {
            $json[] = $card->toJson();
        }

        return $json;
    }
}