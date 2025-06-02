async function mostrar(seccion) {
    const contenido = document.getElementById('contenido');
    let html = '';

    switch (seccion) {
        case 'inicio':
            html = `
  <div class="card">
    <h3>Inicio</h3>
    <p>Bienvenido al panel de administración.</p>
    <canvas id="graficaUsuarios" class="grafico-pequeno"></canvas>
    <canvas id="graficaVisitas" class="grafico-pequeno"></canvas>
  </div>`;

            contenido.innerHTML = html;

            // Llamadas a API para obtener datos reales
            try {
                // Datos productos por usuario
                const resUsuarios = await fetch('/api/productos-por-usuario');
                const usuariosData = await resUsuarios.json();

                // Datos visitas mensuales (ejemplo, si tienes endpoint de visitas, sino usa datos estáticos)
                // Aquí pongo datos estáticos para ejemplo
                const visitas = ['Enero', 'Febrero', 'Marzo', 'Abril'];
                const conteoVisitas = [120, 200, 150, 300];

                // Crear gráfico productos por usuario
                new Chart(document.getElementById('graficaUsuarios'), {
                    type: 'bar',
                    data: {
                        labels: usuariosData.map(u => u.usuario),
                        datasets: [{
                            label: 'Productos por Usuario',
                            data: usuariosData.map(u => u.total_productos),
                            backgroundColor: 'rgba(54, 162, 235, 0.6)',
                            borderColor: 'rgba(54, 162, 235, 1)',
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: true,
                        plugins: { title: { display: true, text: 'Usuarios con más productos' } },
                        scales: { y: { beginAtZero: true } }
                    }
                });

                // Crear gráfico visitas mensuales (usa tus datos reales si tienes)
                new Chart(document.getElementById('graficaVisitas'), {
                    type: 'line',
                    data: {
                        labels: visitas,
                        datasets: [{
                            label: 'Visitas',
                            data: conteoVisitas,
                            fill: false,
                            borderColor: 'rgba(255, 99, 132, 1)',
                            tension: 0.3
                        }]
                    },
                    options: {
                        responsive: true,
                        plugins: { title: { display: true, text: 'Visitas a la página' } }
                    }
                });

            } catch (error) {
                contenido.innerHTML += `<p>Error cargando datos: ${error.message}</p>`;
            }
            break;

        // Otros casos sin cambios
        case 'usuarios':
            html = `<div class="card"><h3>Gestión de Usuarios</h3><p>Lista, editar y eliminar usuarios aquí.</p></div>`;
            contenido.innerHTML = html;
            break;

        case 'reportes':
            html = `<div class="card"><h3>Reportes</h3><p>Estadísticas, gráficos y más.</p></div>`;
            contenido.innerHTML = html;
            break;

        case 'ajustes':
            html = `<div class="card"><h3>Ajustes</h3><p>Configuración general del sistema.</p></div>`;
            contenido.innerHTML = html;
            break;

        default:
            html = `<div class="card"><h3>Error</h3><p>Sección no encontrada.</p></div>`;
            contenido.innerHTML = html;
    }
}
