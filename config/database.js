const mysql = require("mysql2/promise")

// Conexión a MySQL
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "12345",
  database: "provecta",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

// Verificar conexión
db.getConnection()
  .then((connection) => {
    console.log(" Conectado a la base de datos (Pool OK)")
    connection.release()
  })
  .catch((err) => {
    console.error("❌ Error al conectar a MySQL (Pool):", err)
  })

module.exports = { db }
