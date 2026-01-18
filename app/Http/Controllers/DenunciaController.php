<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreDenunciaRequest;
use App\Http\Requests\UpdateDenunciaEstadoRequest;
use App\Models\Denuncia;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DenunciaController extends Controller
{
    // Crear denuncia (con múltiples evidencias)
    public function store(StoreDenunciaRequest $request): JsonResponse
    {
        $denuncia = Denuncia::create([
            'titulo' => $request->titulo,
            'descripcion' => $request->descripcion,
            'categoria' => $request->categoria,
            'ubicacion' => $request->ubicacion,
            'lat' => $request->lat,
            'lng' => $request->lng,
            'estado' => 'pendiente',
        ]);

        if ($request->hasFile('evidencias')) {
            foreach ($request->file('evidencias') as $file) {
                $path = $file->store('denuncias', 'public');

                $denuncia->fotos()->create([
                    'path' => $path,
                ]);
            }
        }

        // Cargar relación de fotos para devolverlas en la respuesta
        $denuncia->load('fotos');

        return response()->json([
            'message' => 'Denuncia registrada correctamente.',
            'data' => $denuncia,
        ], 201);
    }

    // Listar todas las denuncias (incluye fotos)
    public function index(): JsonResponse
    {
        $denuncias = Denuncia::with('fotos')->orderBy('created_at', 'desc')->get();

        return response()->json([
            'data' => $denuncias
        ], 200);
    }

    // Mostrar una denuncia específica (incluye fotos)
    public function show(int $id): JsonResponse
    {
        $denuncia = Denuncia::with('fotos')->find($id);

        if (!$denuncia) {
            return response()->json([
                'message' => 'Denuncia no encontrada.'
            ], 404);
        }

        return response()->json([
            'data' => $denuncia
        ], 200);
    }

    // Eliminar denuncia (las fotos en BD se eliminan por cascade; archivos quedan en storage si no los borras)
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

    // Actualizar estado de denuncia (PATCH)
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

    // (Opcional) Actualizar datos de denuncia - si no lo estás usando, elimínalo para evitar duplicidad
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
        }

        $denuncia->save();

        return response()->json([
            'message' => 'Denuncia actualizada correctamente.',
            'data' => $denuncia
        ], 200);
    }
}
