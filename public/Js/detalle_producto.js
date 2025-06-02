// ==================== VARIABLES GLOBALES ====================
const urlParams = new URLSearchParams(window.location.search);
const productoId = urlParams.get('id');
const usuarioActivo = localStorage.getItem('usuarioId');
const id_producto = productoId;

// ==================== UTILIDADES ====================
const Utils = {
    showToast: (message, type = "success") => {
        let container = document.getElementById("toast-container")

        if (!container) {
            container = document.createElement("div")
            container.id = "toast-container"
            container.className = "toast-container"
            document.body.appendChild(container)
        }

        const toast = document.createElement("div")
        toast.className = `toast ${type}`

        const icon = type === "success" ? "✅" : type === "error" ? "❌" : type === "warning" ? "⚠️" : "ℹ️"

        toast.innerHTML = `
            <div class="toast-content">
                <span class="toast-icon">${icon}</span>
                <span class="toast-message">${message}</span>
                <button class="toast-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `

        container.appendChild(toast)

        // Auto-remove después de 5 segundos
        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove()
            }
        }, 5000)
    },

    escapeHtml: (text) => {
        if (typeof text !== "string") {
            return text
        }
        const div = document.createElement("div")
        div.textContent = text
        return div.innerHTML
    },

    formatDate: (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
    },
}

// ==================== NAVEGACIÓN ====================
function actualizarNavegacion() {
    const btnPrimario = document.getElementById("btn-x")
    const btnSecundario = document.getElementById("btn-x2")

    if (usuarioActivo) {

        if (btnPrimario) {
            btnPrimario.textContent = "Perfil"
            btnPrimario.href = "../Html/dashboard_comprador.html"
        }

        if (btnSecundario) {
            btnSecundario.style.display = "none"
        }
    } else {

        if (btnPrimario) {
            btnPrimario.textContent = "Iniciar Sesión"
            btnPrimario.href = "../Html/Login.html"
        }

        if (btnSecundario) {
            btnSecundario.style.display = "inline-flex"
            btnSecundario.textContent = "Registrarse"
            btnSecundario.href = "../Html/registrar.html"
        }
    }
}

// ==================== FUNCIONES PRINCIPALES ====================
async function cargarDetalleProducto(productoId) {
    try {
        const response = await fetch(`/producto-detalle/${productoId}`)
        const data = await response.json()
        const producto = data.producto

        function mostrarOCultarImagen(id, imagen) {
            const img = document.getElementById(id)
            if (img) {
                if (imagen && imagen.trim() !== "") {
                    img.src = `../uploads/${imagen}`
                    img.style.display = "block"
                } else {
                    img.style.display = "none"
                }
            }
        }

        mostrarOCultarImagen("img_1", producto.imagen_principal)
        mostrarOCultarImagen("img_2", producto.imagen_secundaria1)
        mostrarOCultarImagen("img_3", producto.imagen_secundaria2)
        mostrarOCultarImagen("imagen_principal", producto.imagen_principal)

        const mainTitleElement = document.querySelector(".product-main-title")
        if (mainTitleElement) {
            mainTitleElement.textContent = producto.nombre
        }

        document.getElementById("nombre").textContent = producto.nombre
        document.getElementById("proveedor").textContent = producto.proveedor_nombre
        document.getElementById("unidad_medida").textContent = producto.unidad_medida
        document.getElementById("origen_producto").textContent = producto.origen_producto
        document.getElementById("tiempo_entrega").textContent = producto.tiempo_entrega
        document.getElementById("precio").textContent = Number.parseFloat(producto.precio).toLocaleString("es-CO")
        document.getElementById("precio_anterior").textContent = (producto.precio * 1.15).toFixed(2)
        document.getElementById("stock").textContent = producto.stock
        document.getElementById("minimo_pedido").textContent = producto.minimo_pedido

        calcularDescuento((producto.precio * 1.15).toFixed(2), producto.precio)
        cargarProductosRelacionados(producto.categoria, productoId)
        await cargarResenasYEstadisticas(productoId)
        await verifiarfavorito()


    } catch (err) {
        console.error("Error al cargar producto:", err)
        Utils.showToast("Error al cargar el producto", "error")
    }
}

