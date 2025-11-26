const categorias = {
    "Electrónica": [
        "Teléfonos móviles",
        "Computadoras",
        "Accesorios electrónicos",
        "Televisores",
        "Audio y sonido"
    ],
    "Electrodomésticos": [
        "Refrigeradores",
        "Lavadoras",
        "Cocinas",
        "Hornos",
        "Aires acondicionados"
    ],
    "Ropa y Vestimenta": [
        "Hombres",
        "Mujeres",
        "Niños",
        "Deportiva",
        "Ropa interior"
    ],
    "Calzado": [
        "Zapatillas",
        "Botas",
        "Zapatos formales",
        "Sandalias",
        "Infantil"
    ],
    "Juguetes y Juegos": [
        "Educativos",
        "Para bebés",
        "Juegos de mesa",
        "Muñecos",
        "Vehículos de juguete"
    ],
    "Muebles": [
        "Sofás",
        "Mesas",
        "Sillas",
        "Camas",
        "Almacenamiento"
    ],
    "Herramientas y Ferretería": [
        "Herramientas",
        "Accesorios",
        "Materiales de construcción",
        "Productos de limpieza",
        "Seguridad y vigilancia"
    ],
    "Automotriz": [
        "Repuestos",
        "Herramientas",
        "Audio para autos",
        "Llantas y neumáticos",
        "Accesorios"
    ],
    "Deportes y Aire Libre": [
        "Indumentaria deportiva",
        "Equipamiento",
        "Calzado",
        "Fitness",
        "Ciclismo"
    ],
    "Belleza y Cuidado Personal": [
        "Cuidado de la piel",
        "Maquillaje",
        "Suplementos",
        "Higiene personal",
        "Perfumería"
    ],
    "Salud y Medicamentos": [
        "Medicamentos",
        "Suplementos",
        "Equipos médicos",
        "Productos ecológicos",
        "Cuidado personal"
    ],
    "Alimentación y Bebidas": [
        "Frescos",
        "Congelados",
        "Snacks",
        "Despensa",
        "Orgánicos"
    ],
    "Productos para Mascotas": [
        "Perros",
        "Gatos",
        "Alimentos",
        "Accesorios",
        "Higiene y salud"
    ],
    "Libros y Material de Oficina": [
        "Ficción",
        "No ficción",
        "Infantiles",
        "Educativos",
        "Autoayuda",
        "Cuadernos",
        "Artículos escolares",
        "Oficina",
        "Tinta y tóner",
        "Organización"
    ],
    "Tecnología e Informática": [
        "Smartwatches",
        "Tablets",
        "Laptops",
        "Cámaras",
        "Accesorios tech"
    ],
    "Telefonía y Accesorios": [
        "Teléfonos móviles",
        "Accesorios",
        "Audio y sonido"
    ],
    "Relojería y Joyería": [
        "Relojes",
        "Joyas",
        "Accesorios"
    ],
    "Instrumentos Musicales": [
        "Guitarras",
        "Teclados",
        "Percusión",
        "Accesorios",
        "Sonido profesional"
    ],
    "Artículos de Cocina": [
        "Utensilios",
        "Electrodomésticos",
        "Decoración",
        "Productos ecológicos",
        "Productos de limpieza"
    ],
    "Jardinería y Plantas": [
        "Muebles de jardín",
        "Herramientas",
        "Decoración exterior",
        "Plantas",
        "Riego"
    ],
    "Seguridad y Vigilancia": [
        "Cámaras",
        "Alarmas",
        "Sistemas de control",
        "Accesorios",
        "Productos ecológicos"
    ],
    "Bebés y Niños": [
        "Pañales",
        "Ropa de bebé",
        "Alimentación",
        "Juguetes para bebés",
        "Cochecitos"
    ],
    "Arte y Manualidades": [
        "Pinturas",
        "Papel",
        "Materiales de construcción",
        "Productos ecológicos",
        "Productos de limpieza"
    ],
    "Viajes y Equipaje": [
        "Maletas",
        "Accesorios de viaje",
        "Guías",
        "Tours",
        "Seguros de viaje"
    ],
    "Servicios y Suscripciones": [
        "Servicios",
        "Suscripciones",
        "Accesorios",
        "Productos ecológicos",
        "Productos de limpieza"
    ],
    "Textiles para el Hogar": [
        "Ropa de cama",
        "Cortinas",
        "Toallas",
        "Decoración",
        "Productos ecológicos"
    ],
    "Materiales de Construcción": [
        "Herramientas",
        "Accesorios",
        "Productos ecológicos",
        "Productos de limpieza",
        "Seguridad y vigilancia"
    ],
    "Productos Ecológicos": [
        "Productos de limpieza",
        "Alimentos",
        "Textiles",
        "Herramientas",
        "Accesorios"
    ],
    "Productos de Limpieza": [
        "Detergentes",
        "Limpieza general",
        "Accesorios",
        "Productos ecológicos",
        "Seguridad y vigilancia"
    ]
};

