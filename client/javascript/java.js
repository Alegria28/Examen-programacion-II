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
        // CAMBIAR LA IP SEGÚN LA IP DEL SERVIDOR
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

document.addEventListener("DOMContentLoaded", () => {

    const payBtn = document.getElementById('pay-btn');
    const startExamBtn = document.getElementById('start-exam-btn');

    if (payBtn) {
        payBtn.addEventListener('click', function () {
            Swal.fire({
                title: 'Procesando pago...',
                timer: 1500,
                didOpen: () => {
                    Swal.showLoading()
                }
            }).then(() => {
                document.getElementById('payment-status').classList.add('hidden');
                document.getElementById('exam-access').classList.remove('hidden');
            });
        });
    }

    if (startExamBtn) {
        startExamBtn.addEventListener('click', function () {
            const token = localStorage.getItem('token');
        
            if (!token) {
                Swal.fire({
                    title: 'Acceso Denegado',
                    text: 'Debes iniciar sesión para poder comenzar el examen.',
                    icon: 'warning',
                    confirmButtonText: 'Iniciar Sesión'
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.href = './login.html';
                    }
                });
                return;
            }
            // Si hay token, redirigir al usuario a la página del examen
            window.location.href = './quizJava.html';
        });
    }
});
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