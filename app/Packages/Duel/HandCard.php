<?php

namespace App\Packages\Duel;

class HandCard
{
    protected ?Card $card;

    public function __construct(?Card $card = null)
    {
        $this->card = $card;
    }

    public function setCard(?Card $card): bool
    {
        $this->card = $card;

        return true;
    }

    public function takeCard(): ?Card
    {
        $card = $this->card;
        $this->card = null;

        return $card;
    }

    public function getCard(): ?Card
    {
        return $this->card;
    }

    public function isEmpty(): bool
    {
        return is_null($this->card);
    }

    public static function fromJson(?int $json, array $cardSettrings): self
    {
        $card = null;
        if (!is_null($json)) {
            $card = Card::fromCardNumber($json, $cardSettrings);
        }
        return new self($card);
    }

    public function toJson(): ?int
    {
        if ($this->card) {
            return $this->card->getCardNumber();
        }

        return null;
    }

}