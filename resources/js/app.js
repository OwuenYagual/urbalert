import './bootstrap';

/* =========================
   LISTADO (CARDS)
========================= */
function cargarDenuncias() {
    const container = document.getElementById('denuncias-container');
    if (!container) return;

    fetch('/api/denuncias', { headers: { 'Accept': 'application/json' } })
        .then(response => {
            if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
            return response.json();
        })
        .then(result => {
            const denuncias = result.data;
            container.innerHTML = '';

            if (!denuncias || denuncias.length === 0) {
                container.innerHTML = `<p style="text-align:center; grid-column:1/-1;">No existen denuncias registradas.</p>`;
                return;
            }

            denuncias.forEach(d => {
                const estadoClass = `estado-${String(d.estado).toLowerCase().replace(/\s+/g, '_')}`;
                const card = document.createElement('div');
                card.className = 'denuncia-card';
                card.style.cursor = 'pointer';

                card.innerHTML = `
                    <div class="denuncia-categoria">${d.categoria}</div>
                    <h3>${d.titulo}</h3>
                    <p class="denuncia-ubicacion"><i class="icon-location"></i> ${d.ubicacion}</p>
                    <p class="denuncia-descripcion">${d.descripcion.substring(0, 100)}${d.descripcion.length > 100 ? '...' : ''}</p>
                    <div class="denuncia-footer">
                        <span class="estado ${estadoClass}">${d.estado}</span>
                        <span class="fecha">${new Date(d.created_at).toLocaleDateString('es-ES')}</span>
                    </div>
                `;

                card.addEventListener('click', () => abrirModalDetalle(d.id));
                container.appendChild(card);
            });
        })
        .catch((error) => {
            console.error('Error al cargar denuncias:', error);
            container.innerHTML = `<p style="text-align:center; grid-column:1/-1; color:red;">Error al cargar las denuncias.</p>`;
        });
}

function cargarDenunciasInicio() {
    const container = document.getElementById('denuncias-inicio-container');
    if (!container) return;

    fetch('/api/denuncias', { headers: { 'Accept': 'application/json' } })
        .then(response => {
            if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
            return response.json();
        })
        .then(result => {
            const denuncias = result.data ? result.data.slice(0, 6) : [];
            container.innerHTML = '';

            if (!denuncias || denuncias.length === 0) {
                container.innerHTML = `<p style="text-align:center; grid-column:1/-1;">No existen denuncias registradas.</p>`;
                return;
            }

            denuncias.forEach(d => {
                const estadoClass = `estado-${String(d.estado).toLowerCase().replace(/\s+/g, '_')}`;
                const card = document.createElement('div');
                card.className = 'denuncia-card';
                card.style.cursor = 'pointer';

                card.innerHTML = `
                    <div class="denuncia-categoria">${d.categoria}</div>
                    <h3>${d.titulo}</h3>
                    <p class="denuncia-ubicacion"><i class="icon-location"></i> ${d.ubicacion}</p>
                    <p class="denuncia-descripcion">${d.descripcion.substring(0, 100)}${d.descripcion.length > 100 ? '...' : ''}</p>
                    <div class="denuncia-footer">
                        <span class="estado ${estadoClass}">${d.estado}</span>
                        <span class="fecha">${new Date(d.created_at).toLocaleDateString('es-ES')}</span>
                    </div>
                `;

                card.addEventListener('click', () => abrirModalDetalle(d.id));
                container.appendChild(card);
            });
        })
        .catch((error) => {
            console.error('Error al cargar denuncias inicio:', error);
            container.innerHTML = `<p style="text-align:center; grid-column:1/-1; color:red;">Error al cargar las denuncias.</p>`;
        });
}

