<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DenunciaController;

Route::get('/ping', function () {
    return response()->json(['message' => 'API Urbalert activa']);
});

// Lectura (puede ser pública)
Route::get('/denuncias', [DenunciaController::class, 'index']);
Route::get('/denuncias/{id}', [DenunciaController::class, 'show']);

// Escritura (requiere login)
Route::middleware('auth')->group(function () {
    Route::post('/denuncias', [DenunciaController::class, 'store']);
    Route::patch('/denuncias/{id}/estado', [DenunciaController::class, 'updateEstado']);
    Route::put('/denuncias/{id}', [DenunciaController::class, 'update']);
    Route::delete('/denuncias/{id}', [DenunciaController::class, 'destroy']);
});

Route::middleware('web')->group(function () {
    Route::post('/denuncias', [DenunciaController::class, 'store']);
    Route::patch('/denuncias/{id}/estado', [DenunciaController::class, 'updateEstado']);
    Route::put('/denuncias/{id}', [DenunciaController::class, 'update']);
    Route::delete('/denuncias/{id}', [DenunciaController::class, 'destroy']);
});

