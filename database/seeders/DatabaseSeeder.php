<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\Deck;
use App\Models\DeckCard;
use App\Models\Duel;
use App\Models\GameSession;
use App\Models\GameSessionSection;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $cardSettings = [];
        $string = file_get_contents(resource_path('settings/cards.json'));
        if (!empty($string)) {
            $cardSettings = json_decode($string, true);
        }

        $users = [];
        for ($i = 1; $i <= 2; $i++) {
            $user = User::create([
                'name' => "user{$i}",
                'email' => "user{$i}@example.jp",
                'password' => Hash::make('password'),
            ]);


            $gameSession = GameSession::create([
                'user_id' => $user->id,
            ]);

            $gameSessionSection = GameSessionSection::create([
                'game_session_id' => $gameSession->id,
                'order' => 1,
            ]);

            $this->createPresetDeck($gameSessionSection, $cardSettings);


            $users[] = $user;

        }

        ///////
        /*
        $duel = new Duel([
            'user_id' => $users[0]->id,
            'turn' => 1,
            'deck_id' => $deckModels[0]->id,
            'enemy_deck_id' => $deckModels[1]->id,
        ]);
        */

        // \App\Models\User::factory(10)->create();

        // \App\Models\User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);
    }

    function createPresetDeck(GameSessionSection $gameSessionSection, array $cardSettings)
    {
        $defaultDeck = [
            1, 1, 1, 2, 3, 4,
        ];


        $deck = new Deck([
            //
        ]);

        $gameSessionSection->deck()->save($deck);

        $order = 1;
        foreach ($defaultDeck as $cardNumber) {

            $deckCard = new DeckCard([
                'card_number' => $cardNumber,
                'order' => $order,
            ]);

            $deck->deckCards()->save($deckCard);

            $order++;
        }
        $cardListCount = count($cardSettings);
        for ($j = 0; $j < 5; $j++) {
            $cardNumber = rand(5, $cardListCount - 1);

            $deckCard = new DeckCard([
                'card_number' => $cardNumber,
                'order' => $order,
            ]);

            $deck->deckCards()->save($deckCard);

            $order++;
        }

    }
}
