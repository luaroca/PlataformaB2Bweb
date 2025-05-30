const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');
const multer = require('multer');

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

db.connect(err => {
  if (err) {
    console.error('❌ Error al conectar a MySQL:', err);
  } else {
    console.log('✅ Conectado a la base de datos');
  }
});

// Configuración de almacenamiento para imágenes con multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'public/uploads'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = Date.now() + '-' + Math.round(Math.random() * 1e9) + ext;
    cb(null, filename);
  }
});
const upload = multer({ storage });

// Rutas

// Registro de usuario
app.post('/registrar', (req, res) => {
  const { nombre, contrasena, cedula, correo, telefono, rol } = req.body;
  if (!nombre || !contrasena || !cedula || !correo || !telefono || !rol) {
    return res.status(400).send('Faltan datos del formulario');
  }
  const sql = 'INSERT INTO usuarios (nombre, contrasena, cedula, correo, telefono, rol) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(sql, [nombre, contrasena, cedula, correo, telefono, rol], err => {
    if (err) {
      console.error(err);
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
      console.error(err);
      return res.status(500).json({ success: false, message: 'Error en el servidor' });
    }
    if (resultados.length > 0) {
      const usuario = resultados[0];
      res.json({ success: true, id: usuario.id, nombre: usuario.nombre, rol: usuario.rol });
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
      console.error(err);
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
app.post('/api/productos', upload.array('imagenes', 3), (req, res) => {
  const {
    nombre, descripcion, categoria, subcategoria, unidad_medida,
    minimo_pedido, tiempo_entrega, condiciones_pago,
    origen_producto, precio, stock, proveedor_id
  } = req.body;

  const imagenes = req.files;
  if (!imagenes || imagenes.length < 1) {
    return res.status(400).json({ success: false, message: 'Debes subir al menos una imagen' });
  }

  const imagen_principal = imagenes[0]?.filename || null;
  const imagen_secundaria1 = imagenes[1]?.filename || null;
  const imagen_secundaria2 = imagenes[2]?.filename || null;

  const sql = `
    INSERT INTO productos (
      nombre, descripcion, categoria, subcategoria, unidad_medida, minimo_pedido,
      tiempo_entrega, condiciones_pago, origen_producto, precio, stock, proveedor_id,
      imagen_principal, imagen_secundaria1, imagen_secundaria2
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [
    nombre, descripcion, categoria, subcategoria, unidad_medida, minimo_pedido,
    tiempo_entrega, condiciones_pago, origen_producto, precio, stock, proveedor_id,
    imagen_principal, imagen_secundaria1, imagen_secundaria2
  ], (err, resultado) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'Error al guardar producto' });
    }
    res.json({ success: true, productoId: resultado.insertId });
  });
});

// Editar producto
app.put('/api/productos/:id', (req, res) => {
  const id = req.params.id;
  const {
    nombre, descripcion, categoria, subcategoria, unidad_medida, minimo_pedido, tiempo_entrega,
    condiciones_pago, origen_producto, precio, stock, proveedor_id
  } = req.body;

  const sql = `
    UPDATE productos SET
      nombre = ?, descripcion = ?, categoria = ?, subcategoria = ?, unidad_medida = ?,
      minimo_pedido = ?, tiempo_entrega = ?, condiciones_pago = ?, origen_producto = ?,
      precio = ?, stock = ?, proveedor_id = ?
    WHERE id = ?
  `;

  db.query(sql, [
    nombre, descripcion, categoria, subcategoria, unidad_medida,
    minimo_pedido, tiempo_entrega, condiciones_pago, origen_producto,
    precio, stock, proveedor_id, id
  ], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'Error al actualizar producto' });
    }
    res.json({ success: true, message: 'Producto actualizado' });
  });
});

// Eliminar producto
app.delete('/api/productos/:id', (req, res) => {
  const sql = 'DELETE FROM productos WHERE id = ?';
  db.query(sql, [req.params.id], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false });
    }
    res.json({ success: true });
  });
});

// Obtener productos de un proveedor
app.get('/api/productos/proveedor/:proveedorId', (req, res) => {
  const sql = 'SELECT * FROM productos WHERE proveedor_id = ?';
  db.query(sql, [req.params.proveedorId], (err, resultados) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false });
    }
    res.json({ success: true, productos: resultados });
  });
});

// Publicar producto
app.put('/api/productos/publicar/:id', (req, res) => {
  const sql = 'UPDATE productos SET publicado = TRUE WHERE id = ?';
  db.query(sql, [req.params.id], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false });
    }
    res.json({ success: true });
  });
});

// Retirar publicación de producto
app.put('/api/productos/retirar/:id', (req, res) => {
  const sql = 'UPDATE productos SET publicado = FALSE WHERE id = ?';
  db.query(sql, [req.params.id], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false });
    }
    res.json({ success: true });
  });
});

// Obtener todos los productos publicados
app.get('/api/productos/publicados', (req, res) => {
  const sql = `
    SELECT 
      p.id, p.nombre, p.descripcion, p.precio, p.imagen_principal,
      p.minimo_pedido, p.tiempo_entrega, p.condiciones_pago, p.categoria,
      u.nombre AS proveedor_nombre
    FROM productos p
    JOIN usuarios u ON p.proveedor_id = u.id
    WHERE p.publicado = TRUE
  `;
  db.query(sql, (err, resultados) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'Error al obtener productos publicados' });
    }
    res.json({ success: true, productos: resultados });
  });
});

// Vista detallada de un producto (con nombre del proveedor)
app.get('/producto-detalle/:id', (req, res) => {
  const { id } = req.params;
  const sql = `
    SELECT 
      p.*, 
      u.nombre AS proveedor_nombre
    FROM productos p
    JOIN usuarios u ON p.proveedor_id = u.id
    WHERE p.id = ?
  `;
  db.query(sql, [id], (err, resultados) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'Error del servidor' });
    }
    if (resultados.length > 0) {
      res.json({ success: true, producto: resultados[0] });
    } else {
      res.status(404).json({ success: false, message: 'Producto no encontrado' });
    }
  });
});

// Obtener un producto por ID
app.get('/api/productos/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM productos WHERE id = ?';
  db.query(sql, [id], (err, resultados) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'Error del servidor' });
    }
    if (resultados.length > 0) {
      res.json({ success: true, producto: resultados[0] });
    } else {
      res.status(404).json({ success: false, message: 'Producto no encontrado' });
    }
  });
});

// Iniciar servidor
app.listen(puerto, () => {
  console.log(`🚀 Servidor escuchando en http://localhost:${puerto}`);
});


const nodemailer = require('nodemailer');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// Configura tu correo
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'rodriguezemelin20@gmail.com', // Cambia esto por tu correo de envío
        pass: 'dikm pznz ijwg ukii'     // Cambia esto por la clave de aplicación de Gmail
    }
});

