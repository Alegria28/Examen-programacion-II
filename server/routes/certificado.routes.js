const express = require("express");
const router = express.Router();
const { generarPDF } = require("../controllers/certificado.controller");
const { verifyToken } = require("../middleware/auth.middleware");

// Ruta protegida para descargar certificado
router.get("/certificado", verifyToken, generarPDF);

module.exports = router;