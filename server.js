const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const puerto = 5000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Conexión a MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '12345',
  database: 'provecta'
});

db.connect((err) => {
  if (err) {
    console.error('❌ Error al conectar a MySQL:', err);
    return;
  }
  console.log('✅ Conectado a la base de datos');
});

// Ruta para registrar usuario
app.post('/registrar', (req, res) => {
  const { nombre, contrasena, cedula, correo, telefono, rol } = req.body;

  if (!nombre || !contrasena || !cedula || !correo || !telefono || !rol) {
    return res.status(400).send('Faltan datos del formulario');
  }

  const sql = 'INSERT INTO usuarios (nombre, contrasena, cedula, correo, telefono, rol) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(sql, [nombre, contrasena, cedula, correo, telefono, rol], (err, resultado) => {
    if (err) {
      console.error('❌ Error al registrar usuario:', err);
      return res.status(500).send('Error al registrar usuario');
    }
    res.send('Usuario registrado con éxito');
  });
});

// Ruta para login
app.post('/login', (req, res) => {
  const { correo, contrasena } = req.body;

  if (!correo || !contrasena) {
    return res.status(400).json({ success: false, message: 'Correo y contraseña requeridos' });
  }

  const sql = 'SELECT * FROM usuarios WHERE correo = ? AND contrasena = ?';
  db.query(sql, [correo, contrasena], (err, resultados) => {
    if (err) {
      console.error('❌ Error en consulta de login:', err);
      return res.status(500).json({ success: false, message: 'Error en el servidor al consultar la base de datos' });
    }

    if (resultados.length > 0) {
      res.json({ success: true });
    } else {
      res.json({ success: false, message: 'Correo o contraseña incorrectos' });
    }
  });
});

// Iniciar servidor
app.listen(puerto, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${puerto}`);
});
