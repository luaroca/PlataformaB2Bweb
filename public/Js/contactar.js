// Obtener el productoId de la URL
const urlParams = new URLSearchParams(window.location.search);
const productoId = urlParams.get('id');
document.getElementById('productoId').value = productoId;

let datosListos = false;

// Obtener los datos del producto y del vendedor
fetch(`/api/contacto-info/${productoId}`)
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            document.getElementById('correoVendedor').value = data.correoVendedor;
            document.getElementById('nombreProducto').value = data.producto.nombre;
            datosListos = true;
        } else {
            console.error('Error en la respuesta:', data.message);
            Utils.showToast('Error al obtener los datos del producto', 'error');
        }
    })
    .catch(error => {
        console.error('Error en fetch:', error);
        Utils.showToast('Error de conexión', 'error');
    });

// Validación del formulario y prevención de envío si no cumple reglas
document.getElementById('quotationForm').addEventListener('submit', function (event) {
    const correoVendedor = document.getElementById('correoVendedor').value;

    // 1) Debe estar cargada la info del vendedor
    if (!datosListos || !correoVendedor) {
        event.preventDefault();
        Utils.showToast(
            'Por favor espera a que se cargue la información del vendedor antes de enviar el formulario.',
            'warning'
        );
        return;
    }

    // Obtener valores
    const buyerName = document.getElementById('buyerName').value.trim();
    const buyerId = document.getElementById('buyerId').value.trim();
    const buyerEmail = document.getElementById('buyerEmail').value.trim();
    const buyerPhone = document.getElementById('buyerPhone').value.trim();
    const position = document.getElementById('position').value.trim();
    const companyName = document.getElementById('companyName').value.trim();
    const address = document.getElementById('address').value.trim();
    const city = document.getElementById('city').value.trim();
    const productName = document.getElementById('productName').value.trim();
    const quantityStr = document.getElementById('quantity').value.trim();
    const deliveryLocation = document.getElementById('deliveryLocation').value.trim();
    const additionalRequirements = document.getElementById('additionalRequirements').value.trim();

    // Base de caracteres permitidos para campos alfanuméricos con símbolos básicos:
    // letras (incluye tildes), números, espacios, coma, punto, guion y #.
    const textChars = "a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\\s,\\.\\-#";


    // Expresiones regulares y reglas
    const nombreRegex = new RegExp(`^[${textChars}]{5,50}$`);          // 5 ≤ Nombre ≤ 50
    const cargoRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s,.\-#]{4,}$/;                                                               // Cargo ≥ 4, letras y números
    const cedulaRegex = /^\d{7,10}$/;                                  // 7 a 10 dígitos
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;                   // text@dominio.xxx sin espacios
    const telefonoRegex = /^3\d{9}$/;                                  // 10 dígitos, empieza en 3
    const empresaRegex = new RegExp(`^[${textChars}]{4,50}$`);         // 4 ≤ N empresa ≤ 50
    const direccionRegex = new RegExp(`^[${textChars}]{4,50}$`);       // 4 ≤ Dirección ≤ 50
    const ciudadRegex = new RegExp(`^[${textChars}]{4,50}$`);          // 4 ≤ Ciudad ≤ 50
    const productoRegex = new RegExp(`^[${textChars}]{4,50}$`);        // 4 ≤ N producto ≤ 50
    const lugarEntregaRegex = new RegExp(`^[${textChars}]{4,50}$`);    // 4 ≤ Lugar entrega ≤ 50
    const requisitosAdicRegex = new RegExp(`^[${textChars}]{4,100}$`); // 4 ≤ Req. adicionales ≤ 100

    // Validación: Nombre completo (obligatorio)
    if (!nombreRegex.test(buyerName)) {
        event.preventDefault();
        Utils.showToast(
            'El nombre completo debe tener entre 5 y 50 caracteres y puede incluir letras, números, espacios  .',
            'error'
        );
        return;
    }

    // Validación: Cargo/posición (opcional, ≥ 4, letras y números)
    if (position.length > 0 && !cargoRegex.test(position)) {
        event.preventDefault();
        Utils.showToast(
            'El cargo/posición debe tener al menos 4 caracteres, contener letras y números .',
            'error'
        );
        return;
    }

    // Validación: Cédula (obligatoria, 7-10 dígitos, rango)
    if (!cedulaRegex.test(buyerId)) {
        event.preventDefault();
        Utils.showToast(
            'La cédula debe ser numérica, entre 7 y 10 dígitos.',
            'error'
        );
        return;
    }
    const cedulaNum = Number(buyerId);
    if (cedulaNum < 1000000 || cedulaNum > 9999999999) {
        event.preventDefault();
        Utils.showToast(
            'La cédula debe estar entre 1.000.000 y 9.999.999.999.',
            'error'
        );
        return;
    }

    // Validación: Correo electrónico
    if (!emailRegex.test(buyerEmail)) {
        event.preventDefault();
        Utils.showToast(
            'El correo electrónico debe tener un formato válido (text@dominio.xxx) y no contener espacios.',
            'error'
        );
        return;
    }

    // Validación: Teléfono (10 dígitos, empieza con 3, rango 3000000000–3999999999)
    if (!telefonoRegex.test(buyerPhone)) {
        event.preventDefault();
        Utils.showToast(
            'El teléfono debe ser numérico, de 10 dígitos y comenzar con el número 3.',
            'error'
        );
        return;
    }
    const telefonoNum = Number(buyerPhone);
    if (telefonoNum < 3000000000 || telefonoNum > 3999999999) {
        event.preventDefault();
        Utils.showToast(
            'El teléfono debe estar entre 3000000000 y 3999999999.',
            'error'
        );
        return;
    }

    // Validación: Nombre de la empresa (obligatorio, 4–50)
    if (!empresaRegex.test(companyName)) {
        event.preventDefault();
        Utils.showToast(
            'El nombre de la empresa debe tener entre 4 y 50 caracteres y puede incluir letras, números, espacios  .',
            'error'
        );
        return;
    }

    // Validación: Dirección (opcional, 4–50 si se diligencia)
    if (address.length > 0 && !direccionRegex.test(address)) {
        event.preventDefault();
        Utils.showToast(
            'La dirección debe tener entre 4 y 50 caracteres y puede incluir letras, números, espacios .',
            'error'
        );
        return;
    }

    // Validación: Ciudad (opcional, 4–50 si se diligencia)
    if (city.length > 0 && !ciudadRegex.test(city)) {
        event.preventDefault();
        Utils.showToast(
            'La ciudad debe tener entre 4 y 50 caracteres y puede incluir letras, números, espacios .',
            'error'
        );
        return;
    }

    // Validación: Nombre del producto (obligatorio, 4–50)
    if (!productoRegex.test(productName)) {
        event.preventDefault();
        Utils.showToast(
            'El nombre del producto debe tener entre 4 y 50 caracteres y puede incluir letras, números, espacios  .',
            'error'
        );
        return;
    }

    // Validación: Cantidad requerida (entero positivo, ≥ 1)
    const quantity = Number(quantityStr);
    if (!Number.isInteger(quantity) || quantity < 1) {
        event.preventDefault();
        Utils.showToast(
            'La cantidad requerida debe ser un número entero positivo mayor o igual a 1.',
            'error'
        );
        return;
    }

    // Validación: Lugar de entrega (opcional, 4–50 si se diligencia)
    if (deliveryLocation.length > 0 && !lugarEntregaRegex.test(deliveryLocation)) {
        event.preventDefault();
        Utils.showToast(
            'El lugar de entrega debe tener entre 4 y 50 caracteres y puede incluir letras, números, espacios.',
            'error'
        );
        return;
    }

    // Validación: Requisitos adicionales (opcional, 4–100 si se diligencia)
    if (additionalRequirements.length > 0 && !requisitosAdicRegex.test(additionalRequirements)) {
        event.preventDefault();
        Utils.showToast(
            'Los requisitos adicionales deben tener entre 4 y 100 caracteres y pueden incluir letras, números, espacios .',
            'error'
        );
        return;
    }

    // Si todo es válido, se permite el envío normal hacia /enviar-contacto
});
