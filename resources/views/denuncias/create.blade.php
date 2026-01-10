@extends('layouts.app')

@section('title', 'Registrar denuncia')

@section('content')
    <h2>Registrar nueva denuncia</h2>

    <form id="denuncia-form" style="max-width: 600px; margin-top: 16px;">
        <div style="margin-bottom: 12px;">
            <label for="titulo">Título</label><br>
            <input
                type="text"
                id="titulo"
                name="titulo"
                required
                style="width: 100%; padding: 8px;"
            >
        </div>

        <div style="margin-bottom: 12px;">
            <label for="descripcion">Descripción</label><br>
            <textarea
                id="descripcion"
                name="descripcion"
                rows="4"
                required
                style="width: 100%; padding: 8px;"
            ></textarea>
        </div>

        <div style="margin-bottom: 12px;">
            <label for="categoria">Categoría</label><br>
            <select
                id="categoria"
                name="categoria"
                required
                style="width: 100%; padding: 8px;"
            >
                <option value="">Seleccione una categoría</option>
                <option value="Salud pública">Salud pública</option>
                <option value="Alumbrado">Alumbrado</option>
                <option value="Seguridad">Seguridad</option>
                <option value="Infraestructura">Infraestructura</option>
                <option value="Otros">Otros</option>
            </select>
        </div>

        <div style="margin-bottom: 12px;">
            <label for="ubicacion">Ubicación</label><br>
            <input
                type="text"
                id="ubicacion"
                name="ubicacion"
                required
                style="width: 100%; padding: 8px;"
            >
        </div>

        <div style="margin-top: 16px;">
            <button type="submit" class="btn">Enviar denuncia</button>
            <a href="/" class="btn" style="background-color: #6b7280;">Cancelar</a>
        </div>
    </form>

    <div id="mensaje" style="margin-top: 16px;"></div>
@endsection
