document.addEventListener('DOMContentLoaded', () => {
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

        denuncias.forEach(denuncia => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${denuncia.titulo}</td>
                <td>${denuncia.categoria}</td>
                <td><strong>${denuncia.estado}</strong></td>
                <td>
                    <a href="/denuncias/${denuncia.id}" class="btn">
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
});
