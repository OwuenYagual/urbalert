import './bootstrap';

function cargarDenuncias() {
    const tbody = document.getElementById('denuncias-body');
    if (!tbody) return;

    fetch('/api/denuncias')
        .then(response => {
            if (!response.ok) throw new Error('Error en la respuesta del servidor');
            return response.json();
        })
        .then(result => {
            const denuncias = result.data;
            tbody.innerHTML = '';

            if (!denuncias || denuncias.length === 0) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="4">No existen denuncias registradas.</td>
                    </tr>
                `;
                return;
            }

            denuncias.forEach(d => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${d.titulo}</td>
                    <td>${d.categoria}</td>
                    <td><strong>${d.estado}</strong></td>
                    <td>
                        <a href="/denuncias/${d.id}" class="btn">Ver detalle</a>
                        <button class="btn btn-delete btn-eliminar" data-id="${d.id}">
                            Eliminar
                        </button>

                    </td>
                `;
                tbody.appendChild(row);
            });
        })
        .catch(() => {
            tbody.innerHTML = `
                <tr>
                    <td colspan="4">Error al cargar las denuncias.</td>
                </tr>
            `;
        });
}

function mostrarMensajeGlobal(texto, tipo = 'info') {
    const el = document.getElementById('mensaje-global');
    if (!el) return;

    let color = '#2563eb'; // azul
    if (tipo === 'success') color = '#16a34a';
    if (tipo === 'error') color = '#dc2626';
    if (tipo === 'warning') color = '#d97706';

    el.innerHTML = `
        <div style="padding:10px; border-radius:6px; border:1px solid #ddd; color:${color}; background:#fff;">
            ${texto}
        </div>
    `;

    setTimeout(() => {
        el.innerHTML = '';
    }, 3000);
}

function confirmarEliminacion() {
    return confirm('¿Está seguro de querer eliminar esta denuncia? Esta acción no se puede deshacer.');
}

function activarBotonesEliminar() {
    const tbody = document.getElementById('denuncias-body');
    if (!tbody) return;

    tbody.addEventListener('click', (e) => {
        const btn = e.target.closest('.btn-eliminar');
        if (!btn) return;

        const id = btn.dataset.id;
        eliminarDenuncia(id, btn);
    });
}


function crearDenuncia() {
    const form = document.getElementById('denuncia-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const mensajeEl = document.getElementById('mensaje');

        const ubicacion = document.getElementById('ubicacion').value?.trim();
        const lat = document.getElementById('lat').value;
        const lng = document.getElementById('lng').value;

        // Validación mínima de ubicación seleccionada (mapa/autocomplete)
        if (!ubicacion || !lat || !lng) {
            mensajeEl.innerHTML =
                '<p style="color: red;">Seleccione una ubicación en el mapa (busque o marque el punto) antes de enviar.</p>';
            return;
        }

        const seleccionada = typeof window.__urbalertUbicacionSeleccionada === 'function'
            ? window.__urbalertUbicacionSeleccionada()
            : true;

        if (!seleccionada) {
            mensajeEl.innerHTML =
                '<p style="color:red;">Seleccione la ubicación en el mapa (clic, arrastre el pin o use el buscador) antes de enviar.</p>';
            return;
        }

        const data = {
            titulo: document.getElementById('titulo').value,
            descripcion: document.getElementById('descripcion').value,
            categoria: document.getElementById('categoria').value,
            ubicacion,
            lat: Number(lat),
            lng: Number(lng),
        };

        fetch('/api/denuncias', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then(async (response) => {
                const payload = await response.json().catch(() => ({}));
                if (!response.ok) throw payload;
                return payload;
            })
            .then(() => {
                mensajeEl.innerHTML =
                    '<p style="color: green;">Denuncia registrada correctamente. Redirigiendo...</p>';

                setTimeout(() => {
                    window.location.href = '/denuncias'; 
                }, 800);
            })
            .catch((error) => {
                let msg = 'Error al registrar la denuncia.';
                if (error?.errors) {
                    msg = Object.values(error.errors).flat().join('<br>');
                } else if (error?.message) {
                    msg = error.message;
                }
                mensajeEl.innerHTML = `<p style="color: red;">${msg}</p>`;
            });
    });
}

