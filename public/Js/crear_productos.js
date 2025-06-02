
const categorias = {
    "Electrónica": [
        "Teléfonos móviles",
        "Computadoras",
        "Accesorios electrónicos",
        "Televisores",
        "Audio y sonido"
    ],
    "Ropa": [
        "Hombres",
        "Mujeres",
        "Niños",
        "Deportiva",
        "Ropa interior"
    ],
    "Hogar": [
        "Muebles",
        "Decoración",
        "Cocina",
        "Iluminación",
        "Electrodomésticos"
    ],
    "Alimentos": [
        "Frescos",
        "Congelados",
        "Snacks",
        "Despensa",
        "Orgánicos"
    ],
    "Bebidas": [
        "Gaseosas",
        "Jugos",
        "Agua",
        "Cerveza",
        "Vinos y licores"
    ],
    "Salud y Belleza": [
        "Cuidado de la piel",
        "Maquillaje",
        "Suplementos",
        "Higiene personal",
        "Perfumería"
    ],
    "Deportes": [
        "Indumentaria deportiva",
        "Equipamiento",
        "Calzado",
        "Fitness",
        "Ciclismo"
    ],
    "Juguetes": [
        "Educativos",
        "Para bebés",
        "Juegos de mesa",
        "Muñecos",
        "Vehículos de juguete"
    ],
    "Mascotas": [
        "Perros",
        "Gatos",
        "Alimentos",
        "Accesorios",
        "Higiene y salud"
    ],
    "Automotriz": [
        "Repuestos",
        "Herramientas",
        "Audio para autos",
        "Llantas y neumáticos",
        "Accesorios"
    ],
    "Libros": [
        "Ficción",
        "No ficción",
        "Infantiles",
        "Educativos",
        "Autoayuda"
    ],
    "Papelería": [
        "Cuadernos",
        "Artículos escolares",
        "Oficina",
        "Tinta y tóner",
        "Organización"
    ],
    "Calzado": [
        "Zapatillas",
        "Botas",
        "Zapatos formales",
        "Sandalias",
        "Infantil"
    ],
    "Tecnología": [
        "Smartwatches",
        "Tablets",
        "Laptops",
        "Cámaras",
        "Accesorios tech"
    ],
    "Viajes": [
        "Maletas",
        "Accesorios de viaje",
        "Guías",
        "Tours",
        "Seguros de viaje"
    ],
    "Instrumentos Musicales": [
        "Guitarras",
        "Teclados",
        "Percusión",
        "Accesorios",
        "Sonido profesional"
    ],
    "Jardín": [
        "Muebles de jardín",
        "Herramientas",
        "Decoración exterior",
        "Plantas",
        "Riego"
    ],
    "Muebles": [
        "Sofás",
        "Mesas",
        "Sillas",
        "Camas",
        "Almacenamiento"
    ],
    "Bebés": [
        "Pañales",
        "Ropa de bebé",
        "Alimentación",
        "Juguetes para bebés",
        "Cochecitos"
    ],
    "Oficina": [
        "Escritorios",
        "Sillas de oficina",
        "Organización",
        "Tecnología de oficina",
        "Libreros"
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
    submitBtn.classList.add('btn-loading');
    submitBtn.disabled = true;

    const proveedorId = localStorage.getItem('usuarioId');
    if (!proveedorId) {
        Utils.showToast('Debes iniciar sesión primero.', 'warning');
        submitBtn.classList.remove('btn-loading');
        submitBtn.disabled = false;
        return window.location.href = '../Html/login.html';
    }

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
