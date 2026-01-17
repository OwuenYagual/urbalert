<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreDenunciaRequest;
use App\Http\Requests\UpdateDenunciaEstadoRequest;
use App\Models\Denuncia;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DenunciaController extends Controller
{
    // Crear denuncia
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

    // Listar todas las denuncias
    public function index(): JsonResponse
    {
        $denuncias = Denuncia::orderBy('created_at', 'desc')->get();

        return response()->json([
            'data' => $denuncias
        ], 200);
    }

    // Mostrar una denuncia
    public function show(int $id): JsonResponse
    {
        $denuncia = Denuncia::find($id);

        if (!$denuncia) {
            return response()->json([
                'message' => 'Denuncia no encontrada.'
            ], 404);
        }

        return response()->json([
            'data' => $denuncia
        ], 200);
    }

    // Eliminar denuncia
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

    // Actualizar estado de denuncia
    public function updateEstado(UpdateDenunciaEstadoRequest $request, int $id): JsonResponse
    {
        $denuncia = Denuncia::find($id);

        if (!$denuncia) {
            return response()->json([
                'message' => 'Denuncia no encontrada.'
            ], 404);
        }

        $denuncia->estado = $request->estado;
        $denuncia->save();

        return response()->json([
            'message' => 'Estado actualizado correctamente.',
            'data' => $denuncia
        ], 200);
    }

    // Actualizar datos de denuncia
    public function update(int $id, Request $request): JsonResponse
    {
        $denuncia = Denuncia::find($id);

        if (!$denuncia) {
            return response()->json([
                'message' => 'Denuncia no encontrada.'
            ], 404);
        }

        if ($request->has('estado')) {
            $denuncia->estado = $request->estado;
            $denuncia->save();
        }

        return response()->json([
            'message' => 'Denuncia actualizada correctamente.',
            'data' => $denuncia
        ], 200);
    }
}