/* =========================
   MODAL DETALLE (HOME/INDEX)
========================= */
function abrirModalDetalle(id) {
    const modal = document.getElementById('modal-detalle');
    const contenido = document.getElementById('detalle-contenido');
    if (!modal || !contenido) return;

    fetch(`/api/denuncias/${id}`, { headers: { 'Accept': 'application/json' } })
        .then(response => {
            if (!response.ok) throw new Error('Denuncia no encontrada');
            return response.json();
        })
        .then(result => {
            const d = result.data;
            const estadoClass = `estado-${String(d.estado).toLowerCase().replace(/\s+/g, '_')}`;

            contenido.innerHTML = `
                <h2 class="modal-detalle-titulo">${d.titulo}</h2>

                <div class="modal-detalle-seccion">
                    <div class="modal-detalle-label">Categoría</div>
                    <div class="modal-detalle-valor">
                        <span class="modal-detalle-badge denuncia-categoria" style="display:inline-block;">${d.categoria}</span>
                    </div>
                </div>

                <div class="modal-detalle-seccion">
                    <div class="modal-detalle-label">Estado</div>
                    <div class="modal-detalle-valor">
                        <span class="estado ${estadoClass}">${d.estado}</span>
                    </div>
                </div>

                <div class="modal-detalle-seccion">
                    <div class="modal-detalle-label">Ubicación</div>
                    <div class="modal-detalle-valor">${d.ubicacion}</div>
                </div>

                <div class="modal-detalle-seccion">
                    <div class="modal-detalle-label">Descripción</div>
                    <div class="modal-detalle-valor">${d.descripcion}</div>
                </div>

                <div class="modal-detalle-seccion">
                    <div class="modal-detalle-label">Fecha de registro</div>
                    <div class="modal-detalle-valor">${new Date(d.created_at).toLocaleDateString('es-ES', { year:'numeric', month:'long', day:'numeric', hour:'2-digit', minute:'2-digit' })}</div>
                </div>

                <div class="modal-detalle-acciones">
                    <a href="/denuncias/${d.id}" class="btn">Ver página completa</a>
                    <button class="btn btn-delete" onclick="eliminarDenuncia(${d.id}, { refresh: true, closeModal: true })">Eliminar</button>
                </div>
            `;

            modal.classList.add('active');
        })
        .catch(() => {
            contenido.innerHTML = '<p>No se pudo cargar la información de la denuncia.</p>';
            modal.classList.add('active');
        });
}

function cerrarModal() {
    const modal = document.getElementById('modal-detalle');
    if (modal) modal.classList.remove('active');
}

/* =========================
   CREATE (FORM + FOTOS)
========================= */
function crearDenuncia() {
    const form = document.getElementById('denuncia-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const mensajeEl = document.getElementById('mensaje');

        const ubicacion = document.getElementById('ubicacion')?.value?.trim();
        const lat = document.getElementById('lat')?.value;
        const lng = document.getElementById('lng')?.value;

        if (!ubicacion || !lat || !lng) {
            mensajeEl.innerHTML = '<p style="color:red;">Seleccione una ubicación en el mapa antes de enviar.</p>';
            return;
        }

        const seleccionada = typeof window.__urbalertUbicacionSeleccionada === 'function'
            ? window.__urbalertUbicacionSeleccionada()
            : true;

        if (!seleccionada) {
            mensajeEl.innerHTML = '<p style="color:red;">Seleccione la ubicación (clic en mapa o buscador) antes de enviar.</p>';
            return;
        }

        // FormData permite enviar archivos: evidencias[]
        const fd = new FormData(form);

        try {
            const response = await fetch('/api/denuncias', {
                method: 'POST',
                credentials: 'same-origin',
                headers: { 'Accept': 'application/json' },
                body: fd, // NO Content-Type manual
            });

            const payload = await response.json().catch(() => ({}));

            if (!response.ok) {
                let msg = payload?.message || 'Error al registrar la denuncia.';
                if (payload?.errors) {
                    msg = Object.values(payload.errors).flat().join('<br>');
                }
                mensajeEl.innerHTML = `<p style="color:red;">${msg}</p>`;
                return;
            }

            mensajeEl.innerHTML = '<p style="color:green;">Denuncia registrada correctamente. Redirigiendo...</p>';
            setTimeout(() => window.location.href = '/', 800);

        } catch (err) {
            console.error(err);
            mensajeEl.innerHTML = '<p style="color:red;">Error de conexión. Intente nuevamente.</p>';
        }
    });
}

