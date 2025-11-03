// Importa la versión de promesas del módulo 'fs' para leer y modificar el archivo .json
const fs = require('fs').promises;
const path = require('path');

// Función controladora para obtener el perfil del usuario autenticado
exports.obtenerUsuario = async (req, res) => {
    try {
        // Lo que nos llega por medio del POST
        const cuentaUser = req.body.cuenta;

        if (!cuentaUser) {
            return res.status(400).json({
                error: "No se proporcionó el nombre de cuenta"
            });
        }

        // Ruta al archivo JSON
        const usersPath = path.join(__dirname, '../models/users.json');

        // Leer el archivo
        const contenidoArchivo = await fs.readFile(usersPath, 'utf-8');
        const users = JSON.parse(contenidoArchivo);

        // Buscar el usuario en la base de datos
        const user = users.find(u => u.cuenta === cuentaUser);

        if (!user) {
            return res.status(404).json({
                error: "Usuario no encontrado en la base de datos"
            });
        }

        // Devolver toda la información del usuario
        return res.status(200).json({
            usuario: {
                id: user.id,
                cuenta: user.cuenta,
                nombre: user.nombre,
                cursoPagado: user.cursoPagado
            }
        });

    } catch (error) {
        console.error('Error al obtener usuario:', error);
        return res.status(500).json({
            error: "Error interno del servidor al obtener información del usuario"
        });
    }
};

exports.realizarPago = async (req, res) => {
    try {
        const cuentaUser = req.body.cuenta;

        if (!cuentaUser) {
            return res.status(400).json({
                error: 'No se proporcionó el nombre de cuenta para realizar el pago'
            });
        }

        // Ruta al archivo JSON
        const usersPath = path.join(__dirname, '../models/users.json');

        // Leer el archivo
        const contenidoArchivo = await fs.readFile(usersPath, 'utf-8');
        const users = JSON.parse(contenidoArchivo);

        // Buscar el índice del usuario
        const userIndex = users.findIndex(u => u.cuenta === cuentaUser);

        if (userIndex === -1) {
            return res.status(404).json({
                error: 'Usuario no encontrado'
            });
        }

        // Verificar si ya ha pagado
        if (users[userIndex].cursoPagado === "true") {
            return res.status(400).json({
                error: 'El usuario ya ha realizado el pago del curso',
                usuario: users[userIndex]
            });
        }

        // Modificar el cursoPagado
        users[userIndex].cursoPagado = "true";

        // Guardar los cambios en el archivo
        await fs.writeFile(usersPath, JSON.stringify(users, null, 2), 'utf-8');

        return res.status(200).json({
            mensaje: 'Pago realizado exitosamente',
            usuario: {
                id: users[userIndex].id,
                cuenta: users[userIndex].cuenta,
                nombre: users[userIndex].nombre,
                cursoPagado: users[userIndex].cursoPagado
            }
        });

    } catch (error) {
        console.error('Error al procesar el pago:', error);

        if (error.code === 'ENOENT') {
            return res.status(500).json({
                error: 'No se pudo encontrar el archivo de usuarios en el servidor'
            });
        }

        if (error instanceof SyntaxError) {
            return res.status(500).json({
                error: 'Error al procesar los datos de usuarios. El archivo puede estar corrupto'
            });
        }

        return res.status(500).json({
            error: 'Error interno del servidor al procesar el pago'
        });
    }
};