@extends('layouts.app')

@section('title', 'Listado de denuncias')

@section('content')
    <h2>Denuncias registradas</h2>

    <div style="margin-bottom: 16px;">
        <a href="/denuncias/crear" class="btn">Registrar nueva denuncia</a>
    </div>

    <div class="denuncias-grid" id="denuncias-container">
        <p style="text-align: center; grid-column: 1 / -1;">Cargando denuncias...</p>
    </div>

    <!-- Modal de detalles -->
    <div id="modal-detalle" class="modal">
        <div class="modal-content">
            <span class="modal-close" onclick="cerrarModal()">&times;</span>
            <div id="detalle-contenido">
                <p>Cargando detalles...</p>
            </div>
        </div>
    </div>
@endsection
