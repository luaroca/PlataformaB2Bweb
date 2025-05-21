const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');
//const multer = require('multer');
const app = express();
const puerto = 5000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'mysql20',
  database: 'provecta'
});

db.connect((err) => {
  if (err) return console.error('❌ Error al conectar a MySQL:', err);
  console.log('✅ Conectado a la base de datos');
});

// Multer
/*const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'public/uploads'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = Date.now() + '-' + Math.round(Math.random() * 1e9) + ext;
    cb(null, filename);
  }
});*/


// Registro de usuario
app.post('/registrar', (req, res) => {
  const { nombre, contrasena, cedula, correo, telefono, rol } = req.body;
  if (!nombre || !contrasena || !cedula || !correo || !telefono || !rol) {
    return res.status(400).send('Faltan datos del formulario');
  }
  const sql = 'INSERT INTO usuarios (nombre, contrasena, cedula, correo, telefono, rol) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(sql, [nombre, contrasena, cedula, correo, telefono, rol], (err) => {
    if (err) return res.status(500).send('Error al registrar usuario');
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
    if (err) return res.status(500).json({ success: false, message: 'Error en el servidor' });
    if (resultados.length > 0) {
      const usuario = resultados[0];
      res.json({ success: true, id: usuario.id, nombre: usuario.nombre, rol: usuario.rol });
    } else {
      res.json({ success: false, message: 'Correo o contraseña incorrectos' });
    }
  });
});

// Perfil
app.get('/perfil/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ success: false, message: 'ID inválido' });
  }

  const sql = 'SELECT nombre, correo, telefono, cedula, rol, imagen FROM usuarios WHERE id = ?';
  db.query(sql, [id], (err, resultados) => {
    if (err) return res.status(500).json({ success: false, message: 'Error del servidor' });

    if (resultados.length > 0) {
      res.json({ success: true, usuario: resultados[0] });
    } else {
      res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }
  });
});

app.get('/perfil/:id/imagen', (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).send('ID inválido');
  }

  const sql = 'SELECT imagen FROM usuarios WHERE id = ?';
  db.query(sql, [id], (err, resultados) => {
    if (err) {
      console.error('Error al obtener imagen:', err);
      return res.status(500).send('Error del servidor');
    }

    if (resultados.length === 0 || !resultados[0].imagen) {
      return res.status(404).send('Imagen no encontrada');
    }

    const imagen = resultados[0].imagen;

    // Suponiendo que guardas imágenes en formato JPEG, ajusta si usas otro tipo
    res.setHeader('Content-Type', 'image/jpeg'); 
    res.send(imagen);
  });
});

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Luego en ruta:
/*app.post('/actualizar-imagen/:id', upload.single('imagen'), (req, res) => {
    const id = parseInt(req.params.id, 10);
    const nuevaImagen = req.file ? req.file.buffer : null;

    if (!id || isNaN(id) || !nuevaImagen) {
        return res.status(400).send('ID inválido o imagen no enviada');
    }

    const sql = 'UPDATE usuarios SET imagen = ? WHERE id = ?';
    db.query(sql, [nuevaImagen, id], (err, result) => {
        if (err) {
            console.error('Error al actualizar imagen:', err);
            return res.status(500).send('Error al actualizar imagen');
        }

        if (result.affectedRows === 0) {
            return res.status(404).send('Usuario no encontrado');
        }

        res.send('Imagen actualizada correctamente');
    });
});*/


