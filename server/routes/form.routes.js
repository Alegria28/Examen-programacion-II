const express = require("express");
const { mandarFormulario } = require("../controllers/form.controller");

const router = express.Router();

router.post("/mandarFormulario", mandarFormulario);

module.exports = router;