const unidadesMedida = [
    "pieza",
    "caja",
    "kg",
    "litro",
    "metro",
    "gramo",
    "mililitro",
    "paquete",
    "docena",
    "rollo"
];

const condicionesPago = [
    "Transferencia bancaria",
    "Contra entrega",
    "Tarjeta de crédito",
    "Tarjeta de débito",
    "PayPal",
    "Efectivo",
    "Crédito a 30 días",
    "Cheque"
];

const selectCategoria = document.getElementById('categoria');
const selectSubcategoria = document.getElementById('subcategoria');
const selectUnidad = document.getElementById('unidad_medida');
const selectPago = document.getElementById('condiciones_pago');
const imageInput = document.getElementById('imagenes');
const imagePreview = document.getElementById('imagePreview');

function getProductoIdDesdeURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

const productoId = getProductoIdDesdeURL();

function cargarCategorias() {
    for (const cat in categorias) {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat;
        selectCategoria.appendChild(option);
    }
}

selectCategoria.addEventListener('change', () => {
    const seleccion = selectCategoria.value;
    selectSubcategoria.innerHTML = '<option value="">Seleccione una subcategoría</option>';
    if (seleccion && categorias[seleccion]) {
        categorias[seleccion].forEach(sub => {
            const option = document.createElement('option');
            option.value = sub;
            option.textContent = sub;
            selectSubcategoria.appendChild(option);
        });
        selectSubcategoria.disabled = false;
    } else {
        selectSubcategoria.disabled = true;
    }
});

function cargarUnidades() {
    unidadesMedida.forEach(u => {
        const option = document.createElement('option');
        option.value = u;
        option.textContent = u;
        selectUnidad.appendChild(option);
    });
}

function cargarCondicionesPago() {
    condicionesPago.forEach(c => {
        const option = document.createElement('option');
        option.value = c;
        option.textContent = c;
        selectPago.appendChild(option);
    });
}

function precargarFormulario(producto) {
    document.getElementById('nombre').value = producto.nombre;
    document.getElementById('precio').value = producto.precio;
    document.getElementById('descripcion').value = producto.descripcion;
    document.getElementById('minimo_pedido').value = producto.minimo_pedido;
    document.getElementById('stock').value = producto.stock;
    document.getElementById('origen_producto').value = producto.origen_producto;
    document.getElementById('tiempo_entrega').value = producto.tiempo_entrega;
    document.getElementById('categoria').value = producto.categoria;

    selectCategoria.dispatchEvent(new Event('change'));

    setTimeout(() => {
        document.getElementById('subcategoria').value = producto.subcategoria;
    }, 100);

    document.getElementById('unidad_medida').value = producto.unidad_medida;
    document.getElementById('condiciones_pago').value = producto.condiciones_pago;

    // Previsualizar imágenes existentes
    if (producto.imagenes && producto.imagenes.length) {
        imagePreview.innerHTML = '';
        producto.imagenes.slice(0, 3).forEach((url, index) => {
            const previewItem = document.createElement('div');
            previewItem.className = 'file-preview-item';

            const img = document.createElement('img');
            img.src = url;
            img.alt = `Imagen ${index + 1}`;

            previewItem.appendChild(img);
            imagePreview.appendChild(previewItem);
        });
    }

    // Cambiar texto del botón
    const submitBtn = document.querySelector('#formularioProducto button[type="submit"]');
    submitBtn.innerHTML = '<i class="fas fa-edit me-2"></i>Guardar Cambios';
}

imageInput.addEventListener('change', function () {
    imagePreview.innerHTML = '';

    const maxFiles = 3;
    const filesToShow = Array.from(this.files).slice(0, maxFiles);

    filesToShow.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = function (e) {
            const previewItem = document.createElement('div');
            previewItem.className = 'file-preview-item';

            const img = document.createElement('img');
            img.src = e.target.result;
            img.alt = `Vista previa ${index + 1}`;

            previewItem.appendChild(img);
            imagePreview.appendChild(previewItem);
        };
        reader.readAsDataURL(file);
    });

    document.querySelector('.file-input-text').textContent = `${this.files.length} imagen(es) seleccionadas`;
});

