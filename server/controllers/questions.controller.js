const QUESTIONS = require("../data/questions"); // Banco de 16 preguntas

let currentExamQuestions = [];

// --- 1) Enviar preguntas al frontend ---  
const startQuiz = (req, res) => {
    console.log("Acceso al /api/questions/start");
    
    // 1. Baraja y toma 8 preguntas (tu lógica está bien)
    const pool = Array.isArray(QUESTIONS) ? QUESTIONS.slice() : [];
    const shuffled = pool.sort(() => Math.random() - 0.5).slice(0, 8);

    // 2. Prepara las 8 preguntas para el frontend
    const publicQuestions = [];
    
    currentExamQuestions = [];

    shuffled.forEach((q, index) => {
        // Barajamos las opciones
        const options = Array.isArray(q.options) ? [...q.options].sort(() => Math.random() - 0.5) : [];
        
        publicQuestions.push({
            id: q.id, 
            text: `${index + 1}. ${q.text}`,
            options
        });

        // Guardamos la información completa de estas 8 preguntas en nuestra variable
        currentExamQuestions.push(q);
    });

    res.status(200).json({
        message: "Preguntas listas. ¡Éxito!",
        questions: publicQuestions
    });
};

// --- 2) Recibir y evaluar respuestas ---
const submitAnswers = (req, res) => {
    console.log("Acceso al /api/questions/submit");
    const userAnswers = Array.isArray(req.body.answers) ? req.body.answers : [];

    let score = 0;
    const details = [];
    
    for (const q of currentExamQuestions) {
        // 3.1) Busca la respuesta del usuario para esta pregunta
        const user = userAnswers.find(a => a.id === q.id);

        // 3.2) Compara con la respuesta correcta
        const isCorrect = !!user && user.answer === q.correct;
        if (isCorrect) score++;

        // 3.4) Agrega detalles
        details.push({
            id: q.id,
            text: q.text,
            yourAnswer: user ? user.answer : null,
            correctAnswer: q.correct,
            correct: isCorrect
        });
    }

    // 4. Determina si aprobó
    const total = currentExamQuestions.length; 
    const scorePercent = (score / total) * 100;
    const passed = scorePercent >= 80; 

    // 5. Envía el resultado
    return res.status(200).json({
        message: "Respuestas evaluadas.",
        score,
        total,
        passed,
        details
    });
};

module.exports = { startQuiz, submitAnswers };