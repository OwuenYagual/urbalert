<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreDenunciaRequest;
use App\Models\Denuncia;
use Illuminate\Http\JsonResponse;

class DenunciaController extends Controller
{
    public function store(StoreDenunciaRequest $request)
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

    public function index(): JsonResponse 
    {
        $denuncias = Denuncia::orderBy('created_at', 'desc')->get();

        return response()->json([
            'data' => $denuncias
        ],200);
    }

    public function destroy(int $id): JsonResponse
    {
        $denuncia = Denuncia::find($id);

        if (!$denuncia) {
            return response()->json([
                'message' => 'Denuncia no encontrada.'
            ], 404);
        }

        $denuncia->delete();

        return response()->json([
            'message' => 'Denuncia eliminada correctamente.'
        ], 200);
    }


}
