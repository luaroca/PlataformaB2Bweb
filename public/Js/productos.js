// Variables globales
let todosLosProductos = []
let productosFiltrados = []
let vistaActual = "grid" // 'grid' o 'list'
const categorias = new Set()

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
  inicializarApp()
  configurarEventListeners()
  cargarProductosDesdeAPI()
  cargarEstadisticasReales()
})

function inicializarApp() {
  // Mostrar spinner de carga
  mostrarCargando(true)

  // Configurar vista inicial
  vistaActual = "grid"
}

function configurarEventListeners() {
  // Buscador
  const buscador = document.getElementById("buscador")
  buscador.addEventListener("input", debounce(filtrarProductos, 300))

  // Filtros
  document.getElementById("categoriaFiltro").addEventListener("change", filtrarProductos)
  document.getElementById("precioFiltro").addEventListener("change", filtrarProductos)

  // Botón de filtrar
  document.querySelector(".filter-btn").addEventListener("click", filtrarProductos)

  // Toggle de vista
  document.getElementById("gridView").addEventListener("click", () => cambiarVista("grid"))
  document.getElementById("listView").addEventListener("click", () => cambiarVista("list"))

  // Animación del navbar al hacer scroll
  window.addEventListener("scroll", handleNavbarScroll)
}

function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

async function cargarEstadisticasReales() {
  try {
    const response = await fetch("/api/estadisticas")

    if (!response.ok) {
      throw new Error(`Error al cargar estadísticas: ${response.status}`)
    }

    const data = await response.json()

    if (data.success) {
      const stats = data.estadisticas
      document.getElementById("totalProductos").textContent = `${stats.total_productos} Productos`
      document.getElementById("totalProveedores").textContent = `${stats.total_proveedores} Proveedores`
      document.getElementById("totalCategorias").textContent = `${stats.total_categorias} Categorías`
    } else {
      throw new Error("Error en la respuesta de estadísticas")
    }
  } catch (error) {
    console.error("Error al cargar estadísticas:", error)
    // Mostrar valores por defecto en caso de error
    document.getElementById("totalProductos").textContent = "-- Productos"
    document.getElementById("totalProveedores").textContent = "-- Proveedores"
    document.getElementById("totalCategorias").textContent = "-- Categorías"
  }
}

async function cargarProductosDesdeAPI() {
  try {
    mostrarCargando(true)

    // Llamada a la API para obtener productos publicados
    const response = await fetch("/api/productos/publicados")

    if (!response.ok) {
      throw new Error(`Error al cargar productos: ${response.status}`)
    }

    const data = await response.json()

    if (!data.success) {
      throw new Error("Error en la respuesta de la API")
    }

    todosLosProductos = data.productos.map((producto) => {
      // Asegurarse de que la ruta de la imagen sea correcta
      const imagen = producto.imagen_principal
        ? `/uploads/${producto.imagen_principal}`
        : "/placeholder.svg?height=250&width=300"

      return {
        ...producto,
        imagen: imagen,
      }
    })

    // Extraer categorías únicas para el filtro
    todosLosProductos.forEach((producto) => {
      if (producto.categoria) {
        categorias.add(producto.categoria)
      }
    })

    // Llenar el selector de categorías
    llenarSelectorCategorias()

    productosFiltrados = [...todosLosProductos]
    mostrarCargando(false)
    renderizarProductos()
    actualizarContadorResultados()
  } catch (error) {
    console.error("Error al cargar productos:", error)
    mostrarCargando(false)
    mostrarNotificacion("Error al cargar los productos. Intente nuevamente más tarde.", "error")

    // Mostrar mensaje de error en la interfaz
    document.getElementById("noProductos").classList.remove("d-none")
    document.getElementById("resultadosCount").textContent = "Error al cargar productos"
  }
}

function llenarSelectorCategorias() {
  const categoriaSelect = document.getElementById("categoriaFiltro")

  // Mantener la opción por defecto
  const defaultOption = categoriaSelect.options[0]
  categoriaSelect.innerHTML = ""
  categoriaSelect.appendChild(defaultOption)

  // Agregar las categorías con emojis
  const emojis = {
    Hogar: "🏠",
    Alimentos: "🍎",
    Bebidas: "🥤",
    Tecnología: "💻",
    Ropa: "👕",
    Calzado: "👟",
    "Salud y Belleza": "💄",
    Deportes: "⚽",
    Electrodomésticos: "🔌",
    Juguetes: "🧸",
    Bebés: "👶",
    Automotriz: "🚗",
    Libros: "📚",
    Papelería: "📝",
    Mascotas: "🐕",
    Herramientas: "🔧",
    Muebles: "🪑",
    Viajes: "✈️",
    "Instrumentos Musicales": "🎵",
    Jardín: "🌱",
    Electrónica: "📱",
  }

  // Ordenar categorías alfabéticamente
  const categoriasOrdenadas = Array.from(categorias).sort()

  categoriasOrdenadas.forEach((categoria) => {
    const option = document.createElement("option")
    option.value = categoria
    const emoji = emojis[categoria] || ""
    option.textContent = `${emoji} ${categoria}`
    categoriaSelect.appendChild(option)
  })
}

