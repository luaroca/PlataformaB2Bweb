const { db } = require("../config/database")

const favoriteController = {
  // Agregar/quitar favorito
  agregarFavorito: async (req, res) => {
    try {
      const id_producto = req.params.id_producto
      const id_usuario = req.params.id_usuario

      if (!id_producto || !id_usuario) {
        return res.status(400).json({
          success: false,
          message: "Se requieren ID de producto y usuario",
        })
      }

      const checkSql = "SELECT * FROM favoritos WHERE id_producto = ? AND id_usuario = ?"
      const [existingFavs] = await db.execute(checkSql, [id_producto, id_usuario])

      if (existingFavs && existingFavs.length > 0) {
        const sql = "DELETE FROM favoritos WHERE id_producto = ? AND id_usuario = ?"
        const [result] = await db.execute(sql, [id_producto, id_usuario])
        return res.status(200).json({
          success: true,
          message: "Eliminado de Favoritos",
          alreadyExists: true,
        })
      }

      const sql = "INSERT INTO favoritos (id_producto, id_usuario) VALUES (?, ?)"
      const [result] = await db.execute(sql, [id_producto, id_usuario])

      res.status(201).json({
        success: true,
        message: "Producto añadido a favoritos",
        favorito_id: result.insertId,
      })
    } catch (error) {
      console.error("❌ Error al añadir a favoritos:", error)

      if (error.code === "ER_DUP_ENTRY") {
        return res.status(409).json({
          success: false,
          message: "El producto ya está en favoritos",
        })
      }

      res.status(500).json({
        success: false,
        message: "Error al añadir producto a favoritos",
        error: error.message,
      })
    }
  },

  // Obtener favoritos de un usuario
  obtenerFavoritos: async (req, res) => {
    const id_usuario = req.params.id_usuario
    const query =
      "SELECT p.id, p.nombre FROM productos p JOIN favoritos f ON p.id = f.id_producto JOIN usuarios u ON u.id = f.id_usuario WHERE u.id = ?"

    try {
      const [resultado] = await db.execute(query, [id_usuario])
      if (resultado.length > 0) {
        res.json({
          success: true,
          favoritos: resultado,
        })
      } else {
        res.status(404).json({ success: false, message: "Favoritos no Encontrados" })
      }
    } catch (error) {
      console.error("Error al obtener los Favoritos:", error)
      res.status(500).json({ success: false, message: "Error del servidor" })
    }
  },
}

module.exports = favoriteController
