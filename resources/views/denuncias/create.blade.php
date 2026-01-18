@extends('layouts.app')

@section('title', 'Registrar denuncia')

@section('content')
    <div style="max-width: 600px; margin: 0 auto;">
        <h2 style="text-align: center;">Registrar nueva denuncia</h2>

        <form id="denuncia-form" style="margin-top: 16px;">
            <div style="margin-bottom: 12px;">
                <label for="titulo">Título</label><br>
                <input
                    type="text"
                    id="titulo"
                    name="titulo"
                    required
                    style="width: 100%; padding: 8px; box-sizing: border-box;"
                >
            </div>

            <div style="margin-bottom: 12px;">
                <label for="descripcion">Descripción</label><br>
                <textarea
                    id="descripcion"
                    name="descripcion"
                    rows="4"
                    required
                    style="width: 100%; padding: 8px; box-sizing: border-box;"
                ></textarea>
            </div>

            <div style="margin-bottom: 12px;">
                <label for="categoria">Categoría</label><br>
                <select
                    id="categoria"
                    name="categoria"
                    required
                    style="width: 100%; padding: 8px; box-sizing: border-box;"
                >
                    <option value="">Seleccione una categoría</option>
                    <option value="Salud pública">Salud pública</option>
                    <option value="Alumbrado">Alumbrado</option>
                    <option value="Seguridad">Seguridad</option>
                    <option value="Infraestructura">Infraestructura</option>
                    <option value="Otros">Otros</option>
                </select>
            </div>

            {{-- Buscador --}}
            <div style="margin-bottom: 12px;">
                <label for="buscador-direccion">Buscar ubicación</label><br>
                <input
                    type="text"
                    id="buscador-direccion"
                    placeholder="Escribe una dirección o lugar..."
                    style="width: 100%; padding: 8px;"
                    autocomplete="off"
                >
                <small style="color:#555;">Selecciona una sugerencia o marca el punto en el mapa.</small>
            </div>

            {{-- Mapa --}}
            <div style="margin-bottom: 12px;">
                <div id="map" style="width: 100%; height: 320px; border: 1px solid #ddd; border-radius: 6px;"></div>
            </div>

            {{-- Campos ocultos (los que irán al backend) --}}
            <input type="hidden" id="ubicacion" name="ubicacion">
            <input type="hidden" id="lat" name="lat">
            <input type="hidden" id="lng" name="lng">

            <div style="margin-top: 16px; text-align: center;">
                <button type="submit" class="btn">Enviar denuncia</button>
                <a href="/" class="btn" style="background-color: #6b7280;">Cancelar</a>
            </div>
        </form>

        <div id="mensaje" style="margin-top: 16px;"></div>
    </div>
@endsection

