const { db } = require("../config/database")
const path = require("path")
const fs = require("fs")

const userController = {
  // Registro de usuario
  registrarUsuario: async (req, res) => {
    const { nombre, contrasena, cedula, correo, telefono, rol, codigo_pais, pais } = req.body

    if (!nombre || !contrasena || !cedula || !correo || !telefono || !rol || !pais) {
      return res.status(400).send("Faltan datos del formulario")
    }

    const sql =
      "INSERT INTO usuarios (nombre, contrasena, cedula, correo, telefono, rol, pais) VALUES (?, ?, ?, ?, ?, ?, ?)"

    try {
      await db.execute(sql, [nombre, contrasena, cedula, correo, telefono, rol, codigo_pais])
      res.send("Usuario registrado con éxito")
    } catch (err) {
      console.error(err)
      return res.status(500).send("Error al registrar usuario")
    }
  },

  // Login
  loginUsuario: async (req, res) => {
    const { correo, contrasena } = req.body

    if (!correo || !contrasena) {
      return res.status(400).json({ success: false, message: "Correo y contraseña requeridos" })
    }

    const sql = "SELECT * FROM usuarios WHERE correo = ? AND contrasena = ?"

    try {
      const [resultados] = await db.execute(sql, [correo, contrasena])
      if (resultados.length > 0) {
        const usuario = resultados[0]
        res.json({ success: true, id: usuario.id, nombre: usuario.nombre, rol: usuario.rol })
      } else {
        res.json({ success: false, message: "Correo o contraseña incorrectos" })
      }
    } catch (err) {
      console.error(err)
      return res.status(500).json({ success: false, message: "Error en el servidor" })
    }
  },

  // Obtener perfil
  obtenerPerfil: async (req, res) => {
    const id = req.params.id
    const sql = "SELECT nombre, correo, telefono, cedula, rol, imagen FROM usuarios WHERE id = ?"

    try {
      const [resultados] = await db.execute(sql, [id])
      if (resultados.length > 0) {
        res.json({ success: true, usuario: resultados[0] })
      } else {
        res.status(404).json({ success: false, message: "Usuario no encontrado" })
      }
    } catch (err) {
      console.error(err)
      return res.status(500).json({ success: false, message: "Error del servidor" })
    }
  },

  // Actualizar perfil
  actualizarPerfil: async (req, res) => {
    const id = req.params.id
    const { cedula, nombre, correo, telefono } = req.body

    try {
      const [rows] = await db.query("SELECT imagen FROM usuarios WHERE id = ?", [id])

      if (rows.length === 0) {
        return res.status(404).send("Usuario no encontrado.")
      }

      let nuevaRutaImagen = rows[0].imagen

      if (req.file) {
        nuevaRutaImagen = `/uploads/${req.file.filename}`

        const imagenAnterior = rows[0].imagen
        if (imagenAnterior && imagenAnterior !== "/uploads/default.png") {
          const rutaCompleta = path.join(__dirname, "../public", imagenAnterior)
          if (fs.existsSync(rutaCompleta)) {
            fs.unlinkSync(rutaCompleta)
          }
        }
      }

      await db.query(`UPDATE usuarios SET cedula = ?, nombre = ?, correo = ?, telefono = ?, imagen = ? WHERE id = ?`, [
        cedula,
        nombre,
        correo,
        telefono,
        nuevaRutaImagen,
        id,
      ])

      res.json({ success: true, message: "Perfil actualizado correctamente." })
    } catch (error) {
      console.error("Error actualizando perfil:", error)
      res.status(500).send("Error al actualizar el perfil.")
    }
  },
}

module.exports = userController
