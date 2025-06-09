const express = require("express")
const router = express.Router()
const contactController = require("../controllers/contactController")


router.post("/enviar-contacto", contactController.enviarContacto)

module.exports = router
