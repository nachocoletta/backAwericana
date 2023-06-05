const { Router } = require("express");
const { body, param } = require('express-validator');
const { validarCampos } = require("../middlewares/validar-campos");
const {
    obtenerTalles,
} = require("../controllers/talle.js");

const router = Router();

router.get('/', obtenerTalles)

module.exports = router;