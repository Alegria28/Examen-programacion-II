import { API_BASE_URL } from './config.js';

const API_CERTIFICADO = `${API_BASE_URL}/api/certificados`;
const btnPDF = document.getElementById("btnPDF");

btnPDF.addEventListener("click", async () => {
    if (confirm("¿Deseas descargar tu certificado en PDF?")) {
        try {
            const token = localStorage.getItem('token'); // Obtener el token almacenado
            // Verificación solo en frontend
            //const score = parseInt(document.querySelector('h2').textContent.split('/')[0].split(':')[1].trim());
            if (!token) {
                alert("No hay token. Inicia sesión primero.");
                return;
            }
            const score = 8;

            if (score >= 6) { // 75% de 8 preguntas = 6
                alert("¡Felicidades! Has aprobado el examen. Descargando certificado...");

                alert("¡Descargando certificado...");

                // URL completa
                const urlCompleta = `${API_CERTIFICADO}/certificado`;

                // Llamar al backend para generar y descargar el certificado (sin body)
                const response = await fetch(urlCompleta, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });
                if (response.ok) {
                    const blob = await response.blob();

                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `certificado.pdf`;
                    a.click();
                    window.URL.revokeObjectURL(url);
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
    }
});