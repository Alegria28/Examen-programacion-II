const API = "http://localhost:3000/api/questions";
const btnCargar = document.getElementById("btnCargar");
const quizForm = document.getElementById("quizForm");
const listaPreguntas = document.getElementById("listaPreguntas");
const resultado = document.getElementById("resultado");
let preguntas = [];

btnCargar.addEventListener("click", async () => {
    // Verificar si hay token de autenticación
    const token = localStorage.getItem('authToken'); // o sessionStorage
    
    if (!token) {
        alert("Debes iniciar sesión primero para realizar el quiz");
        // Redirigir al login
        // window.location.href = "/login";
        return;
    }

    console.log("Enviando petición a /api/questions/start");
    
    try {
        const res = await fetch(`${API}/start`, { 
            method: "POST",
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        // Verificar si la respuesta no es exitosa
        if (!res.ok) {
            if (res.status === 401) {
                alert("Sesión expirada o inválida. Por favor inicia sesión nuevamente.");
                // Limpiar token y redirigir
                localStorage.removeItem('authToken');
                // window.location.href = "/login";
                return;
            }
            throw new Error(`Error ${res.status}: ${res.statusText}`);
        }

        const data = await res.json();
        console.log("Respuesta del servidor:", data);
        preguntas = data.questions;
        
        listaPreguntas.innerHTML = "";
        preguntas.forEach(q => {
            const div = document.createElement("div");
            div.className = "card";
            div.innerHTML = `
                <p><strong>${q.id}.</strong> ${q.text}</p>
                ${q.options.map(opt => `
                <label>
                    <input type="radio" name="q_${q.id}" value="${opt}"> ${opt}
                </label><br>
                `).join("")}
            `;
            listaPreguntas.appendChild(div);
        });
        
        quizForm.style.display = "block";
        resultado.innerHTML = "";
        btnCargar.style.display = "none";
        
    } catch (error) {
        console.error("Error al cargar preguntas:", error);
        alert("Error al cargar las preguntas: " + error.message);
    }
});

quizForm.addEventListener("submit", async e => {
    e.preventDefault();
    const answers = preguntas.map(q => {
        const selected = document.querySelector(`input[name="q_${q.id}"]:checked`);
        return { id: q.id, answer: selected ? selected.value : "" };
    });

    console.log("Enviando petición a /api/questions/submit");
    console.log("Enviando respuestas:", { answers });
    
    const res = await fetch(`${API}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers })
    });
    const data = await res.json();
    console.log("Respuesta del servidor para submit:", data);

    resultado.innerHTML = `
    <h2>Resultado: ${data.score}/${data.total}</h2>
    ${data.details.map(d => `
        <div class="card">
        <p>${d.text}</p>
        <p>Tu respuesta: ${d.yourAnswer ?? "(sin responder)"}</p>
        <p>Correcta: ${d.correctAnswer}</p>
        <p class="${d.correct ? "ok" : "bad"}">
            ${d.correct ? " Correcto" : " Incorrecto"}
        </p>
        </div>
    `).join("")}
    `;
});