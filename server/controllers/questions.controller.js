const QUESTIONS = require("../data/questions"); // Banco de 16 preguntas

// --- 1) Enviar preguntas al frontend ---  
const startQuiz = (req, res) => {

    // 1. Baraja y toma 8 preguntas
    const pool = Array.isArray(QUESTIONS) ? QUESTIONS.slice() : [];
    const shuffled = pool.sort(() => Math.random() - 0.5).slice(0, 8);

    // 2. Prepara las 8 preguntas para el frontend (sin respuestas correctas)
    const publicQuestions = [];

    shuffled.forEach((q, index) => {
        // Barajamos las opciones
        const options = Array.isArray(q.options) ? [...q.options].sort(() => Math.random() - 0.5) : [];

        publicQuestions.push({
            id: q.id,
            text: `${index + 1}. ${q.text}`,
            options
        });

    });

    res.status(200).json({
        message: "Preguntas listas. ¡Éxito!",
        questions: publicQuestions,
        // Agregamos el dummy attemptId para que el frontend no falle
        attemptId: "temp-id-123456"
    });
};

// --- 2) Recibir y evaluar respuestas ---
const submitAnswers = (req, res) => {
    // 1. Toma las respuestas enviadas por el usuario
    const userAnswers = Array.isArray(req.body.answers) ? req.body.answers : [];

    let score = 0;
    const details = [];
    // El total ya no se basa en una variable global, 
    // sino en cuántas respuestas recibimos.
    const total = userAnswers.length;

    // 2. Itera sobre las respuestas del usuario
    for (const userAnswer of userAnswers) {

        // 3. Busca la pregunta completa (con la respuesta correcta) 
        // en nuestro banco de preguntas maestro.
        const q = QUESTIONS.find(q_master => q_master.id === userAnswer.id);

        // Si el usuario envía un ID que no existe, lo ignoramos
        if (!q) continue;

        // 4. Compara con la respuesta correcta
        const isCorrect = !!userAnswer.answer && userAnswer.answer === q.correct;
        if (isCorrect) score++;

        // 5. Agrega detalles
        details.push({
            id: q.id,
            text: q.text,
            yourAnswer: userAnswer.answer || null, // Usamos la respuesta del usuario
            correctAnswer: q.correct,
            correct: isCorrect
        });
    }

    // 6. Determina si aprobó
    const scorePercent = (total > 0) ? (score / total) * 100 : 0;
    const passed = scorePercent >= 75; // Umbral de aprobación del 75%

    if (passed < 75) {
        console.log("El usuario ha reprobado el examen");
    }
    else {
        console.log("El usuario ha aprobado el examen");
    }

    // 7. Envía el resultado
    return res.status(200).json({
        message: "Respuestas evaluadas.",
        score,
        total,
        passed,
        details
    });


};

module.exports = { startQuiz, submitAnswers };