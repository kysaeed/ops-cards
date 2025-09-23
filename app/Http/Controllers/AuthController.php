<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Packages\GameMaster\GameMaster;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class AuthController extends Controller
{
    protected array $cardSettings;

    public function __construct()
    {
        $this->cardSettings = [];
        $string = file_get_contents(resource_path('settings/cards.json'));
        if (!empty($string)) {
            $this->cardSettings = json_decode($string, true);
        }

    }

    protected function createInitialData(User $user)
    {
        $gameMaster = new GameMaster($user);
        $gameMaster->closeAllGameSession();
        $gameMaster->initializeGameSession();
    }


    public function login()
    {
logger('AuthController::login() -----');
        $user = Auth::user();

// $user = User::find(3);
// Auth::login($user);

        if (!$user) {
            $user = DB::transaction(function () {
                $maxNumber = User::max('id') ?? 0;
                $maxNumber++;

                $user = new User([
                    'name' => "user{$maxNumber}",
                    'email' => "user{$maxNumber}@exampe.jp",
                    'password' => '1234', //@todo
                ]);

                $user->save();

                $this->createInitialData($user);


                Auth::login($user, /*true*/);

                return $user;
            });
        }

        $gameMaster = new GameMaster($user);

        $gameSessionSectionStep = $gameMaster->getActiveGameSessionSectionStep();

        $state = 0;
        if ($gameSessionSectionStep?->shop) {
            $state = 1;
        } elseif ($gameSessionSectionStep?->duel) {
            $state = 2;
        }

        return response()->json([
            'user' => $user,
            'state' => $state,
        ]);
    }
}
