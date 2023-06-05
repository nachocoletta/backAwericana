const { Router } = require("express");
const { body, param } = require('express-validator');
const { validarCampos } = require("../middlewares/validar-campos");
const iniciarBaseDeDatos = require("../controllers/bd");

const router = Router();

router.get('/', iniciarBaseDeDatos)

module.exports = router;