const { db } = require("../config/database")

const statsController = {
  // Obtener estadísticas generales
  obtenerEstadisticas: async (req, res) => {
    try {
      // Contar productos publicados
      const [productosResult] = await db.execute(
        "SELECT COUNT(*) as total_productos FROM productos WHERE publicado = TRUE",
      )

      // Contar proveedores únicos que tienen productos publicados
      const [proveedoresResult] = await db.execute(`
                SELECT COUNT(DISTINCT u.id) as total_proveedores 
                FROM usuarios u 
                INNER JOIN productos p ON u.id = p.proveedor_id 
                WHERE p.publicado = TRUE AND u.rol = 'Proveedor'
            `)

      // Contar categorías únicas de productos publicados
      const [categoriasResult] = await db.execute(`
                SELECT COUNT(DISTINCT categoria) as total_categorias 
                FROM productos 
                WHERE publicado = TRUE AND categoria IS NOT NULL AND categoria != ''
            `)

      res.json({
        success: true,
        estadisticas: {
          total_productos: productosResult[0].total_productos,
          total_proveedores: proveedoresResult[0].total_proveedores,
          total_categorias: categoriasResult[0].total_categorias,
        },
      })
    } catch (error) {
      console.error("Error al obtener estadísticas:", error)
      res.status(500).json({
        success: false,
        message: "Error al obtener estadísticas",
      })
    }
  },
}

module.exports = statsController
