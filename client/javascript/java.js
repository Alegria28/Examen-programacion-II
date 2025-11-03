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

document.getElementById('pay-btn').addEventListener('click', function () {
    // Verificar si el usuario está logueado
    const token = localStorage.getItem('token');

    if (!token) {
        alert('Debes iniciar sesión para realizar el pago.');
        return;
    }

    // Simular el proceso de pago
    setTimeout(function () {
        document.getElementById('payment-status').classList.add('hidden');
        document.getElementById('exam-access').classList.remove('hidden');
    }, 1000); // Simula un retraso de 1 segundo para el pago
});

document.getElementById('start-exam-btn').addEventListener('click', function () {
    // Verificar si el usuario está logueado
    const token = localStorage.getItem('token');

    if (!token) {
        alert('Debes iniciar sesión para realizar el pago.');
        return;
    }

    // Redirigir al usuario a la página del examen
    window.location.href = './examenJava.html';
});