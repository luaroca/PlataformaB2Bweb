
let productosData = [];

async function cargarProductos() {
    try {
        const res = await fetch('/api/productos/publicados');
        const data = await res.json();
        productosData = data.productos || [];
        aplicarFiltros(); // Aplicar filtros al cargar
    } catch (err) {
        console.error("Error al cargar productos:", err);
        Utils.showToast('Error al cargar productos publicados.','error');
    }
}

function mostrarProductos(lista) {
    const contenedor = document.getElementById("listaProductos");
    contenedor.innerHTML = '';

    if (lista.length === 0) {
        contenedor.innerHTML = '<p class="text-center text-muted">No hay productos disponibles.</p>';
        return;
    }

    lista.forEach(p => {
        const proveedor = p.proveedor_nombre || 'N/A';
        const imagen = p.imagen_principal ? `/uploads/${p.imagen_principal}` : 'imagen-placeholder.jpg';


        const col = document.createElement("div");
        col.className = "col-md-4 mb-4";

        col.innerHTML = `
        <div class="card shadow h-100 animate_animated animate_fadeInUp">
          <img src="..${imagen}" class="card-img-top" alt="${p.nombre}" loading="lazy">
          <div class="card-body">
            <h5 class="card-title">${p.nombre}</h5>
            <p class="card-text"><strong>Precio:</strong> $${p.precio} COP</p>
          </div>
          <div class="card-footer bg-transparent text-center">
            <a id="" href="../Html/detalle_producto.html?id=${p.id}" class="btn btn-outline-primary">Ver Detalles</a>
          </div>
        </div>
      `;

        contenedor.appendChild(col);
    });
}

function aplicarFiltros() {
    const texto = document.getElementById("buscador").value.toLowerCase();
    const categoria = document.getElementById("categoriaFiltro").value.toLowerCase();
    const precioOrden = document.getElementById("precioFiltro").value;

    let filtrados = productosData;

    // Filtrar por nombre
    if (texto) {
        filtrados = filtrados.filter(p => p.nombre.toLowerCase().includes(texto));
    }

    // Filtrar por categoría
    if (categoria) {
        filtrados = filtrados.filter(p => p.categoria && p.categoria.toLowerCase() === categoria);
    }

    // Ordenar por precio
    if (precioOrden === 'menor') {
        filtrados.sort((a, b) => a.precio - b.precio);
    } else if (precioOrden === 'mayor') {
        filtrados.sort((a, b) => b.precio - a.precio);
    }

    mostrarProductos(filtrados);
}

// Eventos combinados
document.getElementById("buscador").addEventListener("input", aplicarFiltros);
document.getElementById("categoriaFiltro").addEventListener("change", aplicarFiltros);
document.getElementById("precioFiltro").addEventListener("change", aplicarFiltros);

// Inicial
cargarProductos();