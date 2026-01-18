import './bootstrap';

/* =========================
   HELPERS
========================= */
function estadoClassName(estado) {
    return `estado-${String(estado).toLowerCase().replace(/\s+/g, '_')}`;
}

async function getUsuarioActual() {
    try {
        const res = await fetch('/api/me', {
            method: 'GET',
            credentials: 'same-origin',
            headers: { 'Accept': 'application/json' },
        });
        if (!res.ok) return null;
        return await res.json();
    } catch {
        return null;
    }
}

/* =========================
   LISTADO (CARDS)
========================= */
function cargarDenuncias() {
    const container = document.getElementById('denuncias-container');
    if (!container) return;

    fetch('/api/denuncias', { headers: { 'Accept': 'application/json' } })
        .then(r => {
            if (!r.ok) throw new Error(`Error HTTP: ${r.status}`);
            return r.json();
        })
        .then(result => {
            const denuncias = result.data;
            container.innerHTML = '';

            if (!denuncias || denuncias.length === 0) {
                container.innerHTML = `<p style="text-align:center; grid-column:1/-1;">No existen denuncias registradas.</p>`;
                return;
            }

            denuncias.forEach(d => {
                const card = document.createElement('div');
                card.className = 'denuncia-card';
                card.style.cursor = 'pointer';

                card.innerHTML = `
                    <div class="denuncia-categoria">${d.categoria}</div>
                    <h3>${d.titulo}</h3>
                    <p class="denuncia-ubicacion"><i class="icon-location"></i> ${d.ubicacion}</p>
                    <p class="denuncia-descripcion">${d.descripcion.substring(0, 100)}${d.descripcion.length > 100 ? '...' : ''}</p>
                    <div class="denuncia-footer">
                        <span class="estado ${estadoClassName(d.estado)}">${d.estado}</span>
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
        .then(r => {
            if (!r.ok) throw new Error(`Error HTTP: ${r.status}`);
            return r.json();
        })
        .then(result => {
            const denuncias = result.data ? result.data.slice(0, 6) : [];
            container.innerHTML = '';

            if (!denuncias || denuncias.length === 0) {
                container.innerHTML = `<p style="text-align:center; grid-column:1/-1;">No existen denuncias registradas.</p>`;
                return;
            }

            denuncias.forEach(d => {
                const card = document.createElement('div');
                card.className = 'denuncia-card';
                card.style.cursor = 'pointer';

                card.innerHTML = `
                    <div class="denuncia-categoria">${d.categoria}</div>
                    <h3>${d.titulo}</h3>
                    <p class="denuncia-ubicacion"><i class="icon-location"></i> ${d.ubicacion}</p>
                    <p class="denuncia-descripcion">${d.descripcion.substring(0, 100)}${d.descripcion.length > 100 ? '...' : ''}</p>
                    <div class="denuncia-footer">
                        <span class="estado ${estadoClassName(d.estado)}">${d.estado}</span>
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
   - Solo muestra "Eliminar" si admin o dueño
========================= */
async function abrirModalDetalle(id) {
    const modal = document.getElementById('modal-detalle');
    const contenido = document.getElementById('detalle-contenido');
    if (!modal || !contenido) return;

    try {
        const [me, denRes] = await Promise.all([
            getUsuarioActual(),
            fetch(`/api/denuncias/${id}`, { headers: { 'Accept': 'application/json' } })
        ]);

        if (!denRes.ok) throw new Error('Denuncia no encontrada');
        const result = await denRes.json();
        const d = result.data;

        const isAdmin = me?.role === 'admin';
        const esDueno = me && Number(d.user_id) === Number(me.id);
        const puedeEliminar = isAdmin || esDueno;

        const btnEliminar = puedeEliminar
            ? `<button class="btn btn-delete" onclick="eliminarDenuncia(${d.id}, { refresh: true, closeModal: true })">Eliminar</button>`
            : '';

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
                    <span class="estado ${estadoClassName(d.estado)}">${d.estado}</span>
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
                <div class="modal-detalle-valor">
                    ${new Date(d.created_at).toLocaleDateString('es-ES', { year:'numeric', month:'long', day:'numeric', hour:'2-digit', minute:'2-digit' })}
                </div>
            </div>

            <div class="modal-detalle-acciones">
                <a href="/denuncias/${d.id}" class="btn">Ver página completa</a>
                ${btnEliminar}
            </div>
        `;

        modal.classList.add('active');
    } catch (e) {
        contenido.innerHTML = '<p>No se pudo cargar la información de la denuncia.</p>';
        modal.classList.add('active');
    }
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

        const fd = new FormData(form);

        try {
            const response = await fetch('/api/denuncias', {
                method: 'POST',
                credentials: 'same-origin',
                headers: { 'Accept': 'application/json' },
                body: fd,
            });

            const payload = await response.json().catch(() => ({}));

            if (!response.ok) {
                let msg = payload?.message || 'Error al registrar la denuncia.';
                if (payload?.errors) msg = Object.values(payload.errors).flat().join('<br>');
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
   - Eliminar: admin o dueño
   - Cambiar estado: solo admin (PATCH /api/denuncias/{id}/estado)
========================= */
async function cargarDetalleDenuncia() {
    const container = document.getElementById('detalle-denuncia');
    if (!container) return;

    const mapEl = document.getElementById('map-show');
    const id = container.dataset.id;

    try {
        const [me, resDen] = await Promise.all([
            getUsuarioActual(),
            fetch(`/api/denuncias/${id}`, { headers: { 'Accept': 'application/json' } })
        ]);

        if (!resDen.ok) throw new Error('Denuncia no encontrada');

        const result = await resDen.json();
        const d = result.data;

        const isAdmin = me?.role === 'admin';
        const esDueno = me && Number(d.user_id) === Number(me.id);
        const puedeEditarEliminar = isAdmin || esDueno;
        const puedeCambiarEstado = isAdmin;

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

        const htmlAdminEstado = puedeCambiarEstado ? `
            <div style="margin-top:28px; padding-top:20px; border-top:1px solid #e5e7eb;">
                <label style="font-size:12px;font-weight:600;color:#6b7280;text-transform:uppercase;display:block;margin-bottom:12px;">
                    Actualizar estado (solo admin)
                </label>
                <select id="estado-select" style="width:100%; padding:10px; border:1px solid #d1d5db; border-radius:6px; font-size:14px; margin-bottom:12px;">
                    <option value="pendiente" ${d.estado === 'pendiente' ? 'selected' : ''}>Pendiente</option>
                    <option value="en_revision" ${d.estado === 'en_revision' ? 'selected' : ''}>En revisión</option>
                    <option value="resuelto" ${d.estado === 'resuelto' ? 'selected' : ''}>Resuelto</option>
                    <option value="rechazado" ${d.estado === 'rechazado' ? 'selected' : ''}>Rechazado</option>
                </select>
                <button class="btn" style="width:100%;" onclick="actualizarEstadoDenuncia(${d.id})">
                    Guardar estado
                </button>
            </div>
        ` : '';

        const htmlAcciones = puedeEditarEliminar ? `
            <div style="display:flex; gap:12px; margin-top:12px;">
                <a class="btn" style="flex:1; margin:0;" href="/denuncias/${d.id}/editar">Editar</a>
                <button class="btn btn-delete" style="flex:1; margin:0;"
                onclick="eliminarDenuncia(${d.id}, { redirect: '/' })">
                Eliminar
                </button>
            </div>
            ` : `...`;

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
                        <span class="estado ${estadoClassName(d.estado)}">${d.estado}</span>
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

                ${htmlAdminEstado}
                ${htmlAcciones}
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

    } catch (e) {
        container.innerHTML = '<p>No se pudo cargar la información de la denuncia.</p>';
        if (mapEl) mapEl.innerHTML = '';
    }
}

async function cargarEditDenuncia() {
    const form = document.getElementById('denuncia-edit-form');
    if (!form) return;

    const id = form.dataset.id;
    const mensajeEl = document.getElementById('mensaje');
    const evidenciasEl = document.getElementById('evidencias-actuales');

    try {
        const res = await fetch(`/api/denuncias/${id}`, { headers: { 'Accept': 'application/json' } });
        const payload = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(payload?.message || 'No se pudo cargar la denuncia.');

        const d = payload.data;

        // Prefill campos
        document.getElementById('titulo').value = d.titulo ?? '';
        document.getElementById('descripcion').value = d.descripcion ?? '';
        document.getElementById('categoria').value = d.categoria ?? '';
        document.getElementById('ubicacion').value = d.ubicacion ?? '';
        document.getElementById('lat').value = d.lat ?? '';
        document.getElementById('lng').value = d.lng ?? '';

        const buscador = document.getElementById('buscador-direccion');
        if (buscador) buscador.value = d.ubicacion ?? '';

        // Evidencias actuales
        const fotos = Array.isArray(d.fotos) ? d.fotos : [];
        evidenciasEl.innerHTML = fotos.length
            ? fotos.map(f => `
                <a href="/storage/${f.path}" target="_blank" rel="noopener">
                    <img src="/storage/${f.path}" style="width:160px;height:110px;object-fit:cover;border-radius:8px;border:1px solid #ddd;">
                </a>
              `).join('')
            : `<p style="color:#6b7280;">Sin evidencias.</p>`;

        // Inicializar mapa centrado en la denuncia (si hay lat/lng)
        initMapaEdicionDenuncia(d);

    } catch (e) {
        mensajeEl.innerHTML = `<p style="color:red;">${e.message}</p>`;
    }
}

function initMapaEdicionDenuncia(d) {
    const mapEl = document.getElementById('map');
    const inputBuscar = document.getElementById('buscador-direccion');
    const inputUbicacion = document.getElementById('ubicacion');
    const inputLat = document.getElementById('lat');
    const inputLng = document.getElementById('lng');

    if (!mapEl || !inputBuscar || !inputUbicacion || !inputLat || !inputLng) return;
    if (!window.google || !google.maps) return;

    const hasCoords = d.lat !== null && d.lng !== null && d.lat !== '' && d.lng !== '';
    const center = hasCoords
        ? { lat: Number(d.lat), lng: Number(d.lng) }
        : { lat: -2.170998, lng: -79.922359 };

    const map = new google.maps.Map(mapEl, {
        center,
        zoom: hasCoords ? 16 : 13,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
    });

    const geocoder = new google.maps.Geocoder();
    let ubicacionSeleccionada = true; // en edición ya hay ubicación inicial

    let marker = null;

    if (google.maps.marker && google.maps.marker.AdvancedMarkerElement) {
        marker = new google.maps.marker.AdvancedMarkerElement({ position: center, map });
    } else {
        marker = new google.maps.Marker({ position: center, map, draggable: true });
        marker.addListener('dragend', () => {
            const pos = marker.getPosition();
            if (!pos) return;
            inputLat.value = pos.lat();
            inputLng.value = pos.lng();
            ubicacionSeleccionada = true;
            geocoder.geocode({ location: pos }, (results, status) => {
                if (status === 'OK' && results?.[0]) {
                    inputUbicacion.value = results[0].formatted_address;
                    inputBuscar.value = results[0].formatted_address;
                }
            });
        });
    }

    function setMarkerPosition(latLng) {
        if (marker instanceof google.maps.Marker) marker.setPosition(latLng);
        else marker.position = latLng;
    }

    map.addListener('click', (e) => {
        setMarkerPosition(e.latLng);
        map.panTo(e.latLng);
        inputLat.value = e.latLng.lat();
        inputLng.value = e.latLng.lng();
        ubicacionSeleccionada = true;
        geocoder.geocode({ location: e.latLng }, (results, status) => {
            if (status === 'OK' && results?.[0]) {
                inputUbicacion.value = results[0].formatted_address;
                inputBuscar.value = results[0].formatted_address;
            }
        });
    });

    const autocomplete = new google.maps.places.Autocomplete(inputBuscar, {
        fields: ['geometry', 'formatted_address', 'name'],
        componentRestrictions: { country: ['ec'] },
    });

    autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (!place.geometry?.location) return;

        const loc = place.geometry.location;
        map.panTo(loc);
        map.setZoom(16);
        setMarkerPosition(loc);

        inputLat.value = loc.lat();
        inputLng.value = loc.lng();
        inputUbicacion.value = place.formatted_address || place.name || inputBuscar.value;
        ubicacionSeleccionada = true;
    });

    window.__urbalertUbicacionSeleccionada = () => ubicacionSeleccionada;
}

async function guardarEditDenuncia() {
    const form = document.getElementById('denuncia-edit-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const id = form.dataset.id;
        const mensajeEl = document.getElementById('mensaje');

        const ubicacion = document.getElementById('ubicacion')?.value?.trim();
        const lat = document.getElementById('lat')?.value;
        const lng = document.getElementById('lng')?.value;

        if (!ubicacion || !lat || !lng) {
            mensajeEl.innerHTML = '<p style="color:red;">Seleccione una ubicación válida en el mapa.</p>';
            return;
        }

        // En multipart, para máxima compatibilidad: POST + _method=PUT
        const fd = new FormData(form);
        fd.append('_method', 'PUT');

        try {
            const res = await fetch(`/api/denuncias/${id}`, {
                method: 'POST',
                credentials: 'same-origin',
                headers: { 'Accept': 'application/json' },
                body: fd,
            });

            const payload = await res.json().catch(() => ({}));
            if (!res.ok) {
                let msg = payload?.message || 'No se pudo guardar.';
                if (payload?.errors) msg = Object.values(payload.errors).flat().join('<br>');
                mensajeEl.innerHTML = `<p style="color:red;">${msg}</p>`;
                return;
            }

            mensajeEl.innerHTML = '<p style="color:green;">Cambios guardados. Redirigiendo...</p>';
            setTimeout(() => window.location.href = `/denuncias/${id}`, 800);

        } catch (err) {
            mensajeEl.innerHTML = '<p style="color:red;">Error de conexión.</p>';
        }
    });
}


async function actualizarEstadoDenuncia(id) {
    const select = document.getElementById('estado-select');
    const estado = select?.value;

    if (!estado) {
        alert('Seleccione un estado.');
        return;
    }

    try {
        const response = await fetch(`/api/denuncias/${id}/estado`, {
            method: 'PATCH',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ estado }),
        });

        const payload = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(payload?.message || 'No se pudo actualizar el estado.');

        alert('Estado actualizado correctamente.');
        cargarDetalleDenuncia();
        // refrescar listados si existen
        cargarDenuncias();
        cargarDenunciasInicio();
    } catch (e) {
        alert(e.message || 'No se pudo actualizar el estado.');
    }
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

        if (opts.closeModal) cerrarModal();

        if (opts.refresh) {
            cargarDenuncias();
            cargarDenunciasInicio();
        }

        if (opts.redirect) {
            window.location.href = opts.redirect;
        }
    } catch (e) {
        alert(e.message || 'No se pudo eliminar la denuncia.');
    }
}

/* =========================
   MAPA CREATE
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
   EXPORTS GLOBAL
========================= */
window.eliminarDenuncia = eliminarDenuncia;
window.cerrarModal = cerrarModal;
window.abrirModalDetalle = abrirModalDetalle;
window.actualizarEstadoDenuncia = actualizarEstadoDenuncia;

document.addEventListener('DOMContentLoaded', () => {
    cargarDenuncias();
    cargarDenunciasInicio();
    crearDenuncia();
    cargarDetalleDenuncia();
    initMapaRegistroDenuncia();
    cargarEditDenuncia();
    guardarEditDenuncia();
    const modal = document.getElementById('modal-detalle');
    if (modal) {
        modal.addEventListener('click', (event) => {
            if (event.target === modal) cerrarModal();
        });
    }
});
