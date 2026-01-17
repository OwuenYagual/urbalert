import './bootstrap';

function cargarDenuncias() {
    const container = document.getElementById('denuncias-container');
    if (!container) return;

    fetch('/api/denuncias')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            return response.json();
        })
        .then(result => {
            const denuncias = result.data;
            container.innerHTML = '';

            if (!denuncias || denuncias.length === 0) {
                container.innerHTML = `
                    <p style="text-align: center; grid-column: 1 / -1;">No existen denuncias registradas.</p>
                `;
                return;
            }

            denuncias.forEach(d => {
                const estadoClass = `estado-${d.estado.toLowerCase().replace(/\s+/g, '_')}`;
                const card = document.createElement('div');
                card.className = 'denuncia-card';
                card.style.cursor = 'pointer';
                card.innerHTML = `
                    <div class="denuncia-categoria">${d.categoria}</div>
                    <h3>${d.titulo}</h3>
                    <p class="denuncia-ubicacion">
                        <i class="icon-location"></i> ${d.ubicacion}
                    </p>
                    <p class="denuncia-descripcion">${d.descripcion.substring(0, 100)}${d.descripcion.length > 100 ? '...' : ''}</p>
                    <div class="denuncia-footer">
                        <span class="estado ${estadoClass}">
                            ${d.estado}
                        </span>
                        <span class="fecha">${new Date(d.created_at).toLocaleDateString('es-ES')}</span>
                    </div>
                `;
                card.addEventListener('click', () => {
                    abrirModalDetalle(d.id);
                });
                container.appendChild(card);
            });
        })
        .catch((error) => {
            console.error('Error al cargar denuncias:', error);
            container.innerHTML = `
                <p style="text-align: center; grid-column: 1 / -1; color: red;">Error al cargar las denuncias. Verifica la consola para más detalles.</p>
            `;
        });
}

function cargarDenunciasInicio() {
    const container = document.getElementById('denuncias-inicio-container');
    if (!container) return;

    fetch('/api/denuncias')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            return response.json();
        })
        .then(result => {
            const denuncias = result.data ? result.data.slice(0, 6) : [];
            container.innerHTML = '';

            if (!denuncias || denuncias.length === 0) {
                container.innerHTML = `
                    <p style="text-align: center; grid-column: 1 / -1;">No existen denuncias registradas.</p>
                `;
                return;
            }

            denuncias.forEach(d => {
                const estadoClass = `estado-${d.estado.toLowerCase().replace(/\s+/g, '_')}`;
                const card = document.createElement('div');
                card.className = 'denuncia-card';
                card.style.cursor = 'pointer';
                card.innerHTML = `
                    <div class="denuncia-categoria">${d.categoria}</div>
                    <h3>${d.titulo}</h3>
                    <p class="denuncia-ubicacion">
                        <i class="icon-location"></i> ${d.ubicacion}
                    </p>
                    <p class="denuncia-descripcion">${d.descripcion.substring(0, 100)}${d.descripcion.length > 100 ? '...' : ''}</p>
                    <div class="denuncia-footer">
                        <span class="estado ${estadoClass}">
                            ${d.estado}
                        </span>
                        <span class="fecha">${new Date(d.created_at).toLocaleDateString('es-ES')}</span>
                    </div>
                `;
                card.addEventListener('click', () => {
                    abrirModalDetalle(d.id);
                });
                container.appendChild(card);
            });
        })
        .catch((error) => {
            console.error('Error al cargar denuncias:', error);
            container.innerHTML = `
                <p style="text-align: center; grid-column: 1 / -1; color: red;">Error al cargar las denuncias.</p>
            `;
        });
}

