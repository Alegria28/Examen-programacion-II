const express = require('express'); // Importamos el modulo express
const cors = require('cors'); // Importamos el módulo cors para manejar solicitudes entre dominios
const app = express(); // Creamos una instancia de la aplicación
const PORT = process.env.PORT || 3000; // Definimos puerto por el cual va a escuchar nuestro servidor
const HOST = process.env.HOST || '0.0.0.0'; // Definimos host

const serverIp = '10.13.140.189'; // Reemplaza con la IP de tu servidor si es necesario

// Middleware para parsear JSON en las solicitudes entrantes
app.use(express.json());

// Configuración de CORS (permitir cualquier origen durante desarrollo)
app.use(cors({ origin: true, methods: ['GET','POST','PUT','DELETE','PATCH'] }));

// Rutas para manejar preguntas
const questionsRoutes = require("./routes/questions.routes");
app.use("/api/questions", questionsRoutes);

// Start the server and listen for incoming requests
app.listen(PORT, HOST, () => {
    console.log(`Servidor escuchando en http://${serverIp}:${PORT}`);
});




