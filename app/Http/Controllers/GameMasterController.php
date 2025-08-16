<?php

namespace App\Http\Controllers;

use App\Packages\GameMaster\GameMaster;
use App\Models\User;
use Illuminate\Http\Request;

class GameMasterController extends Controller
{
    public function __construct(protected GameMaster $gameMaster)
    {
        ;
    }

    /**
     * ゲームセッションを初期化する
     */
    public function initializeGameSession(Request $request)
    {
        $user = $request->user();
        $result = $this->gameMaster->initializeGameSession($user);

        return response()->json($result);
    }
}
