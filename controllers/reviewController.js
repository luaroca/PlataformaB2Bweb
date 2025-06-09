const { db } = require("../config/database")

const reviewController = {
  // Obtener reseñas de un producto
  obtenerResenas: async (req, res) => {
    try {
      const { productoId } = req.params
      const page = Number.parseInt(req.query.page) || 1
      const limit = Number.parseInt(req.query.limit) || 10
      const offset = (page - 1) * limit

      const [productoCheck] = await db.execute("SELECT id, nombre FROM productos WHERE id = ?", [productoId])

      if (productoCheck.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Producto no encontrado",
        })
      }

      const [conteoTotal] = await db.execute("SELECT COUNT(*) as total FROM resenas WHERE producto_id = ?", [
        productoId,
      ])

      if (conteoTotal[0].total === 0) {
        const [conteoConConversion] = await db.execute(
          "SELECT COUNT(*) as total FROM resenas WHERE producto_id = CAST(? AS UNSIGNED)",
          [productoId],
        )

        const [productosConResenas] = await db.execute("SELECT DISTINCT producto_id FROM resenas LIMIT 10")
      }

      const queryResenas = `
                SELECT 
                    id, calificacion, comentario, fecha_creacion,
                    usuario_nombre, usuario_email, codigo_pais
                FROM resenas 
                WHERE producto_id = ?
                ORDER BY fecha_creacion DESC
                LIMIT ${limit} OFFSET ${offset}
            `

      const [resenas] = await db.execute(queryResenas, [productoId])

      const [totalResult] = await db.execute("SELECT COUNT(*) as total FROM resenas WHERE producto_id = ?", [
        productoId,
      ])
      const totalResenas = totalResult[0].total

      const estadisticas = {
        promedio_calificacion: 0,
        total_resenas: 0,
        distribucion_calificaciones: {
          1: 0,
          2: 0,
          3: 0,
          4: 0,
          5: 0,
        },
      }

      if (totalResenas > 0) {
        const [statsResult] = await db.execute(
          `
                    SELECT 
                        AVG(calificacion) as promedio_calificacion,
                        COUNT(*) as total_resenas
                    FROM resenas 
                    WHERE producto_id = ?
                `,
          [productoId],
        )

        const [distribucionResult] = await db.execute(
          `
                    SELECT 
                        calificacion,
                        COUNT(*) as cantidad
                    FROM resenas 
                    WHERE producto_id = ? 
                    GROUP BY calificacion
                `,
          [productoId],
        )

        estadisticas.promedio_calificacion = Number.parseFloat(statsResult[0].promedio_calificacion) || 0
        estadisticas.total_resenas = Number.parseInt(statsResult[0].total_resenas) || 0

        distribucionResult.forEach((item) => {
          estadisticas.distribucion_calificaciones[item.calificacion] = item.cantidad
        })
      }

      const totalPages = Math.ceil(totalResenas / limit)
      const hasNextPage = page < totalPages
      const hasPrevPage = page > 1

      const response = {
        success: true,
        data: {
          producto: {
            id: productoCheck[0].id,
            nombre: productoCheck[0].nombre,
          },
          resenas: resenas,
          estadisticas: estadisticas,
          paginacion: {
            currentPage: page,
            totalPages: totalPages,
            totalItems: totalResenas,
            itemsPerPage: limit,
            hasNextPage: hasNextPage,
            hasPrevPage: hasPrevPage,
          },
        },
      }

      res.json(response)
    } catch (error) {
      console.error("❌ ERROR en endpoint reseñas:", error)
      console.error("Stack trace:", error.stack)

      res.status(500).json({
        success: false,
        message: "Error interno del servidor",
        error: process.env.NODE_ENV === "development" ? error.message : "Error interno",
      })
    }
  },

  // Crear nueva reseña
  crearResena: async (req, res) => {
    try {
      const { producto_id, usuario_nombre, usuario_email, pais, codigo_pais, calificacion, comentario } = req.body

      if (!producto_id || !usuario_nombre || !calificacion) {
        return res.status(400).json({
          success: false,
          message: "Faltan campos obligatorios",
        })
      }

      if (calificacion < 1 || calificacion > 5) {
        return res.status(400).json({
          success: false,
          message: "La calificación debe estar entre 1 y 5",
        })
      }

      const [producto] = await db.execute("SELECT id FROM productos WHERE id = ?", [producto_id])
      if (producto.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Producto no encontrado",
        })
      }

      const imagen_resena = req.file ? req.file.filename : null

      const insertQuery = `
                INSERT INTO resenas (
                    producto_id, usuario_nombre, usuario_email, pais, codigo_pais,
                    calificacion, comentario
                ) VALUES (?, ?, ?, ?, ?, ?, ?)
            `

      const [result] = await db.execute(insertQuery, [
        producto_id,
        usuario_nombre,
        usuario_email,
        pais,
        codigo_pais,
        calificacion,
        comentario,
      ])

      res.status(201).json({
        success: true,
        message: "Reseña creada exitosamente",
        resena_id: result.insertId,
      })
    } catch (error) {
      console.error("Error al crear reseña:", error)
      res.status(500).json({
        success: false,
        message: "Error interno del servidor",
      })
    }
  },

  // Obtener estadísticas de reseñas
  obtenerEstadisticasResenas: async (req, res) => {
    try {
      const { productoId } = req.params

      const query = `
                SELECT 
                    total_resenas,
                    promedio_calificacion,
                    calificacion_5,
                    calificacion_4,
                    calificacion_3,
                    calificacion_2,
                    calificacion_1
                FROM resenas_estadisticas 
                WHERE producto_id = ?
            `

      const [estadisticas] = await db.execute(query, [productoId])

      const stats = estadisticas[0] || {
        total_resenas: 0,
        promedio_calificacion: 0,
        calificacion_5: 0,
        calificacion_4: 0,
        calificacion_3: 0,
        calificacion_2: 0,
        calificacion_1: 0,
      }

      const total = stats.total_resenas || 1
      const porcentajes = {
        p5: Math.round((stats.calificacion_5 / total) * 100),
        p4: Math.round((stats.calificacion_4 / total) * 100),
        p3: Math.round((stats.calificacion_3 / total) * 100),
        p2: Math.round((stats.calificacion_2 / total) * 100),
        p1: Math.round((stats.calificacion_1 / total) * 100),
      }

      res.json({
        success: true,
        estadisticas: {
          ...stats,
          porcentajes,
        },
      })
    } catch (error) {
      console.error("Error al obtener estadísticas:", error)
      res.status(500).json({
        success: false,
        message: "Error interno del servidor",
      })
    }
  },
}

module.exports = reviewController