function calcularDescuento(precioAnterior, precioActual) {
    const diferencia = precioAnterior - precioActual
    const porcentajeDescuento = (diferencia / precioAnterior) * 100
    document.getElementById("porcentaje_descuento").textContent = porcentajeDescuento.toFixed(2) + "%"
}

async function cargarProductosRelacionados(categoria, id) {
    try {
        const response = await fetch(`/productos-relacionados/${categoria}/${id}`)
        const data = await response.json()
        const contenedor = document.getElementById("related-products")

        contenedor.innerHTML = ""

        if (data.success && data.productos.length > 0) {
            data.productos.forEach((producto) => {
                const div = document.createElement("div")
                div.className = "related-product-card"
                div.innerHTML = `
                    <img src="../${producto.imagen_principal ? `../uploads/${producto.imagen_principal}` : "imagen-placeholder.jpg"}"
                        alt="${producto.nombre}" />
                    <p class="product-name">${producto.nombre}</p>
                    <p class="product-price">$${Number.parseFloat(producto.precio).toLocaleString("es-CO")}</p>
                `
                div.onclick = () => {
                    location.href = `../Html/detalle_producto.html?id=${producto.id}`;
                }
                contenedor.appendChild(div)
            })
        } else {
            contenedor.innerHTML = "<p>No hay productos relacionados.</p>"
        }
    } catch (err) {
        console.error("Error al cargar productos relacionados:", err)
    }
}

// ==================== FUNCIONES DE RESEÑAS ====================
async function verifiarfavorito() {
    const btnFavoritos = document.getElementById("btn-favoritos");

    if (!usuarioActivo || !productoId || !btnFavoritos) return;

    try {
        // Llamada al backend para obtener favoritos del usuario
        const response = await fetch(`/favoritos/${usuarioActivo}`);
        const data = await response.json();

        if (data.success && Array.isArray(data.favoritos)) {
            const estaEnFavoritos = data.favoritos.some(p => p.id == productoId);
            if (estaEnFavoritos) {
                // Cambia estilos para mostrarlo como activo
                btnFavoritos.style.backgroundColor = "#1F4E60";
                btnFavoritos.style.color = "#fff";
                btnFavoritos.classList.add("activo");
            }
        }
    } catch (error) {
        console.error("Error al verificar favoritos:", error);
    }
}
async function cargarResenasYEstadisticas(productoId) {
    try {
        await cargarEstadisticasResenas(productoId)
        await cargarResenas(productoId, 1, 5)
    } catch (error) {
        console.error("❌ Error al cargar reseñas:", error)
    }
}

async function cargarEstadisticasResenas(productoId) {
    try {
        const response = await fetch(`/resenas-estadisticas/${productoId}`)

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()

        if (data.success && data.estadisticas) {
            const stats = data.estadisticas
            actualizarResumenCalificaciones(stats)
            actualizarBarrasProgreso(stats.porcentajes)
        } else {
            console.warn("No se encontraron estadísticas")
            const statsDefault = {
                total_resenas: 0,
                promedio_calificacion: 0,
                porcentajes: { p5: 0, p4: 0, p3: 0, p2: 0, p1: 0 },
            }
            actualizarResumenCalificaciones(statsDefault)
            actualizarBarrasProgreso(statsDefault.porcentajes)
        }
    } catch (error) {
        console.error("Error al cargar estadísticas:", error)
    }
}

async function cargarResenas(productoId, page = 1, limit = 5) {
    try {

        const response = await fetch(`/resenas/${productoId}?page=${page}&limit=${limit}`)

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()

        if (data.success && data.data && data.data.resenas) {
            mostrarResenas(data.data.resenas, data.data.paginacion)
        } else {
            console.warn("⚠️ No se encontraron reseñas")
            mostrarResenas([], 0)
        }
    } catch (error) {
        console.error("❌ Error al cargar reseñas:", error)
        const contenedor = document.getElementById("reviews-list")
        if (contenedor) {
            contenedor.innerHTML = "<p>Error al cargar las reseñas. Por favor, intenta de nuevo más tarde.</p>"
        }
    }
}

