const users = require("../models/users.json");
const PDFDocument = require("pdfkit");
const fs = require('fs');
const path = require('path'); // Importar path para rutas seguras

// Helper to move to next line
function jumpLine(doc, lines) {
  for (let index = 0; index < lines; index++) {
    doc.moveDown();
  }
}

exports.generarPDF = async (req, res) => {
    console.log("🎯 CONTROLLER: Iniciando...");
    console.log("🎯 CONTROLLER: req.userId =", req.userId);
    
    try {
        // 1. Obtener el usuario del request
        const userId = req.userId;
        
        // 2. Buscar el usuario
        let usuario = users.find(u => {
            console.log(`🎯 Comparando: "${u.cuenta}" === "${userId}" -> ${u.cuenta === userId}`);
            return u.cuenta === userId;
        });
        
        console.log("🎯 CONTROLLER: Resultado de búsqueda:", usuario);
        
        // 3. Si no encuentra usuario, crear uno por defecto
        if (!usuario) {
            console.log("CONTROLLER: USUARIO NO ENCONTRADO");
        }

        console.log("✅ CONTROLLER: Usuario encontrado, generando PDF...");
        
        // 4. Configurar la respuesta como PDF
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="certificado-java-${usuario.cuenta}.pdf"`);

        // 5. Crear el PDF
        const doc = new PDFDocument({
            layout: 'landscape',
            size: 'A4',
        });
        
        // Pipe ANTES de cualquier contenido
        doc.pipe(res);

        // 6. Contenido del PDF con manejo de errores en imágenes
    
        doc.rect(0, 0, doc.page.width, doc.page.height).fill('#fff');

        doc.fontSize(10);

        // Margin
        const distanceMargin = 18;

        doc
        .fillAndStroke('#0e8cc3')
        .lineWidth(20)
        .lineJoin('round')
        .rect(
            distanceMargin,
            distanceMargin,
            doc.page.width - distanceMargin * 2,
            doc.page.height - distanceMargin * 2,
        )
        .stroke();

        // Header - Logo de LexisCode
        const maxWidth = 140;
        const maxHeight = 70;

        try {
        const logoPath = path.join(__dirname, '../img/Logo.png');
        if (fs.existsSync(logoPath)) {
            doc.image(logoPath, doc.page.width / 2 - maxWidth / 2, 60, {
            fit: [maxWidth, maxHeight],
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
        .text('CERTIFICATE OF COMPLETION', {
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
        const lineSize = 174;
        const signatureHeight = 390;

        doc.fillAndStroke('#021c27');
        doc.strokeOpacity(0.2);

        // Firma izquierda - Instructor
        const leftStartX = 100;
        const leftEndX = leftStartX + lineSize;

        // Imagen firma instructor (lado izquierdo)
        try {
        const firmaInstructorPath = path.join(__dirname, '../img/firmaInstructor.png');
        if (fs.existsSync(firmaInstructorPath)) {
            doc.image(firmaInstructorPath, leftStartX + (lineSize/2) - 30, signatureHeight - 30, {
            width: 60,
            align: 'center',
            });
        }
        } catch (error) {
        console.log("Firma instructor no cargada");
        }

        jumpLine(doc, 1);

        // Línea firma instructor
        doc
        .moveTo(leftStartX, signatureHeight)
        .lineTo(leftEndX, signatureHeight)
        .stroke();

        // Texto firma instructor
        doc
        .fontSize(10)
        .fill('#021c27')
        .text('Eduardo Arturo Alegria Vela', leftStartX, signatureHeight + 10, {
            columns: 1,
            columnGap: 0,
            height: 40,
            width: lineSize,
            align: 'center',
        });

        doc
        .fontSize(10)
        .fill('#021c27')
        .text('Technical Instructor', leftStartX, signatureHeight + 25, {
            columns: 1,
            columnGap: 0,
            height: 40,
            width: lineSize,
            align: 'center',
        });

        // Firma derecha - CEO
        const rightStartX = doc.page.width - 100 - lineSize;
        const rightEndX = rightStartX + lineSize;

        // Imagen firma CEO (lado derecho)
        try {
        const firmaCEOPath = path.join(__dirname, '../img/firmaCEO.png');
        if (fs.existsSync(firmaCEOPath)) {
            doc.image(firmaCEOPath, rightStartX + (lineSize/2) - 30, signatureHeight - 30, {
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
        .moveTo(rightStartX, signatureHeight)
        .lineTo(rightEndX, signatureHeight)
        .stroke();

        // Texto firma CEO
        doc
        .fontSize(10)
        .fill('#021c27')
        .text('Darely Quezada Guerrero', rightStartX, signatureHeight + 10, {
            columns: 1,
            columnGap: 0,
            height: 40,
            width: lineSize,
            align: 'center',
        });

        doc
        .fontSize(10)
        .fill('#021c27')
        .text('CEO of LexisCode', rightStartX, signatureHeight + 25, {
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