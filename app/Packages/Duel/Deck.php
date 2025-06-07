<?php
namespace App\Packages\Duel;

class Deck
{
    protected array $cardNumberList;
    protected array $cardSettings;

    public function __construct(array $cardNumberList = [], array $cardSettings)
    {
        $this->cardNumberList = $cardNumberList;
        $this->cardSettings = $cardSettings;
    }

    public function draw(): ?Card
    {
        if (empty($this->cardNumberList)) {
            return null;
        }

        $cardNumber = array_shift($this->cardNumberList);
        return Card::fromCardNumber($cardNumber, $this->cardSettings);
    }

    public function getCount(): int
    {
        return count($this->cardNumberList);
    }

    public function isEmpty(): bool
    {
        return empty($this->cardNumberList);
    }

    public static function fromJson(array $json, array $cardSettings): self
    {
        return new self($json, $cardSettings);
    }

    public function toJson(): array
    {
        return $this->cardNumberList;
    }

    /**
     * デッキの一番下にカードを追加する
     * @param Card $card 追加するカード
     */
    public function addToBottom(Card $card): void
    {
        $this->cardNumberList[] = $card->getCardNumber();
    }
}