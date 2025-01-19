<?php
namespace App\Packages\Duel;

class Card
{
    protected int $cardNumber;
    protected int $power;
    protected int $addPower;

    public function __construct(int $cardNumber, int $addPower = 0, array $cardInfo)
    {
        $this->cardNumber = $cardNumber;

        $this->power = $cardInfo['power'];
        $this->addPower = $addPower;
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

    public static function fromJson(array $json, array $cardSettrings): Card
    {
        $cardNumber = $json['cardNumber'];
        $cardInfo = $cardSettrings[$cardNumber - 1];

        return new Card(
            $cardNumber,
            $json['addPower'],
            $cardInfo,
        );
    }

    public function toJson(): array
    {
        return [
            'cardNumber' => $this->cardNumber,
            'addPower' => $this->addPower,
        ];
    }
}