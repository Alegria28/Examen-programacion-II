// Función para inicializar el dropdown con click en lugar de hover
export function initializeDropdown() {
    // Esperar a que el DOM esté listo
    setTimeout(() => {
        const dropdown = document.getElementById('user-dropdown');
        const dropdownMenu = document.getElementById('dropdown-menu');
        
        if (dropdown && dropdownMenu) {
            // Toggle dropdown al hacer click
            dropdown.addEventListener('click', (e) => {
                e.stopPropagation();
                dropdownMenu.classList.toggle('show');
            });
            
            // Cerrar dropdown al hacer click fuera
            document.addEventListener('click', (e) => {
                if (!dropdown.contains(e.target)) {
                    dropdownMenu.classList.remove('show');
                }
            });
        }
    }, 100);
}
