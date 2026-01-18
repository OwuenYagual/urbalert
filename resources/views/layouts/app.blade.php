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

<header style="display: flex; justify-content: flex-end; align-items: center; padding: 0.5rem 1rem; gap: 1rem;">
    
    @auth
        <!-- Usuario logueado: Inicio, Denuncias, Registrar denuncia + Cerrar sesión -->
        <nav class="nav-right" style="display: flex; gap: 1rem; align-items: center;">
            <a href="/">Inicio</a>
            <a href="/denuncias">Denuncias</a>
            <a href="/denuncias/crear">Registrar denuncia</a>
            <form id="logout-form" action="{{ route('logout') }}" method="POST" style="display: none;">
                @csrf
            </form>
            <a href="#" onclick="event.preventDefault(); document.getElementById('logout-form').submit();">
                Cerrar sesión
            </a>
        </nav>
    @else
        <!-- Usuario no logueado: Inicio, Denuncias, Registrar denuncia + Iniciar sesión -->
        <nav class="nav-right" style="display: flex; gap: 1rem; align-items: center;">
            <a href="/">Inicio</a>
            <a href="/denuncias">Denuncias</a>
            <a href="/denuncias/crear">Registrar denuncia</a>
            <a href="{{ route('login') }}">Iniciar sesión</a>
        </nav>
    @endauth

</header>


<main>
    @yield('content')
</main>



@yield('scripts')

<!-- Script para confirmación de logout -->
<script>
function confirmLogout(event) {
    event.preventDefault();
    if (confirm("¿Estás seguro que quieres cerrar sesión?")) {
        document.getElementById('logout-form').submit();
    }
}
</script>
<footer>
    <p>Urbalert &copy; {{ date('Y') }} — Sistema de denuncias comunitarias</p>
</footer>

{{-- Espacio para scripts adicionales por vista --}}
@yield('scripts')

<script async src="https://maps.googleapis.com/maps/api/js?key={{ env('GOOGLE_MAPS_API_KEY') }}&libraries=places" defer></script>



</body>
</html>
