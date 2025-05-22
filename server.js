const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');
const multer = require('multer');
const app = express();
const puerto = 5000;

// Para manejar datos JSON
app.use(express.json());

// Para manejar datos URL encoded (como formularios)
app.use(express.urlencoded({ extended: true }));

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
});

// Crear producto con imagen
const fs = require('fs');

app.post('/api/productos', upload.single('imagen'), (req, res) => {
    const { nombre, descripcion, precio, stock, proveedor_id } = req.body;

    if (!nombre || !descripcion || !precio || !stock || !proveedor_id || !req.file) {
        return res.status(400).json({ success: false, message: 'Todos los campos son obligatorios, incluyendo la imagen' });
    }

    const filePath = path.join(__dirname, 'public', 'uploads', req.file.filename);
    const imagenBuffer = fs.readFileSync(filePath); // ← Aquí NO convertimos a base64
    const mime = req.file.mimetype;

    const sql = 'INSERT INTO productos (nombre, descripcion, precio, stock, proveedor_id, imagen, mime) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [nombre, descripcion, precio, stock, proveedor_id, imagenBuffer, mime], (err, resultado) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: 'Error al guardar producto' });
        }
        res.json({ success: true, productoId: resultado.insertId });
    });
});



const fileType = require('file-type');

app.get('/api/productos/proveedor/:proveedorId', (req, res) => {
    const sql = 'SELECT * FROM productos WHERE proveedor_id = ?';
    db.query(sql, [req.params.proveedorId], (err, resultados) => {
        if (err) return res.status(500).json({ success: false });

        const productos = resultados.map(producto => {
            let imagenBase64 = null;

            if (producto.imagen) {
                imagenBase64 = producto.imagen.toString('base64'); // Convertir BLOB → base64
            }

            return {
                ...producto,
                imagen: imagenBase64,
                mime: producto.mime || 'image/jpeg' // Por defecto si falta
            };
        });

        res.json({ success: true, productos });
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
app.put('/api/productos/:id', upload.single('imagen'), (req, res) => {
    const id = req.params.id; // ID del producto a actualizar
    const { nombre, descripcion, precio, stock } = req.body;

    if (!nombre || !descripcion || !precio || !stock) {
        return res.status(400).json({ success: false, message: 'Todos los campos son obligatorios' });
    }

    let sql, params;

    if (req.file) {
        const filePath = path.join(__dirname, 'public', 'uploads', req.file.filename);
        const imagenBuffer = fs.readFileSync(filePath);
        const mime = req.file.mimetype;

        sql = 'UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, stock = ?, imagen = ?, mime = ? WHERE id = ?';
        params = [nombre, descripcion, precio, stock, imagenBuffer, mime, id];
    } else {
        sql = 'UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, stock = ? WHERE id = ?';
        params = [nombre, descripcion, precio, stock, id];
    }

    db.query(sql, params, (err, resultado) => {
        if (err) {
            console.error('Error al actualizar producto:', err);
            return res.status(500).json({ success: false, message: 'Error al actualizar producto' });
        }
        res.json({ success: true });
    });
});



// Iniciar servidor
app.listen(puerto, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${puerto}`);
});