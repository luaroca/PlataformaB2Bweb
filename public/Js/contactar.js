
// Obtener el productoId de la URL
const urlParams = new URLSearchParams(window.location.search);
const productoId = urlParams.get('id');
document.getElementById('productoId').value = productoId;

let datosListos = false;

// Obtener los datos del producto y del vendedor
fetch(`/api/contacto-info/${productoId}`)
    .then(response => {
        return response.json();
    })
    .then(data => {
        if (data.success) {
            document.getElementById('correoVendedor').value = data.correoVendedor;
            document.getElementById('nombreProducto').value = data.producto.nombre;
            datosListos = true;
        } else {
            console.error('Error en la respuesta:', data.message);
            Utils.showToast('Error al obtener los datos del producto','error');
        }
    })
    .catch(error => {
        console.error('Error en fetch:', error);
        Utils.showToast('Error de conexión','error');
    });

// Prevenir el envío del formulario si aún no están los datos cargados
document.getElementById('quotationForm').addEventListener('submit', function (event) {
    const correoVendedor = document.getElementById('correoVendedor').value;

    if (!datosListos || !correoVendedor) {
        event.preventDefault();
        Utils.showToast('Por favor espera a que se cargue la información del vendedor antes de enviar el formulario.','warning');
        return;
    }

    // Validar campos requeridos
    if (!this.checkValidity()) {
        event.preventDefault();
        Utils.showToast('Por favor completa todos los campos requeridos.','warning');
        return;
    }

    window.location.href = '../Html/mensaje-exito.html';
});