function abrirModalDetalle(id) {
    const modal = document.getElementById('modal-detalle');
    const contenido = document.getElementById('detalle-contenido');

    fetch(`/api/denuncias/${id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Denuncia no encontrada');
            }
            return response.json();
        })
        .then(result => {
            const d = result.data;
            const estadoClass = `estado-${d.estado.toLowerCase().replace(/\s+/g, '_')}`;

            contenido.innerHTML = `
                <h2 class="modal-detalle-titulo">${d.titulo}</h2>
                
                <div class="modal-detalle-seccion">
                    <div class="modal-detalle-label">Categoría</div>
                    <div class="modal-detalle-valor">
                        <span class="modal-detalle-badge denuncia-categoria" style="display: inline-block;">${d.categoria}</span>
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
                    <div class="modal-detalle-valor">${new Date(d.created_at).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
                </div>

                <div class="modal-detalle-acciones">
                    <a href="/denuncias/${d.id}" class="btn">Ver página completa</a>
                    <button class="btn btn-delete" onclick="eliminarDenunciaYCerrar(${d.id}, event)">Eliminar</button>
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
    modal.classList.remove('active');
}

function eliminarDenunciaYCerrar(id, event) {
    event.preventDefault();
    if (!confirm('¿Estás seguro de que deseas eliminar esta denuncia?')) {
        return;
    }

    fetch(`/api/denuncias/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error HTTP! status: ${response.status}`);
        }
        return response.text().then(text => text ? JSON.parse(text) : {});
    })
    .then(data => {
        alert('Denuncia eliminada correctamente.');
        cerrarModal();
        cargarDenuncias();
    })
    .catch(error => {
        alert('Error al eliminar la denuncia: ' + error.message);
    });
}

function cargarDetalleDenuncia() {
    const container = document.getElementById('detalle-denuncia');
    if (!container) return;

    const id = container.dataset.id;

    fetch(`/api/denuncias/${id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Denuncia no encontrada');
            }
            return response.json();
        })
        .then(result => {
            const d = result.data;
            const estadoClass = `estado-${d.estado.toLowerCase().replace(/\s+/g, '_')}`;

            container.innerHTML = `
                <div style="background-color: #ffffff; padding: 28px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
                    <h3 style="margin-top: 0; color: #1f2937; font-size: 24px;">${d.titulo}</h3>
                    
                    <div style="margin-bottom: 20px;">
                        <label style="font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase;">Categoría</label>
                        <p style="margin: 6px 0 0 0; color: #1f2937;">
                            <span style="display: inline-block; background-color: #dbeafe; color: #1e40af; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;">${d.categoria}</span>
                        </p>
                    </div>

                    <div style="margin-bottom: 20px;">
                        <label style="font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase;">Estado</label>
                        <p style="margin: 6px 0 0 0; color: #1f2937;">
                            <span class="estado ${estadoClass}">${d.estado}</span>
                        </p>
                    </div>

                    <div style="margin-bottom: 20px;">
                        <label style="font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase;">Ubicación</label>
                        <p style="margin: 6px 0 0 0; color: #1f2937;">${d.ubicacion}</p>
                    </div>

                    <div style="margin-bottom: 20px;">
                        <label style="font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase;">Descripción</label>
                        <p style="margin: 6px 0 0 0; color: #1f2937; line-height: 1.6;">${d.descripcion}</p>
                    </div>

                    <div style="margin-bottom: 20px;">
                        <label style="font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase;">Fecha de registro</label>
                        <p style="margin: 6px 0 0 0; color: #1f2937;">${new Date(d.created_at).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                    </div>

                    <div style="margin-top: 28px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                        <label style="font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; display: block; margin-bottom: 12px;">Actualizar estado</label>
                        <select id="estado-select" style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 4px; font-size: 14px; margin-bottom: 16px;">
                            <option value="">Selecciona un estado...</option>
                            <option value="Pendiente" ${d.estado === 'Pendiente' ? 'selected' : ''}>Pendiente</option>
                            <option value="En investigación" ${d.estado === 'En investigación' ? 'selected' : ''}>En investigación</option>
                            <option value="Resuelto" ${d.estado === 'Resuelto' ? 'selected' : ''}>Resuelto</option>
                            <option value="Rechazado" ${d.estado === 'Rechazado' ? 'selected' : ''}>Rechazado</option>
                        </select>
                    </div>

                    <div style="display: flex; gap: 12px; margin-top: 12px;">
                        <button class="btn" style="flex: 1; margin: 0;" onclick="actualizarEstadoDenuncia(${d.id})">Guardar cambios</button>
                        <button class="btn btn-delete" style="flex: 1; margin: 0;" onclick="eliminarDenunciaShow(${d.id})">Eliminar denuncia</button>
                    </div>
                </div>
            `;
        })
        .catch(() => {
            container.innerHTML =
                '<p>No se pudo cargar la información de la denuncia.</p>';
        });
}

function actualizarEstadoDenuncia(id) {
    const estadoSelect = document.getElementById('estado-select');
    const nuevoEstado = estadoSelect.value;

    if (!nuevoEstado) {
        alert('Por favor selecciona un estado');
        return;
    }

    fetch(`/api/denuncias/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({ estado: nuevoEstado })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al actualizar el estado');
        }
        return response.json();
    })
    .then(data => {
        alert('Estado actualizado correctamente.');
        cargarDetalleDenuncia();
    })
    .catch(error => {
        alert('Error: ' + error.message);
    });
}

