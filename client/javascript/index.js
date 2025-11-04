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
    <a href="./client/html/login.html" class="login-link">
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

checkSession();