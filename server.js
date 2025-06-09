const express = require("express")
const bodyParser = require("body-parser")
const path = require("path")
const app = express()
const puerto = 5000

// Importar configuraciones
const { db } = require("./config/database")

// Importar rutas
const userRoutes = require("./routes/userRoutes")
const productRoutes = require("./routes/productRoutes")
const reviewRoutes = require("./routes/reviewRoutes")
const favoriteRoutes = require("./routes/favoriteRoutes")
const contactRoutes = require("./routes/contactRoutes")
const adminRoutes = require("./routes/adminRoutes")
const statsRoutes = require("./routes/statsRoutes")

// Middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, "public")))

// Middleware para servir imágenes de reseñas
app.use("/uploads/resenas", express.static(path.join(__dirname, "uploads", "resenas")))

// Rutas - ORDEN IMPORTANTE: las rutas más específicas primero
app.use("/admin", adminRoutes)
app.use("/api", statsRoutes)
app.use("/api", productRoutes)
app.use("/", reviewRoutes)
app.use("/", favoriteRoutes)
app.use("/", contactRoutes)
app.use("/", userRoutes)

// Iniciar servidor
app.listen(puerto, () => {
  console.log(` Servidor escuchando en http://localhost:${puerto}/Html`)
})
