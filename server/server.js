const express = require('express'); // Importamos el modulo express
const app = express(); // Creamos una instancia de la aplicación
const port = 3000; // Definimos puerto por el cual va a escuchar nuestro servidor

// Middleware para parsear JSON en las solicitudes entrantes
app.use(express.json());
// app.use(cors());

// Rutas para manejar preguntas
const questionsRoutes = require("../back/routes/questions.routes");
app.use("/api/questions", questionsRoutes);

// Start the server and listen for incoming requests
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});