<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use Illuminate\Support\Facades\Auth;


// Login
Route::get('/login', [LoginController::class, 'showLoginForm'])->name('login');
Route::post('/login', [LoginController::class, 'login']);

// Registro
Route::get('/register', [RegisterController::class, 'showRegisterForm'])->name('register');
Route::post('/register', [RegisterController::class, 'register']);

Route::post('/logout', function () {
    Auth::logout();
    return redirect('/'); // redirige a página principal
})->name('logout');
/*
|--------------------------------------------------------------------------
| Públicas
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return view('inicio');
});

Route::get('/denuncias', function () {
    return view('denuncias.index');
});

/*
|--------------------------------------------------------------------------
| Crear denuncia (ANTES del {id})
|--------------------------------------------------------------------------
*/

Route::get('/denuncias/crear', function () {
    return view('denuncias.create');
})->middleware('auth');

/*
|--------------------------------------------------------------------------
| Detalle (SIEMPRE AL FINAL)
|--------------------------------------------------------------------------
*/

Route::get('/denuncias/{id}', function ($id) {
    return view('denuncias.show', compact('id'));
});
Route::get('/login', function () {
    return view('auth.login');
})->name('login');

Route::post('/login', [AuthController::class, 'login']);