function actualizarResumenCalificaciones(stats) {
    const promedio = Number.parseFloat(stats.promedio_calificacion) || 0
    const totalResenas = Number.parseInt(stats.total_resenas) || 0

    const ratingScore = document.querySelector(".rating-score")
    const ratingStars = document.querySelector(".rating-stars")
    const ratingLabel = document.querySelector(".rating-label")

    if (ratingScore) {
        ratingScore.textContent = promedio.toFixed(1)
    }

    if (ratingStars) {
        ratingStars.innerHTML = renderizarEstrellas(Math.round(promedio))
    }

    if (ratingLabel) {
        ratingLabel.textContent = `Basado en ${totalResenas} reseñas`
    }
}

function actualizarBarrasProgreso(porcentajes) {
    if (!porcentajes || typeof porcentajes !== "object") {
        porcentajes = { p5: 0, p4: 0, p3: 0, p2: 0, p1: 0 }
    }

    const obtenerPorcentaje = (valor) => {
        const num = Number.parseFloat(valor) || 0
        return Math.max(0, Math.min(100, num))
    }

    const barras = ["bar-5", "bar-4", "bar-3", "bar-2", "bar-1"]
    const porcentajesTexto = ["porcentaje_5", "porcentaje_4", "porcentaje_3", "porcentaje_2", "porcentaje_1"]
    const claves = ["p5", "p4", "p3", "p2", "p1"]

    barras.forEach((barraId, index) => {
        const barra = document.getElementById(barraId)
        const textoElemento = document.getElementById(porcentajesTexto[index])
        const porcentaje = obtenerPorcentaje(porcentajes[claves[index]])

        if (barra) {
            barra.style.width = `${porcentaje}%`
        }

        if (textoElemento) {
            textoElemento.textContent = `${porcentaje.toFixed(0)}%`
        }
    })
}

function mostrarResenas(resenas, paginacion) {
    const contenedor = document.getElementById("reviews-list")
    if (!contenedor) {
        console.warn("Contenedor reviews-list no encontrado")
        return
    }

    contenedor.innerHTML = ""

    if (!resenas || resenas.length === 0) {
        contenedor.innerHTML = "<p>No hay reseñas disponibles para este producto.</p>"
        return
    }

    resenas.forEach((resena) => {
        const nombreUsuario = resena.usuario_nombre || "Usuario anónimo"
        const comentario = resena.comentario || "Sin comentario"
        const calificacion = Number.parseInt(resena.calificacion) || 0
        const pais = resena.codigo_pais || "País no especificado"
        const banderaUrl = resena.codigo_pais
            ? `https://flagcdn.com/w40/${resena.codigo_pais.toLowerCase()}.png`
            : "../uploads/bandera_default.png";

        const fechaFormateada = Utils.formatDate(resena.fecha_creacion)

        const reviewDiv = document.createElement("div")
        reviewDiv.className = "review-item"

        reviewDiv.innerHTML = `
            <div class="review-header">
                <div class="reviewer-info">
                    <span class="reviewer-name">${Utils.escapeHtml(nombreUsuario)}</span>
                    <div class="reviewer-country">
                        <img src="${Utils.escapeHtml(banderaUrl)}" alt="${Utils.escapeHtml(pais)}" width="16" height="12" 
                             onerror="this.src='../uploads/bandera_default.png'">
                        <span>${Utils.escapeHtml(pais)}</span>
                    </div>
                </div>
                <div class="review-rating">
                    ${renderizarEstrellas(calificacion)}
                </div>
            </div>
            <div class="review-content">
                <p>${Utils.escapeHtml(comentario)}</p>
                ${resena.imagen_url ? `<img src="${Utils.escapeHtml(resena.imagen_url)}" alt="Imagen de reseña" class="review-image" onerror="this.style.display='none'">` : ""}
            </div>
            <div class="review-date">
                ${fechaFormateada}
            </div>
        `

        contenedor.appendChild(reviewDiv)
    })
    renderizarControlesPaginacion(paginacion)
}

function renderizarEstrellas(cantidad) {
    const calificacion = Number.parseInt(cantidad) || 0
    const calificacionValida = Math.max(0, Math.min(5, calificacion))

    const estrellas = []
    for (let i = 1; i <= 5; i++) {
        if (i <= calificacionValida) {
            estrellas.push('<span class="star filled">★</span>')
        } else {
            estrellas.push('<span class="star empty">☆</span>')
        }
    }
    return estrellas.join("")
}

