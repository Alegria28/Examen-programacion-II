// Maneja dos rutas principales:
// - **`POST /api/questions/start`** → envía las preguntas (sin mostrar las respuestas correctas).
// - **`POST /api/questions/submit`** → recibe las respuestas del usuario, las evalúa y devuelve el resultado.

const QUESTIONS = require("../data/questions");

// --- 1) Enviar preguntas al frontend ---  

const startQuiz = (req, res) => {
    console.log("Acceso al /api/questions/start");
    // Crea una copia de todas las preguntas SIN el campo 'correct'
    const publicQuestions = QUESTIONS
        .sort(() => Math.random() - 0.5) // Mezcla aleatoriamente
        .slice(0, 8) // Toma las primeras 8
        .map(({ id, text, options }) => ({
            id: q.id, 
            text: q.text, 
            options: q.options.sort(() => Math.random() - 0.5) // Mezcla opciones
    }));

    res.status(200).json({
        message: "Preguntas listas. ¡Éxito!",
        questions: publicQuestions
    });
};

// --- 2) Recibir y evaluar respuestas ---
const submitAnswers = (req, res) => {
    console.log("Acceso al /api/questions/submit");
    console.log("Respuestas recibidas:", JSON.stringify(req.body, null, 2));

    // 1 Toma las respuestas enviadas por el usuario
    // Si req.body.answers es un arreglo → devuelve true
    // El servidor no truena, simplemente no califica nada y responde con score 0.
    const userAnswers = Array.isArray(req.body.answers) ? req.body.answers : [];

    // 2 Inicializa puntaje y arreglo de detalles
    let score = 0;
    const details = [];

    // 3 Recorre todas las preguntas del servidor
    for (const q of QUESTIONS) {
        // 3.1) Busca la respuesta enviada para esta pregunta
        const user = userAnswers.find(a => a.id === q.id);

        // 3.2) Determina si es correcta
        //isCorrect será verdadero solo si existe user y además la respuesta del usuario es igual a la correcta
        const isCorrect = !!user && user.answer === q.correct;

        // 3.3) Suma al puntaje si acierta
        if (isCorrect) score++;

        // 3.4) Agrega la información detallada de la pregunta
        details.push({
            id: q.id,
            text: q.text,
            yourAnswer: user ? user.answer : null,
            correctAnswer: q.correct,
            correct: isCorrect
        });
    }

    // 4 Envía el resultado al cliente
    return res.status(200).json({
        message: "Respuestas evaluadas.",
        score,
        total: QUESTIONS.length,
        details
    });
};

module.exports = { startQuiz, submitAnswers };