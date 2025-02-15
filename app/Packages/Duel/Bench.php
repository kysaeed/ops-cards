<?php
namespace App\Packages\Duel;


class Bench
{
    protected array $benchItems;

    public function __construct(array $benchItems = [])
    {
        $this->benchItems = $benchItems;
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