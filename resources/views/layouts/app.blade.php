<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>@yield('title', 'Urbalert')</title>

    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    @vite(['resources/css/app.css', 'resources/js/app.js'])
    
    @yield('styles')
</head>
<body>

<header>
    <h1>
        <a href="/" style="color: white; text-decoration: none;">
            Urbalert
        </a>
    </h1>
    <nav>
        <a href="/">Denuncias</a>
        <a href="/denuncias/crear">Registrar denuncia</a>
    </nav>
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
