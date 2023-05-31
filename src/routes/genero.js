const { Router } = require("express");
const { body, param } = require('express-validator');
const { validarCampos } = require("../middlewares/validar-campos");
const {
    obtenerGeneros,
} = require("../controllers/genero.js");

const router = Router();

router.get('/', obtenerGeneros)

module.exports = router;