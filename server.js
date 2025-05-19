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

// Registrar usuario
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

// Login
app.post('/login', (req, res) => {
  const { correo, contrasena } = req.body;

  if (!correo || !contrasena) {
    return res.status(400).json({ success: false, message: 'Correo y contraseña requeridos' });
  }

  const sql = 'SELECT * FROM usuarios WHERE correo = ? AND contrasena = ?';
  db.query(sql, [correo, contrasena], (err, resultados) => {
    if (err) {
      console.error('❌ Error en consulta de login:', err);
      return res.status(500).json({ success: false, message: 'Error en el servidor' });
    }

    if (resultados.length > 0) {
      const usuario = resultados[0];
      res.json({
        success: true,
        id: usuario.id,
        nombre: usuario.nombre,
        rol: usuario.rol
      });
    } else {
      res.json({ success: false, message: 'Correo o contraseña incorrectos' });
    }
  });
});

// Perfil de usuario
app.get('/perfil/:id', (req, res) => {
  const id = req.params.id;
  const sql = 'SELECT nombre, correo, telefono, cedula, rol FROM usuarios WHERE id = ?';

  db.query(sql, [id], (err, resultados) => {
    if (err) {
      console.error('❌ Error al consultar perfil:', err);
      return res.status(500).json({ success: false, message: 'Error del servidor' });
    }

    if (resultados.length > 0) {
      res.json({ success: true, usuario: resultados[0] });
    } else {
      res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }
  });
});

// Crear producto
app.post('/api/productos', (req, res) => {
  const { nombre, descripcion, precio, stock, proveedor_id } = req.body;

  if (!nombre || !descripcion || !precio || !stock || !proveedor_id) {
    return res.status(400).json({ success: false, message: 'Todos los campos son obligatorios' });
  }

  const sql = 'INSERT INTO productos (nombre, descripcion, precio, stock, proveedor_id) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [nombre, descripcion, precio, stock, proveedor_id], (err, resultado) => {
    if (err) {
      console.error('❌ Error al guardar producto:', err);
      return res.status(500).json({ success: false, message: 'Error al guardar producto' });
    }
    res.json({ success: true, productoId: resultado.insertId });
  });
});

// Obtener productos de un proveedor
app.get('/api/productos/proveedor/:proveedorId', (req, res) => {
  const proveedorId = req.params.proveedorId;
  const sql = 'SELECT * FROM productos WHERE proveedor_id = ?';

  db.query(sql, [proveedorId], (err, resultados) => {
    if (err) {
      console.error('❌ Error al obtener productos:', err);
      return res.status(500).json({ success: false });
    }
    res.json({ success: true, productos: resultados });
  });
});

// Eliminar producto
app.delete('/api/productos/:id', (req, res) => {
  const id = req.params.id;
  const sql = 'DELETE FROM productos WHERE id = ?';

  db.query(sql, [id], (err) => {
    if (err) {
      console.error('❌ Error al eliminar producto:', err);
      return res.status(500).json({ success: false });
    }
    res.json({ success: true });
  });
});

// Publicar producto
app.put('/api/productos/publicar/:id', (req, res) => {
  const id = req.params.id;
  const sql = 'UPDATE productos SET publicado = TRUE WHERE id = ?';

  db.query(sql, [id], (err) => {
    if (err) {
      console.error('❌ Error al publicar producto:', err);
      return res.status(500).json({ success: false });
    }
    res.json({ success: true });
  });
});

// Iniciar servidor
app.listen(puerto, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${puerto}`);
});
