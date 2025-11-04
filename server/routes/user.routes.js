const express = require("express");
const { obtenerUsuario, realizarPago } = require("../controllers/user.controller");

const router = express.Router();

router.post("/obtenerUsuario", obtenerUsuario);
router.post("/realizarPago", realizarPago);

module.exports = router;