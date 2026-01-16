import './bootstrap';

function cargarDenuncias() {
    const tbody = document.getElementById('denuncias-body');
    if (!tbody) return;

    fetch('/api/denuncias')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor');
            }
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
                        <a href="/denuncias/${d.id}" class="btn">
                            Ver detalle
                        </a>
                        <button class="btn btn-delete" onclick="eliminarDenuncia(${d.id})">
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

            container.innerHTML = `
                <p><strong>Título:</strong> ${d.titulo}</p>
                <p><strong>Descripción:</strong> ${d.descripcion}</p>
                <p><strong>Categoría:</strong> ${d.categoria}</p>
                <p><strong>Ubicación:</strong> ${d.ubicacion}</p>
                <p><strong>Estado:</strong> ${d.estado}</p>
            `;
        })
        .catch(() => {
            container.innerHTML =
                '<p>No se pudo cargar la información de la denuncia.</p>';
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
        console.log('Response status:', response.status);
        if (!response.ok) {
            throw new Error(`Error HTTP! status: ${response.status}`);
        }
        return response.text().then(text => text ? JSON.parse(text) : {});
    })
    .then(data => {
        console.log('Success:', data);
        alert('Denuncia eliminada correctamente.');
        cargarDenuncias();
    })
    .catch(error => {
        console.error('Error completo:', error);
        alert('Error al eliminar la denuncia: ' + error.message);
    });
}

// Hacer la función disponible globalmente
window.eliminarDenuncia = eliminarDenuncia;

document.addEventListener('DOMContentLoaded', () => {
    cargarDenuncias();
    crearDenuncia();
    cargarDetalleDenuncia();
});
