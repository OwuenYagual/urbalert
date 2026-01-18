@extends('layouts.app')

@section('title', 'Registrarse')

@section('content')
<div class="auth-container">
    <h2>Crear cuenta</h2>
    @if ($errors->any())
        <div style="color:#dc2626; background:#fee2e2; padding:10px; border-radius:6px; margin-bottom:12px;">
            <ul style="margin:0; padding-left:18px;">
                @foreach ($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
    @endif

    <form method="POST" action="{{ route('register') }}">
        @csrf

        <input type="text" name="name" placeholder="Nombre completo" required>
        <input type="email" name="email" placeholder="Correo electrónico" required>
        <input type="password" name="password" placeholder="Contraseña" required>
        <input type="password" name="password_confirmation" placeholder="Confirmar contraseña" required>

        <button type="submit">Registrarse</button>
    </form>

    <a href="{{ route('login') }}" class="alt-action">¿Ya tienes cuenta? Iniciar sesión</a>
</div>
@endsection