function eliminarDenunciaShow(id) {
    if (!confirm('¿Estás seguro de que deseas eliminar esta denuncia?')) {
        return;
    }

    fetch(`/api/denuncias/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error HTTP! status: ${response.status}`);
        }
        return response.text().then(text => text ? JSON.parse(text) : {});
    })
    .then(data => {
        alert('Denuncia eliminada correctamente.');
        window.location.href = '/denuncias';
    })
    .catch(error => {
        alert('Error al eliminar la denuncia: ' + error.message);
    });
}

function crearDenuncia() {
    const form = document.getElementById('denuncia-form');
    if (!form) return; 

    form.addEventListener('submit', e => {
        e.preventDefault();

        const data = {
            titulo: document.getElementById('titulo').value,
            descripcion: document.getElementById('descripcion').value,
            categoria: document.getElementById('categoria').value,
            ubicacion: document.getElementById('ubicacion').value
        };

        fetch('/api/denuncias', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => { throw err; });
            }
            return response.json();
        })
        .then(() => {
            document.getElementById('mensaje').innerHTML =
                '<p style="color: green;">Denuncia registrada correctamente. Redirigiendo...</p>';

            setTimeout(() => {
                window.location.href = '/denuncias';
            }, 800);
        })
        .catch(error => {
            let msg = 'Error al registrar la denuncia.';
            if (error.errors) {
                msg = Object.values(error.errors).join('<br>');
            }
            document.getElementById('mensaje').innerHTML =
                `<p style="color: red;">${msg}</p>`;
        });
    });
}

function eliminarDenuncia(id) {
    if (!confirm('¿Estás seguro de que deseas eliminar esta denuncia?')) {
        return;
    }

    fetch(`/api/denuncias/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al eliminar la denuncia');
        }
        return response.json();
    })
    .then(() => {
        cargarDenuncias();
    })
    .catch(() => {
        alert('Error al eliminar la denuncia. Intenta nuevamente.');
    });
}

// Hacer la función disponible globalmente
window.eliminarDenuncia = eliminarDenuncia;
window.cerrarModal = cerrarModal;
window.actualizarEstadoDenuncia = actualizarEstadoDenuncia;
window.eliminarDenunciaShow = eliminarDenunciaShow;
window.abrirModalDetalle = abrirModalDetalle;

document.addEventListener('DOMContentLoaded', () => {
    cargarDenuncias();
    cargarDenunciasInicio();
    crearDenuncia();
    cargarDetalleDenuncia();

    // Cerrar modal al hacer clic en el fondo
    const modal = document.getElementById('modal-detalle');
    if (modal) {
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                cerrarModal();
            }
        });
    }
});
