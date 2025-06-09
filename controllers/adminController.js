const { db } = require("../config/database")

const adminController = {
  // Login de administrador
  loginAdmin: async (req, res) => {
    const { correo, contrasena } = req.body

    if (!correo || !contrasena) {
      return res.status(400).json({ success: false, message: "Correo y contraseña son requeridos" })
    }

    try {
      const [users] = await db.execute("SELECT id, correo, contrasena, rol FROM usuarios WHERE correo = ?", [correo])

      if (users.length === 0) {
        return res.status(401).json({ success: false, message: "Credenciales inválidas" })
      }

      const user = users[0]

      if (user.rol !== "admin") {
        return res.status(403).json({ success: false, message: "Acceso denegado. No eres administrador." })
      }

      if (contrasena !== user.contrasena) {
        return res.status(401).json({ success: false, message: "Credenciales inválidas" })
      }

      res.json({
        success: true,
        message: "Autenticación correcta",
        admin: true,
        userId: user.id,
      })
    } catch (error) {
      console.error("Error en login admin:", error)
      res.status(500).json({ success: false, message: "Error interno del servidor" })
    }
  },
}

module.exports = adminController
