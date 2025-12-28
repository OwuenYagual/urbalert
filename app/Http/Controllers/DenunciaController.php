<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreDenunciaRequest;
use App\Models\Denuncia;
use Illuminate\Http\JsonResponse;

class DenunciaController extends Controller
{
    public function store(StoreDenunciaRequest $request): JsonResponse
    {
        $denuncia = Denuncia::create([
            'titulo' => $request->titulo,
            'descripcion' => $request->descripcion,
            'categoria' => $request->categoria,
            'ubicacion' => $request->ubicacion,
            'estado' => 'pendiente',
        ]);

        return response()->json([
            'message' => 'Denuncia registrada correctamente.',
            'data' => $denuncia,
        ], 201);
    }
}
