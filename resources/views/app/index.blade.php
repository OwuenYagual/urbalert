@extends('layouts.app')

@section('title', 'Listado de denuncias')

@section('content')
    <h2>Denuncias registradas</h2>

    <div style="margin-bottom: 16px;">
        <a href="/denuncias/crear" class="btn">Registrar nueva denuncia</a>
    </div>

    <table>
        <thead>
            <tr>
                <th>Título</th>
                <th>Categoría</th>
                <th>Estado</th>
                <th>Acción</th>
            </tr>
        </thead>
        <tbody id="denuncias-body">
            <tr>
                <td colspan="4">Cargando denuncias...</td>
            </tr>
        </tbody>
    </table>
@endsection
