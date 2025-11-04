const express = require("express");
const { obtenerUsuario, realizarPago, marcarExamenRealizado } = require("../controllers/user.controller");

const router = express.Router();

router.post("/obtenerUsuario", obtenerUsuario);
router.post("/realizarPago", realizarPago);
router.post("/marcarExamenRealizado", marcarExamenRealizado);

module.exports = router;