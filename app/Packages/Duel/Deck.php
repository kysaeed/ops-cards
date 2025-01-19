<?php
namespace App\Packages\Duel;

class Deck
{
    protected array $cardNumberList;
    protected array $cardSettings;

    public function __construct(array $cardNumberList, array $cardSettings)
    {
        $this->cardNumberList = $cardNumberList;
        $this->cardSettings = $cardSettings;

    }

    public function draw(): ?Card
    {
        if (empty($this->cardNumberList)) {
            return null;
        }


        //// @todo
        $cardNumber = array_shift($this->cardNumberList);

        $cardInfo = $this->cardSettings[$cardNumber - 1] ?? null;
        if (!$cardInfo) {
            return null;
        }

        return new Card($cardNumber, 0, $cardInfo);
    }

}