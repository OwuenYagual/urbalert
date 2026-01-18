<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Auth;

// Públicas
Route::get('/', fn () => view('inicio'));
Route::get('/denuncias', fn () => view('denuncias.index'));

// Auth (único)
Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
Route::post('/login', [AuthController::class, 'login']);

Route::get('/register', [AuthController::class, 'showRegister'])->name('register');
Route::post('/register', [AuthController::class, 'register']);

Route::post('/logout', [AuthController::class, 'logout'])->name('logout')->middleware('auth');

// Protegidas
Route::get('/denuncias/crear', fn () => view('denuncias.create'))->middleware('auth');
Route::get('/denuncias/{id}', fn ($id) => view('denuncias.show', compact('id')));

Route::get('/denuncias/{id}/editar', function ($id) {
    return view('denuncias.edit', compact('id'));
})->middleware('auth');