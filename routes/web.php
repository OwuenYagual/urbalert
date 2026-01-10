<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('denuncias.index');
});

Route::get('/denuncias/crear', function () {
    return view('denuncias.create');
});

Route::get('/denuncias/{id}', function ($id) {
    return view('denuncias.show', ['id' => $id]);
});


