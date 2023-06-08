const { Router } = require("express");
const { param } = require('express-validator');

const { validarCampos } = require("../middlewares/validar-campos");
const authMiddleware = require("../middlewares/session");
const checkRole = require("../middlewares/role");

const { obtenerImagenes, subirImagen, borrarImagen } = require("../controllers/banner.js");

const router = Router();

router.get('/', obtenerImagenes);

router.post('/', [
    authMiddleware,
    checkRole(['admin'])
], subirImagen);

router.delete('/:id', [
    authMiddleware,
    checkRole(['admin']),
    param('id', 'El id debe ser entero mayor a 0').isInt({min:1}),
    validarCampos
], borrarImagen)

module.exports = router;