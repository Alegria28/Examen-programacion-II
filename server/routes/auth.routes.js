const express = require("express");
const { login, logout } = require("../controllers/auth.controller");
const { verifyToken } = require("../middleware/auth.middleware");

const router = express.Router();

// Ruta pública: POST /api/login
router.post("/login", login);

// Rutas protegidas (requieren token)
// POST /api/logout - Cerrar sesión
router.post("/logout", verifyToken, logout);

module.exports = router;