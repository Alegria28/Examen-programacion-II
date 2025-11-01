// Capturamos el formulario
const form = document.getElementById("formLogin")

// Escuchamos el evento "submit"
form.addEventListener("submit", async (e) => {
    e.preventDefault(); // evita que la página se recargue

    // Obtener los valores escritos por el usuario
    const login = document.getElementById("username").value;
    const contrasena = document.getElementById("password").value;

    // Enviar los datos al servidor usando fetch + async/await
    try {
        const res = await fetch("http://localhost:3000/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                cuenta: login, // nombre del campo esperado el backend
                contrasena: contrasena
            })
        });

        // Intentamos parsear el JSON (puede fallar si el servidor responde vacío)
        let data;
        try {
            data = await res.json();
        } catch (parseErr) {
            console.warn("Respuesta no JSON del servidor", parseErr);
            data = {};
        }

        // Revisar la respuesta
        if (res.ok) {
            const cuenta = data.usuario?.cuenta;
            const token = data.token;

            localStorage.setItem('token', token);
            localStorage.setItem('userName', cuenta);

            alert("Acceso permitido: " + cuenta);

            // Redirigimos al usuario a la pagina principal
            window.location.replace("/");
            
        } else {
            alert(data?.error ?? `Error ${res.status}`);
            document.getElementById("login").value = "";
            document.getElementById("password").value = "";
        }

    } catch (err) {
        console.error("Error al conectar con el servidor:", err);
        alert("Error de conexión con el servidor");
    }
});