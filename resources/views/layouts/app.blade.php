<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>@yield('title', 'Urbalert')</title>

    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    @vite(['resources/css/app.css', 'resources/js/app.js'])

    <style>
        /* Layout: footer stays at bottom when content is corto */
        html, body { height: 100%; }
        body { display: flex; flex-direction: column; min-height: 100vh; }
        main { flex: 1 0 auto; }
        footer { flex-shrink: 0; }
    </style>

    @yield('styles')
</head>
<body>

<header>
    <div style="display:flex; align-items:center; gap:12px;">
        <a href="/">
            <img src="/images/logo.png" alt="Urbalert" style="height:48px; object-fit:contain; vertical-align:middle;" onerror="this.style.display='none'">
        </a>
        <nav>
            <a href="/listar_denuncias.html">Denuncias</a>
            <a href="/registrar_denuncia.html">Registrar denuncia</a>
        </nav>
    </div>
</header>

<main>
    @yield('content')
</main>

<footer>
    <p>Urbalert &copy; {{ date('Y') }} — Sistema de denuncias comunitarias</p>
</footer>

{{-- Espacio para scripts adicionales por vista --}}
@yield('scripts')

</body>
</html>
