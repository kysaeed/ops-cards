<?php
namespace App\Packages\Duel;


class BenchItem
{
    protected array $cardList;

    public function __construct(array $cardList = [])
    {
        $this->cardList = $cardList;
    }


    public static function fromJson(array $json, array $cardSettings): self
    {
        $cards = [];
        foreach ($json as $c) {
            $cards[] = Card::fromJson($c, $cardSettings);
        }

        return new self($cards);
    }

    public function toJson(): array
    {
        $json = [];
        foreach ($this->cardList as $card) {
            $json[] = $card->toJson();
        }

        return $json;
    }
}