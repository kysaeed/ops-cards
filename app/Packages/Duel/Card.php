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

    public static function fromCardNumber(int $cardNumber, array $cardSettrings): self
    {
        $cardInfo = $cardSettrings[$cardNumber - 1];
        return new self($cardNumber, 0, $cardInfo);
    }

    public static function fromJson(array $json, array $cardSettrings): self
    {
        $cardNumber = $json['cardNumber'];
        $cardInfo = $cardSettrings[$cardNumber - 1];

        return new self(
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