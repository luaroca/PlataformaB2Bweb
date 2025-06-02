const proveedorId = localStorage.getItem('usuarioId');

if (!proveedorId) {
    Utils.showToast('Debes iniciar sesión', 'warning');
    window.location.href = '../Html/login.html';
}

async function cargarProductos() {
    const res = await fetch(`/api/productos/proveedor/${proveedorId}`);
    const data = await res.json();

    const contenedor = document.getElementById('productos-lista');
    const resumen = document.getElementById('resumen-productos');

    const totalEl = document.getElementById('totalProductos');
    const publicadosEl = document.getElementById('publicados-count');
    const noPublicadosEl = document.getElementById('noPublicados-count');

    const barraPublicados = document.getElementById('barraPublicados');
    const barraNoPublicados = document.getElementById('barraNoPublicados');

    contenedor.innerHTML = '';
    resumen.style.display = 'none';

    if (data.success && data.productos.length > 0) {
        let publicados = 0;
        let noPublicados = 0;

        data.productos.forEach(producto => {
            producto.publicado ? publicados++ : noPublicados++;
            const card = document.createElement('div');
            card.className = 'col-md-6 col-lg-4';

            const estadoBadge = producto.publicado
                ? `<span class="badge bg-success"><i class="fas fa-eye"></i> Publicado</span>`
                : `<span class="badge bg-secondary"><i class="fas fa-eye-slash"></i> No publicado</span>`;

            card.innerHTML = `
            <div class="card h-100 shadow-sm border-0">
              <img src="../uploads/${producto.imagen_principal}" class="card-img-top" style="object-fit:cover; height:220px;" onerror="this.src='placeholder.jpg'">
              <div class="card-body d-flex flex-column">
                <div class="d-flex justify-content-between align-items-center mb-2">
                  <h5 class="card-title text-primary mb-0">${producto.nombre}</h5>
                  ${estadoBadge}
                </div>
                <p class="card-text"><strong>Descripción:</strong> ${producto.descripcion}</p>
                <p class="card-text"><strong>Categoría:</strong> ${producto.categoria || '-'} / ${producto.subcategoria || '-'}</p>
                <p class="card-text"><strong>Precio:</strong> $${producto.precio}</p>
                <p class="card-text"><strong>Stock:</strong> ${producto.stock}</p>
                <p class="card-text"><strong>Unidad de medida:</strong> ${producto.unidad_medida || '-'}</p>
                <p class="card-text"><strong>Mínimo de pedido:</strong> ${producto.minimo_pedido || '-'}</p>
                <p class="card-text"><strong>Tiempo de entrega:</strong> ${producto.tiempo_entrega || '-'}</p>
                <p class="card-text"><strong>Condiciones de pago:</strong> ${producto.condiciones_pago || '-'}</p>
                <p class="card-text"><strong>Origen:</strong> ${producto.origen_producto || '-'}</p>

                <div class="d-flex gap-2 mt-2">
                  ..${producto.imagen_secundaria1 ? `<img src="../uploads/${producto.imagen_secundaria1}" class="img-thumbnail w-50">` : ''}
                  ..${producto.imagen_secundaria2 ? `<img src="../uploads/${producto.imagen_secundaria2}" class="img-thumbnail w-50">` : ''}
                </div>

                <div class="mt-auto pt-3 d-flex justify-content-between align-items-center">
                  <div class="btn-group">
                    <button class="btn btn-sm btn-outline-primary" onclick="editarProducto(${producto.id})"><i class="fas fa-edit"></i> Editar</button>
                    <button class="btn btn-sm btn-outline-danger" onclick="eliminarProducto(${producto.id})"><i class="fas fa-trash"></i> Eliminar</button>
                  </div>
                  ${producto.publicado
                    ? `<button class="btn btn-sm btn-warning" onclick="retirarProducto(${producto.id})"><i class="fas fa-eye-slash"></i> Retirar</button>`
                    : `<button class="btn btn-sm btn-success" onclick="publicarProducto(${producto.id})"><i class="fas fa-check-circle"></i> Publicar</button>`}
                </div>
              </div>
            </div>
          `;

            contenedor.appendChild(card);
        });

        const total = data.productos.length;
        const porcentajePublicados = Math.round((publicados / total) * 100);
        const porcentajeNoPublicados = 100 - porcentajePublicados;

        totalEl.textContent = total;
        publicadosEl.textContent = publicados;
        noPublicadosEl.textContent = noPublicados;

        barraPublicados.style.width = porcentajePublicados + '%';
        barraPublicados.textContent = porcentajePublicados + '%';

        barraNoPublicados.style.width = porcentajeNoPublicados + '%';
        barraNoPublicados.textContent = porcentajeNoPublicados + '%';

        resumen.style.display = 'flex';

    } else {
        contenedor.innerHTML = `<div class="alert alert-info text-center">No tienes productos registrados.</div>`;
    }
}

async function eliminarProducto(id) {
    try {
        if (confirm('¿Seguro que deseas eliminar este producto?')) {
            const res = await fetch(`/api/productos/${id}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) {
                cargarProductos();
                Utils.showToast('Producto eliminado', 'success');
            }
        }
    } catch (error) {
        console.error(error);
    }
}

async function publicarProducto(id) {
    const res = await fetch(`/api/productos/publicar/${id}`, { method: 'PUT' });
    const data = await res.json();
    if (data.success) {
        Utils.showToast('Producto publicado', 'success');
        cargarProductos();
    }
}

async function retirarProducto(id) {
    const res = await fetch(`/api/productos/retirar/${id}`, { method: 'PUT' });
    const data = await res.json();
    if (data.success) {
        Utils.showToast('Producto retirado de publicación', 'error');
        cargarProductos();
    }
}

// Aquí la función editada para redirigir a la página de edición con el ID por query string
function editarProducto(id) {
    window.location.href = `../Html/editar_producto.html?id=${id}`;
}

window.onload = cargarProductos;