function filtrarProductos() {
  const textoBusqueda = document.getElementById("buscador").value.toLowerCase().trim()
  const categoriaSeleccionada = document.getElementById("categoriaFiltro").value
  const ordenPrecio = document.getElementById("precioFiltro").value

  // Filtrar por texto
  productosFiltrados = todosLosProductos.filter((producto) => {
    const coincideTexto =
      !textoBusqueda ||
      producto.nombre.toLowerCase().includes(textoBusqueda) ||
      (producto.descripcion && producto.descripcion.toLowerCase().includes(textoBusqueda)) ||
      (producto.proveedor_nombre && producto.proveedor_nombre.toLowerCase().includes(textoBusqueda))

    const coincideCategoria = !categoriaSeleccionada || producto.categoria === categoriaSeleccionada

    return coincideTexto && coincideCategoria
  })

  // Ordenar por precio
  if (ordenPrecio === "menor") {
    productosFiltrados.sort((a, b) => Number.parseFloat(a.precio) - Number.parseFloat(b.precio))
  } else if (ordenPrecio === "mayor") {
    productosFiltrados.sort((a, b) => Number.parseFloat(b.precio) - Number.parseFloat(a.precio))
  }

  renderizarProductos()
  actualizarContadorResultados()
}

function renderizarProductos() {
  const contenedor = document.getElementById("listaProductos")
  const noProductos = document.getElementById("noProductos")

  if (productosFiltrados.length === 0) {
    contenedor.innerHTML = ""
    noProductos.classList.remove("d-none")
    return
  }

  noProductos.classList.add("d-none")

  const productosHTML = productosFiltrados
    .map((producto, index) => {
      return crearCardProducto(producto, index)
    })
    .join("")

  contenedor.innerHTML = productosHTML
  contenedor.className = vistaActual === "grid" ? "row g-4" : "row g-3 list-view"

  // Agregar animaciones
  const cards = contenedor.querySelectorAll(".product-card")
  cards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`
    card.classList.add("animate-fade-in")
  })
}

function crearCardProducto(producto, index) {
  const colClass = vistaActual === "grid" ? "col-lg-4 col-md-6 col-sm-12" : "col-12"
  const precio = Number.parseFloat(producto.precio).toLocaleString("es-ES", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  return `
    <div class="${colClass}">
      <div class="product-card" data-producto-id="${producto.id}">
        <div class="product-image">
          <img src="${producto.imagen}" alt="${producto.nombre}" loading="lazy" onerror="this.src='/placeholder.svg?height=250&width=300'">
        </div>
        <div class="product-info">
          <span class="product-category">${producto.categoria || "Sin categoría"}</span>
          <h5 class="product-title">${producto.nombre}</h5>
          <p class="product-description">${producto.descripcion || "Sin descripción"}</p>
          <div class="product-price">$${precio}</div>
          <div class="product-supplier">
            <i class="fas fa-store"></i>
            <span>${producto.proveedor_nombre || "Proveedor"}</span>
          </div>
          <div class="product-actions">
            <button class="btn btn-details w-100" onclick="verDetalles(${producto.id})">
              <i class="fas fa-eye me-2"></i>Ver Detalles
            </button>
          </div>
        </div>
      </div>
    </div>
  `
}

function cambiarVista(nuevaVista) {
  vistaActual = nuevaVista

  // Actualizar botones
  document.getElementById("gridView").classList.toggle("active", nuevaVista === "grid")
  document.getElementById("listView").classList.toggle("active", nuevaVista === "list")

  // Re-renderizar productos
  renderizarProductos()
}

function actualizarContadorResultados() {
  const contador = document.getElementById("resultadosCount")
  const total = productosFiltrados.length

  if (total === 0) {
    contador.textContent = "No se encontraron productos"
  } else if (total === 1) {
    contador.textContent = "1 producto encontrado"
  } else {
    contador.textContent = `${total} productos encontrados`
  }
}

function mostrarCargando(mostrar) {
  const spinner = document.getElementById("loadingSpinner")
  const contenedor = document.getElementById("listaProductos")

  if (mostrar) {
    spinner.classList.remove("d-none")
    contenedor.innerHTML = ""
  } else {
    spinner.classList.add("d-none")
  }
}

function verDetalles(productoId) {
  // Redirigir a la página de detalle del producto
  window.location.href = `../Html/detalle_producto.html?id=${productoId}`
}

function mostrarNotificacion(mensaje, tipo = "info") {
  // Crear elemento de notificación
  const notificacion = document.createElement("div")
  notificacion.className = `alert alert-${tipo === "error" ? "danger" : tipo} alert-dismissible fade show position-fixed`
  notificacion.style.cssText = "top: 100px; right: 20px; z-index: 9999; min-width: 300px;"

  notificacion.innerHTML = `
    ${mensaje}
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  `

  document.body.appendChild(notificacion)

  // Auto-remover después de 5 segundos
  setTimeout(() => {
    if (notificacion.parentNode) {
      notificacion.remove()
    }
  }, 5000)
}

function handleNavbarScroll() {
  const navbar = document.querySelector(".custom-navbar")
  if (window.scrollY > 50) {
    navbar.style.background = "linear-gradient(135deg, rgba(37, 99, 235, 0.95) 0%, rgba(29, 78, 216, 0.95) 100%)"
    navbar.style.backdropFilter = "blur(20px)"
  } else {
    navbar.style.background = "linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%)"
    navbar.style.backdropFilter = "blur(10px)"
  }
}

// Exportar funciones para uso global
window.verDetalles = verDetalles
