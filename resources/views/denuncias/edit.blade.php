@extends('layouts.app')

@section('title', 'Editar denuncia')

@section('content')
<div style="max-width: 700px; margin: 0 auto;">
    <h2 style="text-align:center;">Editar denuncia</h2>

    <form id="denuncia-edit-form" data-id="{{ $id }}" style="margin-top:16px;" enctype="multipart/form-data">
        @csrf

        <div style="margin-bottom: 12px;">
            <label for="titulo">Título</label><br>
            <input type="text" id="titulo" name="titulo" required style="width:100%; padding:8px;">
        </div>

        <div style="margin-bottom: 12px;">
            <label for="descripcion">Descripción</label><br>
            <textarea id="descripcion" name="descripcion" rows="4" required style="width:100%; padding:8px;"></textarea>
        </div>

        <div style="margin-bottom: 12px;">
            <label for="categoria">Categoría</label><br>
            <select id="categoria" name="categoria" required style="width:100%; padding:8px;">
                <option value="">Seleccione una categoría</option>
                <option value="Salud pública">Salud pública</option>
                <option value="Alumbrado">Alumbrado</option>
                <option value="Seguridad">Seguridad</option>
                <option value="Infraestructura">Infraestructura</option>
                <option value="Otros">Otros</option>
            </select>
        </div>

        <div style="margin-bottom: 12px;">
            <label for="buscador-direccion">Buscar ubicación</label><br>
            <input type="text" id="buscador-direccion" placeholder="Escribe una dirección o lugar..." style="width:100%; padding:8px;" autocomplete="off">
            <small style="color:#555;">Mueve el pin para ajustar la ubicación.</small>
        </div>

        <div style="margin-bottom: 12px;">
            <div id="map" style="width:100%; height:320px; border:1px solid #ddd; border-radius:6px;"></div>
        </div>

        <input type="hidden" id="ubicacion" name="ubicacion">
        <input type="hidden" id="lat" name="lat">
        <input type="hidden" id="lng" name="lng">

        <div style="margin-top: 14px;">
            <label>Evidencias actuales</label>
            <div id="evidencias-actuales" style="display:flex; gap:10px; flex-wrap:wrap; margin-top:10px;"></div>
        </div>

        <div style="margin-top: 14px;">
            <label for="evidencias">Agregar nuevas evidencias (opcional)</label><br>
            <input type="file" id="evidencias" name="evidencias[]" multiple accept="image/*">
        </div>

        <div style="margin-top: 16px; text-align:center;">
            <button type="submit" class="btn">Guardar cambios</button>
            <a href="/denuncias/{{ $id }}" class="btn" style="background:#6b7280;">Cancelar</a>
        </div>
    </form>

    <div id="mensaje" style="margin-top:16px;"></div>
</div>
@endsection
