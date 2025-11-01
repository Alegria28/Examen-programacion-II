// --- Función para verificar si hay sesión activa ---
function checkSession() {
    const userName = localStorage.getItem('userName');
    if (userName) {
        updateUILoggedIn(userName);
    } else {
        updateUILoggedOut();
    }
}

// --- Actualizar UI cuando hay sesión ---
function updateUILoggedIn(userName) {
    // Obtenemos el div
    const contenidoDiv = document.getElementById("cuenta");
    // Modificamos el contenido de este div
    contenidoDiv.innerHTML = `
    <div class="dropdown">${userName}
        <div class="dropdown-content">
            <a onclick="logout()">Salir</a>
        </div>
    </div>
    `;
}

// --- Actualizar UI cuando NO hay sesión ---
function updateUILoggedOut() {
    // Obtenemos el div
    const contenidoDiv = document.getElementById("cuenta");
    // Modificamos el contenido de este div
    contenidoDiv.innerHTML = `
    <a href="./login.html">Iniciar sesion</a>
    `;
}

// --- Función para hacer logout ---
async function logout() {
    try {
        const res = await fetch("http://localhost:3000/api/logout", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (res.ok) {
            alert('Sesión cerrada correctamente');
        } else {
            const data = await res.json();
            alert(data?.error ?? `Error al cerrar sesión`);
        }
    } catch (err) {
        console.error("Error al conectar con el servidor:", err);
        alert("Error de conexión");
    } finally {
        // Siempre limpiar localStorage y actualizar UI, incluso si hay error
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        updateUILoggedOut();
    }
}

checkSession();
