
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


const selectUnidad = document.getElementById('unidad_medida');
const selectPago = document.getElementById('condiciones_pago');
const imageInput = document.getElementById('imagenes');
const imagePreview = document.getElementById('imagePreview');

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
            previewItem.appendChild(img);
            imagePreview.appendChild(previewItem);
        };
        reader.readAsDataURL(file);
    });
});

// Simulación: cargar datos de producto para editar
async function cargarDatosProducto() {
    const productoId = new URLSearchParams(window.location.search).get('id');
    if (!productoId) {
        Utils.showToast("ID de producto no especificado.", 'error');
        return;
    }

    try {
        const res = await fetch(`/api/productos/${productoId}`);
        const data = await res.json();

        if (data.success) {
            const p = data.producto;
            document.getElementById('nombre').value = p.nombre;
            document.getElementById('descripcion').value = p.descripcion;
            document.getElementById('precio').value = p.precio;
            document.getElementById('stock').value = p.stock;
            document.getElementById('origen_producto').value = p.origen_producto;
            document.getElementById('minimo_pedido').value = p.minimo_pedido;
            document.getElementById('tiempo_entrega').value = p.tiempo_entrega;
            selectUnidad.value = p.unidad_medida;
            selectPago.value = p.condiciones_pago;
            document.getElementById('categoria').value = p.categoria || '';
            document.getElementById('subcategoria').value = p.subcategoria || '';
            // Las imágenes pueden mostrarse si están disponibles desde el servidor
        } else {
            Utils.showToast("No se pudo cargar el producto.", 'error');
        }
    } catch (error) {
        console.error(error);
        Utils.showToast("Error al cargar el producto.", 'error');
    }
}

// Enviar actualización
const form = document.getElementById('formularioEditarProducto');
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const productoId = new URLSearchParams(window.location.search).get('id');
    if (!productoId) {
        Utils.showToast("Producto no especificado.", 'error');
        return
    }

    const proveedorId = localStorage.getItem('usuarioId');
    if (!proveedorId) {
        Utils.showToast('Debes iniciar sesión primero.', 'warning');
        return window.location.href = '../Html/login.html';
    }

    const formData = new FormData(form);
    formData.append('proveedor_id', proveedorId);
    formData.append('imagen_producto', imageInput)

    try {
        const res = await fetch(`/api/productos/${productoId}`, {
            method: 'PUT',
            body: formData
        });

        const data = await res.json();
        if (data.success) {
            Utils.showToast("Producto actualizado correctamente", 'success');
        } else {
            Utils.showToast("Error: " + data.message, 'error');
        }
    } catch (err) {
        console.error(err);
        Utils.showToast("Error al actualizar el producto.", 'error');
    }
});

window.addEventListener('DOMContentLoaded', () => {
    if (!localStorage.getItem("usuarioId")) {
        return window.location.href = "../Html/login.html";
    }
    cargarUnidades();
    cargarCondicionesPago();
    cargarDatosProducto();
});