<?php
namespace App\Packages\Duel;


class BenchItem
{
    protected array $cardList;

    public function __construct(array $cardList = [])
    {
        $this->cardList = $cardList;
    }

    public function getCardNumber(): ?int
    {
        if (empty($this->cardList)) {
            return null;
        }
        return $this->cardList[0]?->getCardNumber();
    }

    public function getCount(): int
    {
        return count($this->cardList);
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

    /**
     * 指定したインデックスのカードを削除する
     * @param int $index 削除するカードのインデックス
     */
    public function removeCard(int $index): void
    {
        array_splice($this->cardList, $index, 1);
    }

    /**
     * カードリストが空かどうかを判定
     * @return bool 空の場合はtrue
     */
    public function isEmpty(): bool
    {
        return empty($this->cardList);
    }

    /**
     * カードリストを取得
     * @return array カードの配列
     */
    public function getCards(): array
    {
        return $this->cardList;
    }
}