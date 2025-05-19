const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Mostrar la ruta absoluta de la carpeta pública (opcional para depurar)
console.log("Sirviendo archivos estáticos desde:", path.join(__dirname, 'public'));

// Servir archivos estáticos desde la carpeta "public"
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para manejar formularios (opcional si vas a usar POST)
app.use(express.urlencoded({ extended: true }));

// Ruta raíz opcional para redirigir a index.html (puedes omitir si accedes directo)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en: http://localhost:${PORT}`);
});
