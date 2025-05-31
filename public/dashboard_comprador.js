// Utilidades
const Utils = {
    // Mostrar/ocultar loading
    showLoading: () => {
        const loader = document.getElementById("loading-spinner")
        if (loader) {
            loader.style.display = "flex"
        }
    },

    hideLoading: () => {
        const loader = document.getElementById("loading-spinner")
        if (loader) {
            loader.style.display = "none"
        }
    },

    // Sistema de notificaciones toast
    showToast: (message, type = "success") => {
        let container = document.getElementById("toast-container")

        // Si no existe el container, crearlo
        if (!container) {
            container = document.createElement("div")
            container.id = "toast-container"
            container.className = "toast-container"
            document.body.appendChild(container)
        }

        const toast = document.createElement("div")
        toast.className = `toast ${type}`

        const icon = type === "success" ? "fa-check-circle" : type === "error" ? "fa-exclamation-circle" : "fa-info-circle"

        toast.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <i class="fas ${icon}"></i>
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" 
                        style="background: none; border: none; cursor: pointer; margin-left: auto; font-size: 18px;">×</button>
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

    // Validar email
    isValidEmail: (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    },

    // Validar teléfono
    isValidPhone: (phone) => {
        const phoneRegex = /^[\d\s\-+$$$$]+$/
        return phoneRegex.test(phone) && phone.length >= 7
    },

    // Formatear imagen URL
    formatImageUrl: (imagePath) => {
        if (!imagePath) return "uploads/default.png"
        if (imagePath.startsWith("http")) return imagePath
        return imagePath.startsWith("/") ? imagePath : `uploads/${imagePath}`
    },
}

// Función simple para cargar perfil (compatible con tu código original)
async function cargarPerfil() {
    const userId = localStorage.getItem("usuarioId")
    if (!userId) {
        Utils.showToast("No se especificó el ID de usuario.", "error")
        setTimeout(() => {
            window.location.href = "login.html"
        }, 2000)
        return
    }

    try {
        Utils.showLoading()
        console.log("Cargando perfil para usuario:", userId)

        const res = await fetch(`/perfil/${userId}`)
        console.log("Respuesta del servidor:", res.status)

        const data = await res.json()
        console.log("Datos recibidos:", data)

        if (res.ok && data.success) {
            const usuario = data.usuario

            // Actualizar información básica
            document.getElementById("cedula").textContent = usuario.cedula || "N/A"
            document.getElementById("nombre").textContent = usuario.nombre || "N/A"
            document.getElementById("correo").textContent = usuario.correo || "N/A"
            document.getElementById("telefono").textContent = usuario.telefono || "N/A"
            document.getElementById("rol").textContent = usuario.rol || "N/A"

            // Actualizar nombre en header
            document.getElementById("nombre-display").textContent = usuario.nombre || "Usuario"
            document.getElementById("rol-badge").textContent = usuario.rol || "Usuario"

            // Actualizar imagen
            const imgElement = document.getElementById("imagen_usuario")
            if (usuario.imagen && usuario.imagen.trim() !== "") {
                imgElement.src = Utils.formatImageUrl(usuario.imagen)
            } else {
                imgElement.src = "uploads/default.png"
            }

            imgElement.onerror = () => {
                imgElement.src = "uploads/default.png"
            }

            // Llenar formulario de edición
            document.getElementById("cedula-input").value = usuario.cedula || ""
            document.getElementById("nombre-input").value = usuario.nombre || ""
            document.getElementById("correo-input").value = usuario.correo || ""
            document.getElementById("telefono-input").value = usuario.telefono || ""

            // Mostrar/ocultar botones según rol
            const btnMisProductos = document.getElementById("btn-mis-productos")
            const btnCrearProducto = document.getElementById("btn-crear-producto")

            if (usuario.rol === "Distribuidor") {
                btnMisProductos.style.display = "none"
                btnCrearProducto.style.display = "none"
            } else {
                btnMisProductos.style.display = "flex"
                btnCrearProducto.style.display = "flex"
            }

            Utils.showToast("Perfil cargado correctamente", "success")
        } else {
            Utils.showToast(data.message || "No se encontró el usuario.", "error")
        }
    } catch (error) {
        console.error("Error al cargar perfil:", error)
        Utils.showToast("Error al conectar con el servidor.", "error")
    } finally {
        Utils.hideLoading()
    }
}

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM cargado, iniciando aplicación...")

    const usuarioActivo = localStorage.getItem("usuarioId")
    console.log("Usuario activo:", usuarioActivo)

    if (!usuarioActivo) {
        console.log("No hay usuario activo, redirigiendo a login...")
        window.location.href = "login.html"
        return
    }

    // Cargar perfil
    cargarPerfil()

    // Botón volver
    const btnVolver = document.getElementById("btn-volver")
    if (btnVolver) {
        btnVolver.addEventListener("click", () => {
            window.history.back()
        })
    }

    // Botón cerrar sesión
    const btnCerrarSesion = document.getElementById("btn-cerrar-sesion")
    if (btnCerrarSesion) {
        btnCerrarSesion.addEventListener("click", () => {
            if (confirm("¿Estás seguro de que quieres cerrar sesión?")) {
                localStorage.removeItem("usuarioId")
                localStorage.removeItem("usuarioActivo")
                window.location.href = "login.html"
            }
        })
    }

    // Botón editar
    var opacidad = 0.0;
    const btnEditar = document.getElementById("btn-editar")
    const modalOverlay = document.getElementById("modal-overlay")
    if (btnEditar && modalOverlay) {
        btnEditar.addEventListener("click", () => {
            modalOverlay.style.display = "flex";
            while (opacidad<101) {
                opacidad += 0.3;
                modalOverlay.style.opacity = opacidad;
            }
        })
    }

    // Botón cancelar modal
    const btnCancelar = document.getElementById("btn-cancelar")
    if (btnCancelar && modalOverlay) {
        btnCancelar.addEventListener("click", () => {
            modalOverlay.style.display = "none";

        })
    }

    // Botón cerrar modal
    const btnCerrarModal = document.getElementById("btn-cerrar-modal")
    if (btnCerrarModal && modalOverlay) {
        btnCerrarModal.addEventListener("click", () => {
            modalOverlay.style.display = "none"
        })
    }

    // Click fuera del modal
    if (modalOverlay) {
        modalOverlay.addEventListener("click", (e) => {
            if (e.target === modalOverlay) {
                modalOverlay.style.display = "none"
            }
        })
    }

    // Formulario de edición
    const formEditar = document.getElementById("form-editar")
    if (formEditar) {
        formEditar.addEventListener("submit", async (e) => {
            e.preventDefault()

            const userId = localStorage.getItem("usuarioId")
            if (!userId) {
                Utils.showToast("No se encontró el ID de usuario.", "error")
                return
            }

            const formData = new FormData(formEditar)

            try {
                const btnGuardar = document.getElementById("btn-guardar")
                if (btnGuardar) {
                    btnGuardar.disabled = true
                    btnGuardar.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...'
                }

                const res = await fetch(`/actualizar-perfil-completo/${userId}`, {
                    method: "POST",
                    body: formData,
                })

                if (res.ok) {
                    Utils.showToast("Perfil actualizado correctamente.", "success")
                    modalOverlay.style.display = "none"
                    cargarPerfil()
                } else {
                    const text = await res.text()
                    Utils.showToast(`Error: ${text}`, "error")
                }
            } catch (error) {
                console.error("Error al actualizar perfil:", error)
                Utils.showToast("Error al actualizar el perfil.", "error")
            } finally {
                const btnGuardar = document.getElementById("btn-guardar")
                if (btnGuardar) {
                    btnGuardar.disabled = false
                    btnGuardar.innerHTML = '<i class="fas fa-save"></i> Guardar Cambios'
                }
            }
        })
    }

    // Botones de navegación
    const btnCrearProducto = document.getElementById("btn-crear-producto")
    if (btnCrearProducto) {
        btnCrearProducto.addEventListener("click", () => {
            window.location.href = "crear_productos.html"
        })
    }

    const btnMisProductos = document.getElementById("btn-mis-productos")
    if (btnMisProductos) {
        btnMisProductos.addEventListener("click", () => {
            window.location.href = "mis_productos.html"
        })
    }

    // Preview de imagen
    const imagenInput = document.getElementById("imagen-input")
    if (imagenInput) {
        imagenInput.addEventListener("change", (e) => {
            const file = e.target.files[0]
            const preview = document.getElementById("preview-imagen")

            if (file && preview) {
                const reader = new FileReader()
                reader.onload = (e) => {
                    preview.innerHTML = `
                        <img src="${e.target.result}" alt="Preview" 
                             style="max-width: 150px; max-height: 150px; border-radius: 12px; margin-top: 10px;">
                        <p style="margin-top: 0.5rem; font-size: 0.9rem; color: #666;">Nueva imagen seleccionada</p>
                    `
                }
                reader.readAsDataURL(file)
            }
        })
    }

    // Botón cambiar imagen
    const cambiarImagenBtn = document.querySelector(".cambiar-imagen-btn")
    if (cambiarImagenBtn && imagenInput) {
        cambiarImagenBtn.addEventListener("click", () => {
            imagenInput.click()
        })
    }
})
