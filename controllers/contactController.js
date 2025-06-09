const { transporter } = require("../config/email")

const contactController = {
  // Enviar email de contacto
  enviarContacto: (req, res) => {
    const {
      correoVendedor,
      buyerName,
      buyerEmail,
      buyerPhone,
      position,
      companyName,
      businessType,
      address,
      city,
      productName,
      productCategory,
      quantity,
      quantityUnit,
      deliveryLocation,
      expectedDeliveryDate,
      paymentTerms,
      urgency,
      specifications,
      additionalRequirements,
    } = req.body

    const mailOptions = {
      from: '"Plataforma B2B" <plataformab2b@gmail.com>',
      to: correoVendedor,
      subject: `Consulta sobre: ${productName}`,
      text: `
                Nombre del comprador: ${buyerName}
                Correo del comprador: ${buyerEmail}
                Teléfono: ${buyerPhone}
                Cargo/Posición: ${position}
                Nombre de la empresa: ${companyName}
                Tipo de negocio: ${businessType}

                Dirección: ${address}
                Ciudad: ${city}

                Producto de interés: ${productName}
                Categoría: ${productCategory}
                Cantidad requerida: ${quantity} ${quantityUnit}

                Lugar de entrega: ${deliveryLocation}
                Fecha esperada de entrega: ${expectedDeliveryDate}
                Términos de pago preferidos: ${paymentTerms}
                Urgencia de la cotización: ${urgency}

                Especificaciones técnicas: ${specifications}
                Requisitos adicionales: ${additionalRequirements}
            `,
    }

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error al enviar:", error)
        return res.status(500).send("Error al enviar el mensaje.")
      }
      res.redirect("../Html/mensaje-exito.html")
    })
  },
}

module.exports = contactController
