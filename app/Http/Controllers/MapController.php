<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\CarbonImmutable;


class MapController extends Controller
{

    public function enter()
    {

        /** @var User $user */
        $user = Auth::user();

        $gameSession = $user->gameSessions()->active()->first();
        $gameSessionSection = $gameSession->gameSessionSections()
            ->active()
            ->first();

        $activeStepCount = $gameSessionSection->gameSessionSectionSteps()->count();
        if ($activeStepCount <= 0) {
            $gameSessionSection->compleated_at = CarbonImmutable::now();
            $gameSessionSection->save();

            $gameSession = $gameSessionSection->gameSession;
            $gameSession->compleated_at = CarbonImmutable::now();
            $gameSession->save();
        }


        return response()->json([
            'count' => $activeStepCount,
        ]);
    }
}
