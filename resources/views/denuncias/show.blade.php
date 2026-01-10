@extends('layouts.app')

@section('title', 'Detalle de denuncia')

@section('content')
    <h2>Detalle de la denuncia</h2>

    <div id="detalle-denuncia">
        <p>Cargando información...</p>
    </div>

    <div style="margin-top: 20px;">
        <a href="/" class="btn">Volver al listado</a>
    </div>
@endsection

@section('scripts')
<script>
    document.addEventListener('DOMContentLoaded', () => {
        const id = {{ $id }};
        const container = document.getElementById('detalle-denuncia');

        fetch(`/api/denuncias/${id}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Denuncia no encontrada');
                }
                return response.json();
            })
            .then(result => {
                const d = result.data;

                container.innerHTML = `
                    <p><strong>Título:</strong> ${d.titulo}</p>
                    <p><strong>Descripción:</strong> ${d.descripcion}</p>
                    <p><strong>Categoría:</strong> ${d.categoria}</p>
                    <p><strong>Ubicación:</strong> ${d.ubicacion}</p>
                    <p><strong>Estado:</strong> ${d.estado}</p>
                `;
            })
            .catch(() => {
                container.innerHTML = `
                    <p>No se pudo cargar la información de la denuncia.</p>
                `;
            });
    });
</script>
@endsection
