const express = require('express'); // Importamos el modulo express
const app = express(); // Creamos una instancia de la aplicación
const port = 3000; // Definimos puerto por el cual va a escuchar nuestro servidor

// (Opcional) Ruta de salud
app.get("/health", (_req, res) => res.json({ ok: true }));

// Start the server and listen for incoming requests
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});