const { db } = require("../config/database")

const productController = {
  // Crear producto
  crearProducto: async (req, res) => {
    const {
      nombre,
      descripcion,
      categoria,
      subcategoria,
      unidad_medida,
      minimo_pedido,
      tiempo_entrega,
      condiciones_pago,
      origen_producto,
      precio,
      stock,
      proveedor_id,
    } = req.body

    const imagenes = req.files
    if (!imagenes || imagenes.length < 1) {
      return res.status(400).json({ success: false, message: "Debes subir al menos una imagen" })
    }

    const imagen_principal = imagenes[0]?.filename || null
    const imagen_secundaria1 = imagenes[1]?.filename || null
    const imagen_secundaria2 = imagenes[2]?.filename || null

    const sql = `
            INSERT INTO productos (
                nombre, descripcion, categoria, subcategoria, unidad_medida, minimo_pedido,
                tiempo_entrega, condiciones_pago, origen_producto, precio, stock, proveedor_id,
                imagen_principal, imagen_secundaria1, imagen_secundaria2
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `

    try {
      const [resultado] = await db.execute(sql, [
        nombre,
        descripcion,
        categoria,
        subcategoria,
        unidad_medida,
        minimo_pedido,
        tiempo_entrega,
        condiciones_pago,
        origen_producto,
        precio,
        stock,
        proveedor_id,
        imagen_principal,
        imagen_secundaria1,
        imagen_secundaria2,
      ])
      res.json({ success: true, productoId: resultado.insertId })
    } catch (err) {
      console.error(err)
      return res.status(500).json({ success: false, message: "Error al guardar producto" })
    }
  },

  // Editar producto
  editarProducto: async (req, res) => {
    const id = req.params.id
    const {
      nombre,
      descripcion,
      categoria,
      subcategoria,
      unidad_medida,
      minimo_pedido,
      tiempo_entrega,
      condiciones_pago,
      origen_producto,
      precio,
      stock,
      proveedor_id,
    } = req.body

    const imagenes = (req.files || []).slice(0, 3).map((file) => file.filename)
    const hayImagenes = imagenes.length > 0

    const imagenPrincipal = imagenes[0] || null
    const imagenSecundaria1 = imagenes[1] || null
    const imagenSecundaria2 = imagenes[2] || null

    let sql = `
            UPDATE productos SET
                nombre = ?, descripcion = ?, categoria = ?, subcategoria = ?, unidad_medida = ?,
                minimo_pedido = ?, tiempo_entrega = ?, condiciones_pago = ?, origen_producto = ?,
                precio = ?, stock = ?, proveedor_id = ?
        `

    const campos = [
      nombre,
      descripcion,
      categoria,
      subcategoria,
      unidad_medida,
      minimo_pedido,
      tiempo_entrega,
      condiciones_pago,
      origen_producto,
      precio,
      stock,
      proveedor_id,
    ]

    if (hayImagenes) {
      sql += `,
                imagen_principal = ?, imagen_secundaria1 = ?, imagen_secundaria2 = ?
            `
      campos.push(imagenPrincipal, imagenSecundaria1, imagenSecundaria2)
    }

    sql += ` WHERE id = ?`
    campos.push(id)

    try {
      await db.execute(sql, campos)
      res.json({ success: true, message: "Producto actualizado correctamente" })
    } catch (err) {
      console.error(err)
      res.status(500).json({ success: false, message: "Error al actualizar producto" })
    }
  },

  // Eliminar producto
  eliminarProducto: async (req, res) => {
    const { id } = req.params

    try {
      await db.execute("DELETE FROM favoritos WHERE id_producto = ?", [id])
      await db.execute("DELETE FROM productos WHERE id = ?", [id])

      res.status(200).json({ success: true, mensaje: "Producto eliminado correctamente" })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: "Error al eliminar el producto" })
    }
  },

  // Obtener productos de un proveedor
  obtenerProductosProveedor: async (req, res) => {
    const sql = "SELECT * FROM productos WHERE proveedor_id = ?"
    try {
      const [resultados] = await db.execute(sql, [req.params.proveedorId])
      res.json({ success: true, productos: resultados })
    } catch (err) {
      console.error(err)
      return res.status(500).json({ success: false })
    }
  },

  // Publicar producto
  publicarProducto: async (req, res) => {
    const sql = "UPDATE productos SET publicado = TRUE WHERE id = ?"
    try {
      await db.execute(sql, [req.params.id])
      res.json({ success: true })
    } catch (err) {
      console.error(err)
      return res.status(500).json({ success: false })
    }
  },

  // Retirar publicación de producto
  retirarProducto: async (req, res) => {
    const sql = "UPDATE productos SET publicado = FALSE WHERE id = ?"
    try {
      await db.execute(sql, [req.params.id])
      res.json({ success: true })
    } catch (err) {
      console.error(err)
      return res.status(500).json({ success: false })
    }
  },

  // Obtener todos los productos publicados
  obtenerProductosPublicados: async (req, res) => {
    const sql = `
            SELECT
                p.id, p.nombre, p.descripcion, p.precio, p.imagen_principal,
                p.minimo_pedido, p.tiempo_entrega, p.condiciones_pago, p.categoria,
                u.nombre AS proveedor_nombre
            FROM productos p
            JOIN usuarios u ON p.proveedor_id = u.id
            WHERE p.publicado = TRUE
        `
    try {
      const [resultados] = await db.execute(sql)
      res.json({ success: true, productos: resultados })
    } catch (err) {
      console.error(err)
      return res.status(500).json({ success: false, message: "Error al obtener productos publicados" })
    }
  },

  // Obtener un producto por ID
  obtenerProductoPorId: async (req, res) => {
    const { id } = req.params
    const sql = "SELECT * FROM productos WHERE id = ?"
    try {
      const [resultados] = await db.execute(sql, [id])
      if (resultados.length > 0) {
        res.json({ success: true, producto: resultados[0] })
      } else {
        res.status(404).json({ success: false, message: "Producto no encontrado" })
      }
    } catch (err) {
      console.error(err)
      return res.status(500).json({ success: false, message: "Error del servidor" })
    }
  },

  // Vista detallada de un producto
  obtenerDetalleProducto: async (req, res) => {
    const { id } = req.params
    console.log(` Buscando producto con ID: ${id}`) // Debug log

    const sql = `
            SELECT
                p.id, p.nombre, p.descripcion, p.categoria, p.subcategoria, p.unidad_medida,
                p.minimo_pedido, p.tiempo_entrega, p.condiciones_pago, p.origen_producto,
                p.precio, p.stock, p.proveedor_id, u.nombre AS proveedor_nombre, p.publicado,
                p.imagen_principal, p.imagen_secundaria1, p.imagen_secundaria2
            FROM productos p
            JOIN usuarios u ON p.proveedor_id = u.id
            WHERE p.id = ?
        `

    try {
      const [resultados] = await db.execute(sql, [id])
      console.log(` Resultados encontrados: ${resultados.length}`) // Debug log

      if (resultados.length > 0) {
        console.log(` Producto encontrado: ${resultados[0].nombre}`) // Debug log
        res.json({ success: true, producto: resultados[0] })
      } else {
        console.log(`❌ Producto no encontrado con ID: ${id}`) // Debug log
        res.status(404).json({ success: false, message: "Producto no encontrado" })
      }
    } catch (err) {
      console.error("❌ Error en obtenerDetalleProducto:", err)
      return res.status(500).json({ success: false, message: "Error del servidor" })
    }
  },

  // Productos relacionados
  obtenerProductosRelacionados: async (req, res) => {
    const categoria = req.params.categoria
    const id = req.params.id

    const sql = `
            SELECT
                p.id, p.nombre, p.precio, p.imagen_principal,
                u.nombre AS proveedor_nombre
            FROM productos p
            JOIN usuarios u ON p.proveedor_id = u.id
            WHERE p.categoria = ? AND p.publicado = 1 AND p.id != ?
        `

    try {
      const [resultados] = await db.execute(sql, [categoria, id])
      res.json({ success: true, productos: resultados })
    } catch (err) {
      console.error(err)
      return res.status(500).json({ success: false, message: "Error del servidor" })
    }
  },

  // Obtener información de contacto
  obtenerInfoContacto: async (req, res) => {
    const { id } = req.params
    const sql = `
            SELECT 
                u.correo AS correoVendedor,
                p.nombre AS nombre
            FROM productos p
            JOIN usuarios u ON p.proveedor_id = u.id
            WHERE p.id = ?
        `

    try {
      const [resultados] = await db.execute(sql, [id])
      if (resultados.length > 0) {
        res.json({
          success: true,
          correoVendedor: resultados[0].correoVendedor,
          producto: resultados[0],
        })
      } else {
        res.status(404).json({ success: false, message: "Producto no encontrado" })
      }
    } catch (err) {
      console.error("Error al obtener la info de contacto:", err)
      res.status(500).json({ success: false, message: "Error del servidor" })
    }
  },
}

module.exports = productController