// ==================== NUEVA FUNCIONALIDAD: CREAR RESEÑA ====================
function configurarFormularioResena() {
    const btnEscribirResena = document.getElementById("btn-escribir-resena")
    const createReviewSection = document.getElementById("create-review-section")
    const formNuevaResena = document.getElementById("form-nueva-resena")
    const btnCancelarResena = document.getElementById("btn-cancelar-resena")
    const starRatingInput = document.getElementById("star-rating-input")
    const calificacionInput = document.getElementById("calificacion-nueva")
    const comentarioTextarea = document.getElementById("comentario-nuevo")
    const charCount = document.getElementById("char-count")

    // Verificar si el usuario está logueado
    if (!usuarioActivo) {
        if (btnEscribirResena) {
            btnEscribirResena.addEventListener("click", () => {
                Utils.showToast("Debes iniciar sesión para escribir una reseña", "warning")
                setTimeout(() => {
                    window.location.href = "../Html/Login.html"
                }, 2000)
            })
        }
        return
    }

    // Mostrar/ocultar formulario
    if (btnEscribirResena) {
        btnEscribirResena.addEventListener("click", () => {
            createReviewSection.style.display = "block"
            btnEscribirResena.style.display = "none"
            createReviewSection.scrollIntoView({ behavior: "smooth" })
        })
    }

    if (btnCancelarResena) {
        btnCancelarResena.addEventListener("click", () => {
            createReviewSection.style.display = "none"
            btnEscribirResena.style.display = "block"
            formNuevaResena.reset()
            resetearEstrellas()
        })
    }

    // Configurar sistema de estrellas
    if (starRatingInput) {
        const estrellas = starRatingInput.querySelectorAll(".star-input")

        estrellas.forEach((estrella, index) => {
            estrella.addEventListener("click", () => {
                const rating = index + 1
                calificacionInput.value = rating
                actualizarEstrellas(rating)
            })

            estrella.addEventListener("mouseover", () => {
                const rating = index + 1
                actualizarEstrellas(rating, true)
            })
        })

        starRatingInput.addEventListener("mouseleave", () => {
            const currentRating = Number.parseInt(calificacionInput.value) || 0
            actualizarEstrellas(currentRating)
        })
    }

    // Contador de caracteres
    if (comentarioTextarea && charCount) {
        comentarioTextarea.addEventListener("input", () => {
            const length = comentarioTextarea.value.length
            charCount.textContent = length

            if (length > 450) {
                charCount.style.color = "#e74c3c"
            } else if (length > 400) {
                charCount.style.color = "#f39c12"
            } else {
                charCount.style.color = "#666"
            }
        })
    }

    // Envío del formulario
    if (formNuevaResena) {
        formNuevaResena.addEventListener("submit", async (e) => {
            e.preventDefault()
            await enviarNuevaResena()
        })
    }
}

function actualizarEstrellas(rating, isHover = false) {
    const estrellas = document.querySelectorAll(".star-input")
    estrellas.forEach((estrella, index) => {
        if (index < rating) {
            estrella.textContent = "★"
            estrella.style.color = isHover ? "#ffd700" : "#ff6b35"
        } else {
            estrella.textContent = "☆"
            estrella.style.color = "#ddd"
        }
    })
}

function resetearEstrellas() {
    const estrellas = document.querySelectorAll(".star-input")
    estrellas.forEach((estrella) => {
        estrella.textContent = "☆"
        estrella.style.color = "#ddd"
    })
    document.getElementById("calificacion-nueva").value = ""
}

