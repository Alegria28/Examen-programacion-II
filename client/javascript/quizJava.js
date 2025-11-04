import { API_BASE_URL } from './config.js';
import { initializeDropdown } from './dropdownHandler.js';

const API_CERTIFICADO = `${API_BASE_URL}/api/certificados`; // Ruta para certificados
const btnPDF = document.getElementById("btnPDF"); // Botón para descargar PDF

let currentScore = null; // Variable para almacenar la puntuación actual

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
    <div id="user-dropdown" class="dropdown">
        <span class="user-emoji">👤</span>
        <span class="user-name">${userName}</span>
        <svg class="dropdown-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
        <div id="dropdown-menu" class="dropdown-content">
            <a href="#" id="logout-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                Cerrar sesión
            </a>
        </div>
    </div>
    `;

    // Inicializar el dropdown con funcionalidad de click
    initializeDropdown();

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
    <a href="./login.html" class="login-link">
        <span class="login-emoji">🔐</span>
        <span>Iniciar sesión</span>
    </a>
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

let currentQuestions = [];

// --- Función 1: Iniciar el Examen (al cargar la página) ---
async function loadExam() {
    // Ocultar inmediatamente
    btnPDF.style.display = 'none';

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

        // 3. Guardar preguntas y renderizarlas
        currentQuestions = data.questions;
        renderQuestions(currentQuestions);

        // 4. Mostrar formulario
        quizForm.style.display = "block";

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
            <p class="qtext">${q.text}</p>
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

    currentScore = data.score; // Guardar la puntuación actual

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

    // Mostrar botón de descarga de certificado si aprobó
    // data.passed = true; // Simulación para pruebas
    if (data.passed === true) {
        btnPDF.hidden = false;
        btnPDF.style.display = 'inline-block';

        // Mostrar SweetAlert
        Swal.fire({
            title: '¡Has aprobado!',
            text: 'Descarga tu certificado en PDF.',
            icon: 'success',
            showConfirmButton: false,
            timer: 3000, // 3 segundos
            timerProgressBar: true
        });
    }
}

checkSession();

// Solo si la sesión es válida, cargar el examen
if (localStorage.getItem('userName')) {
    document.addEventListener("DOMContentLoaded", loadExam);
    quizForm.addEventListener("submit", submitQuiz);
}

// Funcionalidad de descarga de certificado en PDF
btnPDF.addEventListener("click", async () => {
    const confirmResult = await Swal.fire({
        title: '¿Descargar certificado?',
        text: '¿Deseas descargar tu certificado en PDF?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, descargar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33'
    });

    if (!confirmResult.isConfirmed) {
        return; // El usuario canceló
    }

    try {
        const token = localStorage.getItem('token'); // Obtener el token almacenado

        if (!token) {
            alert("No hay token. Inicia sesión primero.");
            return;
        }
        const score = currentScore; // Usar la puntuación almacenada
        if (score >= 6) { // 75% de 8 preguntas = 6

            // Mostrar alerta de "Descargando..."
            const downloadAlert = Swal.fire({
                title: 'Descargando certificado',
                text: 'Por favor espera...',
                icon: 'info',
                showConfirmButton: false,
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                    Swal.close(); // Cerrar la alerta inmediatamente
                }
            });

            // URL completa
            const urlCompleta = `${API_CERTIFICADO}/certificado`;

            // Llamar al backend para generar y descargar el certificado (sin body)
            const response = await fetch(urlCompleta, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            await downloadAlert.close();

            if (response.ok) {
                const blob = await response.blob();

                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `certificado.pdf`;
                a.click();
                window.URL.revokeObjectURL(url);

                // Mostrar alerta de éxito con timer de 3 segundos
                await Swal.fire({
                    title: '¡Descarga completada!',
                    text: 'Tu certificado se ha descargado correctamente.',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 3000, // 3 segundos
                    timerProgressBar: true
                });

            } else {
                // Obtener el mensaje de error del servidor
                const errorText = await response.text();
                alert(`Error del servidor (${response.status}): ${errorText}`);
            }

        } else {
            alert("No has alcanzado la puntuación mínima para obtener el certificado.");
        }
    } catch (error) {
        console.error("💥 Error completo:", error);
        console.error("💥 Error name:", error.name);
        console.error("💥 Error message:", error.message);
        alert("Error de conexión: " + error.message);
    }

});