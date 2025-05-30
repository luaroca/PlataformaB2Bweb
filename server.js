const express = require('express');
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');
const path = require('path');
const multer = require('multer');
const fs = require('fs');

const app = express();
const puerto = 5000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Conexión a MySQL
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'mysql20',
    database: 'provecta',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

db.getConnection()
    .then(connection => {
        console.log('✅ Conectado a la base de datos (Pool OK)');
        connection.release();
    })
    .catch(err => {
        console.error('❌ Error al conectar a MySQL (Pool):', err);
    });

// Configuración de almacenamiento para imágenes de productos
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

// CONFIGURACIÓN DE MULTER PARA SUBIR IMÁGENES DE RESEÑAS
const storageResenas = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, 'uploads', 'resenas');
        // Crear directorio si no existe
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'resena-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const uploadResenas = multer({
    storage: storageResenas,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB límite
    },
    fileFilter: function (req, file, cb) {
        const allowedTypes = /jpeg|jpg|png|gif/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Solo se permiten archivos de imagen (JPEG, PNG, GIF)'));
        }
    }
});

// MIDDLEWARE PARA SERVIR IMÁGENES DE RESEÑAS
app.use('/uploads/resenas', express.static(path.join(__dirname, 'uploads', 'resenas')));

// FUNCIÓN AUXILIAR PARA OCULTAR NOMBRES DE USUARIO
function ocultarNombreUsuario(nombre) {
    if (typeof nombre !== 'string' || nombre.trim().length < 3) {
        return 'Usuario';
    }

    const partes = nombre.trim().split(' ');
    return partes.map(parte => {
        if (parte.length <= 3) return parte;
        return parte.charAt(0) + '*'.repeat(parte.length - 2) + parte.charAt(parte.length - 1);
    }).join(' ');
}


// ==================== RUTAS DE USUARIOS ====================

// Registro de usuario
app.post('/registrar', async (req, res) => {
    const { nombre, contrasena, cedula, correo, telefono, rol } = req.body;
    if (!nombre || !contrasena || !cedula || !correo || !telefono || !rol) {
        return res.status(400).send('Faltan datos del formulario');
    }
    const sql = 'INSERT INTO usuarios (nombre, contrasena, cedula, correo, telefono, rol) VALUES (?, ?, ?, ?, ?, ?)';
    try {
        await db.execute(sql, [nombre, contrasena, cedula, correo, telefono, rol]);
        res.send('Usuario registrado con éxito');
    } catch (err) {
        console.error(err);
        return res.status(500).send('Error al registrar usuario');
    }
});

// Login
app.post('/login', async (req, res) => {
    const { correo, contrasena } = req.body;
    if (!correo || !contrasena) {
        return res.status(400).json({ success: false, message: 'Correo y contraseña requeridos' });
    }
    const sql = 'SELECT * FROM usuarios WHERE correo = ? AND contrasena = ?';
    try {
        const [resultados] = await db.execute(sql, [correo, contrasena]);
        if (resultados.length > 0) {
            const usuario = resultados[0];
            res.json({ success: true, id: usuario.id, nombre: usuario.nombre, rol: usuario.rol });
        } else {
            res.json({ success: false, message: 'Correo o contraseña incorrectos' });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Error en el servidor' });
    }
});

// Perfil de usuario
app.get('/perfil/:id', async (req, res) => {
    const id = req.params.id;
    const sql = 'SELECT nombre, correo, telefono, cedula, rol, imagen FROM usuarios WHERE id = ?';
    try {
        const [resultados] = await db.execute(sql, [id]);
        if (resultados.length > 0) {
            res.json({ success: true, usuario: resultados[0] });
        } else {
            res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Error del servidor' });
    }
});

// Actualizar Perfil
app.post('/actualizar-perfil-completo/:id', upload.single('imagen'), async (req, res) => {
    const id = req.params.id;
    const { cedula, nombre, correo, telefono } = req.body;

    try {
        const [rows] = await db.query('SELECT imagen FROM usuarios WHERE id = ?', [id]);

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

        await db.query(
            `UPDATE usuarios SET cedula = ?, nombre = ?, correo = ?, telefono = ?, imagen = ? WHERE id = ?`,
            [cedula, nombre, correo, telefono, nuevaRutaImagen, id]
        );

        res.json({ success: true, message: 'Perfil actualizado correctamente.' });

    } catch (error) {
        console.error('Error actualizando perfil:', error);
        res.status(500).send('Error al actualizar el perfil.');
    }
});

// ==================== RUTAS DE PRODUCTOS ====================

// Crear producto
app.post('/api/productos', upload.array('imagenes', 3), async (req, res) => {
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

    try {
        const [resultado] = await db.execute(sql, [
            nombre, descripcion, categoria, subcategoria, unidad_medida, minimo_pedido,
            tiempo_entrega, condiciones_pago, origen_producto, precio, stock, proveedor_id,
            imagen_principal, imagen_secundaria1, imagen_secundaria2
        ]);
        res.json({ success: true, productoId: resultado.insertId });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Error al guardar producto' });
    }
});

// Editar producto
app.put('/api/productos/:id', async (req, res) => {
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

    try {
        await db.execute(sql, [
            nombre, descripcion, categoria, subcategoria, unidad_medida,
            minimo_pedido, tiempo_entrega, condiciones_pago, origen_producto,
            precio, stock, proveedor_id, id
        ]);
        res.json({ success: true, message: 'Producto actualizado' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Error al actualizar producto' });
    }
});

// Eliminar producto
app.delete('/api/productos/:id', async (req, res) => {
    const sql = 'DELETE FROM productos WHERE id = ?';
    try {
        await db.execute(sql, [req.params.id]);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false });
    }
});

// Obtener productos de un proveedor
app.get('/api/productos/proveedor/:proveedorId', async (req, res) => {
    const sql = 'SELECT * FROM productos WHERE proveedor_id = ?';
    try {
        const [resultados] = await db.execute(sql, [req.params.proveedorId]);
        res.json({ success: true, productos: resultados });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false });
    }
});

