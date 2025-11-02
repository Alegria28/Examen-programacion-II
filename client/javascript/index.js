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
    <a href="./client/html/login.html">Iniciar sesion</a>
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
            await Swal.fire({
                title: '¡Sesión cerrada!',
                text: 'Has cerrado sesión correctamente',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false
            });
        } else {
            const data = await res.json();
            await Swal.fire({
                title: 'Error',
                text: data?.error ?? 'Error al cerrar sesión',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    } catch (err) {
        console.error("Error al conectar con el servidor:", err);
        await Swal.fire({
            title: 'Error de conexión',
            text: 'No se pudo conectar con el servidor',
            icon: 'error',
            confirmButtonText: 'OK'
        });
    } finally {
        // Siempre limpiar localStorage y actualizar UI, incluso si hay error
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        updateUILoggedOut();
    }
}

checkSession();