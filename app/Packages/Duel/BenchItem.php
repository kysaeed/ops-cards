<?php
namespace App\Packages\Duel;


class BenchItem
{
    protected array $cardList;

    public function __construct(array $cardList = [])
    {
        $this->cardList = $cardList;
    }

    public function isAcceptableCard(Card $card): bool
    {
        if (empty($this->cardList)) {
            return true;
        }

        $cardElement = $this->cardList[0] ?? null;
        if ($cardElement?->getCardNumber() === $card->getCardNumber()) {
            return true;
        }
        return false;
    }

    public function addCard(Card $card): bool
    {
        if (!$this->isAcceptableCard($card)) {
            return false;
        }
        $this->cardList[] = $card;
        return true;
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