app.post('/enviar-contacto', (req, res) => {
    const { producto, correoVendedor, nombreComprador, correoComprador, mensaje } = req.body;

    const mailOptions = {
        from: '"Plataforma B2B" <plataformab2b@gmail.com>',
        to: correoVendedor,
        subject: `Consulta sobre: ${producto}`,
        text: `
Nombre del comprador: ${nombreComprador}
Correo del comprador: ${correoComprador}
Producto de interés: ${producto}
Mensaje: ${mensaje}
        `
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error al enviar:', error);
            return res.status(500).send('Error al enviar el mensaje.');
        }
        res.send('¡Mensaje enviado exitosamente al vendedor!');
    });
});

app.listen(puerto, () => {
    console.log(`Servidor en http://localhost:${puerto}`);
});

app.get('/contactar/:productoId', (req, res) => {
  const productoId = req.params.productoId;

  const sql = `
    SELECT 
      p.nombre AS nombreProducto,
      u.nombre AS nombreVendedor,
      u.correo AS correoVendedor
    FROM productos p
    JOIN usuarios u ON p.proveedor_id = u.id
    WHERE p.id = ?
  `;

  db.query(sql, [productoId], (err, resultados) => {
    if (err) {
      console.error('Error al obtener los datos del producto:', err);
      return res.status(500).send('Error del servidor');
    }

    if (resultados.length === 0) {
      return res.status(404).send('Producto no encontrado');
    }

    const producto = resultados[0];
    res.sendFile(path.join(__dirname, 'public/contacto.html'));
  });
});