cargarCategorias();
cargarUnidades();
cargarCondicionesPago();

// Si hay ID, cargar el producto
if (productoId) {
    fetch(`/api/productos/${productoId}`)
        .then(res => res.json())
        .then(data => {
            if (data && data.producto) {
                precargarFormulario(data.producto);
            } else {
                Utils.showToast('Producto no encontrado.', 'error');
                window.location.href = '../Html/dashboard_comprador.html';
            }
        })
        .catch(err => {
            Utils.showToast('Error al cargar el producto.', 'error');
            console.error(err);
        });
}

const form = document.getElementById('formularioProducto');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');

    const proveedorId = localStorage.getItem('usuarioId');
    if (!proveedorId) {
        Utils.showToast('Debes iniciar sesión primero.', 'warning');
        return window.location.href = '../Html/login.html';
    }

    // ==========================
    // VALIDACIONES PERSONALIZADAS
    // ==========================

    const nombre = document.getElementById('nombre').value.trim();
    const precioStr = document.getElementById('precio').value.trim();
    const descripcion = document.getElementById('descripcion').value.trim();
    const minimoPedidoStr = document.getElementById('minimo_pedido').value.trim();
    const stockStr = document.getElementById('stock').value.trim();
    const origen = document.getElementById('origen_producto').value.trim();
    const tiempoEntregaStr = document.getElementById('tiempo_entrega').value.trim();

    // 1) Nombre del producto: 1 ≤ longitud ≤ 50
    if (nombre.length < 1 || nombre.length > 50) {
        Utils.showToast('El nombre del producto debe tener entre 1 y 50 caracteres.', 'error');
        return;
    }

    // 4) Precio por unidad ≥ 1000
    const precio = Number(precioStr);
    if (isNaN(precio) || precio < 1000) {
        Utils.showToast('El precio por unidad debe ser un número mayor o igual a 1000.', 'error');
        return;
    }

    // 7) Descripción: 1 ≤ longitud ≤ 200
    if (descripcion.length < 1 || descripcion.length > 200) {
        Utils.showToast('La descripción debe tener entre 1 y 200 caracteres.', 'error');
        return;
    }

    // 120) Cantidad mínima ≥ 1, entero positivo
    const minimoPedido = Number(minimoPedidoStr);
    if (!Number.isInteger(minimoPedido) || minimoPedido < 1) {
        Utils.showToast('La cantidad mínima debe ser un número entero positivo mayor o igual a 1.', 'error');
        return;
    }

    // 123) Stock disponible > 0, entero positivo
    const stock = Number(stockStr);
    if (!Number.isInteger(stock) || stock <= 0) {
        Utils.showToast('El stock disponible debe ser un número entero positivo mayor a 0.', 'error');
        return;
    }

    // 126) Origen del producto: 1 ≤ longitud ≤ 50
    if (origen.length < 1 || origen.length > 50) {
        Utils.showToast('El origen del producto debe tener entre 1 y 50 caracteres.', 'error');
        return;
    }

    // 129) Tiempo de entrega ≥ 1 día, entero positivo
    const tiempoEntrega = Number(tiempoEntregaStr);
    if (!Number.isInteger(tiempoEntrega) || tiempoEntrega < 1) {
        Utils.showToast('El tiempo de entrega debe ser un número entero de días mayor o igual a 1.', 'error');
        return;
    }

    // Si todas las validaciones pasan, deshabilitar botón y enviar
    submitBtn.classList.add('btn-loading');
    submitBtn.disabled = true;

    const formData = new FormData(form);
    formData.append('proveedor_id', proveedorId);

    try {
        const url = productoId ? `/api/productos/${productoId}` : '/api/productos';
        const method = productoId ? 'PUT' : 'POST';

        const res = await fetch(url, {
            method,
            body: formData
        });

        const data = await res.json();

        if (data.success) {
            const successMessage = document.createElement('div');
            successMessage.className = 'alert alert-success mt-3';
            successMessage.innerHTML = '<i class="fas fa-check-circle me-2"></i>Producto actualizado correctamente';
            form.parentNode.insertBefore(successMessage, form.nextSibling);

            window.scrollTo({ top: 0, behavior: 'smooth' });

            setTimeout(() => successMessage.remove(), 5000);
        } else {
            Utils.showToast('Error: ' + data.message, 'error');
        }
    } catch (error) {
        Utils.showToast('Error en la conexión al servidor', 'error');
        console.error(error);
    } finally {
        submitBtn.classList.remove('btn-loading');
        submitBtn.disabled = false;

        
    }
});