async function enviarNuevaResena() {
    const btnEnviar = document.getElementById("btn-enviar-resena")
    const btnText = btnEnviar.querySelector(".btn-text")
    const btnLoading = btnEnviar.querySelector(".btn-loading")

    try {
        // Mostrar loading
        btnText.style.display = "none"
        btnLoading.style.display = "inline-flex"
        btnEnviar.disabled = true

        // Obtener datos del formulario
        const calificacion = document.getElementById("calificacion-nueva").value
        const comentario = document.getElementById("comentario-nuevo").value

        // Validar datos
        if (!calificacion) {
            Utils.showToast("Por favor selecciona una calificación", "error")
            return
        }

        if (!comentario.trim()) {
            Utils.showToast("Por favor escribe un comentario", "error")
            return
        }

        // Obtener información del usuario
        const userData = await obtenerDatosUsuario(usuarioActivo)

        // Preparar datos para enviar según la estructura del endpoint
        const datosResena = {
            producto_id: id_producto,
            usuario_nombre: userData.nombre || "Usuario",
            usuario_email: userData.email || "usuario@ejemplo.com",
            pais: userData.pais || "Colombia",
            codigo_pais: userData.codigo_pais || "CO",
            calificacion: Number.parseInt(calificacion),
            comentario: comentario,
        }

        // Enviar reseña
        const response = await fetch("/resenas", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(datosResena),
        })

        const data = await response.json()

        if (data.success) {
            Utils.showToast("¡Reseña publicada exitosamente!", "success")

            // Limpiar formulario y ocultar
            document.getElementById("form-nueva-resena").reset()
            document.getElementById("create-review-section").style.display = "none"
            document.getElementById("btn-escribir-resena").style.display = "block"
            resetearEstrellas()

            // Recargar reseñas y estadísticas
            await cargarResenasYEstadisticas(id_producto)
        } else {
            Utils.showToast(data.message || "Error al publicar la reseña", "error")
        }
    } catch (error) {
        console.error("Error al enviar reseña:", error)
        Utils.showToast("Error al enviar la reseña. Intenta nuevamente.", "error")
    } finally {
        // Ocultar loading
        btnText.style.display = "inline"
        btnLoading.style.display = "none"
        btnEnviar.disabled = false
    }
}

// Función para obtener datos del usuario
async function obtenerDatosUsuario(usuarioId) {
    try {
        const response = await fetch(`/perfil/${usuarioId}`)

        if (response.ok) {
            const data = await response.json()
            return {
                nombre: data.usuario.nombre,
                email: data.usuario.correo,
                pais: data.usuario.pais || "Colombia",
                codigo_pais: data.usuario.codigo_pais || "CO",
            }
        } else {
            console.warn("No se pudieron obtener datos del usuario, usando valores por defecto")
            return {
                nombre: localStorage.getItem("usuarioNombre") || "Usuario",
                email: localStorage.getItem("usuarioEmail") || "usuario@ejemplo.com",
                pais: "Colombia",
                codigo_pais: "CO",
            }
        }
    } catch (error) {
        console.error("Error al obtener datos del usuario:", error)
        return {
            nombre: localStorage.getItem("usuarioNombre") || "Usuario",
            email: localStorage.getItem("usuarioEmail") || "usuario@ejemplo.com",
            pais: "Colombia",
            codigo_pais: "CO",
        }
    }
}

function renderizarControlesPaginacion(paginacion) {
    const contenedor = document.getElementById('paginacion-reseñas');
    contenedor.innerHTML = '';
    if (!paginacion || paginacion.totalPages <= 1) return;

    const { currentPage, totalPages, hasNextPage, hasPrevPage } = paginacion;

    if (hasPrevPage) {
        const btnAnterior = document.createElement('button');
        btnAnterior.textContent = '← Anterior';
        btnAnterior.className = 'btn-pagination';
        btnAnterior.onclick = () => cargarResenas(id_producto, currentPage - 1, 5);
        contenedor.appendChild(btnAnterior);
    }
    if (currentPage == undefined || totalPages == undefined) {
        currentPage = 1;
        totalPages = 1
    }
    const span = document.createElement('span');
    span.textContent = `Página ${currentPage} de ${totalPages}`;
    contenedor.appendChild(span);

    if (hasNextPage) {
        const btnSiguiente = document.createElement('button');
        btnSiguiente.textContent = 'Siguiente →';
        btnSiguiente.className = 'btn-pagination';
        btnSiguiente.onclick = () => cargarResenas(id_producto, currentPage + 1, 5);
        contenedor.appendChild(btnSiguiente);
    }
}


