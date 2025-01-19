<?php
namespace App\Packages\Duel;

class Card
{
    protected int $cardNumber;
    protected int $power;
    protected int $addPower;

    public function __construct(int $cardNumber, array $cardInfo)
    {
        $this->cardNumber = $cardNumber;

        $this->power = $cardInfo['power'];
        $this->addPower = 0;

    }

    public function getCardNumber(): int
    {
        return $this->cardNumber;
    }

    public function getPower(): int
    {
        return $this->power;
    }

    public function clearBuf(): void
    {
        $this->addPower = 0;
    }

    public function fromJson(array $json, array $cardSettrings)
    {
        $this->cardNumber = $json['cardNumber'];
        $this->addPower = $json['addPower'];

        $cardInfo = $cardSettrings[$this->cardNumber - 1];
        $this->power = $cardInfo['power'];
    }

    public function toJson(): array
    {
        return [
            'cardNumber' => $this->cardNumber,
            'addPower' => $this->addPower,
        ];
    }
}