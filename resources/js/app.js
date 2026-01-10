import './bootstrap';

/**
 * Cargar listado de denuncias
 */
function cargarDenuncias() {
    const tbody = document.getElementById('denuncias-body');
    if (!tbody) return; // no estamos en el index

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

/**
 * Crear nueva denuncia
 */
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
                window.location.href = '/';
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

/**
 * Inicialización general
 */
document.addEventListener('DOMContentLoaded', () => {
    cargarDenuncias();
    crearDenuncia();
});
