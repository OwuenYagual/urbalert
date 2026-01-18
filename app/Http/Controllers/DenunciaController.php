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
            'user_id' => auth()->id(),
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
        $denuncias = Denuncia::with('fotos')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json(['data' => $denuncias], 200);
    }

    // Mostrar una denuncia específica (incluye fotos)
    public function show(int $id): JsonResponse
    {
        $denuncia = Denuncia::with('fotos')->find($id);

        if (!$denuncia) {
            return response()->json(['message' => 'Denuncia no encontrada.'], 404);
        }

        return response()->json(['data' => $denuncia], 200);
    }

    public function destroy(int $id): JsonResponse
    {
        $denuncia = Denuncia::findOrFail($id);
        $this->authorize('delete', $denuncia);

        $denuncia->delete();

        return response()->json(['message' => 'Denuncia eliminada correctamente.'], 200);
    }

    public function updateEstado(UpdateDenunciaEstadoRequest $request, int $id): JsonResponse
    {
        $denuncia = Denuncia::findOrFail($id);
        $this->authorize('updateEstado', $denuncia);

        $denuncia->estado = $request->estado;
        $denuncia->save();

        return response()->json([
            'message' => 'Estado actualizado correctamente.',
            'data' => $denuncia
        ], 200);
    }

    public function update(int $id, Request $request): JsonResponse
    {
        $denuncia = Denuncia::findOrFail($id);

        // IMPORTANTE: aquí se aplica la Policy (dueño o admin)
        $this->authorize('update', $denuncia);

        // usuario normal NO puede cambiar estado por este endpoint
        $request->request->remove('estado');

        $denuncia->fill($request->only([
            'titulo', 'descripcion', 'categoria', 'ubicacion', 'lat', 'lng'
        ]));
        $denuncia->save();

        // subir nuevas evidencias (se agregan, no reemplazan)
        if ($request->hasFile('evidencias')) {
            foreach ($request->file('evidencias') as $file) {
                $path = $file->store('denuncias', 'public');
                $denuncia->fotos()->create(['path' => $path]);
            }
        }

        return response()->json([
            'message' => 'Denuncia actualizada correctamente.',
            'data' => $denuncia->load('fotos'),
        ], 200);
    }

}