// ==================== EVENT LISTENERS ====================
function configurarEventListeners() {
    // Botón volver
    const btnVolver = document.getElementById("btn-volver")
    if (btnVolver) {
        btnVolver.addEventListener("click", () => {
            window.history.back()
        })
    }

    // Botón contactar
    const btnContactar = document.getElementById("cta-button")
    if (btnContactar) {
        btnContactar.addEventListener("click", () => {
            window.location.href = "../Html/contactar.html?id=" + id_producto
        })
    }

    // Botón favoritos
    const btnFavoritos = document.getElementById("btn-favoritos");

    if (btnFavoritos) {
        btnFavoritos.addEventListener("click", async () => {
            if (!usuarioActivo) {
                Utils.showToast("Debes iniciar sesión para agregar favoritos", "warning");
                return;
            }


            try {
                const response = await fetch(`/add-favoritos/${id_producto}/${usuarioActivo}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();

                if (data.success) {
                    if (data.message === "Producto añadido a favoritos") {
                        Utils.showToast(data.message, "success");
                        btnFavoritos.style.backgroundColor = "#1F4E60";
                        btnFavoritos.style.color = "#fff";
                    } else {
                        Utils.showToast(data.message, "info");
                        btnFavoritos.style.backgroundColor = "white";
                        btnFavoritos.style.color = "#1F4E60";
                    }
                } else {
                    Utils.showToast("Error: " + (data.message || "Error desconocido"), "error");
                }

            } catch (error) {
                console.error("❌ Error al enviar favoritos:", error);
                Utils.showToast("Error al añadir a favoritos", "error");
            }
        });
    } else {
        console.warn("⚠️ No se encontró el botón con id 'btn-favoritos'");
    }



    // Galería de imágenes
    configurarGaleriaImagenes()
}

function configurarGaleriaImagenes() {
    const img1 = document.getElementById("img_1")
    const img2 = document.getElementById("img_2")
    const img3 = document.getElementById("img_3")
    const imagenPrincipal = document.getElementById("imagen_principal")

    const setMainImage = (src, clickedImg) => {
        if (!imagenPrincipal) return
        imagenPrincipal.src = src
        document.querySelectorAll(".thumbnail").forEach((img) => img.classList.remove("active"))
        if (clickedImg) {
            clickedImg.classList.add("active")
        }
    }

    const thumbnailClickHandler = (event) => {
        setMainImage(event.target.src, event.target)
    }

    if (img1) img1.addEventListener("click", thumbnailClickHandler)
    if (img2) img2.addEventListener("click", thumbnailClickHandler)
    if (img3) img3.addEventListener("click", thumbnailClickHandler)

    // Establecer imagen inicial
    setTimeout(() => {
        if (img1 && img1.style.display !== "none" && img1.src && img1.src !== window.location.href) {
            setMainImage(img1.src, img1)
        } else if (img2 && img2.style.display !== "none" && img2.src && img2.src !== window.location.href) {
            setMainImage(img2.src, img2)
        } else if (img3 && img3.style.display !== "none" && img3.src && img3.src !== window.location.href) {
            setMainImage(img3.src, img3)
        } else if (imagenPrincipal) {
            imagenPrincipal.src = "../uploads/default.png"
        }
    }, 100)
}


// ==================== INICIALIZACIÓN ====================
document.addEventListener("DOMContentLoaded", () => {

    // Actualizar navegación
    actualizarNavegacion()

    // Configurar event listeners
    configurarEventListeners()

    // Configurar formulario de reseña
    configurarFormularioResena()

    // Cargar producto si existe ID
    if (id_producto) {
        cargarDetalleProducto(id_producto)
    } else {
        console.warn("No se encontró ID de producto en localStorage")
        Utils.showToast("No se encontró el producto solicitado", "error")
    }

})

document.getElementById('btn-compartir').addEventListener('click', async () => {
    const shareData = {
        title: document.title,
        text: '¡Mira este producto!',
        url: window.location.href
    };

    if (navigator.share) {
        try {
            await navigator.share(shareData);
        } catch (err) {
            console.error('Error al compartir:', err);
        }
    } else {
        // Fallback si no es compatible
        copiarURL();
    }
});

function copiarURL() {
    const url = window.location.href;
    navigator.clipboard.writeText(url)
        .then(() => alert('URL copiada al portapapeles'))
        .catch(err => alert('Error al copiar: ' + err));
}
