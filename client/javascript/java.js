import { API_BASE_URL } from './config.js';
import { initializeDropdown } from './dropdownHandler.js';

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
    // Obtenemos el div
    const contenidoDiv = document.getElementById("cuenta");
    // Modificamos el contenido de este div
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

// --- Función para verificar el estado del pago ---
async function verificarEstadoPago() {
    const userName = localStorage.getItem('userName');

    // Si no hay sesión, no hacer nada
    if (!userName) {
        return;
    }

    try {
        const res = await fetch(`${API_BASE_URL}/api/usuario/obtenerUsuario`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                cuenta: userName
            })
        });

        const data = await res.json();

        if (res.ok && data.usuario && data.usuario.cursoPagado === "true") {
            // Si ya pagó, mostrar el acceso al examen
            document.getElementById('payment-status').classList.add('hidden');
            document.getElementById('exam-access').classList.remove('hidden');
        }
    } catch (error) {
        
    }
}

// En caso de que se le haga click al botón de pagar, obtenemos el botón y le agregamos un listener
document.getElementById('pay-btn').addEventListener('click', async (e) => {
    // Verificar si el usuario está logueado
    const token = localStorage.getItem('token');

    if (!token) {
        Swal.fire({
            title: 'Acceso Denegado',
            text: 'Debes iniciar sesión para realizar el pago.',
            icon: 'warning',
            confirmButtonText: 'Iniciar Sesión'
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = './login.html';
            }
        });
        return;
    }

    // Obtenemos la cuenta que esta logueada
    const userName = localStorage.getItem('userName');

    if (!userName) {
        await Swal.fire({
            title: 'Error',
            text: 'No se pudo obtener el nombre de usuario del almacenamiento local',
            icon: 'error',
            confirmButtonText: 'OK'
        });
        return;
    }

    // Mostrar loading mientras se procesa
    Swal.fire({
        title: 'Procesando...',
        text: 'Verificando información del usuario',
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    // Pequeño delay para que el loading sea visible
    await new Promise(resolve => setTimeout(resolve, 500));

    // Obtenemos los datos de la cuenta 
    try {
        const res = await fetch(`${API_BASE_URL}/api/usuario/obtenerUsuario`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                cuenta: userName
            })
        });

        // Intentamos parsear el JSON
        let data;
        try {
            data = await res.json();
        } catch (parseErr) {
            
            await Swal.fire({
                title: 'Error de Respuesta',
                text: 'El servidor respondió con un formato incorrecto',
                icon: 'error',
                confirmButtonText: 'OK'
            });
            return;
        }

        // Revisar la respuesta
        if (res.ok && data.usuario) {
            // Obtenemos la informacion de la cuenta para ver si esta ya ha pagado
            const pagado = data.usuario.cursoPagado;

            // Si ya pagó, mostrar mensaje
            if (pagado === "true") {
                
                await Swal.fire({
                    title: 'Ya has pagado',
                    text: 'Ya has realizado el pago de este curso anteriormente',
                    icon: 'info',
                    confirmButtonText: 'OK'
                });

                // Mostrar el acceso al examen
                document.getElementById('payment-status').classList.add('hidden');
                document.getElementById('exam-access').classList.remove('hidden');
                return;
            }

            // Si no ha pagado el curso, llamamos a nuestra API para que lo pague
            if (pagado === "false") {
                // Actualizar el mensaje de loading
                Swal.update({
                    title: 'Procesando pago...',
                    text: 'Por favor espera'
                });

                // Pequeño delay para que el usuario vea el cambio de mensaje
                await new Promise(resolve => setTimeout(resolve, 800));

                try {
                    const resPago = await fetch(`${API_BASE_URL}/api/usuario/realizarPago`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            cuenta: userName
                        })
                    });

                    const dataPago = await resPago.json();

                    if (resPago.ok) {
                        // Actualizar el DOM directamente
                        document.getElementById('payment-status').classList.add('hidden');
                        document.getElementById('exam-access').classList.remove('hidden');

                        
                    } else {
                        
                        await new Promise(resolve => setTimeout(resolve, 300));

                        await Swal.fire({
                            title: 'Error al procesar el pago',
                            text: dataPago.error || 'Ocurrió un error al procesar tu pago',
                            icon: 'error',
                            confirmButtonText: 'OK',
                            allowOutsideClick: false
                        });
                    }
                } catch (errorPago) {
                    
                    await new Promise(resolve => setTimeout(resolve, 300));

                    await Swal.fire({
                        title: 'Error de Conexión',
                        text: 'No se pudo conectar con el servidor para procesar el pago',
                        icon: 'error',
                        confirmButtonText: 'OK',
                        allowOutsideClick: false
                    });
                }
            }

        } else {
            
            await new Promise(resolve => setTimeout(resolve, 300));

            await Swal.fire({
                title: 'Error',
                text: data.error || 'No se pudo obtener la información del usuario',
                icon: 'error',
                confirmButtonText: 'OK',
                allowOutsideClick: false
            });
        }

    } catch (error) {
        
        await new Promise(resolve => setTimeout(resolve, 300));

        await Swal.fire({
            title: 'Error de Conexión',
            text: 'No se pudo conectar con el servidor. Verifica tu conexión a internet',
            icon: 'error',
            confirmButtonText: 'OK',
            allowOutsideClick: false
        });
    }

});

// En caso de que se le haga click al botón de realizar el examen, obtenemos el botón y le agregamos un listener
document.getElementById('start-exam-btn').addEventListener('click', function () {
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

checkSession();
verificarEstadoPago();