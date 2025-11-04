const users = require("../models/users.json");
const PDFDocument = require("pdfkit");
const fs = require('fs');
const path = require('path'); // Importar path para rutas seguras

// Helper to move to next line
function jumpLine(doc, lines) {
    for (let index = 0; index < lines; index++) { // Repetir por el número de líneas
        doc.moveDown(); // Mover hacia abajo una línea
    }
}

exports.generarPDF = async (req, res) => {

    try {
        // 1. Obtener el usuario del request
        const userId = req.userId; // Obtenido del middleware de autenticación

        // 2. Buscar el usuario
        let usuario = users.find(u => {
            return u.cuenta === userId; // Asumiendo que 'cuenta' es el identificador único
        });

        // 3. Si no encuentra usuario, crear uno por defecto
        if (!usuario) {
            console.log("CONTROLLER: USUARIO NO ENCONTRADO");
        }

        // 4. Configurar la respuesta como PDF
        res.setHeader('Content-Type', 'application/pdf'); // Tipo de contenido PDF
        res.setHeader('Content-Disposition', `attachment; filename="certificado-java-${usuario.cuenta}.pdf"`); // Forzar descarga con nombre de archivo

        // 5. Crear el PDF
        const doc = new PDFDocument({
            layout: 'landscape',
            size: 'A4',
        });

        // Pipe ANTES de cualquier contenido
        doc.pipe(res); // Enviar el PDF directamente en la respuesta

        // 6. Contenido del PDF con manejo de errores en imágenes
        doc.rect(0, 0, doc.page.width, doc.page.height).fill('#fff'); // Fondo blanco

        doc.fontSize(10);

        // Margin
        const distanceMargin = 18; // Margen desde los bordes

        doc
            .fillAndStroke('#0e8cc3')
            .lineWidth(20)
            .lineJoin('round') // Esquinas redondeadas
            .rect( // Dibuja un rectángulo con margen
                distanceMargin, // x
                distanceMargin, // y
                doc.page.width - distanceMargin * 2, // width
                doc.page.height - distanceMargin * 2, // height
            )
            .stroke();

        // Header - Logo de LexisCode
        const maxWidth = 140;
        const maxHeight = 70;

        try {
            const logoPath = path.join(__dirname, '../img/Logo.png'); // Ruta segura para el logo
            if (fs.existsSync(logoPath)) { // Verificar si el archivo existe
                doc.image(logoPath, doc.page.width / 2 - maxWidth / 2, 60, { // Centrar el logo en el header
                    fit: [maxWidth, maxHeight], // Ajustar tamaño máximo
                    align: 'center',
                });
            }
        } catch (error) {
            console.log("Logo no cargado");
        }

        jumpLine(doc, 5)

        doc
            .fontSize(10)
            .fill('#021c27')
            .text('LexisCode Education Program', {
                align: 'center',
            });

        jumpLine(doc, 2)

        // Content
        doc
            .fontSize(16)
            .fill('#021c27')
            .text('CERTIFICATE OF COMPLETION', { // Título del certificado
                align: 'center',
            });

        jumpLine(doc, 1)

        // Fecha y ciudad
        const fecha = new Date();
        doc
            .fontSize(10)
            .fill('#021c27')
            .text(`Aguascalientes, ${fecha.toLocaleDateString('es-ES')}`, {
                align: 'center',
            });

        jumpLine(doc, 2)

        doc
            .fontSize(10)
            .fill('#021c27')
            .text('This certificate is presented to', {
                align: 'center',
            });

        jumpLine(doc, 2)

        doc
            .fontSize(24)
            .fill('#021c27')
            .text(usuario.nombre, { // Nombre del estudiante
                align: 'center',
            });

        jumpLine(doc, 1)

        doc
            .fontSize(10)
            .fill('#021c27')
            .text('Successfully completed the Java Professional Developer course.', {
                align: 'center',
            });

        jumpLine(doc, 7)

        doc.lineWidth(1);

        // Signatures - LADO IZQUIERDO (Instructor)
        const lineSize = 174; // Ancho de la línea de firma
        const signatureHeight = 390; // Altura donde van las firmas

        doc.fillAndStroke('#021c27'); // Color de las líneas de firma
        doc.strokeOpacity(0.2); // Opacidad de las líneas de firma

        // Firma izquierda - Instructor
        const leftStartX = 100; // Punto inicial de la línea izquierda
        const leftEndX = leftStartX + lineSize; // Punto final de la línea izquierda

        // Imagen firma instructor (lado izquierdo)
        try {
            const firmaInstructorPath = path.join(__dirname, '../img/firmaInstructor.png'); // Ruta segura para la firma, 
            if (fs.existsSync(firmaInstructorPath)) { // Verificar si el archivo existe
                doc.image(firmaInstructorPath, leftStartX + (lineSize / 2) - 30, signatureHeight - 30, { // Centrar la imagen sobre la línea
                    width: 60, // Ancho de la imagen
                    align: 'center', // Alineación centrada
                });
            }
        } catch (error) {
            console.log("Firma instructor no cargada");
        }

        jumpLine(doc, 1);

        // Línea firma instructor
        doc
            .moveTo(leftStartX, signatureHeight) // Punto inicial
            .lineTo(leftEndX, signatureHeight) // Punto final
            .stroke(); // Dibujar la línea

        // Texto firma instructor
        doc
            .fontSize(10) 
            .fill('#021c27')
            .text('Eduardo Arturo Alegria Vela', leftStartX, signatureHeight + 10, { // Nombre del instructor
                columns: 1, // Una columna
                columnGap: 0,  // Sin espacio entre columnas
                height: 40, // Altura del texto
                width: lineSize, // Ancho igual a la línea de firma
                align: 'center', // Alineación centrada
            });

        doc
            .fontSize(10)
            .fill('#021c27')
            .text('Technical Instructor', leftStartX, signatureHeight + 25, { // Título del instructor
                columns: 1, // Una columna
                columnGap: 0, // Sin espacio entre columnas
                height: 40, // Altura del texto
                width: lineSize, // Ancho igual a la línea de firma
                align: 'center',
            });

        // Firma derecha - CEO
        const rightStartX = doc.page.width - 100 - lineSize; // Punto inicial de la línea derecha
        const rightEndX = rightStartX + lineSize; // Punto final de la línea derecha

        // Imagen firma CEO (lado derecho)
        try {
            const firmaCEOPath = path.join(__dirname, '../img/firmaCEO.png'); // Ruta segura para la firma CEO
            if (fs.existsSync(firmaCEOPath)) {
                doc.image(firmaCEOPath, rightStartX + (lineSize / 2) - 30, signatureHeight - 30, { // Centrar la imagen sobre la línea
                    width: 60,
                    align: 'center',
                });
            }
        } catch (error) {
            console.log("Firma CEO no cargada");
        }

        jumpLine(doc, 1);

        // Línea firma CEO
        doc
            .moveTo(rightStartX, signatureHeight) // Punto inicial
            .lineTo(rightEndX, signatureHeight) // Punto final
            .stroke(); // Dibujar la línea

        // Texto firma CEO
        doc
            .fontSize(10)
            .fill('#021c27')
            .text('Darely Quezada Guerrero', rightStartX, signatureHeight + 10, { // Nombre del CEO
                columns: 1, // Una columna
                columnGap: 0, // Sin espacio entre columnas
                height: 40, // Altura del texto
                width: lineSize, // Ancho igual a la línea de firma
                align: 'center',
            });

        doc
            .fontSize(10)
            .fill('#021c27')
            .text('CEO of LexisCode', rightStartX, signatureHeight + 25, { // Título del CEO
                columns: 1,
                columnGap: 0,
                height: 40,
                width: lineSize,
                align: 'center',
            });

        jumpLine(doc, 4);

        // 7. Finalizar el documento
        doc.end();

    } catch (error) {
        console.error('❌ Error general generando PDF:', error);
        if (!res.headersSent) {
            res.status(500).json({ error: "Error al generar certificado" });
        }
    }
};