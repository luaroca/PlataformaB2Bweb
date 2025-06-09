const express = require("express")
const router = express.Router()
const userController = require("../controllers/userController")
const productController = require("../controllers/productController")
const { upload } = require("../config/multer")


router.post("/registrar", userController.registrarUsuario)
router.post("/login", userController.loginUsuario)
router.get("/perfil/:id", userController.obtenerPerfil)
router.post("/actualizar-perfil-completo/:id", upload.single("imagen"), userController.actualizarPerfil)


router.get("/producto-detalle/:id", productController.obtenerDetalleProducto)
router.get("/productos-relacionados/:categoria/:id", productController.obtenerProductosRelacionados)
router.get("/api/contacto-info/:id", productController.obtenerInfoContacto)

module.exports = router