/*app.get('/perfil/:id', (req, res) => {
  const id = req.params.id;
  const sql = 'SELECT nombre, correo, telefono, cedula, rol FROM usuarios WHERE id = ?';
  db.query(sql, [id], (err, resultados) => {
    if (err) return res.status(500).json({ success: false, message: 'Error del servidor' });
    if (resultados.length > 0) {
      res.json({ success: true, usuario: resultados[0] });
    } else {
      res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }
  });
});*/
app.post('/actualizar-perfil-completo/:id', upload.single('imagen'), (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).send('ID inválido');

  const { nombre, correo, telefono, cedula, rol } = req.body;
  if (!nombre || !correo || !cedula ) {
    return res.status(400).send('Faltan campos obligatorios');
  }

  // Primero la parte del update para texto:
  const sqlText = 'UPDATE usuarios SET nombre = ?, correo = ?, telefono = ?, cedula = ? WHERE id = ?';

  db.query(sqlText, [nombre, correo, telefono || '', cedula, id], (err, result) => {
    if (err) {
      console.error('Error al actualizar datos:', err);
      return res.status(500).send('Error al actualizar perfil');
    }
    if (result.affectedRows === 0) {
      return res.status(404).send('Usuario no encontrado');
    }

    // Si se envió imagen, actualizar imagen en otro query
    if (req.file) {
      const imagenBuffer = req.file.buffer;
      const sqlImg = 'UPDATE usuarios SET imagen = ? WHERE id = ?';
      db.query(sqlImg, [imagenBuffer, id], (err2) => {
        if (err2) {
          console.error('Error al actualizar imagen:', err2);
          return res.status(500).send('Error al actualizar imagen');
        }
        res.send('Perfil (datos e imagen) actualizado correctamente');
      });
    } else {
      res.send('Perfil actualizado correctamente');
    }
  });
});

// Crear producto con imagen
app.post('/api/productos', upload.single('imagen'), (req, res) => {
  const { nombre, descripcion, precio, stock, proveedor_id } = req.body;
  const imagen = req.file ? `/uploads/${req.file.filename}` : null;

  if (!nombre || !descripcion || !precio || !stock || !proveedor_id || !imagen) {
    return res.status(400).json({ success: false, message: 'Todos los campos son obligatorios, incluyendo la imagen' });
  }

  const sql = 'INSERT INTO productos (nombre, descripcion, precio, stock, proveedor_id, imagen) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(sql, [nombre, descripcion, precio, stock, proveedor_id, imagen], (err, resultado) => {
    if (err) return res.status(500).json({ success: false, message: 'Error al guardar producto' });
    res.json({ success: true, productoId: resultado.insertId });
  });
});

// Obtener productos de proveedor
app.get('/api/productos/proveedor/:proveedorId', (req, res) => {
  const sql = 'SELECT * FROM productos WHERE proveedor_id = ?';
  db.query(sql, [req.params.proveedorId], (err, resultados) => {
    if (err) return res.status(500).json({ success: false });
    res.json({ success: true, productos: resultados });
  });
});

// Obtener productos publicados para compradores (con nombre del proveedor)
app.get('/api/productos/publicados', (req, res) => {
  const sql = `
    SELECT p.id, p.nombre, p.descripcion, p.precio, p.imagen, u.nombre AS proveedor_nombre
    FROM productos p
    JOIN usuarios u ON p.proveedor_id = u.id
    WHERE p.publicado = TRUE
  `;
  db.query(sql, (err, resultados) => {
    if (err) return res.status(500).json({ success: false, message: 'Error al obtener productos publicados' });
    res.json({ success: true, productos: resultados });
  });
});

// Eliminar producto
app.delete('/api/productos/:id', (req, res) => {
  const sql = 'DELETE FROM productos WHERE id = ?';
  db.query(sql, [req.params.id], (err) => {
    if (err) return res.status(500).json({ success: false });
    res.json({ success: true });
  });
});

// Publicar producto
app.put('/api/productos/publicar/:id', (req, res) => {
  const sql = 'UPDATE productos SET publicado = TRUE WHERE id = ?';
  db.query(sql, [req.params.id], (err) => {
    if (err) return res.status(500).json({ success: false });
    res.json({ success: true });
  });
});

// Editar producto
app.put('/api/productos/:id', (req, res) => {
  const id = req.params.id;
  const { nombre, descripcion, precio, stock } = req.body;

  if (!nombre || !descripcion || !precio || !stock) {
    return res.status(400).json({ success: false, message: 'Todos los campos son obligatorios' });
  }

  const sql = 'UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, stock = ? WHERE id = ?';
  db.query(sql, [nombre, descripcion, precio, stock, id], (err, resultado) => {
    if (err) return res.status(500).json({ success: false, message: 'Error al actualizar producto' });
    res.json({ success: true });
  });
});

// Iniciar servidor
app.listen(puerto, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${puerto}`);
});