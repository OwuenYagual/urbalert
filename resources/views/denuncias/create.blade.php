//@extends('layouts.app')

@section('title', 'Registrar denuncia')

@section('content')
    <h2>Registrar nueva denuncia</h2>

    <!-- Botón para abrir/ocultar la sección de denuncias -->
    <div class="text-center py-6">
        <button id="btn-denuncias" class="bg-red-600 text-white px-6 py-3 rounded hover:bg-red-700 transition">
            Mostrar/Ocultar formulario
        </button>
    </div>

    <!-- Sección de denuncias (oculta al inicio) -->
    <section id="denuncias" class="py-6 bg-gray-50 text-center">

    <form id="denuncia-form" style="max-width: 600px; margin: 0 auto; margin-top: 16px; text-align: left;">
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

    </section>

    <script>
        // Mostrar/ocultar sección de denuncias desde la propia vista
        (function(){
            const btn = document.getElementById('btn-denuncias');
            const section = document.getElementById('denuncias');
            if(!btn || !section) return;
            // por defecto ocultar la sección si está dentro de otra página
            section.classList.add('hidden');
            btn.addEventListener('click', () => {
                section.classList.toggle('hidden');
                if(!section.classList.contains('hidden')) section.scrollIntoView({ behavior: 'smooth' });
            });
        })();
    </script>
@endsection
