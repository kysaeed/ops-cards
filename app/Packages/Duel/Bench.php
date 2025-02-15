<?php
namespace App\Packages\Duel;


class Bench
{
    protected array $benchItems;

    public function __construct(array $benchItems = [])
    {
        $this->benchItems = $benchItems;
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
}