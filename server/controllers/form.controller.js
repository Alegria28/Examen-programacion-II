// Importa la versión de promesas del módulo 'fs' para leer y modificar el archivo .json
const fs = require('fs').promises;
const path = require('path');

exports.mandarFormulario = async (req, res) => {
    try {
        // Lo que recibimos por medio del POST
        const formRespuestas = req.body;

        if (!formRespuestas) {
            return res.status(400).json({
                error: "No tiene informacion el form"
            });
        }

        // Ruta al archivo JSON
        const formPath = path.join(__dirname, '../models/form.json');

        // Leer el archivo
        const contenidoArchivo = await fs.readFile(formPath, 'utf-8');
        const forms = JSON.parse(contenidoArchivo);

        // Agregar el nuevo formulario al array
        forms.push(formRespuestas);

        // Guardar los cambios en el archivo
        await fs.writeFile(formPath, JSON.stringify(forms, null, 2), 'utf-8');

        // Mostrar todo el archivo JSON en consola
        console.log('=== Archivo form.json completo ===');
        console.log(JSON.stringify(forms, null, 2));
        console.log('===================================');

        // Responder con éxito
        return res.status(200).json({
            message: "Formulario guardado exitosamente",
            data: formRespuestas
        });

    } catch (error) {
        console.error('Error al guardar form:', error);
        return res.status(500).json({
            error: "Error interno del servidor al guardar form"
        });
    }
};