/* =========================
   SHOW (DETALLE + MAPA + FOTOS)
========================= */
function cargarDetalleDenuncia() {
    const container = document.getElementById('detalle-denuncia');
    if (!container) return;

    const mapEl = document.getElementById('map-show');
    const id = container.dataset.id;

    fetch(`/api/denuncias/${id}`, { headers: { 'Accept': 'application/json' } })
        .then(response => {
            if (!response.ok) throw new Error('Denuncia no encontrada');
            return response.json();
        })
        .then(result => {
            const d = result.data;
            const estadoClass = `estado-${String(d.estado).toLowerCase().replace(/\s+/g, '_')}`;

            const lat = Number(d.lat);
            const lng = Number(d.lng);

            const fotos = Array.isArray(d.fotos) ? d.fotos : [];
            const htmlFotos = fotos.length ? `
                <div style="margin-top:18px;">
                    <label style="font-size:12px;font-weight:600;color:#6b7280;text-transform:uppercase;display:block;margin-bottom:10px;">Evidencias</label>
                    <div style="display:flex; gap:10px; flex-wrap:wrap;">
                        ${fotos.map(f => `
                            <a href="/storage/${f.path}" target="_blank" rel="noopener">
                                <img src="/storage/${f.path}" alt="Evidencia"
                                    style="width:170px;height:120px;object-fit:cover;border-radius:8px;border:1px solid #ddd;" />
                            </a>
                        `).join('')}
                    </div>
                </div>
            ` : `<p style="margin-top:16px;"><em>Sin evidencias adjuntas.</em></p>`;

            container.innerHTML = `
                <div style="background:#fff; padding:28px; border-radius:8px; box-shadow:0 2px 8px rgba(0,0,0,.1);">
                    <h3 style="margin-top:0; color:#1f2937; font-size:24px;">${d.titulo}</h3>

                    <div style="margin-bottom:20px;">
                        <label style="font-size:12px;font-weight:600;color:#6b7280;text-transform:uppercase;">Categoría</label>
                        <p style="margin:6px 0 0; color:#1f2937;">
                            <span style="display:inline-block;background:#dbeafe;color:#1e40af;padding:6px 12px;border-radius:20px;font-size:12px;font-weight:600;">
                                ${d.categoria}
                            </span>
                        </p>
                    </div>

                    <div style="margin-bottom:20px;">
                        <label style="font-size:12px;font-weight:600;color:#6b7280;text-transform:uppercase;">Estado</label>
                        <p style="margin:6px 0 0; color:#1f2937;">
                            <span class="estado ${estadoClass}">${d.estado}</span>
                        </p>
                    </div>

                    <div style="margin-bottom:20px;">
                        <label style="font-size:12px;font-weight:600;color:#6b7280;text-transform:uppercase;">Ubicación</label>
                        <p style="margin:6px 0 0; color:#1f2937;">${d.ubicacion}</p>
                    </div>

                    <div style="margin-bottom:20px;">
                        <label style="font-size:12px;font-weight:600;color:#6b7280;text-transform:uppercase;">Descripción</label>
                        <p style="margin:6px 0 0; color:#1f2937; line-height:1.6;">${d.descripcion}</p>
                    </div>

                    <div style="margin-bottom:20px;">
                        <label style="font-size:12px;font-weight:600;color:#6b7280;text-transform:uppercase;">Fecha de registro</label>
                        <p style="margin:6px 0 0; color:#1f2937;">
                            ${new Date(d.created_at).toLocaleDateString('es-ES', { year:'numeric', month:'long', day:'numeric', hour:'2-digit', minute:'2-digit' })}
                        </p>
                    </div>

                    ${htmlFotos}

                    <p style="margin-top:16px;">
                        <a class="btn" target="_blank" rel="noopener" href="https://www.google.com/maps?q=${lat},${lng}">
                            Ver en Google Maps
                        </a>
                    </p>

                    <div style="display:flex; gap:12px; margin-top:12px;">
                        <button class="btn btn-delete" style="flex:1; margin:0;" onclick="eliminarDenuncia(${d.id}, { redirect: '/' })">
                            Eliminar denuncia
                        </button>
                    </div>
                </div>
            `;

            // Mapa
            if (mapEl && window.google && google.maps && !Number.isNaN(lat) && !Number.isNaN(lng)) {
                const center = { lat, lng };
                const map = new google.maps.Map(mapEl, { center, zoom: 16 });

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

/* =========================
   DELETE (ÚNICO, reutilizable)
========================= */
async function eliminarDenuncia(id, opts = {}) {
    if (!id) return;

    const ok = confirm('¿Está seguro de querer eliminar esta denuncia? Esta acción no se puede deshacer.');
    if (!ok) return;

    try {
        const response = await fetch(`/api/denuncias/${id}`, {
            method: 'DELETE',
            credentials: 'same-origin',
            headers: { 'Accept': 'application/json' }
        });

        if (!response.ok) {
            const payload = await response.json().catch(() => ({}));
            throw new Error(payload?.message || `Error HTTP: ${response.status}`);
        }

        // Si estás en modal
        if (opts.closeModal) cerrarModal();

        // Refrescar listados
        if (opts.refresh) {
            cargarDenuncias();
            cargarDenunciasInicio();
        }

        // Redirección (ej. desde show)
        if (opts.redirect) {
            window.location.href = opts.redirect;
        }

    } catch (e) {
        alert(e.message || 'No se pudo eliminar la denuncia.');
    }
}

/* =========================
   MAPA CREATE
   (Tu función existente se mantiene; solo la dejo tal cual)
========================= */
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

    const defaultCenter = { lat: -2.170998, lng: -79.922359 };

    const map = new google.maps.Map(mapEl, {
        center: defaultCenter,
        zoom: 13,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
    });

    const geocoder = new google.maps.Geocoder();
    let ubicacionSeleccionada = false;

    let advMarker = null;
    let legacyMarker = null;

    function setMarkerPosition(center) {
        if (advMarker) advMarker.position = center;
        else if (legacyMarker) legacyMarker.setPosition(center);
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

    if (google.maps.marker && google.maps.marker.AdvancedMarkerElement) {
        advMarker = new google.maps.marker.AdvancedMarkerElement({
            position: defaultCenter,
            map,
        });
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

    map.addListener('click', (e) => {
        setMarkerPosition(e.latLng);
        map.panTo(e.latLng);
        setLatLng(e.latLng);
        setDireccionFromLatLng(e.latLng);
    });

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
            () => {}
        );
    }

    window.__urbalertUbicacionSeleccionada = () => ubicacionSeleccionada;
}

/* =========================
   EXPORTS GLOBAL (solo lo necesario)
========================= */
window.eliminarDenuncia = eliminarDenuncia;
window.cerrarModal = cerrarModal;
window.abrirModalDetalle = abrirModalDetalle;

document.addEventListener('DOMContentLoaded', () => {
    cargarDenuncias();
    cargarDenunciasInicio();
    crearDenuncia();
    cargarDetalleDenuncia();
    initMapaRegistroDenuncia();

    const modal = document.getElementById('modal-detalle');
    if (modal) {
        modal.addEventListener('click', (event) => {
            if (event.target === modal) cerrarModal();
        });
    }
});
