<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Shop;
use App\Models\ShopCard;


class ShopController extends Controller
{
    public function enter(Request $request)
    {
        $shop = Shop::first();
        $shopCards = $shop->shopCards()->orderBy('order')->get();

        $cardNumberList = [];
        foreach ($shopCards as $c) {
            $cardNumberList[] = $c->card_number;
        }

        return response()->json([
            'shopCards' => $cardNumberList,
        ]);
    }

    public function select(Request $request)
    {



    }
}
