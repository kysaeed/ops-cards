<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Duel;
use App\Models\Deck;
use App\Models\DeckCard;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $defaultDeck = [
            1, 1, 1, 2, 3, 4,
        ];

        $users = [];
        $deckModels = [];
        $testDeckCard = 5;
        for ($i = 1; $i <= 2; $i++) {
            $user = User::create([
                'name' => "user{$i}",
                'email' => "user{$i}@example.jp",
                'password' => Hash::make('password'),
            ]);

            $deck = new Deck([
                'level' => 1,
            ]);

            $user->decks()->save($deck);
            $deckModels[] = $deck;

            $order = 1;
            foreach ($defaultDeck as $cardNumber) {

                $deckCard = new DeckCard([
                    'card_number' => $cardNumber,
                    'order' => $order,
                ]);

                $deck->deckCards()->save($deckCard);

                $order++;
            }

            for ($j = 0; $j < 5; $j++) {
                //$cardNumber = 5 + rand(0, 12);
                $cardNumber = $testDeckCard;
                $testDeckCard++;

                $deckCard = new DeckCard([
                    'card_number' => $cardNumber,
                    'order' => $order,
                ]);

                $deck->deckCards()->save($deckCard);

                $order++;
            }

            /*
            $cards = $deck->deckCards()
                ->orderBy('order')
                ->get();
            $cards->shuffle();
            $order = 1;

            foreach($cards as $c) {
                $c->order = $order;
                $c->save();
                $order++;
            }
            */

            $users[] = $user;

        }

        ///////
        Duel::create([
            'turn' => 1,
            'deck_id' => $deckModels[0]->id,
            'enemy_deck_id' => $deckModels[1]->id,
        ]);

        // \App\Models\User::factory(10)->create();

        // \App\Models\User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);
    }
}
