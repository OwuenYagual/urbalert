@extends('layouts.app')

@section('title', 'Inicio - Urbalert')

@section('content')
    <div class="inicio-container">
        <section class="hero">
            <h2>Bienvenido a Urbalert</h2>
            <p class="intro-text">
                Urbalert es una plataforma de denuncias que te permite comunicar problematicas 
                de seguridad, infraestructura y servicios públicos en tu comunidad. 
                Que tu voz, nos ayude a construir una mejor comunidad.
            </p>
        </section>

        <section class="features">
            <div class="feature-card">
                <h3>Reporta Problemas</h3>
                <p>Registra denuncias sobre delitos, daños a infraestructura y otros problemas que afecten tu zona.</p>
            </div>
            <div class="feature-card">
                <h3>Comunidad Activa</h3>
                <p>Forma parte de una red de ciudadanos comprometidos con la seguridad local.</p>
            </div>
            <div class="feature-card">
                <h3>Información Transparente</h3>
                <p>Visualiza reportes de tu comunidad y mantente informado sobre lo que sucede alrededor.</p>
            </div>
        </section>

        <section class="emergencias">
            <h2>Contactos de Emergencia</h2>
            <div class="contactos-grid">
                <div class="contacto-card emergencia">
                    <h3>Emergencia General</h3>
                    <p class="numero">911</p>
                    <p class="descripcion">Para cualquier emergencia o peligro inmediato</p>
                </div>
                <div class="contacto-card policia">
                    <h3>Policía Nacional</h3>
                    <p class="numero">112</p>
                    <p class="descripcion">Delitos y situaciones de seguridad pública</p>
                </div>
                <div class="contacto-card bomberos">
                    <h3>Bomberos</h3>
                    <p class="numero">119</p>
                    <p class="descripcion">Incendios, rescates y emergencias técnicas</p>
                </div>
            </div>
        </section>

        <section class="cta">
            <h3>¿Necesitas reportar algo?</h3>
            <a href="/denuncias/crear" class="btn btn-cta">Registrar Denuncia</a>
            <a href="/denuncias" class="btn btn-secondary">Ver Denuncias</a>
        </section>
    </div>
@endsection
