import { API_BASE_URL } from './config.js';

// --- Función para verificar si hay sesión activa ---
function checkSession() {
    const userName = localStorage.getItem('userName');
    if (userName) {
        updateUILoggedIn(userName);
    } else {
        updateUILoggedOut();
        // Si no hay sesión, no debería estar aquí
        Swal.fire({
            title: 'Acceso Denegado',
            text: 'Debes iniciar sesión para presentar el examen.',
            icon: 'error',
            confirmButtonText: 'Ir a Login'
        }).then(() => {
            window.location.href = './login.html';
        });
    }
}

// --- Actualizar UI cuando hay sesión ---
function updateUILoggedIn(userName) {
    const contenidoDiv = document.getElementById("cuenta");
    contenidoDiv.innerHTML = `
    <div class="dropdown">${userName}
        <div class="dropdown-content">
            <a href="#" id="logout-btn">Salir</a>
        </div>
    </div>
    `;
    
    // Agregar event listener al botón de logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }
}

// --- Actualizar UI cuando NO hay sesión ---
function updateUILoggedOut() {
    const contenidoDiv = document.getElementById("cuenta");
    contenidoDiv.innerHTML = `
    <a href="./login.html">Iniciar sesion</a>
    `;
}

// --- Función para hacer logout ---
async function logout() {
    try {
        const res = await fetch(`${API_BASE_URL}/api/logout`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('token')}`
            }
        });
    } catch (err) {
        console.error("Error al conectar con el servidor:", err);
    } finally {
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        updateUILoggedOut();
        window.location.href = '../../index.html'; // Redirigir al inicio
    }
}

const API_URL = `${API_BASE_URL}/api/questions`;
const CERTIFICATION_NAME = "Certificación Java Professional"; //

// Elementos del DOM
const quizForm = document.getElementById("quizForm");
const listaPreguntas = document.getElementById("listaPreguntas");
const resultado = document.getElementById("resultado");
const submitBtn = document.getElementById("submit-btn");

let currentAttemptId = null;
let currentQuestions = [];

// --- Función 1: Iniciar el Examen (al cargar la página) ---
async function loadExam() {
    const token = localStorage.getItem('token');

    // 1. Mostrar datos de la cabecera del examen
    document.getElementById("certification-title").innerText = `Examen: ${CERTIFICATION_NAME}`;
    document.getElementById("user-name-display").innerText = localStorage.getItem('userName') || "N/A";
    document.getElementById("exam-date").innerText = new Date().toLocaleDateString('es-ES');

    try {
        // 2. Pedir las preguntas al backend (Ruta Protegida)
        const res = await fetch(`${API_URL}/start`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await res.json();

        if (!res.ok) {
            // Manejar errores (ej. token inválido, ya hizo el examen)
            throw new Error(data.error || "No se pudo cargar el examen.");
        }

        // 3. Guardar datos del intento y renderizar preguntas
        currentAttemptId = data.attemptId;
        currentQuestions = data.questions;
        renderQuestions(currentQuestions);

        // 4. Mostrar formulario
        quizForm.style.display = "block";
        // SE HA ELIMINADO LA LLAMADA A startTimer()

    } catch (err) {
        await Swal.fire({
            title: 'Error al cargar el examen',
            text: err.message,
            icon: 'error',
            confirmButtonText: 'Volver'
        });
    }
}

// --- Función 2: Renderizar las preguntas en el HTML ---
function renderQuestions(questions) {
    listaPreguntas.innerHTML = "";
    questions.forEach((q, index) => {
        const div = document.createElement("div");
        div.className = "card"; // Usamos el estilo .card
        div.innerHTML = `
            <p class="qtext"><strong>${index + 1}.</strong> ${q.text}</p>
            <div class="options">
                ${q.options.map(opt => `
                    <label class="option">
                        <input type="radio" name="q_${q.id}" value="${opt}"> ${opt}
                    </label>
                `).join("")}
            </div>
        `;
        listaPreguntas.appendChild(div);
    });
}

// --- Función 4: Enviar el Examen (al hacer submit) ---
async function submitQuiz(e) {
    if (e) e.preventDefault(); // Prevenir recarga si fue por clic
    if (!currentAttemptId) return;

    submitBtn.disabled = true;

    // 1. Recolectar respuestas
    const answers = currentQuestions.map(q => {
        const selected = document.querySelector(`input[name="q_${q.id}"]:checked`);
        return { id: q.id, answer: selected ? selected.value : null };
    });

    try {
        // 2. Enviar respuestas al backend (Ruta Protegida)
        const res = await fetch(`${API_URL}/submit`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                attemptId: currentAttemptId,
                answers: answers
            })
        });

        const data = await res.json();
        if (!res.ok) {
            throw new Error(data.error || "No se pudo evaluar el examen.");
        }

        // 3. Mostrar resultado
        renderResult(data);

    } catch (err) {
        await Swal.fire({
            title: 'Error al enviar el examen',
            text: err.message,
            icon: 'error'
        });
        submitBtn.disabled = false; // Permitir reintento de envío si falló
    }
}

// --- Función 5: Renderizar el resultado ---
function renderResult(data) {
    // Ocultar el formulario
    quizForm.style.display = "none";

    const resultTitle = data.passed
        ? "¡Felicidades, has APROBADO!"
        : "Resultado: NO APROBADO";

    resultado.innerHTML = `
        <div class="card">
            <h2 class="score ${data.passed ? 'ok' : 'bad'}">${resultTitle}</h2>
            <p>Tu puntuación fue: <strong>${data.score} / ${data.total}</strong></p>
            ${data.passed ? '<p>Tu certificado estará disponible pronto.</p>' : ''}
        </div>
        
        <h3>Revisión de respuestas:</h3>
        ${data.details.map(d => `
            <article class="card result-item">
                <p class="qtext">${d.text}</p>
                <p>Tu respuesta: <strong>${d.yourAnswer || "(sin responder)"}</strong></p>
                <p>Correcta: <strong>${d.correctAnswer}</strong></p>
                <p class="${d.correct ? 'ok' : 'bad'}">${d.correct ? "✓ Correcto" : "✗ Incorrecto"}</p>
            </article>
        `).join("")}
    `;
}

checkSession();

// Solo si la sesión es válida, cargar el examen
if (localStorage.getItem('userName')) {
    document.addEventListener("DOMContentLoaded", loadExam);
    quizForm.addEventListener("submit", submitQuiz);
}