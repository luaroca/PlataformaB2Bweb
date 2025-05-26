const express = require('express');
const fileType = require('file-type');
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
    const sql = 'SELECT nombre, correo, telefono, cedula, rol, imagen FROM usuarios WHERE id = ?';
    db.query(sql, [id], (err, resultados) => {
        if (err) return res.status(500).json({ success: false, message: 'Error del servidor' });
        
        if (resultados.length > 0) {
            const usuario = resultados[0];

            // Construir la URL completa de la imagen
            usuario.imagen = usuario.imagen 
                ? `${req.protocol}://${req.get('host')}${usuario.imagen}`
                : null;
            console.log(usuario.imagen);
            res.json({ success: true, usuario });
        } else {
            res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }
    });
});


//Actualizar Perfil
const dbPromise = db.promise();

app.post('/actualizar-perfil-completo/:id', upload.single('imagen'), async (req, res) => {
    const id = req.params.id;
    const { cedula, nombre, correo, telefono } = req.body;

    try {
        const [rows] = await dbPromise.query('SELECT imagen FROM usuarios WHERE id = ?', [id]);

        if (rows.length === 0) {
            return res.status(404).send('Usuario no encontrado.');
        }

        let nuevaRutaImagen = rows[0].imagen;

        if (req.file) {
            nuevaRutaImagen = `/uploads/${req.file.filename}`;

            const imagenAnterior = rows[0].imagen;
            if (imagenAnterior && imagenAnterior !== '/uploads/default.png') {
                const rutaCompleta = path.join(__dirname, 'public', imagenAnterior);
                if (fs.existsSync(rutaCompleta)) {
                    fs.unlinkSync(rutaCompleta);
                }
            }
        }

        await dbPromise.query(
            `UPDATE usuarios SET cedula = ?, nombre = ?, correo = ?, telefono = ?, imagen = ? WHERE id = ?`,
            [cedula, nombre, correo, telefono, nuevaRutaImagen, id]
        );

        res.json({ success: true, message: 'Perfil actualizado correctamente.' });

    } catch (error) {
        console.error('Error actualizando perfil:', error);
        res.status(500).send('Error al actualizar el perfil.');
    }
});


// Crear producto con imagen
app.post('/api/productos', upload.single('imagen'), (req, res) => {
    const { nombre, descripcion, precio, stock, proveedor_id } = req.body;

    if (!nombre || !descripcion || !precio || !stock || !proveedor_id || !req.file) {
        return res.status(400).json({ success: false, message: 'Todos los campos son obligatorios, incluyendo la imagen' });
    }

    const imagenRuta = `/uploads/${req.file.filename}`;
    const mime = req.file.mimetype;

    const sql = 'INSERT INTO productos (nombre, descripcion, precio, stock, proveedor_id, imagen, mime) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [nombre, descripcion, precio, stock, proveedor_id, imagenRuta, mime], (err, resultado) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: 'Error al guardar producto' });
        }
        res.json({ success: true, productoId: resultado.insertId });
    });
});

//Buscar Mis Productos (proveedor)
app.get('/api/productos/proveedor/:proveedorId', (req, res) => {
    const sql = 'SELECT * FROM productos WHERE proveedor_id = ?';
    db.query(sql, [req.params.proveedorId], (err, resultados) => {
        if (err) return res.status(500).json({ success: false });

        const productos = resultados.map(producto => ({
            ...producto,
            imagen: producto.imagen, // ya es la ruta
            mime: producto.mime || 'image/jpeg'
        }));

        res.json({ success: true, productos });
    });
});



// Obtener productos publicados para compradores (con nombre del proveedor y correo)
app.get('/api/productos/publicados', (req, res) => {
    const sql = `
        SELECT p.id, p.nombre, p.descripcion, p.precio, p.imagen, u.nombre AS proveedor_nombre, u.correo
        FROM productos p
        JOIN usuarios u ON p.proveedor_id = u.id
        WHERE p.publicado = TRUE
    `;
    db.query(sql, (err, resultados) => {
        if (err) return res.status(500).json({ success: false, message: 'Error al obtener productos publicados' });

        const productos = resultados.map(producto => ({
            ...producto,
            imagen: producto.imagen,
            correo: producto.correo
        }));

        res.json({ success: true, productos });
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

const fs = require('fs');

// Editar producto
app.put('/api/productos/:id', upload.single('imagen'), (req, res) => {
    const id = req.params.id;
    const { nombre, descripcion, precio, stock } = req.body;

    if (!nombre || !descripcion || !precio || !stock) {
        return res.status(400).json({ success: false, message: 'Todos los campos son obligatorios' });
    }

    if (req.file) {
        // Obtener la ruta actual de la imagen para borrarla
        const getOldImageSql = 'SELECT imagen FROM productos WHERE id = ?';
        db.query(getOldImageSql, [id], (err, resultado) => {
            if (err || resultado.length === 0) {
                console.error('Error al obtener imagen anterior:', err);
            } else {
                const rutaAnterior = path.join(__dirname, 'public', resultado[0].imagen || '');
                // Eliminar archivo antiguo si existe
                if (fs.existsSync(rutaAnterior)) {
                    fs.unlinkSync(rutaAnterior);
                }
            }

            // Ahora actualizar el producto con la nueva imagen
            const imagenRuta = `/uploads/${req.file.filename}`;
            const mime = req.file.mimetype;
            const updateSql = 'UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, stock = ?, imagen = ?, mime = ? WHERE id = ?';
            const params = [nombre, descripcion, precio, stock, imagenRuta, mime, id];

            db.query(updateSql, params, (err) => {
                if (err) {
                    console.error('Error al actualizar producto:', err);
                    return res.status(500).json({ success: false, message: 'Error al actualizar producto' });
                }
                res.json({ success: true });
            });
        });
    } else {
        const updateSql = 'UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, stock = ? WHERE id = ?';
        const params = [nombre, descripcion, precio, stock, id];

        db.query(updateSql, params, (err) => {
            if (err) {
                console.error('Error al actualizar producto:', err);
                return res.status(500).json({ success: false, message: 'Error al actualizar producto' });
            }
            res.json({ success: true });
        });
    }
});


// Iniciar servidor
app.listen(puerto, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${puerto}`);
});