function initMapaRegistroDenuncia() {
    const mapEl = document.getElementById('map');
    const inputBuscar = document.getElementById('buscador-direccion');
    const inputUbicacion = document.getElementById('ubicacion');
    const inputLat = document.getElementById('lat');
    const inputLng = document.getElementById('lng');

    if (!mapEl || !inputBuscar || !inputUbicacion || !inputLat || !inputLng) return;

    if (!window.google || !google.maps) {
        console.error('Google Maps API no cargó. Revisa la API KEY / script del layout.');
        return;
    }

    const defaultCenter = { lat: -2.170998, lng: -79.922359 }; // Guayaquil

    const map = new google.maps.Map(mapEl, {
        center: defaultCenter,
        zoom: 13,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
    });

    const geocoder = new google.maps.Geocoder();

    // Exigir selección real del usuario
    let ubicacionSeleccionada = false;

    // Marcador (preferido: AdvancedMarkerElement; fallback: Marker)
    let advMarker = null;
    let legacyMarker = null;

    function setMarkerPosition(center) {
        if (advMarker) {
            advMarker.position = center;
        } else if (legacyMarker) {
            legacyMarker.setPosition(center);
        }
    }

    function getMarkerPosition() {
        if (advMarker && advMarker.position) return advMarker.position;
        if (legacyMarker) return legacyMarker.getPosition();
        return null;
    }

    function setLatLng(latLng) {
        inputLat.value = typeof latLng.lat === 'function' ? latLng.lat() : latLng.lat;
        inputLng.value = typeof latLng.lng === 'function' ? latLng.lng() : latLng.lng;
        ubicacionSeleccionada = true;
    }

    function setDireccionFromLatLng(latLng) {
        geocoder.geocode({ location: latLng }, (results, status) => {
            if (status === 'OK' && results && results[0]) {
                inputUbicacion.value = results[0].formatted_address;
                inputBuscar.value = results[0].formatted_address;
            }
        });
    }

    // Crear marcador
    if (google.maps.marker && google.maps.marker.AdvancedMarkerElement) {
        advMarker = new google.maps.marker.AdvancedMarkerElement({
            position: defaultCenter,
            map,
        });
        // Nota: AdvancedMarker no soporta draggable igual que Marker clásico sin configuración extra.
        // Para arrastre, mantenemos click en mapa como principal.
    } else {
        legacyMarker = new google.maps.Marker({
            position: defaultCenter,
            map,
            draggable: true,
        });

        legacyMarker.addListener('dragend', () => {
            const pos = legacyMarker.getPosition();
            if (!pos) return;
            setLatLng(pos);
            setDireccionFromLatLng(pos);
        });
    }

    // Click en mapa: mover pin + guardar coords + dirección
    map.addListener('click', (e) => {
        setMarkerPosition(e.latLng);
        map.panTo(e.latLng);
        setLatLng(e.latLng);
        setDireccionFromLatLng(e.latLng);
    });

    // Autocomplete
    const autocomplete = new google.maps.places.Autocomplete(inputBuscar, {
        fields: ['geometry', 'formatted_address', 'name'],
        componentRestrictions: { country: ['ec'] },
    });

    autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (!place.geometry || !place.geometry.location) return;

        const loc = place.geometry.location;

        map.panTo(loc);
        map.setZoom(16);
        setMarkerPosition(loc);

        setLatLng(loc);
        inputUbicacion.value = place.formatted_address || place.name || inputBuscar.value;
    });

    // Geolocalización (solo centra, NO marca como seleccionada)
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const userLoc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
                map.setCenter(userLoc);
                map.setZoom(15);
                setMarkerPosition(userLoc);

                inputLat.value = userLoc.lat;
                inputLng.value = userLoc.lng;
            },
            () => { /* ignore */ }
        );
    }

    window.__urbalertUbicacionSeleccionada = () => ubicacionSeleccionada;
}

function cargarDetalleDenuncia() {
    const container = document.getElementById('detalle-denuncia');
    if (!container) return;

    const mapEl = document.getElementById('map-show');
    const id = container.dataset.id;

    fetch(`/api/denuncias/${id}`)
        .then(response => {
            if (!response.ok) throw new Error('Denuncia no encontrada');
            return response.json();
        })
        .then(result => {
            const d = result.data;

            const lat = Number(d.lat);
            const lng = Number(d.lng);

            container.innerHTML = `
                <p><strong>Título:</strong> ${d.titulo}</p>
                <p><strong>Descripción:</strong> ${d.descripcion}</p>
                <p><strong>Categoría:</strong> ${d.categoria}</p>
                <p><strong>Ubicación:</strong> ${d.ubicacion}</p>
                <p><strong>Estado:</strong> ${d.estado}</p>
                <p>
                    <a class="btn" target="_blank" rel="noopener"
                       href="https://www.google.com/maps?q=${lat},${lng}">
                       Ver en Google Maps
                    </a>
                </p>
            `;

            if (mapEl && window.google && google.maps && !Number.isNaN(lat) && !Number.isNaN(lng)) {
                const center = { lat, lng };

                const map = new google.maps.Map(mapEl, {
                    center,
                    zoom: 16,
                });

                if (google.maps.marker && google.maps.marker.AdvancedMarkerElement) {
                    new google.maps.marker.AdvancedMarkerElement({ position: center, map });
                } else {
                    new google.maps.Marker({ position: center, map });
                }
            } else if (mapEl) {
                mapEl.innerHTML = '<p style="padding:8px;">No se pudo cargar el mapa para esta denuncia.</p>';
            }
        })
        .catch(() => {
            container.innerHTML = '<p>No se pudo cargar la información de la denuncia.</p>';
            if (mapEl) mapEl.innerHTML = '';
        });
}

function eliminarDenuncia(id) {
    if (!id) return;

    const ok = confirm('¿Está seguro de eliminar esta denuncia? Esta acción no se puede deshacer.');
    if (!ok) return;

    fetch(`/api/denuncias/${id}`, {
        method: 'DELETE',
        headers: { 'Accept': 'application/json' },
    })
        .then(async (response) => {
            if (response.status === 204) return {}; 
            const payload = await response.json().catch(() => ({}));
            if (!response.ok) throw payload;
            return payload;
        })
        .then(() => {
            // refrescar listado
            cargarDenuncias();
        })
        .catch((error) => {
            const msg = error?.message || 'No se pudo eliminar la denuncia.';
            alert(msg);
        });
}

// Exponer para onclick inline
window.eliminarDenuncia = eliminarDenuncia;

document.addEventListener('DOMContentLoaded', () => {
    cargarDenuncias();
    crearDenuncia();
    cargarDetalleDenuncia();
    activarBotonesEliminar();
    initMapaRegistroDenuncia();
});
