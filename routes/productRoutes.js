const express = require("express")
const router = express.Router()
const productController = require("../controllers/productController")
const { upload } = require("../config/multer")


router.post("/productos", upload.array("imagenes", 3), productController.crearProducto)
router.put("/productos/:id", upload.array("imagenes", 5), productController.editarProducto)
router.delete("/productos/:id", productController.eliminarProducto)
router.get("/productos/proveedor/:proveedorId", productController.obtenerProductosProveedor)
router.put("/productos/publicar/:id", productController.publicarProducto)
router.put("/productos/retirar/:id", productController.retirarProducto)
router.get("/productos/publicados", productController.obtenerProductosPublicados)
router.get("/productos/:id", productController.obtenerProductoPorId)

module.exports = router
