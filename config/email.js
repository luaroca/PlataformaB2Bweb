const nodemailer = require("nodemailer")

// Configuración del transporter de email
const transporter = nodemailer.createTransport({

  service: "gmail",
  auth: {
    user: "rodriguezemelin20@gmail.com",
    pass: "dikm pznz ijwg ukii",
  },
})

module.exports = { transporter }
