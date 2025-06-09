const express = require("express")
const router = express.Router()
const reviewController = require("../controllers/reviewController")
const { uploadResenas } = require("../config/multer")


router.get("/resenas/:productoId", reviewController.obtenerResenas)
router.post("/resenas", uploadResenas.single("imagen"), reviewController.crearResena)
router.get("/resenas-estadisticas/:productoId", reviewController.obtenerEstadisticasResenas)

module.exports = router
