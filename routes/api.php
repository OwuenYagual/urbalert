<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DenunciaController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
| Aquí se registran las rutas de la API del proyecto Urbalert.
| Estas rutas son consumidas por el frontend o por herramientas
| como Postman para pruebas del backend.
*/

/*
|--------------------------------------------------------------------------
| Ruta de prueba (opcional)
|--------------------------------------------------------------------------
| Permite verificar que la API está funcionando correctamente.
*/
Route::get('/ping', function () {
    return response()->json([
        'message' => 'API Urbalert activa'
    ]);
});

/*
|--------------------------------------------------------------------------
| Denuncias
|--------------------------------------------------------------------------
| Endpoints relacionados con la gestión de denuncias comunitarias.
*/

/**
 * Registrar una nueva denuncia
 * Método: POST
 * URL: /api/denuncias
 */
Route::post('/denuncias', [DenunciaController::class, 'store']);
Route::get('/denuncias', [DenunciaController::class, 'index']);
