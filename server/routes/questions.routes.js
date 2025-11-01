const express = require("express");
const router = express.Router();
const { startQuiz, submitAnswers } = require("../controllers/questions.controller");
const { verifyToken } = require("../middleware/auth.middleware"); // Importar el middleware de autenticación, 
                                                                  // el usuario debe estar autenticado para acceder al examen

// POST que envía preguntas
router.post("/start", verifyToken, startQuiz);

// POST que recibe y evalúa respuestas
router.post("/submit", verifyToken, submitAnswers);

module.exports = router;