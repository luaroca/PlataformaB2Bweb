const express = require("express")
const router = express.Router()
const favoriteController = require("../controllers/favoriteController")


router.post("/add-favoritos/:id_producto/:id_usuario", favoriteController.agregarFavorito)
router.get("/favoritos/:id_usuario", favoriteController.obtenerFavoritos)

module.exports = router
