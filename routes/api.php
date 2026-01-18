<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\DenunciaController;

Route::get('/ping', function () {
    return response()->json(['message' => 'API Urbalert activa']);
});

// ---------------------------
// Lectura (pública)
// ---------------------------
Route::get('/denuncias', [DenunciaController::class, 'index']);
Route::get('/denuncias/{id}', [DenunciaController::class, 'show']);

// ---------------------------
// Sesión actual (requiere login)
// ---------------------------
Route::middleware(['web', 'auth'])->get('/me', function () {
    return response()->json([
        'id' => Auth::id(),
        'role' => Auth::user()->role,
    ]);
});

// ---------------------------
// Escritura (requiere login por sesión)
// ---------------------------
Route::middleware(['web', 'auth'])->group(function () {
    Route::post('/denuncias', [DenunciaController::class, 'store']);
    Route::patch('/denuncias/{id}/estado', [DenunciaController::class, 'updateEstado']);
    Route::put('/denuncias/{id}', [DenunciaController::class, 'update']);
    Route::delete('/denuncias/{id}', [DenunciaController::class, 'destroy']);
});
