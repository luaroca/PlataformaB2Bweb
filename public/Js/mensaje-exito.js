// Función para redirigir a otra página
function redirectToPage() {
    // Cambia 'index.html' por la página a la que quieres redirigir
    window.location.href = '../Html/productos.html';
}

// Animación de entrada
window.addEventListener('load', function () {
    document.querySelector('.success-card').classList.add('animate-in');
});

// Generar número de referencia aleatorio
function generateReferenceNumber() {
    const date = new Date();
    const year = date.getFullYear();
    const random = Math.floor(Math.random() * 999999).toString().padStart(6, '0');
    return `#COT-${year}-${random}`;
}

// Actualizar número de referencia
document.addEventListener('DOMContentLoaded', function () {
    const refElement = document.querySelector('.reference-number');
    refElement.textContent = `Número de referencia: ${generateReferenceNumber()}`;
});