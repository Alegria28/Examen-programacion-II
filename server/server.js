const express = require('express'); // Importamos el modulo express
const app = express(); // Creamos una instancia de la aplicación
const cors = require('cors');
const port = 3000; // Definimos puerto por el cual va a escuchar nuestro servidor

const authRoutes = require("./routes/auth.routes");
const questionsRoutes = require("./routes/questions.routes");
const certificadoRoutes = require("./routes/certificado.routes");
const userRoutes = require("./routes/user.routes")

// Middlewares mínimos
app.use(express.json());

// --- Modificar respectivamente con la ip actual de la maquina servidor ---
const ipServidor = "127.0.0.1";

const ALLOWED_ORIGINS = [
    'http://localhost:5500',
    'http://127.0.0.1:5500',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    // IP del servidor
    `http://${ipServidor}:5500`,
    `http://${ipServidor}:3000`,
    // IP's permitidas al servidor
    "http://10.0.0.15:5500", // Alegria
    "http://192.168.1.71:5500", // Oscar
    "http://192.168.100.7:5500" // Darely
];

app.use(cors({
    origin: function (origin, callback) {

        if (!origin || ALLOWED_ORIGINS.includes(origin)) {
            return callback(null, true); // null = sin error, true = permitido
        }
        // Si el origen no está permitido, se rechaza la solicitud con un mensaje de error.
        return callback(new Error('Not allowed by CORS: ' + origin));
    },

    // Especifica los métodos HTTP que este servidor aceptará.
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],

    // Algunos navegadores antiguos esperan un código 200 (en lugar de 204) en respuestas "preflight".
    optionsSuccessStatus: 200
}));

// Montar rutas bajo /api
app.use("/api", authRoutes);
app.use("/api/questions", questionsRoutes);
app.use("/api/certificados", certificadoRoutes);
app.use("/api/usuario", userRoutes);

// (Opcional) Ruta de salud
app.get("/health", (_req, res) => res.json({ ok: true }));

// Start the server and listen for incoming requests
app.listen(port, ipServidor, () => {
    console.log(`Servidor corriendo en: http://${ipServidor}:${port}`);
});