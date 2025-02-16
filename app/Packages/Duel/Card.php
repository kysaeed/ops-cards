<?php
namespace App\Packages\Duel;

class Card
{
    protected int $cardNumber;
    protected int $power;
    protected int $addPower;
    protected array $status;

    public function __construct(int $cardNumber, int $addPower = 0, array $cardInfo)
    {
        $this->cardNumber = $cardNumber;

        $this->power = $cardInfo['power'];
        $this->addPower = $addPower;

        $this->status = $cardInfo;
    }

    public function getCardNumber(): int
    {
        return $this->cardNumber;
    }

    public function getCardPower(): int
    {
        return $this->power;
    }

    public function getTotalPower(): int
    {
        return ($this->power + $this->addPower);
    }

    public function setAddPower(int $addPower): void
    {
        $this->addPower = $addPower;
    }

    public function getStatus(): array
    {
        return $this->status;
    }

    public function clearBuf(): void
    {
        $this->addPower = 0;
    }

    public static function fromCardNumber(int $cardNumber, array $cardSettrings): self
    {
        /**
         * @todo それぞれのパラメータを取得
         *  カードIDは1起点なので合わせやすいように修正する
         * */

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