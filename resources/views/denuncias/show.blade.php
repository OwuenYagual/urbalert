@extends('layouts.app')

@section('title', 'Detalle de denuncia')

@section('content')
    <h2>Detalle de la denuncia</h2>

    <div id="detalle-denuncia" data-id="{{ $id }}">
        <p>Cargando información...</p>
    </div>

    <div style="margin-top: 20px;">
        <a href="/" class="btn">Volver al listado</a>
    </div>
@endsection