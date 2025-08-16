<?php
namespace App\Packages\Duel;


class Bench
{
    protected array $benchItems;

    public function __construct(array $benchItems = [])
    {
        $this->benchItems = $benchItems;
    }

    public function getTypeCount()
    {
        return count($this->benchItems);
    }

    public function addCardList(array $cardList)
    {
        foreach ($cardList as $card) {
            $this->addCard($card);
        }

        return true;
    }

    public function addCard(Card $card): bool
    {
        foreach ($this->benchItems as $item) {
            if ($item->isAcceptableCard($card)) {
                $item->addCard($card);
                return true;
            }
        }

        $this->benchItems[] = new BenchItem([$card]);
        return true;
    }

    public static function fromJson(array $json, array $cardSettings): self
    {
        $benchItems = [];
        foreach ($json as $items) {
            $benchItems[] = BenchItem::fromJson($items, $cardSettings);
        }

        return new self($benchItems);
    }


    public function toJson(): array
    {
        $json = [];
        foreach ($this->benchItems as $benchItem) {
            $json[] = $benchItem->toJson();
        }

        return $json;
    }

    public function removeCard(int $index)
    {
        unset($this->benchItems[$index]);
        $this->benchItems = array_values($this->benchItems);
    }

    /**
     * ベンチから特定タイプのカードを取り出す
     * @param int $type 取り出すカードのタイプ
     * @return Card|null 取り出したカード。見つからなかった場合はnull
     */
    public function takeCardByType(int $type): ?Card
    {
        foreach ($this->benchItems as $benchIndex => $benchItem) {
            $cards = $benchItem->getCards();
            foreach ($cards as $cardIndex => $card) {
                if ($card->getStatus()['type'] === $type) {
                    $takenCard = $card;
                    $benchItem->removeCard($cardIndex);

                    // BenchItemが空になった場合、BenchItem自体を削除
                    if ($benchItem->isEmpty()) {
                        array_splice($this->benchItems, $benchIndex, 1);
                    }

                    return $takenCard;
                }
            }
        }
        return null;
    }

    /**
     * ベンチから特定のカード番号のカードを取り出す
     * @param int $cardNumber 取り出すカードの番号
     * @return Card|null 取り出したカード。見つからなかった場合はnull
     */
    public function takeCardByNumber(int $cardNumber): ?Card
    {
        foreach ($this->benchItems as $benchIndex => $benchItem) {
            $cards = $benchItem->getCards();
            foreach ($cards as $cardIndex => $card) {
                if ($card->getCardNumber() === $cardNumber) {
                    $takenCard = $card;
                    $benchItem->removeCard($cardIndex);

                    // BenchItemが空になった場合、BenchItem自体を削除
                    if ($benchItem->isEmpty()) {
                        array_splice($this->benchItems, $benchIndex, 1);
                    }

                    return $takenCard;
                }
            }
        }
        return null;
    }


}