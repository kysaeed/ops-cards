<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DuelController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware('api')->group(function () {

    Route::post('login', [AuthController::class, 'login']);

});

Route::middleware('auth:sanctum')->group(function () {

    Route::prefix('data')->group(function() {
        Route::post('deck', [DuelController::class, 'index']);

        Route::post('deck/draw', [DuelController::class, 'draw']);
    });

});
