const express = require("express")
const router = express.Router()
const statsController = require("../controllers/statsController")


router.get("/estadisticas", statsController.obtenerEstadisticas)

module.exports = router
