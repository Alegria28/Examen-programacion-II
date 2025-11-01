const express = require('express'); // Importamos el modulo express
const authRoutes = require("./routes/auth.routes"); // Importamos las rutas de autenticación
const cors = require('cors'); // Importamos el módulo cors para manejar solicitudes entre dominios
const app = express(); // Creamos una instancia de la aplicación
const PORT = process.env.PORT || 3000; // Definimos puerto por el cual va a escuchar nuestro servidor
const HOST = process.env.HOST || '0.0.0.0'; // Definimos host

const serverIp = '10.13.140.189'; // Reemplaza con la IP de tu servidor si es necesario
const ALLOWED_ORIGINS = [
  'http://localhost:5500',
  'http://127.0.0.1:5500',
  `http://${serverIp}$:5500`, // Agrega la IP del servidor a los orígenes permitidos
  'http://10.13.143.255:5500'
];

// Middleware para parsear JSON en las solicitudes entrantes
app.use(express.json());

// Configuración de CORS
app.use(cors({ origin: true, methods: ['GET','POST','PUT','DELETE','PATCH'] }));

// Montar rutas bajo /api
app.use("/api", authRoutes);

// Rutas para manejar preguntas
const questionsRoutes = require("../back/routes/questions.routes");
app.use("/api/questions", questionsRoutes);

// Start the server and listen for incoming requests
app.listen(port, () => {
    console.log(`Servidor escuchando en http://${serverIp}:${PORT}`);
    //console.log(`Servidor corriendo en http://localhost:${port}`);
});