// Publicar producto
app.put('/api/productos/publicar/:id', async (req, res) => {
    const sql = 'UPDATE productos SET publicado = TRUE WHERE id = ?';
    try {
        await db.execute(sql, [req.params.id]);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false });
    }
});

// Retirar publicación de producto
app.put('/api/productos/retirar/:id', async (req, res) => {
    const sql = 'UPDATE productos SET publicado = FALSE WHERE id = ?';
    try {
        await db.execute(sql, [req.params.id]);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false });
    }
});

// Obtener todos los productos publicados
app.get('/api/productos/publicados', async (req, res) => {
    const sql = `
        SELECT
            p.id, p.nombre, p.descripcion, p.precio, p.imagen_principal,
            p.minimo_pedido, p.tiempo_entrega, p.condiciones_pago, p.categoria,
            u.nombre AS proveedor_nombre
        FROM productos p
        JOIN usuarios u ON p.proveedor_id = u.id
        WHERE p.publicado = TRUE
    `;
    try {
        const [resultados] = await db.execute(sql);
        res.json({ success: true, productos: resultados });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Error al obtener productos publicados' });
    }
});

// Vista detallada de un producto
app.get('/producto-detalle/:id', async (req, res) => {
    const { id } = req.params;
    const sql = `
    SELECT
        p.id,
        p.nombre,
        p.descripcion,
        p.categoria,
        p.subcategoria,
        p.unidad_medida,
        p.minimo_pedido,
        p.tiempo_entrega,
        p.condiciones_pago,
        p.origen_producto,
        p.precio,
        p.stock,
        p.proveedor_id,
        u.nombre AS proveedor_nombre,
        p.publicado,
        p.imagen_principal,
        p.imagen_secundaria1,
        p.imagen_secundaria2
    FROM productos p
    JOIN usuarios u ON p.proveedor_id = u.id
    WHERE p.id = ? `;

    try {
        const [resultados] = await db.execute(sql, [id]);
        if (resultados.length > 0) {
            res.json({ success: true, producto: resultados[0] });
        } else {
            res.status(404).json({ success: false, message: 'Producto no encontrado' });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Error del servidor' });
    }
});

// Obtener un producto por ID
app.get('/api/productos/:id', async (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM productos WHERE id = ?';
    try {
        const [resultados] = await db.execute(sql, [id]);
        if (resultados.length > 0) {
            res.json({ success: true, producto: resultados[0] });
        } else {
            res.status(404).json({ success: false, message: 'Producto no encontrado' });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Error del servidor' });
    }
});

// Productos Relacionados
app.get('/productos-relacionados/:categoria/:id', async (req, res) => {
    const categoria = req.params.categoria;
    const id = req.params.id;

    const sql = `
        SELECT
            p.id,
            p.nombre,
            p.precio,
            p.imagen_principal,
            u.nombre AS proveedor_nombre
        FROM productos p
        JOIN usuarios u ON p.proveedor_id = u.id
        WHERE p.categoria = ? AND p.publicado = 1 AND p.id != ?
    `;

    try {
        const [resultados] = await db.execute(sql, [categoria, id]);
        res.json({ success: true, productos: resultados });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Error del servidor' });
    }
});

// ==================== RUTAS DE RESEÑAS ====================

// OBTENER RESEÑAS DE UN PRODUCTO
app.get('/resenas/:productoId', async (req, res) => {
    try {
        const { productoId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        console.log(page + " " + limit + " " + offset);
        // Obtener reseñas con paginación
        const resenasQuery = `
            SELECT 
                id,
                usuario_nombre,
                pais,
                codigo_pais,
                calificacion,
                comentario,
                imagen_resena,
                DATE_FORMAT(fecha_creacion, '%d %b %Y') as fecha_formateada,
                fecha_creacion
            FROM resenas 
            WHERE producto_id = ? AND activo = TRUE 
            ORDER BY fecha_creacion DESC 
            LIMIT ? OFFSET ?
        `;

        // Obtener estadísticas del producto
        const estadisticasQuery = `
            SELECT 
                total_resenas,
                promedio_calificacion,
                calificacion_5,
                calificacion_4,
                calificacion_3,
                calificacion_2,
                calificacion_1
            FROM resenas_estadisticas 
            WHERE producto_id = ?
        `;

        console.log('Producto ID:', productoId);
        console.log('Page:', page, 'Limit:', limit, 'Offset:', offset);

        const [resenas] = await db.execute(resenasQuery, [productoId, limit, offset]);
        console.log('Reseñas crudas:', resenas);

        const [estadisticas] = await db.execute(estadisticasQuery, [productoId]);
        console.log('Estadísticas crudas:', estadisticas);


        // Procesar reseñas para agregar URL de bandera y ocultar parte del nombre
        const resenasProcessed = resenas.map(resena => {
            try {
                return {
                    ...resena,
                    usuario_nombre: ocultarNombreUsuario(resena.usuario_nombre),
                    bandera_url: resena.codigo_pais && typeof resena.codigo_pais === 'string'
                        ? `https://flagcdn.com/${resena.codigo_pais.toLowerCase()}.svg`
                        : null,
                    imagen_url: resena.imagen_resena ? `/uploads/resenas/${resena.imagen_resena}` : null
                };
            } catch (err) {
                console.error('Error procesando reseña:', resena, err);
                throw err; // Para forzar el 500 con más detalle en consola
            }
        });


        const stats = estadisticas[0] || {
            total_resenas: 0,
            promedio_calificacion: 0,
            calificacion_5: 0,
            calificacion_4: 0,
            calificacion_3: 0,
            calificacion_2: 0,
            calificacion_1: 0
        };

        res.json({
            success: true,
            resenas: resenasProcessed,
            estadisticas: stats,
            pagination: {
                page,
                limit,
                total: stats.total_resenas,
                totalPages: Math.ceil(stats.total_resenas / limit)
            }
        });

    } catch (error) {
        console.error('Error al obtener reseñas:', error.stack || error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }

});

// CREAR NUEVA RESEÑA
app.post('/resenas', uploadResenas.single('imagen'), async (req, res) => {
    try {
        const {
            producto_id,
            usuario_nombre,
            usuario_email,
            pais,
            codigo_pais,
            calificacion,
            comentario
        } = req.body;

        // Validaciones básicas
        if (!producto_id || !usuario_nombre || !calificacion) {
            return res.status(400).json({
                success: false,
                message: 'Faltan campos obligatorios'
            });
        }

        if (calificacion < 1 || calificacion > 5) {
            return res.status(400).json({
                success: false,
                message: 'La calificación debe estar entre 1 y 5'
            });
        }

        // Verificar que el producto existe
        const [producto] = await db.execute('SELECT id FROM productos WHERE id = ?', [producto_id]);
        if (producto.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Producto no encontrado'
            });
        }

        const imagen_resena = req.file ? req.file.filename : null;

        const insertQuery = `
            INSERT INTO resenas (
                producto_id, usuario_nombre, usuario_email, pais, codigo_pais,
                calificacion, comentario, imagen_resena
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const [result] = await db.execute(insertQuery, [
            producto_id, usuario_nombre, usuario_email, pais, codigo_pais,
            calificacion, comentario, imagen_resena
        ]);

        res.status(201).json({
            success: true,
            message: 'Reseña creada exitosamente',
            resena_id: result.insertId
        });

    } catch (error) {
        console.error('Error al crear reseña:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

// OBTENER SOLO ESTADÍSTICAS DE RESEÑAS
app.get('/resenas-estadisticas/:productoId', async (req, res) => {
    try {
        const { productoId } = req.params;

        const query = `
            SELECT 
                total_resenas,
                promedio_calificacion,
                calificacion_5,
                calificacion_4,
                calificacion_3,
                calificacion_2,
                calificacion_1
            FROM resenas_estadisticas 
            WHERE producto_id = ?
        `;

        const [estadisticas] = await db.execute(query, [productoId]);

        const stats = estadisticas[0] || {
            total_resenas: 0,
            promedio_calificacion: 0,
            calificacion_5: 0,
            calificacion_4: 0,
            calificacion_3: 0,
            calificacion_2: 0,
            calificacion_1: 0
        };

        // Calcular porcentajes
        const total = stats.total_resenas || 1; // Evitar división por cero
        const porcentajes = {
            p5: Math.round((stats.calificacion_5 / total) * 100),
            p4: Math.round((stats.calificacion_4 / total) * 100),
            p3: Math.round((stats.calificacion_3 / total) * 100),
            p2: Math.round((stats.calificacion_2 / total) * 100),
            p1: Math.round((stats.calificacion_1 / total) * 100)
        };

        res.json({
            success: true,
            estadisticas: {
                ...stats,
                porcentajes
            }
        });

    } catch (error) {
        console.error('Error al obtener estadísticas:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

// Iniciar servidor
app.listen(puerto, () => {
    console.log(`🚀 Servidor escuchando en http://localhost:${puerto}`);
});