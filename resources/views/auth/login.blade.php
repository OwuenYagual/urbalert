@extends('layouts.app')

@section('title', 'Iniciar sesión')

@section('content')
<div class="login-container">
    <h2>Iniciar sesión</h2>
    <form method="POST" action="/login">
        @csrf
        <input type="email" name="email" placeholder="Correo" required>
        <input type="password" name="password" placeholder="Contraseña" required>
        <button type="submit">Entrar</button>
    </form>
    <a href="{{ route('register') }}" style="display:block; margin-top:10px; color:#2563eb;">Registrarse</a>
</div>

@endsection
